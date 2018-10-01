

var fantipperApp = angular.module('fantipperApp', []);

fantipperApp.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});


fantipperApp.controller('myCtrl',function($scope, $parse, ) {

  $scope.edit = function(user){
    console.log(user);
    $scope.header = user.creator.creatorName;
    
    $scope.image = user.creator.creatorTileImage;
    $scope.creatorEmail = user.creator.creatorEmail;
    console.log($scope.header,$scope.image,$scope.creatorEmail);
    console.log($scope.tip);
  }

  console.log($scope.showForm);

  $scope.showGuest = function(){
    $scope.showForm = true;
  }

  $scope.hideGuest = function(){
    $scope.showForm = false;
  }

});

fantipperApp.controller('usernameCtrl', function($scope){
  var getUsername = document.getElementById('username').value;
  console.log(getUsername);
  // console.log($scope.creator_username);
});

// Removes white spaces in the creatorProfileCreate file in order to generate the creator url
fantipperApp.filter('usernameCreator', function(){
  return function (value) {
    return (!value) ? '' : value.replace(/ /g, '');
  };
});