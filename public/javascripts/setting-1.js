

var fantipperApp = angular.module('fantipperApp', ['ngRoute']);

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
  monthRange = [];
  for(var i = 0; i < 12; i++){
    monthRange.push(months[i] + '('+ (i + 1) + ')'); 
  }

  $scope.months = monthRange;
  $scope.years = years;
  
  $scope.edit = function(user){
    $scope.header = user.creator.creatorName;
    $scope.image = user.creator.creatorTileImage;
    $scope.creatorEmail = user.creator.creatorEmail;
    $scope.creatorDescription = user.creator.creatorDesc;
    $scope.user_id = user._id;
  }

});


// fantipperApp.directive('checkIfName', function(){
//   return {
//     require: 'ngModel',
//     link: function (scope, element, attr, ngModelCtrl) {
//         function fromUser(text) {
//             if (text) {
//                 var transformedInput = text.replace(/[^A-Za-z ]/g, '');

//                 if (transformedInput !== text) {
//                     ngModelCtrl.$setViewValue(transformedInput);
//                     ngModelCtrl.$render();
//                 }
//                 return transformedInput;
//             }
//             return undefined;
//         }            
//         ngModelCtrl.$parsers.push(fromUser);
//     }
// };
// });

fantipperApp.directive('checkIfNumber', function(){
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
});

// // Removes white spaces in the creatorProfileCreate file in order to generate the creator url
// fantipperApp.filter('usernameCreator', function(){
//   return function (value) {
//     return (!value) ? '' : value.replace(/ /g, '');
//   };
// });