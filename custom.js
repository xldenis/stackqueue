
function stackQueueCtrl($scope, $http, $window) {

  $scope.title = "This is the title";
  $scope.question = "This is the question";

    // load the data for the 'python' stackoverflow questions
    $http.jsonp('https://api.stackexchange.com/2.1/search?pagesize=100&order=desc&min=50&sort=votes&tagged=python&site=stackoverflow&callback=JSON_CALLBACK')
	  .success(function(data, status, headers, config) {
	    	     $window.alert(data.items);
		}).
	    error(function(data, status, headers, config) {
	    	     $window.alert('ERROR LOADING DATA');
		});

};