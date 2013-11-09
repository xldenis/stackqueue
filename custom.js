var app = angular.module( 'myApp', [] );

app.controller( 'MainCtrl', function( $scope ) {
  
	$scope.init = function () {
	    // load the data for the 'python' stackoverflow questions
	    $http.jsonp('https://api.stackexchange.com/2.1/search?pagesize=100&order=desc&min=50&sort=votes&tagged=python&site=stackoverflow&callback=JSON_CALLBACK')
		  .success(function(data, status, headers, config) {
		    	     $window.alert(data.items);
			}).
		    error(function(data, status, headers, config) {
		    	     $window.alert('ERROR LOADING DATA');
			});
		};






});