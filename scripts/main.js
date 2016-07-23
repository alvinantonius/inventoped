var shop_id;
var last_id;
var last_sync;

var app = angular.module('Controllers', [

    'HomeController',
    'ManageProductController',
    'NotifController'

]);

app.controller('SyncController', function($scope) { 
    $scope.sync_product = function(){
        dbInv.get("select value from util where key='shop_id'", function(err, row){
            shop_id = row.value;
            if(shop_id > 0){
                dbInv.get("select value from util where key='last_product_id'", function(err, row){
                    last_id = row.value;
                });

                dbInv.get("select value from util where key='last_sync_product'", function(err, row){
                    last_sync = row.value;
                });

                if(last_id && last_sync){
                    SyncFactory.get_all_new_product(shop_id, last_id, last_sync).success(function(list_prod){
                        var list = list_prod.data;

                        if(list.product_list) {
                            $.each(list.product_list, function(index, value){
                                var prod_id = value;

                                SyncFactory.get_product(prod_id).success(function(prod){
                                    var product = new Object();
                                    product.p_id           = prod.p_id;
                                    product.shop_id        = shop_id;
                                    product.product_name   = prod.p_name;
                                    product.product_code   = '';
                                    product.product_status = prod.p_status;
                                    product.use_stock      = (prod.stock > 0 ? 1 : 0);
                                    product.stock_amount   = prod.stock;
                                    product.price          = prod.p_price;
                                    product.price_currency = prod.p_must_insurance;
                                    product.weight         = prod.p_weight_fmt;
                                    product.weight_unit    = prod.p_unit_fmt;
                                    product.condition      = prod.p_condition;
                                    product.description    = prod.p_desc_enc;
                                    product.category_id    = prod.ctg_id;
                                    product.menu_id        = prod.p_menu_id;
                                    product.min_order      = prod.p_min_order;
                                    product.insurance      = prod.p_must_insurance;
                                    product.returnable     = '';
                                    product.synced         = 1;
                                    product.last_sync      = prod.server_time;

                                    ProdManager.CreateProd(product);
                                });
                            });
                        }
                    });                    
                }
            }
        });
        
    };
});

var fs = require('fs');
var base_path = __dirname;

var remote = require('remote'); 
var dialog = remote.require('dialog'); 
var shop_id = 0;
var user_id = 0;

$(document).ready(function() {
    
    // cek dulu udah login apa belum
    // kalo belum, lempar ke halaman login
    
    dbInv.get("select * from util where key='shop_id'", function(err, row){
        shop_id = row.value;
        
        if(!(shop_id > 0)){
            window.location.href = "login.html";
        }
    });
    
    dbInv.get("select * from util where key='user_id'", function(err, row){
        user_id = row.value;
        
        if(!(user_id > 0)){
            window.location.href = "login.html";
        }
    });
        
    
    var shell = require('electron').shell;
    // open links externally by default
    $(document).on('click', 'a[href^="http"]', function(event) {
        event.preventDefault();
        shell.openExternal(this.href);
    });
    
    fs.exists(base_path+'/userimage',function(exists){
        if(exists){
        }else{
            fs.mkdir(base_path+'/userimage');
        }
    });
});

function check_conn(fn){
    var connect = 0;
    $.get('http://192.168.6.195:8008/ping', function(data) {
        if(data){
            connect = 1
        }
        fn(connect);
    });
}

var rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

var token = function() {
    return rand() + rand(); // to make it longer
};

token();
