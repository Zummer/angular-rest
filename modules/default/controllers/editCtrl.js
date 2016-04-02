/**
 * Created by afanasev on 30.03.16.
 */

app
    .controller('editCtrl', function ($scope, $routeParams, Items, $localStorage, currentView) {

        $scope.currentView = currentView;

        $scope.item = {}; // текущий item
        $scope.resetItem = {}; // начальное состояние item

        // сохраняем данные о странице в хранилище
        $scope.$storage = $localStorage;
        if ($scope.pagination.page != undefined) {
            $scope.$storage.pagination = $scope.pagination;
        } else {
            $scope.pagination = $scope.$storage.pagination;
            Items.setPagination($scope.pagination);
        }

        // наполняем текущий item
        if ($routeParams.id != undefined) { // edit
            $scope.item = Items.get(Number($routeParams.id));
            // если наполнение было неудачное, то
            if ($scope.item == null) {
                // получаем данные с сервера
                Items.getOneItemsFromServer(Number($routeParams.id));
            }
        } else { // add
            $scope.item = {};
        }

        // сохраняем изначальное состояние
        $scope.resetItem = angular.copy($scope.item);

        // добавь вотч для сохранение введенных данных в хранилище при добавлении нового item в режиме add

        // реагируем на сообщение
        $scope.$on('item:getOne', function () {
            $scope.item = Items.getOneItem();

        });

        // нажатие Enter
        $scope.myPressFunct = function (keyEvent) {
            if (keyEvent.which === 13) {
                if (keyEvent.target.id == 'Autocomplete') {
                    // форсируем передачу значения, не дожидаясь потери фокуса
                    $scope.item.ownAddress[0].city = angular.element('#Autocomplete').val();
                }
            }
        };

        // отмена изменений и возврат в представление list
        $scope.cancel = function () {
            if ($scope.currentView == 'edit') {
                // восстанавливаем начальные значения
                if ($scope.resetItem) {
                    $scope.item.name = $scope.resetItem.name;
                    $scope.item.ownAddress[0].city = $scope.resetItem.ownAddress[0].city;
                }
                // переходим на просмотр
                $scope.view($scope.item);
            }

            if ($scope.currentView == 'view') {
                // обнуляем текущий item
                $scope.item = {};
                // возращаемся в таблицу
                $scope.pageChanged($scope.pagination.page);
            }

            if ($scope.currentView == 'add') {
                // обнуляем текущий item
                $scope.item = {};
                // возращаемся в таблицу
                $scope.pageChanged($scope.pagination.page);
            }
            //$localStorage.$reset();
        };

        // сохранение
        $scope.save = function () {
            if (angular.isDefined($scope.item) &&
                angular.isDefined($scope.item.name) &&
                angular.isDefined($scope.item.ownAddress[0].city)) { // главное чтоб не пустой был
                $scope.saving = true;
                Items.save($scope.item, $scope.pagination.limit); // а внутри разберемся, есть id или нет
                //$localStorage.$reset();
            }
        };
    });