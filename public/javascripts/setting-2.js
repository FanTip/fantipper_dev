

fantipperApp.controller('CreatorApplicationController', function($scope, $http){

    /**
     * Checking the form for validation
     */
     if(($scope.creatorName != undefined ) && ($scope.textModel != undefined ) && ($scope.location != undefined)){
        // $scope.buttonSection1 = 
        this.checked = true;
     }else{
        this.checked = false;
     }

});

// Removes white spaces in the creatorProfileCreate file in order to generate the creator url
// Checks if the username is taken or not
fantipperApp.filter('usernameCreator', function($http){
    var submitButton = document.getElementById('Submit_profile');
    return function (value) {
        $http({
            method : 'GET',
            url : '/api/fantipper/found/'+ value
        }).then(function successCallback(response) {
            submitButton.disabled = true;
        }, function errorCallback(response) {
            submitButton.disabled = false;
        });
      return (!value) ? '' : value.replace(/ /g, '');
    };
  });