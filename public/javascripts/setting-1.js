

var fantipperApp = angular.module('fantipperApp', ['ngRoute','MyDirectives']);

angular.module('MyDirectives', []);

fantipperApp.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});


fantipperApp.controller('myCtrl',function($scope, $parse, ) {

  var year = new Date().getFullYear();
  years = [];
  for(var i = 0; i < 7; i++){
    var temp = year + i;
    years.push(temp);
  }

  var months    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var monthsNum = ['01','02','03','04','05','06','07','08','09','10','11','12',];
  var month = new Date().getMonth();
  monthRange = [];
  for(var i = 0; i < 12; i++){
    monthRange.push(months[month + i] + '('+ monthsNum[i] + ')'); 
  }

  $scope.months = monthRange;
  $scope.years = years;

  $scope.edit = function(user){
    $scope.header = user.creator.creatorName;
    $scope.image = user.creator.creatorTileImage;
    $scope.creatorEmail = user.creator.creatorEmail;
  }

});

angular.module('MyDirectives').directive('checkIfNumber', function(){
  return {
    require: 'ngModel',
    link: function (scope, element, attr, ngModelCtrl) {
        function fromUser(text) {
            if (text) {
                var transformedInput = text.replace(/[^0-9]/g, '');

                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return transformedInput;
            }
            return undefined;
        }            
        ngModelCtrl.$parsers.push(fromUser);
    }
};
});
angular.module('MyDirectives').directive('checkIfCardumber', function(){
  return {
    require: 'ngModel',
    link: function (scope, element, attr, ngModelCtrl) {
        function fromUser(text) {
            if (text) {
                var transformedInput = text.replace(/[^0-9]/g, '');

                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return transformedInput;
            }
            return undefined;
        }            
        ngModelCtrl.$parsers.push(fromUser);
    }
};
});

fantipperApp.controller('usernameCtrl', function($scope){
  var getUsername = document.getElementById('username').value;
  console.log(getUsername);
  // console.log($scope.creator_username);
});

// // Removes white spaces in the creatorProfileCreate file in order to generate the creator url
// fantipperApp.filter('usernameCreator', function(){
//   return function (value) {
//     return (!value) ? '' : value.replace(/ /g, '');
//   };
// });