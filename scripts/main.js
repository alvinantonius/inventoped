var app = angular.module('Controllers', [

    'HomeController',
    'AddProductController',
    'ManageProductController',
    'NotifController'

]);



$(document).ready(function() {
    
    // cek dulu udah login apa belum
    // kalo belum, lempar ke halaman login
    
    dbInv.get("select * from util where key='shop_id'", function(err, row){
        var shop_id = row.value;
        
        if(!(shop_id > 0)){
            window.location.href = "login.html";
        }
    });
        
    
    var shell = require('electron').shell;
    // open links externally by default
    $(document).on('click', 'a[href^="http"]', function(event) {
        event.preventDefault();
        shell.openExternal(this.href);
    });
});
