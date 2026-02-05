---
templateKey: BlogPost
title: Patterns of Dynamic Programming
date: 2020-10-21T11:39:05.000Z
lastModified: 2025-07-27T08:54:45.000Z
description: Observe patterns.
featuredPost: false
tags:
  - Dynamic Programming
---
Dynamic programming is a programming method or algorithm level
optimization for certain problems. This article will focus on two concerns 
here, they are when to apply it and how to apply it.

**When to apply:**

Dynamic programming is applied often when a problem can be divided into
similar subproblems, and the problem can be solved by solving
subproblems first (**optimal substructure**). This indicates recursion.

The second sign is when you notice that there are a lot of repetitions
on the same subproblems that are being queried during recursion (**overlapping subproblems**). This
indicates that memoization could be applied to optimize time complexity.

**Example problem:**

To practice it, let’s start with a simple example, the ‘subsequence sum’
problem.

The problem states that given an array **arr\[\]** of length **N** and a
number **K**, the task is to find out if there is any subsequence whose
sum of elements is **K**.

(Notice that the definition of subsequence is different from subarray
which is a continuous block. The subsequence can contain elements which
were not consecutive in the original sequence.)

To solve this problem, we can first start with a naive solution, which
finds all possible subsequences we can derive and validate the
candidates. To achieve this we can branch out on each element to
determine if we should include the current element into our subsequence.
As a result, we divide the original problem into 2 subproblems. If
either subproblem returns true then the result is true.

```java
// return true if find a subsequence sum = k
public static class NaiveSolver {
    public boolean solve(int[] arr, int n, int k) {
        return recursionHelper(arr, n, k, 0);
    }

    boolean recursionHelper(int[] arr, int n, int k, int i) {
        // terminating condition
        if (k == 0) {
            return true;
        }

        if (i >= n)
            return false;

        // current element is arr[i]
        int cur = arr[i];

        // branch 1: skip current elem
        boolean sub1 = recursionHelper(arr, n, k, i + 1);

        // branch 2: include current elem into current subsequence
        boolean sub2 = recursionHelper(arr, n, k - cur, i + 1);

        return sub1 || sub2;

    }

}

```

In this example naive solution we can notice the use of recursion calls
of subproblems, but does it show signs of repetitions? It turns out that
repetitions keep showing up. We notice that a subproblem can be
defined/identified by parameter k and i. So (k,i) will be used to
represent a subproblem and to illustrate how subproblems are recursively
divided.

Given arr = \[1,2,3,4\], initial k = 10, initial i = 0

We can draw a binary branch tree based on how we separate this problem
into smaller pieces.

<pre>
            (10,0) 
           /      \
      (10,1)      (9,1)
      /    \      /    \
   (10,2) (8,2) (9,2) (7,2)
   /    \             /   \
(10,3) <b>(7,3)</b>        <b>(7,3)</b> (4,3)
...
</pre>

Notice that subproblem (7,3) has repeatedly shown up and there will be more
repetitions as problems become more complicated.

The time complexity of the naive method depends on the number of nodes
we can find from the binary branch tree inferred from the problem, so
the time complexity is **O(2^n)**.

The space complexity depends on the depth of the tree because we need to
store function calls to be able to trace back during recursion, the
depth is **O(n)**.

**How to apply it:**

Now the difficulty is to derive a well satisfying solution from the
naive method. I am going to demonstrate the derivation step by step.

**Memoization:**

As we have mentioned before, memoization is good for caching
repetitions. So we can optimize the method by using recursive function +
memoization.

```java
public static class MemoizationSolver {
    public boolean solve(int[] arr, int n, int K) {
        Map<String, Boolean> mem = new HashMap<>();
        return recursionHelper(arr, n, K, 0, mem);
    }

    boolean recursionHelper(int[] arr, int n, int k, int i, Map<String, Boolean> mem) {
        // terminating condition
        if (k == 0) {
            return true;
        }

        if (i >= n)
            return false;

        // check mem
        String key = String.format("(%d,%d)", k, i);
        if (mem.containsKey(key)) {
            return mem.get(key);
        }

        // current element is arr[i]
        int cur = arr[i];

        // branch 1: skip current elem
        boolean sub1 = recursionHelper(arr, n, k, i + 1, mem);

        // branch 2: include current elem into current subsequence
        boolean sub2 = recursionHelper(arr, n, k - cur, i + 1, mem);

        // store res into mem
        boolean res = sub1 || sub2;
        mem.put(key, res);

        return res;

    }
}
```

There are really not too many changes here, except that a hashmap is
used to store results for subproblems.

The time/space complexity is **O(K\*n)** since we might have that many
subproblems to solve and record.

There is an issue with this method, each function call will introduce
some extra overhead. Recursively calling the helper function for many
times might slow down the program. Plus, if there are too many recursive
calls we might run into stack overflow exceptions.

**Tabulation:**

To address this issue, we can use tabulation to record results for
subproblems. The difference is that in tabulation mode, we start from
the smallest subproblems and then build larger subproblems toward the
original problem. Therefore there is no recursion required.

```java
public static class TabulationSolver {
    public boolean solve(int[] arr, int n, int K) {

        boolean[][] dp = new boolean[n][K + 1];

        // init table with results of smallest subproblems
        for (int k = 0; k <= K; k++) {
            if (k == 0 || k == arr[0])
                dp[0][k] = true;
        }

        // dp[i][k]=dp[i-1][k] || dp[i-1][k-arr[i]]
        // row i depends on row i-1
        for (int i = 1; i < n; i++) {
            for (int k = 0; k <= K; k++) {

                boolean sub1 = dp[i - 1][k];
                // note that we assume arr[i] is always positive here
                boolean sub2 = ((k - arr[i]) < 0 || (k - arr[i]) > K) ? false : dp[i - 1][k - arr[i]];

                dp[i][k] = sub1 || sub2;
            }
        }

        return dp[n - 1][K];

    }
}
```

Notice that the formula **dp\[i\]\[k\]=dp\[i-1\]\[k\] ||
dp\[i-1\]\[k-arr\[i\]\]** is basically a refactor of the following
recursive function calls.

```java
//branch 1: skip current elem
boolean sub1= recursionHelper(arr, n, k, i+1,mem);

//branch 2: include current elem into current subsequence
boolean sub2= recursionHelper(arr,n,k-cur,i+1,mem);

//store res into mem
boolean res = sub1||sub2;
```

Another thing worth mentioning here is that in tabulation mode we assume
arr\[i\] is always positive otherwise a valid k might be a negative
number that cannot fit into our table. This is a downside of tabulation.
The subproblems must fit into the table, and we need to know the
constraints on k and n for us to define the table.

Time and space complexity: **O(K\*n)**

**Space Compression:**

During the iteration, not all of the table space is utilized, for each
subproblem actually only the previous row of our table is accessed.
Therefore we can compress the table to store the previous row only.

```java
// space compression
public static class CompressedTabulationSolver {
    public boolean solve(int[] arr, int n, int K) {
        boolean[] dp_prev = new boolean[K + 1];
        boolean[] dp_cur = new boolean[K + 1];
        // init table with results of smallest subproblems
        for (int k = 0; k <= K; k++) {
            if (k == 0 || k == arr[0])
                dp_prev[k] = true;
        }

        // dp_cur[k]=dp_prev[k] || dp_prev[k-arr[i]]
        // row i depends on row i-1
        for (int i = 1; i < n; i++) {

            for (int k = 0; k <= K; k++) {

                boolean sub1 = dp_prev[k];
                // note that we assume arr[i] is always positive here
                boolean sub2 = ((k - arr[i]) < 0 || (k - arr[i]) > K) ? false : dp_prev[k - arr[i]];

                dp_cur[k] = sub1 || sub2;
            }
            dp_prev = dp_cur;
            dp_cur = new boolean[K + 1];

        }
        return dp_prev[K];
    }
}
```

Time Complexity: **O(K\*n)**

Space Complexity: **O(K)**
