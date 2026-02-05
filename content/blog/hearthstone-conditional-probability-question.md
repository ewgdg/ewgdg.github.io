---
templateKey: BlogPost
title: An Interesting Hearthstone Conditional Probability Question
date: 2020-04-17T13:00:00.000Z
lastModified: 2025-07-27T08:54:45.000Z
description: Reasonable assumptions make differences.
featuredPost: false
tags:
  - Gaming
  - HearthStone
  - Probability
---
![](/img/An-Interesting-Hearthstone-Conditional-Probability-Question.png)

There was a very interesting conditional probability problem last month
as shown in the picture and it caused a debate over it. Some claimed
that the answer is 1/7 but others said 1/13.

**Background Information:**

Evil Miscreant will generate 2 lackeys, one by one.

There are 7 different lackeys in total, each one has the equal chance to
be generated.

**A Brief Summary of the Question:**

Player1 generates 2 lackeys. Each lackey has 1/7 chance to be the
titanic lackey.

The opponent(we) or a third person knows from God's perspective that
titanic lackey is the only cure for player1 to survive. Player1 plays a
titanic lackey and survives with it. What is the probability for player1
to have the second titanic lackey in hand.

Define:<br/>
Player1: the one who plays titanic lackey. <br/>
Event A: the another card is also titanic <br/>
Event B: player1 plays titanic lackey

To Solve: P(A|B)=?

**Models/Assumptions:**

There are 2 models/assumptions we can build:

M1: player1 always plays titanic when he holds titanic lackeys because
he knows all of the information and is absolutely rational to determine
that playing titanic is the only way to win.

M2: player1 plays any card in an equal chance and he just be lucky to
play the titanic lackey to survive. He doesn't know if the titanic is
the only one that can save him or he is not rational or smart enough.

**Model 1 (M1):**

Solve:

>P(AB) = P(both are titanic and he plays one of them) = 1/7 \* 1/7 = 1/49
>
>P(B)\
= P(at least one of card is titanic and he has to play the titanic)\
= 1-P(none is titanic)\
 = 1- 6/7\*6/7 = 13/49
>
>P(A|B) = P(AB)/P(B) = **1/13**

**Challenge Question 1 under M1:**

What if we know which one of the cards player1 plays, said the **left**
one? Given that in Hearthstone the positional information of the played
card is provided.

Solve:

Based on model 1, player1 has a 50% chance to play either left or right
if both left and right are titanic because the value of left and right
are equal.

Define Event C: player1 plays the left one. We are looking for P(A|BC).

>P(ABC) = P(C|AB)\*P(AB) = 0.5 \* 1/49 = 1/98

Define Event:\
B = B1 U B2 U B3\
B1 = only left side is titanic\
B2 = only right side is titanic\
B3 = both are titanic\
B1,B2,B3 are mutually exclusive.

>P(CB)<br/>
  \= P(C and B1 U B2 U B3)<br/>
  \= P(CB1 U CB2 U CB3) *(distributive property)*<br/>
  \= P(CB1)+P(CB2)+P(CB3)<br/>
  \= P(C|B1)\*P(B1) + P(C|B2)\*P(B2) + P(C|B3)\*P(B3)<br/>
  \= 1 \* 6/49 + 0 \* 6/49 + ½ \* 1/49 = 13/98
>
>P(A|BC) = P(ABC)/P(BC) = **1/13**

**Model 2 (M2):**

Solve:

>P(AB) = P(both are titanic and he plays any one of them) = 1/7 \* 1/7 =
1/49
>
>P(B)<br/>
  \= P(at least one of card is titanic and he just happened to play the
titanic)<br/>
  \= P(he plays a random card which just happened to be titanic)
*(associative law)*<br/>
  \= P(he plays left card and left card is titanic)+ P(he plays right card
and right card is titanic)<br/>
  \= ½ \* 1/7 + ½ \* 1/7 = 1/7
>
>P(A|B) = P(AB)/P(B) = **1/7**


**Summary:**

Based on different assumptions and models we will get different results
from the question. However, Model 1 seems to be a more reasonable model
to me according to game theory. Nevertheless, the two models mentioned
are too idealistic. The real situation might be in between and player1
might have some odds p1\>=1/2 && p1\<=1 to play titanic when he holds
titanic lackeys.
