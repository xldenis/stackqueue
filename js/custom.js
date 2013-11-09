var SQ = angular.module('stackQueueCtrl', ['ngSanitize', 'ngRoute']);

SQ.config(['$routeProvider', 
    function ($routeProvider) {
      $routeProvider.when('/question', {
        templateUrl: '/templates/question.html',
        controller: 'QuestionController'
      }).when("/answer", {
        templateUrl: '/templates/answer.html',
        controller: 'AnswerController'
      }).when("/", {
        templateUrl: "/templates/index.html",
        controller: "IndexController"
      }).otherwise({
        redirectTo: 'index.html'
      });
    }]);

SQ.controller("IndexController", function ($scope, $http, $window) {
  $scope.nothing = 0;
});
SQ.controller("AnswerController", function ($scope, $http, $window) {
  $scope.nothing = 0;
});

chatScope = angular.element(document.getElementById('body')).scope();

SQ.controller("QuestionController", function ($scope, $http, $window) {
window.MY_SCOPE = $scope;
  // these variables are set by the API interface
  $scope.questions = {};
  $scope.tags = {};
  $scope.topicTags = {};
  $scope.currentQuestionId = -1;
  $scope.topic = 'python';
  $scope.test = [];
  $scope.question = true; //Boolean flag on whether we are showing a question or answer.

  $scope.currentTitle = "The Python yield keyword explained";
  $scope.currentQuestion = "<p>To understand what <code>yield</code> does, you must understand what generators are. And before generators come iterables.</p>\n\n<h2>Iterables</h2>\n\n<p>When you create a list, you can read its items one by one, and it's called iteration:</p>\n\n<pre><code>&gt;&gt;&gt; mylist = [1, 2, 3]\n&gt;&gt;&gt; for i in mylist:\n...    print(i)\n1\n2\n3\n</code></pre>\n\n<p>Mylist is an iterable. When you use a list comprehension, you create a list, and so an iterable:</p>\n\n<pre><code>&gt;&gt;&gt; mylist = [x*x for x in range(3)]\n&gt;&gt;&gt; for i in mylist:\n...    print(i)\n0\n1\n4\n</code></pre>\n\n<p>Everything you can use \"for... in...\" on is an iterable: lists, strings, files...\nThese iterables are handy because you can read them as much as you wish, but you store all the values in memory and it's not always what you want when you have a lot of values.</p>\n\n<h2>Generators</h2>\n\n<p>Generators are iterators, but <strong>you can only iterate over them once</strong>. It's because they do not store all the values in memory, <strong>they generate the values on the fly</strong>:</p>\n\n<pre><code>&gt;&gt;&gt; mygenerator = (x*x for x in range(3))\n&gt;&gt;&gt; for i in mygenerator:\n...    print(i)\n0\n1\n4\n</code></pre>\n\n<p>It is just the same except you used <code>()</code> instead of <code>[]</code>. BUT, you can not perform <code>for i in mygenerator</code> a second time since generators can only be used once: they calculate 0, then forget about it and calculate 1, and end calculating 4, one by one.</p>\n\n<h2>Yield</h2>\n\n<p><code>Yield</code> is a keyword that is used like <code>return</code>, except the function will return a generator.</p>\n\n<pre><code>&gt;&gt;&gt; def createGenerator():\n...    mylist = range(3)\n...    for i in mylist:\n...        yield i*i\n...\n&gt;&gt;&gt; mygenerator = createGenerator() # create a generator\n&gt;&gt;&gt; print(mygenerator) # mygenerator is an object!\n&lt;generator object createGenerator at 0xb7555c34&gt;\n&gt;&gt;&gt; for i in mygenerator:\n...     print(i)\n0\n1\n4\n</code></pre>\n\n<p>Here it's a useless example, but it's handy when you know your function will return a huge set of values that you will only need to read once.</p>\n\n<p>To master <code>yield</code>, you must understand that <strong>when you call the function, the code you have written in the function body does not run.</strong> The function only returns the generator object, this is a bit tricky :-)</p>\n\n<p>Then, your code will be run each time the <code>for</code> uses the generator.</p>\n\n<p>Now the hard part:</p>\n\n<p>The first time the <code>for</code> calls the generator object created from your function, it will run the code in your function from the beginning until it hits <code>yield</code>, then it'll return the first value of the loop. Then, each other call will run the loop you have written in the function one more time, and return the next value, until there is no value to return.</p>\n\n<p>The generator is considered empty once the function runs but does not hit yield anymore. It can be because the loop had come to an end, or because you do not satisfy a \"if/else\" anymore.</p>\n\n<h2>Your code explained</h2>\n\n<p>Generator:</p>\n\n<pre><code># Here you create the method of the node object that will return the generator\ndef node._get_child_candidates(self, distance, min_dist, max_dist):\n\n  # Here is the code that will be called each time you use the generator object:\n\n  # If there is still a child of the node object on its left\n  # AND if distance is ok, return the next child\n  if self._leftchild and distance - max_dist &lt; self._median:\n                yield self._leftchild\n\n  # If there is still a child of the node object on its right\n  # AND if distance is ok, return the next child\n  if self._rightchild and distance + max_dist &gt;= self._median:\n                yield self._rightchild\n\n  # If the function arrives here, the generator will be considered empty\n  # there is no more than two values: the left and the right children\n</code></pre>\n\n<p>Caller:</p>\n\n<pre><code># Create an empty list and a list with the current object reference\nresult, candidates = list(), [self]\n\n# Loop on candidates (they contain only one element at the beginning)\nwhile candidates:\n\n    # Get the last candidate and remove it from the list\n    node = candidates.pop()\n\n    # Get the distance between obj and the candidate\n    distance = node._get_dist(obj)\n\n    # If distance is ok, then you can fill the result\n    if distance &lt;= max_dist and distance &gt;= min_dist:\n        result.extend(node._values)\n\n    # Add the children of the candidate in the candidates list\n    # so the loop will keep running until it will have looked\n    # at all the children of the children of the children, etc. of the candidate\n    candidates.extend(node._get_child_candidates(distance, min_dist, max_dist))\n\nreturn result\n</code></pre>\n\n<p>This code contains several smart parts:</p>\n\n<ul>\n<li><p>The loop iterates on a list but the list expands while the loop is being iterated :-) It's a concise way to go through all these nested data even if it's a bit dangerous since you can end up with an infinite loop. In this case, <code>candidates.extend(node._get_child_candidates(distance, min_dist, max_dist))</code> exhausts all the values of the generator, but <code>while</code> keeps creating new generator objects which will produce different values from the previous ones since it's not applied on the same node.</p></li>\n<li><p>The <code>extend()</code> method is a list object method that expects an iterable and adds its values to the list.</p></li>\n</ul>\n\n<p>Usually we pass a list to it:</p>\n\n<pre><code>&gt;&gt;&gt; a = [1, 2]\n&gt;&gt;&gt; b = [3, 4]\n&gt;&gt;&gt; a.extend(b)\n&gt;&gt;&gt; print(a)\n[1, 2, 3, 4]\n</code></pre>\n\n<p>But in your code it gets a generator, which is good because:</p>\n\n<ol>\n<li>You don't need to read the values twice.</li>\n<li>You can have a lot of children and you don't want them all stored in memory.</li>\n</ol>\n\n<p>And it works because Python does not care if the argument of a method is a list or not. Python expects iterables so it will work with strings, lists, tuples and generators! This is called duck typing and is one of the reason why Python is so cool. But this is another story, for another question...</p>\n\n<p>You can stop here, or read a little bit to see a advanced use of generator:</p>\n\n<h2>Controlling a generator exhaustion</h2>\n\n<pre><code>&gt;&gt;&gt; class Bank(): # let's create a bank, building ATMs\n...    crisis = False\n...    def create_atm(self):\n...        while not self.crisis:\n...            yield \"$100\"\n&gt;&gt;&gt; hsbc = Bank() # when everything's ok the ATM gives you as much as you want\n&gt;&gt;&gt; corner_street_atm = hsbc.create_atm()\n&gt;&gt;&gt; print(corner_street_atm.next())\n$100\n&gt;&gt;&gt; print(corner_street_atm.next())\n$100\n&gt;&gt;&gt; print([corner_street_atm.next() for cash in range(5)])\n['$100', '$100', '$100', '$100', '$100']\n&gt;&gt;&gt; hsbc.crisis = True # crisis is coming, no more money!\n&gt;&gt;&gt; print(corner_street_atm.next())\n&lt;type 'exceptions.StopIteration'&gt;\n&gt;&gt;&gt; wall_street_atm = hsbc.create_atm() # it's even true for new ATMs\n&gt;&gt;&gt; print(wall_street_atm.next())\n&lt;type 'exceptions.StopIteration'&gt;\n&gt;&gt;&gt; hsbc.crisis = False # trouble is, even post-crisis the ATM remains empty\n&gt;&gt;&gt; print(corner_street_atm.next())\n&lt;type 'exceptions.StopIteration'&gt;\n&gt;&gt;&gt; brand_new_atm = hsbc.create_atm() # build a new one to get back in business\n&gt;&gt;&gt; for cash in brand_new_atm:\n...    print cash\n$100\n$100\n$100\n$100\n$100\n$100\n$100\n$100\n$100\n...\n</code></pre>\n\n<p>It can be useful for various things like controlling access to a resource.</p>\n\n<h2>Itertools, your best friend</h2>\n\n<p>The itertools module contains special functions to manipulate iterables. Ever wish to duplicate a generator?\nChain two generators? Group values in a nested list with a one liner? Map / Zip without creating another list?</p>\n\n<p>Then just <code>import itertools</code>.</p>\n\n<p>An example? Let's see the possible orders of arrival for a 4 horse race:</p>\n\n<pre><code>&gt;&gt;&gt; horses = [1, 2, 3, 4]\n&gt;&gt;&gt; races = itertools.permutations(horses)\n&gt;&gt;&gt; print(races)\n&lt;itertools.permutations object at 0xb754f1dc&gt;\n&gt;&gt;&gt; print(list(itertools.permutations(horses)))\n[(1, 2, 3, 4),\n (1, 2, 4, 3),\n (1, 3, 2, 4),\n (1, 3, 4, 2),\n (1, 4, 2, 3),\n (1, 4, 3, 2),\n (2, 1, 3, 4),\n (2, 1, 4, 3),\n (2, 3, 1, 4),\n (2, 3, 4, 1),\n (2, 4, 1, 3),\n (2, 4, 3, 1),\n (3, 1, 2, 4),\n (3, 1, 4, 2),\n (3, 2, 1, 4),\n (3, 2, 4, 1),\n (3, 4, 1, 2),\n (3, 4, 2, 1),\n (4, 1, 2, 3),\n (4, 1, 3, 2),\n (4, 2, 1, 3),\n (4, 2, 3, 1),\n (4, 3, 1, 2),\n (4, 3, 2, 1)]\n</code></pre>\n\n<h2>Understanding the inner mechanisms of iteration</h2>\n\n<p>Iteration is a process implying iterables (implementing the <code>__iter__()</code> method) and iterators (implementing the <code>__next__()</code> method).\nIterables are any objects you can get an iterator from. Iterators are objects that let you iterate on iterables.</p>\n\n<p>More about it in this article about <a href=\"http://effbot.org/zone/python-for-statement.htm\">how does the for loop work</a>.</p>\n";
  $scope.stackOverflowUrl = "http://stackoverflow.com";
  
  //updates the ourScore for all unanswered questions
  function updateAllUnansweredQuestionScores() {
  	//formula: ourScore = ((average of all tag scores) * 10,000) + questionScore
  	for (q in $scope.questions) {
  		question = $scope.questions[q];
  		if (question.asked == false) {
  			avgTagScore = 0.0;
  			count = 0;
  			for (tag in question.tags)
  				avgTagScore += $scope.tags[question.tags[tag]];
  			avgTagScore /= question.tags.length;
  			$scope.questions[q].ourScore = (avgTagScore * 10000) + question.score
  		}
  	}
  };

  //gets all the tags
  function getTags(newTags) {
    for(t in newTags)
    {
      console.log(newTags[t].name);
      $scope.topicTags[newTags[t].name] = 0;
    }

  }

  //call with json response of new questions
  function processNewlyFetchedQuestions(newQuestions) {
  	//add any new tags
    for (q in newQuestions){
      question = newQuestions[q];
      for (t in question.tags) {
        tag = question.tags[t];
        if($scope.tags[tag] == undefined)
          $scope.tags[tag] = 0;
      }
    }

  	//add new questions
  	for (q in newQuestions) {
  		question = newQuestions[q];
  		question.question_id = new String(question.question_id);
  		if ($scope.questions[question.question_id] == undefined) {
  			question.asked = false;
  			question.ourScore = -1; //not calculated yet
  			$scope.questions[question.question_id] = question;
  		}
  	}
  	$scope.getNewQuestion();
  };

  $scope.getNewQuestion = function() {
  	//update scores
  	updateAllUnansweredQuestionScores();

  	//compute best question
  	maxScore = -10000000;
  	topQuestion = $scope.questions[0];
  	for (q in $scope.questions) {
  		question = $scope.questions[q];
  		if (question.asked == false) {
  			if (question.ourScore > maxScore) {
  				maxScore = question.ourScore;
  				topQuestion = question;
  			}
  		}
  	}

  	// fill in new values for title, question, stackOverflowUrl
  	$scope.currentQuestionId = topQuestion.question_id;
  	$scope.currentTitle = topQuestion.title;
  	$scope.currentQuestion = topQuestion.body;
  	$scope.stackOverflowUrl = topQuestion.link;

  	$scope.questions[$scope.currentQuestionId].asked = true;
  }

  function showAnswer(answers) {
  	if (answers.length > 0) {
  		$window.alert(answers[0].body);
  	}
  	else {
  		$window.alert('no answers :(');
  	}

  	$scope.getNewQuestion();
  };

  $scope.questionKnown = function () {

    //if the answer is known, demote the tags
    for (var i = 0; i < $scope.questions[$scope.currentQuestionId].tags.length; i++){
      $scope.tags[$scope.questions[$scope.currentQuestionId].tags[i]]--;
    }

    //now go and get a new question
    $scope.getNewQuestion();
  }

  $scope.questionNotKnown = function () {
    //if the answer is not known, promote the tags
    for(var i = 0; i < $scope.questions[$scope.currentQuestionId].tags.length; i++){
      $scope.tags[$scope.questions[$scope.currentQuestionId].tags[i]]++;
    }

    //show correct answer
  	 $http.jsonp('https://api.stackexchange.com/2.1//questions/' + $scope.currentQuestionId + '/answers?order=desc&sort=activity&site=stackoverflow&filter=withbody&callback=JSON_CALLBACK')
	  .success(function(data, status, headers, config) {
	  	$scope.test = data;
	    	     showAnswer(data['items']);
		}).
	    error(function(data, status, headers, config) {
	    	     $window.alert('ERROR LOADING ANSWERS');
		});
  }

  // load the data for the 'python' stackoverflow questions
  $http.jsonp('https://api.stackexchange.com/2.1/search?pagesize=100&order=desc&min=50&sort=votes&tagged=python&site=stackoverflow&filter=withbody&callback=JSON_CALLBACK')
	  .success(function(data, status, headers, config) {
	  	$scope.test = data;
	    	     processNewlyFetchedQuestions(data['items']);
		}).
	    error(function(data, status, headers, config) {
	    	     $window.alert('ERROR LOADING QUESTIONS');
		});

<<<<<<< HEAD:custom.js
  //get all tags
  $http.jsonp('http://api.stackexchange.com/2.1/tags?pagesize=100&order=desc&sort=popular&site=stackoverflow&callback=JSON_CALLBACK')
    .success(function(data, status, headers, config) {
      $scope.test = data;
             getTags(data['items']);
    }).
      error(function(data, status, headers, config) {
             $window.alert('ERROR LOADING DATA');
    });
};
=======
});
>>>>>>> d5998472572d04cda33eeb6e20e845408f75d13b:js/custom.js
