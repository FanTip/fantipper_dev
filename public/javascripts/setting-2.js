

fantipperApp.controller('CreatorApplicationController', function($scope){
    console.log('CAC');
    $scope.part_1 = true;
    $scope.showpart2 = function(){
        $scope.part_2 = true;
        $scope.part_1 = false;
    }

    $scope.showpart3 = function(){
        $scope.part_3 = true;
        $scope.part_2 = false;
    }

    console.log($scope.part_2);    
});