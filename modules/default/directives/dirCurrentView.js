/**
 * Created by afanasev on 31.03.16.
 */

app.directive('dirCurrentView', function () {
    return {
        link: function (scope, element, attributes) {
            scope.data = '';
            if (scope.currentView == 'view') {
                scope.data = 'Просмотр';
            }
            if (scope.currentView == 'edit') {
                scope.data = 'Редактирование';
            }
            if (scope.currentView == 'add') {
                scope.data = 'Добавление';
            }
        },
        restrict: "A",
        template: "<h2 class='panel-heading'>{{data}}</h2>"
    }
});