---
templateKey: BlogPost
title: Optimize Unity Synchronization Context
date: 2022-07-28T01:33:07.839Z
lastModified: 2025-07-27T08:54:45.000Z
description: For better performance.
featuredPost: false
tags:
  - Unity
  - Optimization
---
We can found the reference code of UnitySynchronizationContext in their [git repository](https://github.com/Unity-Technologies/UnityCsReference/blob/master/Runtime/Export/Scripting/UnitySynchronizationContext.cs).

Reading the code of it you might notice a mysterious number 1213602 in one of the comment:
> // When you invoke work, remove it from the list to stop it being triggered again (case 1213602)

Googling this number lead me to a [page](https://issuetracker.unity3d.com/issues/additional-memory-allocated-when-removing-workrequest-in-unitysynchronizationcontext-dot-cs) of unity issue tracker. The issue is about the use of List.
> Actual result: List'1.Remove() calls List'1.IndexOf() which allocates additional memory  
> Expected result: List'1.RemoveAt(0) could be used instead, as it does not allocate additional memory

It basically suggest to use `List.RemoveAt(0)` instead of `List.Remove`. However, this is still not good enough. Why don't we take it one step further, for example, by using `List.RemoveAt(lastIndex)` instead of `List.RemoveAt(0)`. It might not be quite obvious but the dotnet documentation mentions the time complexity of this method, and the complexity is much better for removing the last element.
> This method is an O(_n_) operation, where _n_ is ([Count](https://docs.microsoft.com/en-us/dotnet/api/system.collections.generic.list-1.count?view=net-6.0) - `index`).

To accommodate this we need to copy the list in reverse order and iterate the list from its tail, or if we don't want to sacrifice readability we can use a `Queue` or `QueueList` implementation that provides O(1) complexity for both removing head and tail. Here is [my implementation](https://github.com/ewgdg/CircularList) of a `QueueList`.

However, this is still not good enough because we still need to do a redundant list/queue copy per execution.
```csharp
// Exec will execute tasks off the task list
public void Exec()
{
    lock (m_AsyncWorkQueue)
    {
        m_CurrentFrameWork.AddRange(m_AsyncWorkQueue);
        m_AsyncWorkQueue.Clear();
    }
    
    // ... remaining code
}
```

A better choice is to do a queue swapping.
```csharp
private void Execute()
{
  lock ( queueLock )
  {
    //swap
    (runningQueue, pendingQueue) = (pendingQueue, runningQueue);
    pendingQueue.Clear();
  }

  for ( int i = 0; i < runningQueue.Count; i++ )
  {
    var work = runningQueue[i];
    work.Invoke(); // need to catch and handle exceptions here
  }
}
```

Once we have a new implementation of `SynchronizationContext`, the next step is to integrate it into Unity `PlayerLoop` system.
```csharp
var currentSystem = PlayerLoop.GetCurrentPlayerLoop();
var newSubsystem =  new PlayerLoopSystem()
                    {
                      updateDelegate = syncCtx.Execute,
                      type = typeof( RoninGameSynchronizationContext ),
                    };

// inject the new system as a sub system of `Update` Loop system                 
// ... manipulation of the player loop system

// finally set the modified system back
PlayerLoop.SetPlayerLoop( currentSystem );
```

If we want to use it for Editor, we might also need to pump it for Editor update. 
```csharp
if ( SynchronizationContext.Current == instance )
{
  EditorApplication.update -= ExecuteSyncCtx;
  EditorApplication.update += ExecuteSyncCtx;
}
else
{
  EditorApplication.update -= ExecuteSyncCtx;
}

private static void ExecuteSyncCtx()
{
  if ( EditorApplication.isPlayingOrWillChangePlaymode
       || EditorApplication.isCompiling
       || EditorApplication.isUpdating )
  {
    return;
  }

  instance?.Execute();
}
```

At last, we just need to inject the new `SynchronizationContext` to Unity thread before the game starts or editor starts.