---
title: Reading | The Art of Asking Questions
draft: false
author: Qin Tianhao
authorLink: https://github.com/QTH1225
description: How to ask better questions and obtain useful answers.
published: 2025-10-06
tags:
- docs
translations:
  zh: /03notes/ask-questions
lang: en-US
---

## Information on questions
In the course of the study, questions are asked not only by others, but also by others. Gradually, the questions are different from the problems, which can lead to common progress and reflection, and the problems that are not. The strange questions that the people encounter are as follows:

- Post a picture full of molars without any code, only Syntax Error: invalid syntax hints and ask why it was wrong.
- "Send me your git code," "a line" without indicating the purpose of the operation.
- No name or thanks, "Send me a file," "How do you do something" and "Help me get XX."
- Ask questions about what software XX, how to do XX, questions that can be answered directly by Google and so on.
- "Anyone will use Python?" "Anyone with Python on their computer?"

That's why I wrote this blog, and why the question is called an art. Of course, there is already a methodological analysis and explanation of the question on the Internet, so there are pages and blogs. These pages are also full of questions and methods that can be used as references and learning.

[How To Ask Questions The Smart Way](http://www.catb.org/~esr/faqs/smart-questions.html)(Note: This Guide does not provide practical support services for this project!)


The book details how meaningful and efficient questions should be conducted. The user believes that it is worth reading as a more detailed, systematic online question-and-answer material.
[ryanhanwu/How-To-Ask-Questions-The-Smart-Way](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way)
Of course, the warehouse has its opposite side, showing us what stupid questions are often like.
[tangx/Stop-Ask-Questions-The-Stupid-Ways](https://github.com/tangx/Stop-Ask-Questions-The-Stupid-Ways)
At the same time, some excellent websites also summarize relevant questions for information purposes.

[How to ask a good question?](https://hitripod.com/how-to-ask-good-questions/)

[Ask the right questions, and you get good answers.](https://www.darencademy.com/article/view/id/7214?ref=hitripod.com)

[LaTeX Question Process](https://sikouhjw.github.io/2020/03/08/2020-03-08-ask-questions/#%E4%B8%8D%E5%A4%AA%E6%81%B0%E5%BD%93%E7%9A%84-latex-%E6%8F%90%E9%97%AE%E6%AF%94%E5%96%BB)

[LaTeX Questioning Skills: How to get your questions answered efficiently!](https://www.latexstudio.net/archives/7510)
## My question-and-answer process
Here's my question-and-answer process for reference. In fact, the order I'm in is this.
1. Check for false reporting information, build logs, changed file path, etc.
2. Google, bining, DeepSeek, ChatGPT, etc. search for false information and solutions
3. Check in relevant forums whether there are any references to resolution in old articles
4. Try to repeat the error and determine which of the errors was caused
5. Try to recreate MWE (Minimal Work Example, Minimum Job Example)
6. Information on reporting errors and MWE questions in relevant groups

In fact, 60% of the problems can be solved in step two, and 35% in steps three and four. This will ultimately require less than 5% of the questions or problems that people ask. This will not only enhance their ability to solve problems, but also reduce their dependence on others.
## Read the record
Project[How To Ask Questions The Smart Way](http://www.catb.org/~esr/faqs/smart-questions.html)I saw it three years ago, and it was an article on the Internet that details the points of questions and answers. So the user strongly recommends that the reader read them over and over again, and the user also records notes for reference and addition.

### Before asking questions
Before asking a question, please.**Let's start with some thinking and sorting.**You will find that most of the problems can be solved in your own thinking and preparation. Even if they are not, you will have a lot of debugging methods and experience in the debugging process, and you will also be able to describe the problems in greater detail.

The phrase “self-help, help,” is particularly relevant here, and asking questions in forums or groups often means that you do not spend any money. And if you can no longer spend time properly and efficiently sorting out the content of the problem and possible solutions, it is no different than someone else’s time killer (known as “loser,” I prefer to call it “slower”).

So, before asking questions, you need to sort and search the questions. The process can be processed using the question-flow or the methods mentioned in the original text. Please do everything you can to solve the problem. Google is good, ask teachers, and not ask questions without thinking. This is the way the questions are put.

>[!WARNING] 
Don't ever think of yourself.**That's enough.**You get the answer, you don't; you don't. You don't pay for this service. You're going to go alone.**I've earned it.**One answer, by asking a question that has a content, an interesting, a mind-motivated effect -- a question that has the potential to contribute to community experience, rather than simply passively asking for knowledge from others.

Then you need to choose the platform or the way to ask questions according to the nature of the problem. If your problem is urgent and important, the expert recommends paying for knowledge, and the professional can solve your problem much faster. If your problem is a simple technical problem, then you should sort or publish it according to the nature of your problem, and the entry and advanced issues should be distinguished from the software issues. If the corresponding forum does not find the corresponding section, please try to indicate in the title what kind of problem is. At the same time, if your post or the question response is not good, please be careful to forward your questions to different groups.

When you ask questions, choose the appropriate forum or channel. Do not ask questions that have nothing to do with a group or channel with a fixed theme. This is not only a very small question, but it also makes it disgusting.[All Sites - Stack Exchange](https://stackexchange.com/sites)You can also use tags to select your questions.
- Super User is asking generic computer questions, if your questions are not about code or write program, just some network connections, and so on, please come here.
    
- Stack Overflow is a question about writing procedures.
    
- Server Fauld is asking about the server and the network tube.
### Questioning
#### Meaningful and clearly described title
In groups or forums. Do not use meaningless words like "help me," "help me," "please the big guy" that do nothing but encroach on your concise description of the problem. The question-calling forums or groups are not more painful emergency rooms than anyone. On the contrary, these places are places where it is really possible to test whether a person can describe it accurately when he or she is in a difficult situation, and it is more like a time-tested test. How can readers be attracted to your questions in a given time, and ideas and ideas are what you should try to do?

It's a saying. **“Objective-differentiated” description**. The objective indicates which group or group of things is problematic; the difference section suggests inconsistencies with the intended behaviour. Here is an example given in the original text.

Stupid question: Help! Emergency! My computer can't show up properly.
>
> Smart question: X.org 6.8.1 mouse cursor will be deformed and a card MV1005 chip group will be selected.
>
> Smarter question: X.org 6.8.1 mouse cursor, in a card MV1005 chip group environment - will be deformed.

This "target-differentiated" description is a useful way to show your thinking. What, for example, is affected? Just a mouse cursor or other graphics? Only in X.org's X version? Or in 6.8.1? Is it for a card core group? or is it just a MV1005?

#### A precise description of the problem.
A precise and concise description of the titles is important, as is a precise description of the problem. Although you are somewhat adept at writing about the process or something, please check your question description in detail and ensure their accuracy. A careless question is often a waste of the time of the questionee.


#### You can't take your job by being quiet.
Many also know that they cannot ask questions with arrogance and ask for answers, so they go to another extreme -- running away in a whisper. Add to some simple questions words like "I am a white" and "I am a new hand" and so on, and try to give you more patience and so be patient. In fact, it is not relevant to get a better answer to your question, as if it was like telling people that "I don't want to work today, so help me finish my job."

So don't waste each other's time with this simple trick. You should focus more on trying to adjust the code more often, and then grind the form and the possible reasons. Repeating your thoughts and attempts in forums or groups, describing your problems as clearly as possible, is more useful than telling people in groups or forums that you are a little white.

In fact, not only when asked questions, the Author found that this was also true for a number of junior schoolgirls, such as “excessively” polite (or perhaps timid) older sisters. In communication, we often needed an environment of equal communication that was respectful of each other, rather than polite and timid. “No, no, no, no, no.” It was the attitude of the senior schoolgirl or teacher that we should face, rather than using a phrase such as “I don’t understand” or “I haven’t learned” that was never a substitute for research and reflection.
#### Due courtesy and follow-up to the problem
Of course, courtesy is also necessary in asking questions. This shows your gratitude for each other’s willingness to spend time solving your problems. Of course, this is important without a concise technical report. But it is often more likely to be answered than arrogant questions (see the examples given at the beginning of the Author).

Also, it is equally important to say thanks in advance and thank you afterwards in the question. After the problem is resolved, a brief note can be sent to all who have helped you, so that they can know how the problem has been resolved, what effect their suggestions have had in them, and whether there are better suggestions that can be applied to the problem.

Of course, if you are in the forum, you can reinsert the words “as amended” or “solved” in the title. So that people in the group and in the blog can not spend time reading and trying to solve the problems you have solved. If the solution is simple, you can simply post the problem statement; if the solution is complicated, you can summarize and explain the problem in the order of “clear question-solve solutions-what needs attention.” Of course, the question can be followed up by adding the names of all those who have helped you, and this type of addition can give satisfaction to those who have helped you, so that you may be more likely to be helped next time.


#### RTFM and STFW
For the two mysterious spells that solve 60 per cent of the problem, the original text is posted here for information.
♪ There's an old and sacred tradition: ♪ If you receive it ♪`RTFM （Read The Fucking Manual）`The answer is, the answer is, you're the one.**I should read the fucking manual.**Of course, he's basically right. You should read it.

♪ RTFM has a young relative. ♪`STFW（Search The Fucking Web）`The answer is, the answer is, you're the one.**Should be searching the fucking Internet.**. Most of the people are right. Go and search. **[Google is your friend.](http://lmgtfy.com/)**！）

In the forum, you may also be asked to climb the old text of the forum. In fact, someone might even be eager to give you a discussion chain that will address this issue. But don't rely on that kind of care, you should search the old text before asking questions.

Usually, those who answer you with one of these two sentences will give you a manual or a web site containing what you need, and they're reading it when they type it.

- **The information you need is very easy to get.**；
    
- **You can learn more by searching for this information yourself than by pouring it on you.**。
    
You shouldn't be upset about it.**He has expressed some concern for you, according to hacker standards, and has not turned a blind eye to your demands.**You should thank his grandmother for her kindness.

#### Good question or stupid question?
I believe that you have some idea of the way in which the questions are posed, and here the Author gives some examples of and contrasts with the questions mentioned in the original text or added to the Author, and hopefully, some inspiration.
> *Stupid Q*: Where is the learning of Python/Mechanical Learning/In-depth learning?
> 
> *A*: STFW
> 
> *Clever Q*: I searched Google for an introduction/in-depth learning, but I didn't find a newcomer. Can I have some information for an introduction?
> 
> *A*: He's already tried to search himself, but might need some screening.

>*Stupid Q*: I got the XX code from LaTeX studio. It's not working.
>
>*A*: Practice more.
>
>*Clever Q*: I've been trying to compile XeLaTeX and pdfLaTeX, but I'm still wrong. My compilation chain is fine, and other projects can run. Whether I have not installed some packages or version limits. This is my smallest example of work and the compilation of log files.
>
>*A*: It does not seem to be a systemic problem, is it really a bit of a problem? I can try to help him solve it on the basis of his MWE and his log files.

>*Stupid Q*‘My board is in trouble. Who will help me?’
>
>*A*: Okay, you want to take a back tap and change diapers? And press the delete button.
>
>*Clever Q*: I tried X, Y and Z on the S2464 mainframe, but it didn't work, and I tried A, B and C. Please note the strange phenomenon when I tried C. Clearly, florbish is gromping, but the results are unexpected. What is the reason why it usually starts grommicking on the Ashlon MP mainframe? Who knows what I should do next?
>
>*A*: He has tried many methods and determined the fundamentals of the problem, but has no idea what the possible reasons are and what tests are needed. I need to give him a simple hint or help him to avoid him continuing with the useless attempt.

### How to answer the question?
Of course, we can't be a questioner, we can also be an answerer. So how to be a qualified answerer, and there are answers in the original, and the Author adds something to it.
#### A good attitude is the first step in making friends.
Although some of the above-mentioned questions are too straightforward, you should still have an equal attitude to communicate with people and ask questions.
#### Please indicate the answer in time.
If you are not sure about your answer, please state in time that a wrong answer that sounds authoritative is more troubling than the absence of an answer. This often leads the question-maker to try and doubt himself repeatedly. If you are pretending to be an expert to swollen your face, you are also a man of arrogance and no respect for knowledge.

#### Don't joke about the actual set-up and the steps.
The user has seen too many so-called elites who joke about the rmrf directive. They tell the order that it can solve the problem, and they laugh at the fact that they have no computer common sense when they run. This person is like the one who tells people that putting their hands in the meat grinder can cut their nails, and it's stupid and bad. And it's against the original intent of the directive.

#### Appropriate counter-questions
When you have time and you think it's interesting, you can set up some counter-questions and turn a stupid question into a good question. This helps the questioner to think gradually.

#### You put in a good tool, not a hammer to cut a tree.
When you realize that someone is using less convenient or completely wrong methods or tools, tell him and redefine the problem in time. Instead of focusing on how to use a hammer to cut a tree and how to cut it fast and well.

#### The way to give people the right to fish.
And often, if you're a given or a wrong answer, you can attach your thinking to your results, and some of the techniques and attempts are more meaningful than a simple answer.
