/**
 * Created by afanasev on 30.03.16.
 */
app.directive('dirLimitList', function () {
    return {
        link: function (scope, element, attributes) {
            scope.data = scope[attributes["dirLimitList"]];
        },
        restrict: "A",
        templateUrl: "modules/default/templates/dirLimitList.html"
    }
});