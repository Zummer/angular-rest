app
    .controller('defaultCtrl', function ($scope, $routeParams, Items, $location, siteConfig) {

        $scope.version = siteConfig.version;

        //$scope.$watch('item.ownAddress[0].city', function(newValue, oldValue) {
        //    alert('Упс!');
        //});

        $scope.saving = false; // флаг записи

        $scope.pagination = Items.getPagination(); // проверим

        $scope.limits = [10,20,30,50];
        $scope.setLimit = function (limit){
            $scope.pagination.limit = limit;
        };

        $scope.myPressFunct = function(keyEvent) {
            if (keyEvent.which === 13) {
                if (keyEvent.target.id == 'search') {
                    Items.getItemsFromServer($scope.pagination);
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
        $scope.requestForServer = {dont: false};

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

            if (pag.page !== undefined) {
                Items.setPagination(pag);
                if (!$scope.requestForServer.dont) {
                    Items.getItemsFromServer(pag);
                }
            }

            $scope.requestForServer.dont = false;
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

            $scope.requestForServer.dont = ($scope.items != null);

            $scope.item = {};

            if ($scope.pagination.page == undefined) {
                if ($scope.pagination.limit == undefined) {
                    $scope.pagination = Items.getPagination();
                }
            }

            $scope.pageChanged($scope.pagination.page);
        });

        // ждем сообщения и получаем массив объектов
        $scope.$on('item:added', function () {
            $scope.saving = false;

            $scope.requestForServer.dont = true;
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
            //$scope.currentView = "edit";
            $location.path("/edit/" + item.id);
        };

        $scope.view = function (item) {
            $scope.item = item ? item : {};
            //$scope.currentView = "view";
            $location.path("/view/" + item.id);
        };

        $scope.add = function () {
            //$scope.currentView = "add";
            $location.path("/add");
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