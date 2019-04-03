// this is a testing angularjs file

fantipperApp.controller('CreatorApplicationController', function ($scope, $http) {

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



// $http({
//     method : 'GET',
//     url : '/api/fantipper/found/'+ value
// }).then(function successCallback(response) {
//     submitButton.disabled = true;
// }, function errorCallback(response) {
//     submitButton.disabled = false;
// });

// fantipperApp.directive('checkUsername', function($timeout, $q){
//     return {
//         require : 'ngModel',
//         link : function(scope, elm, attr, model){
//             var getUsername = function(){
//                 var username = scope.creatorName;
//                 username = username.replace(/ /g, '');
//                 console.log(username);
//             }
//         }
//     }
// });

// fantipperApp.directive('checkUsername', function($timeout, $q){
//     return {
//       require: 'ngModel',
//       link: function(scope, elm, attr, model) { 
//         model.$asyncValidators.usernameExists = function() { 
//           //here you should access the backend, to check if username exists
//           //and return a promise
//           var defer = $q.defer();
//           $timeout(function(){
//             model.$setValidity('usernameExists', false); 
//             defer.resolve;
//           }, 1000);
//           return defer.promise;
//         };
//       }
//   };
//   });


// Removes white spaces in the creatorProfileCreate file in order to generate the creator url
// Checks if the username is taken or not
fantipperApp.filter('usernameCreator', function () {
   return function (value) {
      return (!value) ? '' : value.replace(/ /g, '');
   };
});