var fs          = require('fs');
var remote      = require('remote'); 
var dialog      = remote.require('dialog'); 
// var nodeRequest = require('request');

var base_path = __dirname;
var shop_id   = 0;
var user_id   = 0;
var last_id;
var last_sync;

var app = angular.module('Controllers', [

    'HomeController',
    'ManageProductController',
    'NotifController'

]);

app.controller('SyncController', function($scope, SyncFactory) { 
    $scope.sync_product = function(){
        dbInv.get("select value from util where key='shop_id'", function(err, row_util){
            shop_id = row_util.value;
            if(shop_id > 0){
                dbInv.get("select value from util where key='last_product_id'", function(err, row_id){
                    last_id = row_id.value;

                    dbInv.get("select value from util where key='last_sync_product'", function(err, row_sync){
                        last_sync = row_sync.value;

                        SyncFactory.get_all_new_product(shop_id, last_id, last_sync).success(function(list_prod){
                            var list = list_prod.data;

                            if(list.product_list) {
                                $.each(list.product_list, function(index, value){
                                    var prod_id = value;

                                    SyncFactory.get_product(prod_id).success(function(result){
                                        var prod    = result.data;
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

                            var query = "select local_p_id, product_name, stock_amount, price, price_currency, weight, " + 
                                        "weight_unit, condition, description, category_id, menu_id, min_order, insurance " + 
                                        "from product where p_id=null";
                            dbInv.each(query, function(err, row_prod){
                                var var_images = new Array();
                                var img_query  = "select file_name, description, stat_primary from product_pic where p_id_local='" + row_prod.local_p_id + "'";

                                dbInv.each(img_query, function(err, row_image){
                                    var image = new Object();
                                    image.file_path   = base_path+'/userimage/'+row_image.file_name;
                                    image.description = row_image.description;

                                    if (row_image.stat_primary == 1){
                                        image.is_primary = 1;
                                    }

                                    var_images.push(image);

                                    formData = image_file : fs.createReadStream( image.file_path )
                                               shop_id    : shop_id

                                    nodeRequest.post {
                                      url      : "http://192.168.6.195:8008/v1/products/image"
                                      formData : formData
                                    }, (err, httpResponse, body) ->
                                    if err
                                        console.error('upload failed:', err)
                                    
                                    console.log 'Upload successful!  Server responded with:', body
                                });

                                var json   = new Object();
                                var data   = new Object();
                                var attrib = new Object()
                                data.type  = "products";

                                attrib.user_id         = user_id;
                                attrib.name            = row_prod.product_name;
                                attrib.description     = row_prod.description;
                                attrib.shop_id         = shop_id;
                                attrib.category_id     = row_prod.category_id;
                                attrib.price_currency  = row_prod.price_currency;
                                attrib.add_to_etalase  = row_prod.add_to_etalase;
                                attrib.etalase_id      = row_prod.menu_id;
                                attrib.add_to_catalog  = 0;
                                attrib.catalog_id      = 0;
                                attrib.returnable      = 0;
                                attrib.condition       = 1;
                                attrib.must_inssurance = 1;
                                attrib.min_order       = 1;
                                attrib.weight.unit     = row_prod.weight_unit;
                                attrib.weight.numeric  = row_prod.weight;
                                attrib.wholesale       = new Array();
                                attrib.images          = var_images;
                                data.attributes        = attrib;

                                json.data = data;
                                var prod_id = SyncFactory.post_product(json);
                            });
                        });
                    });
                });
            }
        });
        
    };
});

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
