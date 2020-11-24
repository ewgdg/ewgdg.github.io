---
templateKey: BlogPost
title: Question Answering Chatbot
date: 2020-11-24T20:41:08.570Z
description: Screening interview?
featuredPost: false
featuredImage: /img/question-answering-chatbot-0.png
---
Recently I got a phone interview about my experience and background kind stuff. What is interesting is that this interview is a non-technical one but the position I applied to is a technical position. This makes me wonder, is it the necessity for non-tech interviews? If so, how would I pass it? Today I am going to solve the problem.

Screening interviews like this can evaluate a candidate's soft skills, most likely to be the communication skill. However, I don't think this contributes a big factor to the reasons. A developer is more about reading and writing skills, not oral speaking and listening skills.\
There must be another reason behind it, and my guess is efficiency and curiosity. 

During the interview I attended, I noticed that the interviewer barely read my resume. He preferred to read the resume with me and post questions during the process. So in my imagination, the interviewer might simply throw a pile of resumes into the air and whatever is left on the table is his pick. This is understandable as there are 200+ applicants to this single position and this maximizes his efficiency to reduce the remaining number of resumes. Reading the resume with the applicant during a phone interview is just another great strategy to use to increase the recruiter’s efficiency. A learner can receive information from many channels, two main channels are voice and text; study shows that students attend lectures get better performance than student study with textbooks. Talking in a phone interview is therefore better than reading the resume for the purpose of knowing the applicants. The interaction, the ability to ask questions, further increases the effectiveness of a phone interview.

Knowing how a phone interview works, the next thing I need to solve is on how to excel it. First thing I notice in a typical screening interview is that, most of the time the interviewer is from the hiring team instead of the team the candidates apply to. There might be some reasons behind it, but this indicates that this kind of interview is a very general evaluation. It is general such that it comes with patterns. 

As human brains are very powerful for pattern recognition, I am able to recognize some patterns for the type of phone interview. The interview usually comes with routine questions. “Tell me about yourself.”, “why do you want this job?”, “why should we hire you?”, “why do you want to work for this company?”, you might have heard these questions before because they are asked again and again. This led me into generating some templates for the questions. If it is repetitively occurring, then I am going to cache it. Even further, I am going to build a chatbot for it, as interaction is desired.

I am building a question answering chatbot for reasons. Firstly, if the interviewers can interactively ask questions about myself and this might delight them. Secondly,  I myself can use the chatbot as a cheatsheet to escape boilerplate questions in analogy to asking questions on stackoverflow.com. The main purpose of it is to ease my life as I am not really good at answering non-technical questions.

I am going to leverage the power of open source projects for the purpose of easing my life. After some research I found some of them as follows:

**Botpress**:
\
https://botpress.com/ for routine conversation , seems quite related.
It uses flow editor, require me to define questions and answers.
Natural language understanding. 
dual-licensed under AGPLv3 and the Botpress Proprietary License.
A good backup solution.\
8.9k stars on github.
After studying on the AGPLv3 license I realize it is not good for devs.

**Rasa**: \
https://rasa.com/   with the power of machine learning and NLU, sounds powerful.
10.1k stars on github.
Licensed under the Apache License, Version 2.0.
Need to train with examples, troublesome if I need to modify dialogues frequently.
Good for closed-domain conversation.

**Opendialog**:
\
https://www.opendialog.ai/ for enterprise scale chatbots.
30 stars on github.
Well it might not be for individual devs.

**Hugging Face**:
\
https://huggingface.co/transformers/index.html.
Many models to use, 
Some are  pre-trained.
36.9k stars on github.
Apache-2.0 License.
I think this is my choice, the github stars won't lie to you.

**Haystack**:
\
Eventually, this is my choice.
It is built on top of the Hugging Face transformer and most importantly it comes with a built-in document retriever. With document retriever I can do question answering at scale by storing my blog posts into a database and retrieve the relevant text as context when required.

## Result

The result is as demonstrated:

![](/img/question-answering-chatbot-0.png)

You might notice that it does not perform well on some cryptic questions; this is because the QA bot is based on my currently existing blog posts, and if there is no relevant context in my blog to the question, then the bot cannot answer it. To solve this issue, I created a new Q&A section below such that the bot can read the context and extract useful answers from it.

## Q&A section:
<details>
  <summary>Click to expand</summary>


Q: Tell me about yourself.\
A: I graduated from the UofT computer engineering department. I am interested in getting a career as a full stack developer. Therefore, I worked on some personal projects about web apps, one of them is server side rendering another one is about Jamstack, and it is a static site, I have learnt react.js and vue.js and javascript during the process. I am currently learning node js and that might help me gain exposure in this field.


Q: What are your career goals?\
A: In the short term, I am looking at getting a job in the industry and learning the ropes and ensuring I am able to use the skills. In the long term, I am certainly looking at growth and increasing my knowledge, along the way gaining both career and financial stability.


Q: Why do you want this job?\
A: I have been gearing up myself for this kind of job profile for a while now. I have read the job description and find myself suitable for the role, hence I am looking forward to this job.
 

Q: Why should we hire you?\
A: I have been interested in this field for a while now. I have accumulated the skills that are required to help me become a better developer. I have ever been a quality assurance engineer and realize that I am more capable of solving problems as a developer. Some of the skills I have acquired are frontend and backend technology like react.js and node.js. Along with that I am good at creative thinking, logical reasoning and team building. 


Q: Why do you want to work for this company?\
A: I am impressed by the work your company has done and the recent developments. It would be an honor to work in a company associated with such a great reputation.
 

Q: What are your strengths?\
A: I am good at this technology and am a quick learner and will quickly grasp the training that will be given to me. I achieved great academy performance with ~3.9 sessional gpa for my 3rd and 4th year study in university. I am an active problem solver; I created my personal page for the purpose of solving my real job hunting challenges.
 

Q: What are your weaknesses?\
A: One of them is that I am a little bit introverted. Sometimes I hesitate to talk or ask for help. When I applied for my postgraduate study, the professors from who I requested for recommendation letters failed to provide the letters on time but I was hesitant to bother them and lost my chances. I used to hate noise environments and lose focus dealing with noise, but I have trained myself to get adapted to it and I got my noise cancelling headphones. Another thing worth mentioning is that I am not a native English speaker and I have a limited vocabulary pool though I am trying to improve over it. 
 

Q: Tell us about your favorite subjects.\
A: Algorithms, Artificial intelligence. I like to solve challenging questions.


Q: How long do you want to work here?\
A: I would love to work for as long as the company finds me relevant to the role, and I also find growth in the company, both in terms of climbing the career ladder and financial growth.
 
Q: Do you have any questions for me?\
A: What are the day to day responsibilities of the job role? 
What is expected of me in the first month, six months and a year?
In your opinion, how can I become successful in this role?


</details>
