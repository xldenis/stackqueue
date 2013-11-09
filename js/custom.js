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
  $scope.currentQuestionId = -1;
  $scope.topic = 'python';
  $scope.test = [];
  $scope.question = true; //Boolean flag on whether we are showing a question or answer.

  $scope.currentTitle = "";
  $scope.currentQuestion = "";
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

});
