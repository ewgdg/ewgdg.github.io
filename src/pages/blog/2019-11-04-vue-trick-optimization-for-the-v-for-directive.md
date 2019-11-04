---
templateKey: BlogPost
title: 'Vue Trick: Optimization for The v-for Directive'
date: 2019-11-04T21:21:47.632Z
description: |-
  Lesson learnt: an optimized solution might not be the
  best solution.
featuredPost: false
featuredImage: /img/vue-trick-optimization-for-v-for-image1.png
tags:
  - vue
  - optimization
  - v-for
---

`v-for` is a directive from Vue for List Rendering. 
The usage is as follows:
```
<ul id="example-1">
  <li v-for="item in items">
    {{ item.message }}
  </li>
</ul>
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```
It is very simple to use and easy to understand. However, coming from back-end background, I noticed that there is a limitation for such a simple directive that there is no direct way to express step, initial index, and end index for the list iteration. Of course developers are smart enough to fix it by preparing the data through iterating, filtering, and mapping before passing the data to `v-for`. The problem is that all of the mentioned processing for the list come with costs, both time cost and space cost. Iterating the whole list for processing and then create a prepared copy of it costs extra O(n) in terms of both time and space complexity. For example, if I want to render items that is of odd index in a list, I have to do the following:
```
<ul id="example-2">
  <li v-for="item in preparedItems">
    {{ item.message }}
  </li>
</ul>
var example2 = new Vue({
  el: '#example-2',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ],
  },
  computed: {
	preparedItems: ()=>{
		const res = []
		for(let i =1; i<n; i+=2;){
			res.push(this.items[i])
		}
		return res
	}
  }
})
```


Is there a better solution? Actually, there are some potential solutions to optimize for the extra cost. 

Solution 1: Re-invent the `v-for` directive such that it is more expressive. The problem of this solution is that it will sacrifice the readability of the code and re-inventing the wheel is not a very efficient way of solving problems. `v-for` is a very common directive, but a replacement of it might be unfamiliar and hard to read.

Solution 2: Re-design the data layer or back-end API such that data is pre-processed before required. GraphQL as a data layer is a great example of such a solution. When you fetch data from back-end, it is ready to be rendered without extra processing. However, sometimes developers have no permission on modifying existing API, and the development cost of changing an existing API might be very high.

Solution 3: Use the generator. If you ever learnt co-routine in python you probably notice that there is a keyword called yield in python and the yield statement allows you to make a generator to generate data without extra cost. Similarly, JS allows you to use the syntax. So to rewrite the previous example: 
```
<ul id="example-3">
  <li v-for="item in generator({list=items,start=1,end=items.length,step=2})">
    {{ item.message }}
  </li>
</ul>
var example3 = new Vue({
  el: '#example-3',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ],
  },
  methods: {
    generator:function*({list=[],start=0,end=0,step=1,filter=()=>true}){
      for(let i=start;i<end;i+=step){
        while(!filter(list[i]) && i<end){
	    i+=step
        }
        yield list[i];
      }
    }
  }
})
```
This method does not cost extra iteration nor extra copy of the list. More excitingly, it does not rewrite the existing syntax and retains the elegance and cleanness of the `v-for` directive.

Congratulations, you have wasted another 15 minutes on your life for reading this trick. If you have never heard of it, here is the quote again:  
“Premature optimization is the root of all evil”.
The recent Nobel prize winners of economics by trio tackling global poverty show the importance of randomized controlled trial. Similarly, by profiling on renderings of a randomly generated list with different optimizations versus a control group that is doing no optimization, I noticed that the performance difference is negligible. When we talk about big O notation, we mean a large amount of input data. But in front-end world, how much data can you fit into one page? Not much. Actually, after my first Vue project, I realized that the core concept of view layer rendering framework like Vue is to prepare you data first before any rendering. How you prepare your data is not a concern of the rendering framework, and most of the time it doesn't matter as the amount of data to be fetched and displayed is very small. The small difference in result does not worth your time.

Lesson learnt: an optimized solution might not be the best solution.
