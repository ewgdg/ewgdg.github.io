---
templateKey: BlogPost
title: What Is The Purpose of An Easy Level Interview Question
date: 2020-11-08T20:45:59.549Z
lastModified: 2025-07-27T08:54:45.000Z
description: |
  Do not despise it.
featuredPost: false
---
Recently, I practiced on mock interview questions and I am confused about the purpose of interviewers when I saw some easy level interview questions. So today I am going to solve this problem: what is the purpose of an easy level interview coding question seen on an interview.

To solve this problem, I am going to view it from the interviewee aspect first. To illustrate how an interviewee behaves, I found an easy level coding question from leetcode.com. The question is as following:

> Given two version numbers, version1 and version2, compare them.
>
> Version numbers consist of one or more revisions joined by a dot '.'. Each revision consists of digits and may contain leading zeros. Every revision contains at least one character. Revisions are 0-indexed from left to right, with the leftmost revision being revision 0, the next revision being revision 1, and so on. For example 2.5.33 and 0.1 are valid version numbers.
>
> To compare version numbers, compare their revisions in left-to-right order. Revisions are compared using their integer value ignoring any leading zeros. This means that revisions 1 and 001 are considered equal. If a version number does not specify a revision at an index, then treat the revision as 0. For example, version 1.0 is less than version 1.1 because their revision 0s are the same, but their revision 1s are 0 and 1 respectively, and 0 < 1.
>
> Return the following:
>
> If version1 < version2, return -1.
>
> If version1 > version2, return 1.
>
> Otherwise, return 0.
>
> **Example 1:**
>
> Input: version1 = "1.01", version2 = "1.001"
>
> Output: 0
>
> Explanation: Ignoring leading zeroes, both "01" and "001" represent the same integer "1".
>
> **Constraints:**
>
> * 1 <= version1.length, version2.length <= 500
> * version1 and version2 only contain digits and '.'.
> * version1 and version2 are valid version numbers.
> * All the given revisions in version1 and version2 can be stored in a 32-bit integer.

You can see that this question is quite trivial to solve, and the most intuitive solution could simply be the best possible solution, there is probably no room to really optimize the naive solution from algorithm level in terms of time/space complexity.

But what are possible candidate solutions look like after all? Are there really some different solutions that can distinguish different candidates and identify qualified candidates? Before we can draw a conclusion, let us really take a look into the real submitted solutions. 

I dived into submitted solution pool and analyze hundreds of those solutions and below are some frequently seen solutions:

**Candidate solution 1** : \
Frequency rate ~ 0.5, mostly common to see
.\
A method with java provided string and integer utility functions
.

Time complexity: O(M+N)
\
Space complexity: O(M+N)\
M,N are lengths of input strings. 

```java
public int compareVersion(String version1, String version2) {
    String[] levels1 = version1.split("\\.");
    String[] levels2 = version2.split("\\.");
    
    int length = Math.max(levels1.length, levels2.length);
    for (int i=0; i<length; i++) {
    	Integer v1 = i < levels1.length ? Integer.parseInt(levels1[i]) : 0;
    	Integer v2 = i < levels2.length ? Integer.parseInt(levels2[i]) : 0;
    	int compare = v1.compareTo(v2);
    	if (compare != 0) {
    		return compare;
    	}
    }
    
    return 0;
}
```

**Candidate solution 2**:\
Frequency rate ~ 0.25, secondly common to see
.\
Parsing string char by char until the end.

Time Complexity O(max(M,N))
\
Space complexity O(1)

```java
public int compareVersion(String version1, String version2) {
    int temp1 = 0,temp2 = 0;
    int len1 = version1.length(),len2 = version2.length();
    int i = 0,j = 0;
    while(i<len1 || j<len2) {
        temp1 = 0;
        temp2 = 0;
        while(i<len1 && version1.charAt(i) != '.') {
            temp1 = temp1*10 + version1.charAt(i++)-'0';
        }
        while(j<len2 && version2.charAt(j) != '.') {
            temp2 = temp2*10 + version2.charAt(j++)-'0';
            
        }
        if(temp1>temp2) return 1;
        else if(temp1<temp2) return -1;
        else {
            i++;
            j++;
            
        }
    }
    return 0;
    
}
```

I have to admit that the most common solution is the first thought that came to my mind when I saw this question. The issue of this solution is that it takes extra space when split the input strings. I forgot the side effect of creating extra space because the string split function is so common that I am so used to it. Shame on me. As a result, I fell into the so-called “ordinary never succeed” trap which is a theory I just invented to explain the necessity of Easy Level coding questions.

The “ordinary never succeed” theory states that an ordinary or commonly seen solution/person can never be successful as it is literally named; it can be proved by contradiction:
> Proof:\
> Assume an ordinary can succeed. Then other ordinaries can follow and mimic the same solution/behavior to become successful. It means eventually all of the ordinaries become successful, then most of the population are successful. This results in a contradiction because a “success” is a relative concept and by definition only a small group of the population can be successful (e.g. if everyone owns billions then a billionaire cannot be described by the term rich). \
> Q.E.D.

To really overcome this trap, I came up with third candidate solution, which is a solution derived from the concept of OOP.

Why OOP? OOP introduces encapsulation, reusability, scalability.  More importantly, it enhances my code readability and a readable solution indicates that I am a good team player.

**Candidate solution 3:**\
Time O(max(M,N))\
Space O(1)

```java
class RevisionIterator implements Iterator<Integer>{
    String version;
    int p;//pointer to next valid index to be read
        
    public RevisionIterator(String v){
        this.version=v;
        p = 0;
    } 
        
    public boolean hasNext(){
        while(p < version.length()){
            char c= version.charAt(p);
            if(c=='.'){
                p++;
            }else{
                break;
            }
        }
        return p < version.length();
            
    }
    public Integer next(){
        if(!hasNext()){
            return 0;
        }
        int res=0;
     
        while(p<version.length()){
            char c = version.charAt(p);
            if( c>='0' && c<='9'){
                //if it is a digit
                res=res*10+c-'0';
            }else{
                //it is a dot
                break;
            }
            p++;          
        }
        return res;
    }
}


public int compareVersion(String version1, String version2) {
    RevisionIterator iter1 = new RevisionIterator(version1);
    RevisionIterator iter2 = new RevisionIterator(version2);
        
    while(iter1.hasNext()||iter2.hasNext()){
        int revision1= iter1.next();
        int revision2 = iter2.next();

        if(revision1<revision2){
            return -1;
        }else if(revision1> revision2){
            return 1;
        }
    }
    return 0;
}

```

In this solution, instead of diving into algorithms directly, I first create a class called Revision Iterator which implements java iterator interface and it demonstrates my understanding on computer science and the concept of OOP. With this iterator class, I am able to finish my solution within a few lines in a much more elegant and readable way. Good Job!!!

From these three different solutions we can see that although this is an easy level question there can still be numerous ways to solve it and each solution plots a different figure of the interviewee.

Imagine myself as an interviewer, my task is to accurately evaluate candidates capability on the given job requirements. To be able to quantify my evaluation, I will start to build metrics. What could possible be one of the metrics? Search engine leads me to four key aspects: Analytical ability (intelligence), Understanding of CS, Coding skills, Personal Compatibility.

Test interviewees with easy level questions might enable the interviewer to better estimate candidates' coding skills and personal compatibility while it might not be able to demonstrate one’s intelligence. The intuition behind is that easy level questions do not require much involvement of intelligence and understanding of CS and thus reduce the sources of error and noise for the other 2 metrics.

If I was the interviewer, then I would pick the third candidate solution above as a qualified solution. The solution demonstrates good understanding of CS as it does not cost extra space and shows the understanding of OOP. In terms of the coding skills, the use of iterators simplifies the solution and makes the solution much more readable. 

Indeed, an easy level question does distinguish candidates on code readability. But what else information could I really get from testing interviewee with easy level questions? Another piece of information I can get is the speed of the interviewee on solving the problem. Coding speed is probably another aspect of coding skills; the use of easy questions reduces the effect of intelligence on speed. A normal phone interview may last for 45 minutes. Subtract 5 minutes for routine handshaking procedure there are still 40 minutes left. It seems that there is still plenty of time to spare, why would speed matter. In fact, a lot of coding interview videos show that there would often be some challenging follow-up questions after the easy level question. My opinion would be to finish an easy level question in 10 minutes. 

Personal compatibility is another factor to evaluate with easy level questions. If the candidate despises the question and solves it right away without discussing it with the interviewer, it might indicate the sign of arrogance. I think a good trick to use here is to tell the interviewer about your algorithm and ask them “what do you think (about my thoughts)?”. By posting the question actively, you gain the initiative. If the interviewer is satisfied about the thought then he might decide to skip the easy level question so that you can have more time on the follow-up questions.

To summarize, when I encounter an easy level question, I need to think about code readability, OOP, time/space complexity and be able to solve it as fast as possible after a discussion with interviewer; if there is time left I might want to test my code. 

P.S.\
I rarely got interviews and never got feedback from interviewers, so I have no idea whether or not my reasoning and thoughts are getting closer to the truth. I guess I am just the mice in a skinner box blindly looking for cure with observer bias. If you are one of the readers who are able to provide me with feedback, your feedback is really valuable to me. I will sincerely appreciate any help.






