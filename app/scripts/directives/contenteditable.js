'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:contenteditable
 * @description
 * # contenteditable
 */
angular.module('transcripticApp').directive('contenteditable', function() {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, element, attrs, ngModel) {
      if (!ngModel) return; // do nothing if no ng-model

      // Specify how UI should be updated
      ngModel.$render = function() {
        element.text(ngModel.$viewValue || '');
      };

      // Listen for change events to enable binding
      element.on('blur keyup change', function() {
        scope.$eval(read);
      });
      read(); // initialize

      // Write data to the model
      function read(forceVal) {
        var html = angular.isString(forceVal) ? forceVal : element.text();
        // When we clear the content editable the browser leaves a <br> behind
        // If strip-br attribute is provided then we strip this out
        if ( attrs.stripBr && html == '<br>' ) {
          html = '';
        }
        ngModel.$setViewValue(html);
      }
    }
  };
});
