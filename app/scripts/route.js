var app = angular.module("invtpd", ["ngRoute", "Controllers"]);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl:"views/home.html",
        controller :"HomeController"
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
    
    .otherwise({redirectTo:'/'});

});
