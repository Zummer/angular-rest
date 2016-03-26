app
    .controller('defaultCtrl', function ($scope, $routeParams, Items, $location) {


        //$scope.$watch('item.ownAddress[0].city', function(newValue, oldValue) {
        //    alert('Упс!');
        //});

        $scope.saving = false; // флаг записи

        $scope.pagination = {};

        $scope.limit = [10,20,30,50];
        $scope.setLimit = function (limit){
            $scope.pagination.limit = limit;
        };

        $scope.myPressFunct = function(keyEvent) {
            if (keyEvent.which === 13) {
                if (keyEvent.target.id == 'search'){
                    Items.getItemsFromServer($scope.pagination);
                }
                if (keyEvent.target.id == 'Autocomplete'){
                    // нажимаем кнопку Сохранить
                    //angular.element('#save').click("save(item)");
                }
            }
        };

        $scope.searchFunct = function () {
            Items.getItemsFromServer($scope.pagination);
        }


        $scope.clearSearch = function () {
            $scope.pagination.filter = '';
            Items.getItemsFromServer($scope.pagination);
        }

        // только для изучения тестирования
        $scope.arrayForTest = [
            'One',
            'Two',
            'Three'
        ];

        $scope.item = {};
        $scope.items = null;
        $scope.dontRequestForServer = false;

        $scope.init = function () {
            $scope.items = Items.getAll();
        };

        $scope.$on('$routeChangeSuccess', function () {

            var pag = {
                limit: (parseInt($routeParams.limit) > 0) ? Number($routeParams.limit) : Items.getPagination().limit,
                page: (parseInt($routeParams.page) > 0) ? Number($routeParams.page) : undefined,
                totalItems: 0,
                totalPages: 0,
                filter: ($scope.pagination.filter !== undefined) ? $scope.pagination.filter : ''
            };

            Items.setPagination(pag);

            if (pag.page !== undefined) {
                if (!$scope.dontRequestForServer) {
                    Items.getItemsFromServer(pag);
                }
            }

            $scope.dontRequestForServer = false;
        });

        $scope.$on('items:updated', function () {
            $scope.items = Items.getAll();
            $scope.pagination = Items.getPagination();
        });

        $scope.$on('item:deleted', function () {
            // перехода на другую страницу не было, не было события $routeChangeSuccess
            // поэтому просто запрашиваем данные из фабрики Items
            $scope.items = Items.getAll();
            $scope.pagination = Items.getPagination();
        });

        $scope.$on('item:updated', function (event, args) {
            $scope.saving = false;

            $scope.dontRequestForServer = true;
            $scope.item = {};
            // обновление $scope.items произошло в сервисе
            // при получении ответа от сервера
            $scope.pageChanged($scope.pagination.page);
        });

        // ждем сообщения и получаем массив объектов
        $scope.$on('item:added', function () {
            $scope.saving = false;

            $scope.dontRequestForServer = true;
            $scope.items = Items.getAll();
            $scope.pagination = Items.getPagination();
            $scope.item = {};
            $scope.pageChanged($scope.pagination.page);
        });

        $scope.pageChanged = function (page) {
            // меняем страницу
            $location.path("/page/" + page + "/limit/" + $scope.pagination.limit);
        };

        $scope.edit = function (item) {
            $scope.item = item ? item : {};
            $location.path("/edit/" + item.id);
        };

        // отмена изменений и возврат в представление list
        $scope.cancel = function () {
            $scope.dontRequestForServer = true;
            $scope.item = {};
            $scope.pageChanged($scope.pagination.page);
        };

        $scope.add = function () {
            $location.path("/add");
        };

        // создание нового элемента
        $scope.save = function () {
            if (angular.isDefined($scope.item) &&
                angular.isDefined($scope.item.name) &&
                angular.isDefined($scope.item.ownAddress[0].city)) { // главное чтоб не пустой был

                $scope.saving = true;
                Items.save($scope.item, $scope.pagination.limit); // а внутри разберемся, есть id или нет
            }
        };

        $scope.delete = function (item) {
            var deleteUser = confirm('Вы уверены что хотите удалить запись?');
            if (deleteUser) {
                $scope.items.splice($scope.items.indexOf(item), 1);
                Items.delete(item, $scope.pagination);
            }
        };

        $scope.result2 = '';
        $scope.options2 = {
            country: 'ru',
            types: '(cities)',
            watchEnter: true
        };
        $scope.details2 = '';
    });