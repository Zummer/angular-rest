app
    .factory('Items', function ($resource, $rootScope) {
        var baseUrl = 'http://rest1/items';
        //var baseUrl = 'http://plottex.ru/rest/items';
        //var baseUrl = 'http://rest1.plottex.ru/items';
        
        var service = {};
        var items = {};
        var servicePagination = {
            limit: 10,
            page: 1,
            filter: ''
        };
        var item = {}; // текущий item

        var itemsResource = $resource(baseUrl + '/:id' + '/:action', {id: '@id'}, {
            query: {
                isArray: false // хочу получить данные в виде объекта
            },
            put: {
                method: 'POST'
            },
            delete: {
                method: 'POST'
            }
        });

        service.getCities = function (){
            return cities;
        };

        service.setPagination = function (pagination) {
            servicePagination = pagination;
        };

        service.getPagination = function () {
            return servicePagination;
        };

        service.getAll = function () {
            return items;
        };

        service.get = function (id) {
            var item = null;
            angular.forEach(items, function (value) {
                if (parseInt(value.id) === parseInt(id)) {
                    item = value;
                    return false;
                }
            });
            return item;
        };

        service.getOneItem = function () {
            return item;
        };

        service.getOneItemsFromServer = function (id) {
            var promise = itemsResource.get({
                id: id}).$promise;

            promise.then(fulfilled, rejected);

            function fulfilled(response) {
                item = response;
                $rootScope.$broadcast('item:getOne');
            }

            function rejected(error) {
                console.log(error);
            }

        };

        service.getItemsFromServer = function (pagination) {
            var promise = itemsResource.query({
                page: pagination.page,
                limit: pagination.limit,
                filter: pagination.filter
            }).$promise;

            promise.then(fulfilled, rejected);

            function fulfilled(response) {
                items = response.items;
                // Добавляем только недостающую информацию, остальное в наличии
                servicePagination.totalItems = response.pagination.totalItems;
                servicePagination.totalPages = response.pagination.totalPages;
                $rootScope.$broadcast('items:updated');
            }

            function rejected(error) {
                console.log(error);
            }
        };

        service.baseUrl = baseUrl;
        service.save = function (item, limit) {
            if (undefined !== item.id && parseInt(item.id) > 0) {
                this.update(item);
            }
            else {
                this.add(item, limit);
            }
        };
        service.update = function (item) {
            var promise = itemsResource.put({
                id: item.id
            }, item).$promise;

            promise.then(fulfilled, rejected);

            function fulfilled(response) {
                // toaster здесь надо бы!!!!
                $rootScope.$broadcast('item:updated');
            }

            function rejected(error) {
                $rootScope.$broadcast('item:error', error);
                console.log(error);
            }
        };
        service.add = function (item, limit) {
            var promise = itemsResource.save({
                item: item,
                limit: limit
            }).$promise;

            promise.then(fulfilled, rejected);

            function fulfilled(response) {
                //надо получить последнюю страницу с сервера
                items = response.items;
                servicePagination = response.pagination;
                $rootScope.$broadcast('item:added', {
                    items: items,
                    pagination: servicePagination
                });
            }

            function rejected(error) {
                $rootScope.$broadcast('item:error', error);
                console.log(error);
            }
        };

        service.delete = function (item, pagination) {
            var promise = itemsResource.delete({
                id: item.id,
                page: pagination.page,
                limit: pagination.limit,
                action: 'delete'
            }, item).$promise;

            promise.then(fulfilled, rejected);

            function fulfilled(response) {
                items = response.items;
                servicePagination = response.pagination;
                $rootScope.$broadcast('item:deleted', {
                    items: items,
                    pagination: servicePagination
                });
            }

            function rejected(error) {
                $rootScope.$broadcast('item:error', error);
                console.log(error);
            }
        };
        return service;
    });