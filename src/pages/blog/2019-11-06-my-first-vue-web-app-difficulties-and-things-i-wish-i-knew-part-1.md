---
templateKey: BlogPost
title: 'My First Vue Web App: Difficulties and Things I Wish I Knew, Part 1'
date: 2019-11-06T21:59:10.643Z
featuredPost: true
featuredImage: >-
  /img/my-first-vue-web-app-difficulties-and-things-i-wish-i-knew-part-1-image1.png
---
**<span dir="ltr">Background:</span>**

<span dir="ltr">When I decided to make my first vue app, I was learning
about web app. It was at that moment, I was facing the first dilemma of
my web app to be developed for practicing purpose, what software stack
should I use. This was the first problem I was going to solve.</span>

<span dir="ltr"></span>

**<span dir="ltr">Problem 1: Template Engine vs. JavaScript
Framework</span>**

<span dir="ltr">My first web app is a university course project 3+ years
ago about a simplified search page with a python web framework called
bottle. The backend logic is very simple. It sends a string as html upon
receiving request. There is no other framework or library involved. So
when I found the term template engine I thought that was the one I was
looking for. I tried JSP for Java, ThymeLeaf, Twig, Mustache, and
Handlebars. Those are very big and popular template engines, and some
are expressiveness powerful while others focusing on simplicity. I felt
restricted when I learnt these engines. If I made some changes on the
template side and I wanted to see the change, I have to adjust my
backend server and the view model for the change. The cascading change
slows my development, so I started to do some further research, and I
saw some other methods including Vue.js, React.js, and Angular.js. These
Javascript frameworks share some similarities on building interactive
user interface. However, as a newbie, I really had no idea whether or
not they were worth my time. A
[<span class="underline">video</span>](https://www.youtube.com/watch?v=x7cQ3mrcKaY)
by Pete Hunt talking about React finally convince me that JavaScript
framework like React is a better choice for me to build a more dynamic
web app. Here are some quotes from the talk:</span>

> <span dir="ltr">“How often do you go to other parts of your code base
> and make changes in order for it to work, and these sorts of cascading
> changes are symptoms of coupling and that is what make software hard
> to maintain... Templates separate technologies, not concerns. And they
> do it by deliberately under-powered. ”.</span>

<span dir="ltr">Being able to stand on the shoulders of giants, I had a
deeper understanding on the topic of web development. As a result, I
made up my mind on picking the JavaScript UI framework instead of those
template view technologies. Indeed, JavaScript UI frameworks come with
many advantages and make it is possible to run JavaScript universally
for both frontend and backend side.</span>

<span dir="ltr"></span>

**<span dir="ltr">Problem 2: React vs. Vue vs. Angular</span>**

<span dir="ltr">You might have noticed that there are actually three of
those javascript frameworks that are very popular for web development.
They are React, Vue, and Angular. I was going to make another decision
here, choosing the right one for my little web app. To solve this
dilemma, I came up with a weighted matrix table for the three
frameworks.</span>

<span dir="ltr"></span>

**<span dir="ltr">Problem 2.1: Evaluation Weighted Matrix</span>**

| <span dir="ltr"></span>                            |                                   | **<span dir="ltr">Framework</span>** |                                           |                                  |                                           |                                  |                                           |
| -------------------------------------------------- | --------------------------------- | ------------------------------------ | ----------------------------------------- | -------------------------------- | ----------------------------------------- | -------------------------------- | ----------------------------------------- |
| <span dir="ltr"></span>                            |                                   | <span dir="ltr">React</span>         |                                           | <span dir="ltr">Vue</span>       |                                           | <span dir="ltr">Angular 2</span> |                                           |
| **<span dir="ltr">Criteria</span>**                | **<span dir="ltr">Weight</span>** | **<span dir="ltr">Score</span>**     | **<span dir="ltr">Weighted Score</span>** | **<span dir="ltr">Score</span>** | **<span dir="ltr">Weighted Score</span>** | **<span dir="ltr">Score</span>** | **<span dir="ltr">Weighted Score</span>** |
| <span dir="ltr">Reliability</span>                 | <span dir="ltr">0.15</span>       | <span dir="ltr">9</span>             | <span dir="ltr">1.35</span>               | <span dir="ltr">7</span>         | <span dir="ltr">1.05</span>               | <span dir="ltr">8.5</span>       | <span dir="ltr">1.275</span>              |
| <span dir="ltr">Readability</span>                 | <span dir="ltr">0.1</span>        | <span dir="ltr">8</span>             | <span dir="ltr">0.8</span>                | <span dir="ltr">8.5</span>       | <span dir="ltr">0.85</span>               | <span dir="ltr">8.5</span>       | <span dir="ltr">0.85</span>               |
| <span dir="ltr">Ease of Learning</span>            | <span dir="ltr">0.25</span>       | <span dir="ltr">7.5</span>           | <span dir="ltr">1.875</span>              | <span dir="ltr">9</span>         | <span dir="ltr">2.25</span>               | <span dir="ltr">6</span>         | <span dir="ltr">1.5</span>                |
| <span dir="ltr">Ease of Use</span>                 | <span dir="ltr">0.1</span>        | <span dir="ltr">8</span>             | <span dir="ltr">0.8</span>                | <span dir="ltr">8.5</span>       | <span dir="ltr">0.85</span>               | <span dir="ltr">8</span>         | <span dir="ltr">0.8</span>                |
| <span dir="ltr">Size</span>                        | <span dir="ltr">0.05</span>       | <span dir="ltr">8</span>             | <span dir="ltr">0.4</span>                | <span dir="ltr">9</span>         | <span dir="ltr">0.45</span>               | <span dir="ltr">6</span>         | <span dir="ltr">0.3</span>                |
| <span dir="ltr">Modularity</span>                  | <span dir="ltr">0.2</span>        | <span dir="ltr">8</span>             | <span dir="ltr">1.6</span>                | <span dir="ltr">8</span>         | <span dir="ltr">1.6</span>                | <span dir="ltr">8</span>         | <span dir="ltr">1.6</span>                |
| <span dir="ltr">Compatibility & Flexibility</span> | <span dir="ltr">0.05</span>       | <span dir="ltr">9</span>             | <span dir="ltr">0.45</span>               | <span dir="ltr">8</span>         | <span dir="ltr">0.4</span>                | <span dir="ltr">8</span>         | <span dir="ltr">0.4</span>                |
| <span dir="ltr">Documentation</span>               | <span dir="ltr">0.05</span>       | <span dir="ltr">8.5</span>           | <span dir="ltr">0.425</span>              | <span dir="ltr">8.5</span>       | <span dir="ltr">0.425</span>              | <span dir="ltr">8</span>         | <span dir="ltr">0.4</span>                |
| <span dir="ltr">Community Support</span>           | <span dir="ltr">0.05</span>       | <span dir="ltr">8</span>             | <span dir="ltr">0.4</span>                | <span dir="ltr">7</span>         | <span dir="ltr">0.35</span>               | <span dir="ltr">8</span>         | <span dir="ltr">0.4</span>                |
| <span dir="ltr"></span>                            | <span dir="ltr"></span>           |                                      |                                           |                                  |                                           |                                  |                                           |
| **<span dir="ltr">Total</span>**                   | <span dir="ltr">1</span>          | <span dir="ltr"></span>              | <span dir="ltr">8.1</span>                | <span dir="ltr"></span>          | <span dir="ltr">8.225</span>              | <span dir="ltr"></span>          | <span dir="ltr">7.525</span>              |
| **<span dir="ltr">Rank</span>**                    | <span dir="ltr"></span>           | <span dir="ltr"></span>              | **<span dir="ltr">2</span>**              | <span dir="ltr"></span>          | **<span dir="ltr">1</span>**              | <span dir="ltr"></span>          | **<span dir="ltr">3</span>**              |

<span dir="ltr"></span>

<span dir="ltr"></span>

**<span dir="ltr">Problem 2.2: Explanation of the Evaluation
Criteria:</span>**

<span dir="ltr">All scores is based on research materials from community
FAQ, online tutorials, introduction videos, official
documentations.</span>

<span dir="ltr"></span>

* **<span dir="ltr">Reliability:</span>**\
  If a framework is proven to be reliable and stable by
  some existing projects then it is clear that it is a good option for
  my web app. For example, Facebook and Instagram are built with
  React.js and prove its stability.
* **<span dir="ltr">Readability:</span>**\
  Code readability is another factor I will when
  choosing a framework for my project. React JSX allows embedded html
  code into JavaScript code and this makes it slightly behind.
* **<span dir="ltr">Ease of Learning:</span>**\
  <span dir="ltr">I give this criteria the highest weight for a reason.
  Frontend world and JavaScript is advanced in a fast pace. Any
  framework you learnt might be out of date at any time. The complete
  rewrite of AngularJS to Angular 2 is a great example. If a framework
  takes a long time for developers to be proficient in it, there is a
  higher risk that your time invested will be a waste. Vue by far is the
  only framework that every developer who use it before agrees on its
  easiness of learning.</span>
* **<span dir="ltr">Ease of Use:</span>**\
  <span dir="ltr">A criteria to describe whether or not a framework is
  convenient to use once the developer masters it.</span>
* **<span dir="ltr">Size:</span>**
  <span dir="ltr">Bandwidth restriction is a problem that every web
  developer might face. Smaller package size provides better end user
  experience, especially when the mobile browser is more popular
  nowadays. Angular 2 has package size around 500k while React is \~100k
  and Vue is \~60k.</span>
* **<span dir="ltr">Modularity:</span>**\
  <span dir="ltr">This criteria describe the ability to separate code
  into components and to reuse code, and component composability of a
  framework. Basically, every framework here claims that it is component
  based so I give them the same score for this criteria.</span>
* **<span dir="ltr">Compatibility:</span>**\
  <span dir="ltr">A compatible framework has the ability to integrate
  with many other libraries like Bootstrap and thus provides more
  flexibility to add customized features. React can be used to develop
  cross-platform apps with other libraries like Ionic/React Native for
  mobile app support.</span>
* **<span dir="ltr">Documentation:</span>**\
  <span dir="ltr">Great examples and detailed explanations are bonus for
  a documentation. It is more of my personal taste.</span>
* **<span dir="ltr">Community Support:</span>**\
  <span dir="ltr">Both React and Angular are backed by big companies and
  large communities. Vue is becoming trendy but the community is
  smaller.</span>

![](/img/my-first-vue-web-app-difficulties-and-things-i-wish-i-knew-part-1-image1.png)

<span dir="ltr">To conclude, Vue was slightly ahead on the evaluation
and I eventually decided to use Nuxt.js which is framework of Vue.js for
the purpose of SSR for my web project.</span>

<span dir="ltr">To be continued.</span>
