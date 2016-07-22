var app = angular.module('Controllers', [

    'HomeController',
    'AddProductController',
    'ManageProductController'

]);


$(document).ready(function() {
    
    // cek dulu udah login apa belum
    // kalo belum, lempar ke halaman login
    // window.location.href = "login.html";
    
    // var shell = require('electron').shell;
    //open links externally by default
    // $(document).on('click', 'a[href^="http"]', function(event) {
    //     event.preventDefault();
    //     shell.openExternal(this.href);
    // });
});
