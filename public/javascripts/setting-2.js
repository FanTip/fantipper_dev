

fantipperApp.controller('CreatorApplicationController', function($scope, $http){
    console.log('CAC');

    if(($scope.creatorName)){
        $http({
            method : 'GET',
            url : '/api/fantipper/found/jhbdjj'
        }).then(function successCallback(response) {
            console.log(response);
        });
    }
    

    $scope.part_1 = true;
    $scope.showpart2 = function(){
        $scope.part_2 = true;
        $scope.part_1 = false;
    }

    $scope.showpart3 = function(){
        $scope.part_3 = true;
        $scope.part_2 = false;
    }
    
    $scope.backpart1 = function(){
        $scope.part_1 = true;
        $scope.part_2 = false;
        $scope.part_3 = false;
    }

    $scope.backpart2 = function(){
        $scope.part_1 = false;
        $scope.part_2 = true;
        $scope.part_3 = false;
    }

    /**
     * Checking the form for validation
     */
        console.log( typeof $scope.creatorName);
     if(($scope.creatorName != undefined ) && ($scope.textModel != undefined ) && ($scope.location != undefined)){
        // $scope.buttonSection1 = 
        this.checked = true;
     }else{
         this.checked = false;
     }


    console.log($scope.part_2);    
});

// Removes white spaces in the creatorProfileCreate file in order to generate the creator url
fantipperApp.filter('usernameCreator', function($scope,$http){
    
    return function (value) {
        $http({
            method : 'GET',
            url : '/api/fantipper/found/'+ $scope.creatorName
        }).then(function successCallback(response) {
            console.log(response);
        }, function errorCallback(response) {
          });
      return (!value) ? '' : value.replace(/ /g, '');
    };
  });