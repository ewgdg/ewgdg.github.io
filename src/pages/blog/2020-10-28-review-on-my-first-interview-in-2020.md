---
templateKey: BlogPost
title: Review on My First Interview In 2020
date: 2020-10-28T17:49:20.246Z
description: Mock interview beforehand is important.
featuredPost: false
tags:
  - interview
  - coding
---
As a newbie with little to no experience in real interviews, here are some of my thoughts and mistakes on my first interview in 2020. 

**First Impression:** \
The first mistake I made is failing to provide insights on the company’s products. I did some research into their products, but unfortunately I did not think about it too much. As a result I stammered when the questions came and thus failed to impress the interviewer. The bad thing is that the first impression matters and I gave a poor impression to my interviewer.

**Communication:** \
One mistake I made is in understanding the question description logically. During the interview, I asked my interviewer if I can enhance the data structure of given input, and he insisted that the input remains its structure. I misunderstood the context and added an extra constraint on my solution that I should not modify the input data structure. But actually although the input remains the same, I can instead preprocess the input data and create a new data structure to store the input data. I think a better way to avoid such a mistake is to make assumptions write them down. If those assumptions are wrong then the interviewer can point it out. Do not add extra constraints myself.

**Asking questions:** \
When the problem is given by the interviewer, it is my turn to post questions on the given problem. I failed to ask meaningful questions before solving the problem. This made my solution less robotic and less optimal without knowing the real constraints on input. 

I should really ask for input constraints ahead of time. For example, if the input size is small and the functions are frequently called, I might want to preprocess the input data and memorize some results. 

I should also ask for function prototypes and use cases to have a better figure on my mind. I wasted some time on realizing the correct prototypes with wrong assumptions. 

**Test cases:** \
It is very important to make sure the solution is correct. Test driven development is a good strategy to use here. I should have made test cases before and write solutions based on test cases. Without writing test cases ahead, my solution became error-prone and I did spend a considerable amount of time debugging it. 

It is also important to come up with some simple edge cases ahead. I did not test much on edge cases after finishing my solution as there is not much time left, so it is better to do it first.

**Analyze complexity and optimization:** \
I forgot to analyze time and space complexity after completion of my solution and thus lost my chance to realize there is a potential optimization behind the scene. Thinking about optimization and complexity is another step to do after solving problems.

**Lesson Learnt:** \
A mock interview for a real interview is as important as a unit test for a program. I could have avoided all mistakes I made if I mocked my interview beforehand.

After some research,
I decide to generalize some steps to analyze a problem during an interview.
These steps are important to demonstrate your understanding of computer science, especially when you notice the interviewer gives no hints.

Step 1:\
Clarify the question, write down all assumptions made.
Ask for input constraints and function prototype if possible.
Analyze the use cases, know the calling frequency.
Avoid asking too many questions, instead just make and state/record assumptions.

Step2:\
Brainstorm the solution, start with a naive solution.

Step3:\
Analyze the complexity and start to improve the algorithm.

Step4:\
Analyze tradeoffs and pick the most efficient approach based on use cases.
Discuss the ideas with the interviewer before implementation.

Step3:\
Design some simple test cases and edge cases as part of  test driven development.

Step4:\
Design classes and abstract the algorithm to write clean code.
Ask the interviewer to skip the redundant code like constructors for the purpose of saving time.

Step5:\
Go through a simple test case. Do not waste time on it if there is another follow up question.
