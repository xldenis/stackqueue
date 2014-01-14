#StackQ: Know what you don't know

A *Y-Hack 2013* project.

StackQ creates procedural quizzes on any subject by pulling questions on any subject from the Stack Exchange network. Based off of your answers it then learns which subjects you are strongest and weakest at, and continues drilling you on your weak spots to help you improve. Thanks to the size of Stack Exchange nearly any topic can be used as quiz subject,  from movies to history or the Japanese language. 

Todo:

- Offline Mode
  - At the very least fail explicitly
  - Ideally, download questions and cache style files ahead of time so
that site is accessible while offline. 
- Finish redesigning views.
- Mobile view.
- Improved selection algorithm, current one too linear and simple
  - Randomized Algorithm ? 
- Expand selection of subjects, possibe cross forum lookup
- Local storage / Persistence
- Actual Quizzing.
  - Keyword lookup 
  - NLP ?
- Annotations? 
  - Allow for cross lookup
     - rainman style?
     - Pull relevant wikipedia articles
       - Question about tail recursion in python
         - pull info from Tail Recursion page on Wikipedia
- Prompt unsolved questions to allow people to write their own solution 
  - Helps out SE
- Better Math processing
- Domain purchase
- Recommend course material? 
  - How to find relevant books? 
    - Amazon searches?
      - Does amazon have an API?
        - Affiliate links?
          - Def offer non affiliated version

Visit http://stackq.herokuapp.com/ for a demo!
