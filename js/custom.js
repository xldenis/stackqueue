//handle key presses
document.onkeydown = function() {
    switch (window.event.keyCode) {
        case 37:
            $("#LeftKey").click();
            break;
        case 38:
            $("#UpDownKey").click();
            break;
        case 39:
            $("#RightKey").click();
            break;
        case 40:
            $("#UpDownKey").click();
            break;
    }
};

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
      }).when("/results", {
        templateUrl: '/templates/score.html',
        controller: "ScoreController"
      }).otherwise({
        redirectTo: '/'
      });
    }]);

SQ.controller("ScoreController", function($scope, $http, $window, $rootScope) {
  window.SCORE_SCOPE = $scope;
  $scope.tags = $rootScope.tags;
  $scope.scores = [];
  $scope.go = function showResults() {
    $scope.tags = $rootScope.tags;
    $scope.scores = []
    $scope.tags = $rootScope.tags;

    var singleScore = {}
    var maxScore = -10000000;
    var minScore = 10000000;
    for (t in $scope.tags) {
      if ($scope.tags[t] > maxScore)
        maxScore = $scope.tags[t];
      if ($scope.tags[t] < minScore) {
        minScore = $scope.tags[t];
      }
    }
    var score = 0;
    for (t in $scope.tags) {
      if ($scope.tags[t] == 0){

      } else if ($scope.tags[t] > 0) {
        score = $scope.tags[t] * 100.0 / maxScore / 2;
        score = 55 - score;
        singleScore = {
          'score':score,
          'tag': t
        };
        $scope.scores.push(singleScore);
      } else if ($scope.tags[t] < 0) {
        score = $scope.tags[t] * 100.0 / minScore / 2;
        score += 45;
        singleScore = {
          'score':score,
          'tag': t
        };
        $scope.scores.push(singleScore);
      }
    }
  }
});
SQ.controller("AnswerController", function ($scope, $http, $window, $rootScope) {
  $scope.currentTitle = $scope.questions[$scope.currentQuestionId].title;
  $scope.learnMoreLink = $scope.questions[$scope.currentQuestionId].link;
  function showAnswer(answers) {
    if (answers.length > 0) {
      $scope.currentAnswer = answers[0].body;
    }
    else {
      $scope.currentAnswer = '<p>no answers :(</p>';
    }
    $scope.tags = $rootScope.questions[$rootScope.currentQuestionId].tags;
  };

  $http.jsonp('https://api.stackexchange.com/2.1//questions/' + $rootScope.currentQuestionId + '/answers?order=desc&sort=activity&site=stackoverflow&filter=withbody&callback=JSON_CALLBACK&key=z3zzdgzm5YOmgvTv3j)V)A((')
    .success(function(data, status, headers, config) {
             showAnswer(data['items']);
    }).
      error(function(data, status, headers, config) {
             $window.alert('ERROR LOADING ANSWERS');
    });
});

SQ.run(function($rootScope) {
  $rootScope.hasLoaded = false;
  $rootScope.currentQuestionId = -1;
  $rootScope.questions = {};
  $rootScope.tags = {};
  $rootScope.topic = 'python';
});

chatScope = angular.element(document.getElementById('body')).scope();

SQ.controller("IndexController", function ($scope, $http, $window, $location, $rootScope) {
  
  TOPIC_SCOPE = $scope;
  
  $scope.submitTopic = function () {
    //write to the external variable here
    $rootScope.topic = $scope.topic;
    $rootScope.hasLoaded = false;
    window.location = "#question";
  }
  $scope.topic = '';
  $('.ui.dropdown').dropdown();

  $rootScope.$on('$locationChangeStart',function(){$('.masthead').remove()});
});

SQ.controller("QuestionController", function ($scope, $http, $window, $route, $location, $rootScope) {
  window.MY_SCOPE = $scope;
  
  // these variables are set by the API interface
  if (!$rootScope.hasLoaded) {
    $scope.currentTitle = "loading...";
    $scope.currentQuestion = "<p>loading...</p>";
    $scope.currentTags = [];
  }

  //updates the ourScore for all unanswered questions
  function updateAllUnansweredQuestionScores() {
    //formula: ourScore = ((average of all tag scores) * 10,000) + questionScore
    for (q in $rootScope.questions) {
            question = $rootScope.questions[q];
            if (question.asked == false) {
                    avgTagScore = 0.0;
                    count = 0;
                    for (tag in question.tags)
                            avgTagScore += $rootScope.tags[question.tags[tag]];
                    avgTagScore /= question.tags.length;
                    $rootScope.questions[q].ourScore = (avgTagScore * 10000) + question.score
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
        if($rootScope.tags[tag] == undefined)
          $rootScope.tags[tag] = 0;
      }
    }

    //add new questions
    for (q in newQuestions) {
            question = newQuestions[q];
            question.question_id = new String(question.question_id);
            if ($rootScope.questions[question.question_id] == undefined) {
                    question.asked = false;
                    question.ourScore = -1; //not calculated yet
                    $rootScope.questions[question.question_id] = question;
            }
    }
    $scope.getNewQuestion();
  };

  $scope.getNewQuestion = function() {

    //update scores
    updateAllUnansweredQuestionScores();

    //compute best question
    maxScore = -10000000;
    topQuestion = $rootScope.questions[0];
    for (q in $rootScope.questions) {
            question = $rootScope.questions[q];
            if (question.asked == false) {
                    if (question.ourScore > maxScore) {
                            maxScore = question.ourScore;
                            topQuestion = question;
                    }
            }
    }

    if (topQuestion == undefined) {
      $rootScope.hasLoaded = false;
      $window.alert('reloading!');
      $route.reload();
    }
    else {
      $window.alert("Q's: " + topQuestion);
    }

    // fill in new values for title, question, stackOverflowUrl
    $rootScope.currentQuestionId = topQuestion.question_id;
    $scope.currentTitle = topQuestion.title;
    $scope.currentQuestion = topQuestion.body;
    $scope.currentTags = topQuestion.tags;

    $rootScope.questions[$rootScope.currentQuestionId].asked = true;
  };

  $rootScope.questionKnown = function () {
    //if the answer is known, demote the tags
    for (var i = 0; i < $rootScope.questions[$rootScope.currentQuestionId].tags.length; i++){
      $rootScope.tags[$rootScope.questions[$rootScope.currentQuestionId].tags[i]]--;
    }

    //now go and get a new question
    $scope.getNewQuestion();
  };

  $rootScope.questionNotKnown = function () {
    //if the answer is not known, promote the tags
    for(var i = 0; i < $rootScope.questions[$rootScope.currentQuestionId].tags.length; i++){
      $rootScope.tags[$rootScope.questions[$rootScope.currentQuestionId].tags[i]]++;
    }

    $location.path( "/answer" );
  };

  if (!$rootScope.hasLoaded) {
    $rootScope.currentQuestionId = -1;
    $rootScope.questions = {};
    $rootScope.tags = {};
    $rootScope.question = true;

    // load the data for the 'python' stackoverflow questions
    $http.jsonp('https://api.stackexchange.com/2.1/search?pagesize=100&order=desc&min=50&sort=votes&tagged=' + $rootScope.topic + '&site=stackoverflow&filter=withbody&callback=JSON_CALLBACK&key=z3zzdgzm5YOmgvTv3j)V)A((')
      .success(function(data, status, headers, config) {
                     processNewlyFetchedQuestions(data['items']);
            }).
        error(function(data, status, headers, config) {
                     $window.alert('ERROR LOADING QUESTIONS');
            });
  }
  else {
    $scope.getNewQuestion();
  }

  $rootScope.hasLoaded = true;
});
