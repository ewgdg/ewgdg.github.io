---
templateKey: BlogPost
title: 'My First Vue Web App: Difficulties and Things I Wish I Knew, Part 2'
date: 2019-11-08T02:06:51.406Z
description: Mistakes I made.
featuredPost: false
tags:
  - Vue
  - mistakes
  - lint
  - Vuex
---
In this section, I want to talk about some mistakes I made for my first Vue app.

**Mistake 1:  Be Restricted by Linter**

Linter is actually the best tool I have ever used for JavaScript developers. A linter is a static code analysis tool that can help me to avoid style and syntax errors. It was especially useful for me when I was not familiar with JS syntax during my first Vue project. As a result, I strictly followed the linting tool I was using and became over reliant on it. The direct result was that my development speed was restricted. The linter is not as smart as a real person, and some rules are just of personal preference of the author. Some styles that can be useful are considered as unsafe such as the reuse of variable name in different scopes. But the reuse of name it is not necessarily dangerous because the constraint of scopes/namespaces. Strictly following the rules of linter, I wasted quite a lot of time on things that are less important, like thinking of unique name for the same kind of variables in different scopes. By reading the official documentation of Eslint, I realized that this was not the right way to use linter. The correct way is to configure and customize the linting rules for your project and preference. And indeed, there is actually a configuration file for the linter and you can even disable rules using inline comments. Linter is a tool to facilitate development, not to restrict.

![](/img/my-first-vue-web-app-difficulties-and-things-i-wish-i-knew-part-2-image2.png)

**Mistake 2: Abuse of Vuex**

My first vue app requires some heavy computations, and the whole app contains many states, some are internal states that are for calculations and some are external states used for UI rendering. To manage such a large number states and data flows, I used the centralized data management store called Vuex. All of the internal and external states were stored in Vuex store. Same for the computations. Vuex are very useful on debugging and tracking down state mutations. However, tracking large amounts of data made the debugging tool laggy and the frequent freezes gave me instincts that something went wrong. When I read the documentation of Vue, I eventually caught the mistake. It is all about the reactivity system of Vue. Vue implements an observer pattern that appends a watcher for every component instance including the store of Vuex.

![](/img/my-first-vue-web-app-difficulties-and-things-i-wish-i-knew-part-2-image1.png)

All of the states/properties in the Vuex store will be modified by Vue to be able to notify the watcher because all of the states in the store will be ‘touched’ during the renderings and computations. If a large amount of states send the change-notifications, the app will be very slow. It is important to minify the number of notifications. That requires the separation of internal states and external states. To reach the goal, I extracted the computation logic into an OOP class, and read only external states that are necessary for rendering from the object instance instantiated by the class into Vuex store.  It turned out that only a small fraction of states were related UI display so they were read into Vuex store. The problem is solved. This mistake reminds me that Vue is a rendering framework and heavy data processing should be separated from it.

To be continued.

Check [Part 3](https://xianzzzz.com/blog/2019-11-08-my-first-vue-web-app-difficulties-and-things-i-wish-i-knew-part-3).
