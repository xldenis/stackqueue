function processResponse(data) {
	alert(data['items']);
}

function stackQueueCtrl($scope) {

  // these variables are set by the API interface
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

}