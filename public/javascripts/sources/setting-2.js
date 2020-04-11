// this is a testing angularjs file

fantipperApp.controller('CreatorApplicationController', function($scope, $http) {

    /**
     * Checking the form for validation
     */
    if (($scope.creatorName != undefined) && ($scope.textModel != undefined) && ($scope.location != undefined)) {
        // $scope.buttonSection1 = 
        this.checked = true;
    } else {
        this.checked = false;
    }

});


fantipperApp.filter('usernameCreator', function() {
    return function(value) {
        return (!value) ? '' : value.replace(/ /g, '');
    };
});