function stackQueueCtrl($scope, $http, $window) {

  // these variables are set by the API interface
  questions = [];
  tags = {};


  function processNewlyFetchedQuestions(newQuestions) {
  	//add any new tags
	//TODO: Cody

  	//add new questions
  	questions.push(newQuestions);

  	alert(newQuestions);
  };

  function chooseBestQuestion() {
  	
  };

  $scope.title = "This is the title";
  $scope.question = "This is the question";
  $scope.tags = ['python', 'django', 'mysql'];
  $scope.stackOverflowUrl = "http://stackoverflow.com";


  // these variables keep track of what kind of questions should be asked in the future
  $scope.favouriteTags = ['python'];
  $scope.blackListedTags = ['Java'];

  

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

  $scope.getNewQuestion = function() {
    // fill in new values for title, question, tags, stackOverflowUrl
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
