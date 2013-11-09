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
      }).otherwise({
        redirectTo: 'index.html'
      });
    }]);


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
  $rootScope.topicTags = {};
  $rootScope.topic = 'python';
  $rootScope.question = true; //Boolean flag on whether we are showing a question or answer.
});

chatScope = angular.element(document.getElementById('body')).scope();

SQ.controller("IndexController", function ($scope, $http, $window, $location, $rootScope) {
  TOPIC_SCOPE = $scope;
  $scope.submitTopic = function () {
    //write to the external variable here
    $rootScope.topic = $scope.topic;
    $window.alert($scope.topic);
    $rootScope.hasLoaded = false;
    window.location = "#question";
  }
  $scope.topic = '';
});
SQ.controller("QuestionController", function ($scope, $http, $window, $location, $rootScope) {
  window.MY_SCOPE = $scope;

  // these variables are set by the API interface
  $scope.currentTitle = "loading...";
  $scope.currentQuestion = "<p>loading...</p>";
  $scope.currentTags = [];
  
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

  //gets all the tags
  function getTags(newTags) {
    for(t in newTags)
    {
      $rootScope.topicTags[newTags[t].name] = 0;
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
    $rootScope.topicTags = {};

    // load the data for the 'python' stackoverflow questions
    $http.jsonp('https://api.stackexchange.com/2.1/search?pagesize=100&order=desc&min=50&sort=votes&tagged=' + $rootScope.topic + '&site=stackoverflow&filter=withbody&callback=JSON_CALLBACK&key=z3zzdgzm5YOmgvTv3j)V)A((')
      .success(function(data, status, headers, config) {
                     processNewlyFetchedQuestions(data['items']);
            }).
        error(function(data, status, headers, config) {
                     $window.alert('ERROR LOADING QUESTIONS');
            });

    $rootScope.hasLoaded = true;
  }

  //get all tags
  $http.jsonp('http://api.stackexchange.com/2.1/tags?pagesize=100&order=desc&sort=popular&site=stackoverflow&callback=JSON_CALLBACK&key=z3zzdgzm5YOmgvTv3j)V)A((')
    .success(function(data, status, headers, config) {
             getTags(data['items']);
    }).
      error(function(data, status, headers, config) {
             $window.alert('ERROR LOADING DATA');
    });
});
