---
templateKey: BlogPost
title: 'My First Vue Web App: Difficulties and Things I Wish I Knew, Part 3'
date: 2019-11-08T18:48:19.565Z
lastModified: 2025-07-27T08:54:45.000Z
description: Tackling difficulties.
featuredPost: false
tags:
  - Vue
  - difficulty
  - parallel
  - web worker
  - comlink
  - progress bar
  - coroutine
  - async
---
During the development, I met many difficulties and one of the difficulties is especially impressive to me. The difficulty is about progress bar. My first Vue app consists of some heavy computations during the loading period, and I wanted to add a progress bar for it.

Adding a progress bar seems to be very simple. An indeterminate progress bar is an easy solution to it. However, I wanted to challenge myself.  To make a real progress bar, I first separated the loading process into ~200 steps, each step added some progress number to a counter. A progress bar from Bootstrap was imported for displaying the counter. This trivial solution did not work because JavaScript is single threaded. To clarify it, this means if my loading process is running synchronously, then the rendering will be blocked. I need some sort of parallel computation to solve this problem. 

To simulate the parallel computation in JavaScript, I can use the concept like coroutine or async function. There is the definition of coroutine from wikipedia:

> Coroutines are computer program components that generalize subroutines for non-preemptive multitasking, by allowing execution to be suspended and resumed. Coroutines are well-suited for implementing familiar program components such as cooperative tasks, exceptions, event loops, iterators, infinite lists and pipes.

In JavaScript, we can use function* and yield to make coroutines. But the case was slightly different here. I wanted to yield the control back to the browser for rendering, not to my main JavaScript program and I did not want to modify too much of my code structure. Therefore, I used the keyword `setTimeout`, `async`, and `await`. The pseudo code is as follows: 

```js
function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function loadData(){
  for(const step of steps){ 
    step();
    updateProgressBar();
    // yield control to browser
    await wait(0);
  }
}
```

The `await wait(0)` is the emulation of the `yield`. It asks the browser to reschedule the current execution into the event loop and thus suspend the execution and yield control to the browser. The browser then have a chance to render the progress bar update. The problem should have been solved in most cases. Unfortunately, it is not perfect for my case as I was using BootstrapVue framework for my UI progress bar. So the progress bar was a component from BootstrapVue and I had no control on the implementation of the component. It turned out that BootstrapVue required some time to play the animation to make it smooth. A change to the progress counter will change the display of the number but not the bar indicator without enough time to finish its animation. This kind of makes sense, as you don’t want any sudden sharp move of your indicator. The simple fix is to extend the waiting time with code like `await wait(10)`. The question is how long is long enough for the animation to finish. On some machines, it might takes 5 ms while on some others it takes 15 ms. The time span is not fixed. Fortunately, we have a rescue for it. The double `requestAnimationFrame` call:

```js
function waitForAnimation() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve)
    })
  })
}
```

I have to admit it is quite hacky here. But the intuition behind it is that the interval between 2 page refresh should be enough for the animation. Since the rescue, The animation can run smoothly and seemingly flawlessly.

However, this is not the happy ending of the story. You might have guessed the problem as an experienced developer. The profiling tool from google chrome browser illustrates the problem. The below graph is a timeline recording result of the whole loading process. 7430 ms out of 8563 ms is used for idling.

![](/img/my-first-vue-web-app-difficulties-and-things-i-wish-i-knew-part-3-image1.png)

Initially, I thought I misunderstood the word ‘idle’ as a non-native English speaker. After I checked the dictionary and confirmed the meaning of ‘idle’, I realized that something went wrong. Remember that I broke my loading process into \~200 steps and if each step takes \~30 ms break, then the idling time is roughly 6000 ms. That means ~90% of the loading time is wasted. I could compromise for better performance or for better animation, but there would be a trade-off anyway. To really overcome the issue, I have to use true parallelism, the Web Worker.

Web Worker is a background worker thread runs parallel to the main execution thread with some limitations. The worker must be in a separate JS file and utilizes string for communication and does not fit well in Webpack environment. These concerns indicate that I would have to rewrite a large scale of my code to integrate Web Worker. After some research, I found some open-source projects that solve all of these concerns. The solutions are Comlink that implements RPC protocol and provides a better communication interface for Web Worker, and Worker-Plugin for automatically bundling and compiling Web Worker within Webpack. 

There were many other difficulties like the resolving conflict with Bootstrap and avoiding Cookies, and persisting and serializing data, but they are just not worth to mention here. So this is the happy ending. If you are interested, the github page for my first Vue app is [this](https://github.com/ewgdg/gacha-simulator).
