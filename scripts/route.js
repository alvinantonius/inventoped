var app = angular.module("invtpd", ["ngRoute", "Controllers", "AddProductController", "EditProductController"]);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl:"views/inventory/manage-produk.html",
        controller :"ManageProductController"
    })

    .when('/inventory/tambah_produk', {
        templateUrl:"views/inventory/tambah-produk.html",
        controller :"AddProductController"
    })
    .when('/inventory/manage_produk', {
        templateUrl:"views/inventory/manage-produk.html",
        controller :"ManageProductController"
    })
    .when('/inventory/edit_produk/:id', {
        templateUrl:"views/inventory/edit-produk.html",
        controller :"EditProductController"
    })
    
    .when('/notification', {
        templateUrl:"views/notification.html",
        controller :"NotifController"
    })
    
    .otherwise({redirectTo:'/'});

});
