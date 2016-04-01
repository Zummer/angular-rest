/**
 * Created by afanasev on 31.03.16.
 */
app.directive('dirMainTable', function ($templateCache) {
    return {
        restrict: "A",
        // один из вариантов предварительной компиляции
        //compile: function compile (templateElement, templateAttrs) {
        //        templateElement.prepend($templateCache.get("dirMainTable"));
        //    console.log(templateElement);
        //    return {
        //        pre: function ($scope, element, attributes) {
        //            $scope.$watch(attributes.dirMainTable, function(value){
        //                $scope.source = value;
        //            });
        //        },
        //    }
        //},
        link: function ($scope, element, attributes) {
            $scope.$watch(attributes.dirMainTable, function(value){
                $scope.source = value;
            });
        },
        template: $templateCache.get("dirMainTable")
    }
});