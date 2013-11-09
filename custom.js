
function stackQueueCtrl($scope, $http, $window) {

  // these variables are set by the API interface
  var questions = {};
  var answers = {}; //todo: fetch & load
  var tags = {};
  var currentQuestionId = -1;
  var topic = 'python';

  $scope.currentTitle = "This is the title";
  $scope.currentQuestion = "This is the question";
  $scope.stackOverflowUrl = "http://stackoverflow.com";
  
  //updates the ourScore for all unanswered questions
  function updateAllUnansweredQuestionScores() {
  	//formula: ourScore = ((average of all tag scores) * 10,000) + questionScore
  	for (q in questions) {
  		question = questions[q];
  		if (question.asked == false) {
  			avgTagScore = 0.0;
  			for (tag in question.tags) 
  				avgTagScore += question.tags[tag];
  			avgTagScore /= (float)question.tags.length;
  		
  			question.ourScore = (avgTagScore * 10000) + question.score
  		}
  	}
  };

  //call with json response of new questions
  function processNewlyFetchedQuestions(newQuestions) {
  	//add any new tags
	//TODO: Cody

  	//add new questions
  	for (q in newQuestions) {
  		if (questions[q.question_id] != undefined) {
  			q.asked = false;
  			q.ourScore = -1; //not calculated yet
			questions[q.question_id] = q;
  		}
  	}
  	updateAllUnansweredQuestionScores();
  	$scope.getNewQuestion();
  };

  $scope.getNewQuestion = function() {
  	//compute best question
  	maxScore = -10000000;
  	topQuestion = questions[0];
  	for (q in questions) {
  		question = questions[q];
  		if (question.asked == false) {
  			if (question.ourScore > maxScore) {
  				maxScore = question.ourScore;
  				topQuestion = question;
  			}
  		}
  	}

  	// fill in new values for title, question, tags, stackOverflowUrl
  	currentQuestion = topQuestion.question_id;
  	$scope.currentTitle = currentQuestion.title;
  	//TODO: $scope.currentQuestion
  	$scope.stackOverflowUrl = currentQuestion.link;
  }

  $scope.questionKnown = function () {
    //if the answer is known, demote the tags
    for (var i = 0; i < $scope.tags.length; i++) {
      var position = $.inArray($scope.tags[i], $scope.favouriteTags);
      if (position == -1) {
        //the tag is not in the favorite tags
        if ($.inArray($scope.tags[i], $scope.blackListedTags) == -1) {
          //the tag is also not in the blackListedTags, add it
          $scope.blackListedTags.append($scope.tags[i]);
        }
      }
      //the tag is in the favorite tags, remove it
      $scope.favouriteTags.splice(position, 1);
    }

    //now go and get a new question
    $scope.getNewQuestion();
  }

  $scope.questionNotKnown = function () {
    //if the answer is not known, promote the tags

    //get the answer
  }

  // load the data for the 'python' stackoverflow questions
  $http.jsonp('https://api.stackexchange.com/2.1/search?pagesize=100&order=desc&min=50&sort=votes&tagged=python&site=stackoverflow&callback=JSON_CALLBACK')
	  .success(function(data, status, headers, config) {
	    	     processNewlyFetchedQuestions(data.items);
		}).
	    error(function(data, status, headers, config) {
	    	     $window.alert('ERROR LOADING DATA');
		});

};
