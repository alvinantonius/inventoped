var fs          = require('fs');
var remote      = require('remote'); 
var dialog      = remote.require('dialog'); 
var restler     = require('restler');

var base_path   = __dirname;
var shop_id     = 0;
var user_id     = 0;
var upd_prod_id = 0;;
var upd_sync    = 20010101010101;;

var last_id;
var last_sync;

var app = angular.module('Controllers', [

    'HomeController',
    'ManageProductController',
    'NotifController'

]);

app.controller('SyncController', function($scope, SyncFactory) { 
    $scope.product = new Object();

    setInterval(function(){ 
        check_conn(function(status){
            $scope.connected = (status == 1 ? 'Connected' : 'Disonnected');
            $scope.status    = status;
        });
        $scope.$apply();
    }, 1000);

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
                            upd_sync = list_prod.server_time;

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
                                        product.stat_del       = 0;

                                        ProdManager.CreateProd(product);
                                    });
                                    
                                    upd_prod_id = (prod_id < upd_prod_id) ? upd_prod_id : prod_id;
                                });
                                $scope.get_product();
                            }

                            var query = "select local_p_id, product_name, stock_amount, price, price_currency, weight, " + 
                                        "weight_unit, condition, description, category_id, menu_id, min_order, insurance " + 
                                        "from product where p_id is null";
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

                                    upload_gambar(image.file_path, shop_id, function(data){
                                        console.log(data);
                                        image.file_url = data.result.file_path;
                                        var_images.push(image);
                                    });
                                });

                                var real_product = {
                                    data : {
                                        type : "products",
                                        attributes:{
                                            user_id         :parseInt(user_id),
                                            name            :row_prod.product_name,
                                            description     :row_prod.description,
                                            shop_id         :parseInt(shop_id),
                                            category_id     :row_prod.category_id,
                                            price_currency  :row_prod.price_currency,
                                            normal_price    :parseInt(row_prod.price),
                                            add_to_etalase  :row_prod.add_to_etalase,
                                            etalase_id      :row_prod.menu_id,
                                            add_to_catalog  :0,
                                            catalog_id      :0,
                                            returnable      :0,
                                            condition       :1,
                                            must_inssurance :1,
                                            min_order       :1,
                                            weight :{
                                                unit        :row_prod.weight_unit,
                                                numeric     :parseInt(row_prod.weight)
                                            },
                                            wholesale:[
                                            ]
                                        }   
                                    }
                                }
 
                                SyncFactory.post_product(real_product).success(function(res){
                                    var stmt = dbInv.prepare("UPDATE product SET p_id="+res.data.id+" WHERE local_p_id='"+row_prod.local_p_id+ "'");

                                    stmt.run();
                                    stmt.finalize();
                                    
                                    upd_sync = (res.server_time < upd_sync) ? upd_sync : res.server_time;
                                });

                                upd_prod_id = (row_prod.local_p_id < upd_prod_id) ? upd_prod_id : row_prod.local_p_id;
                            });

                            // Update util product
                            var stmt = dbInv.prepare("UPDATE util SET value="+upd_prod_id+" WHERE key='last_product_id'");

                            stmt.run();
                            stmt.finalize();

                            // Update util product
                            var stmt = dbInv.prepare("UPDATE util SET value= '"+upd_sync+"' WHERE key='last_sync_product'");

                            stmt.run();
                            stmt.finalize();                              
                        });
                    });
                });
            }
        });
    };

    $scope.get_product = function(){
        // Get total count row
        if ($scope.product) {
            last_p_id = $scope.product.last_id;
        }

        $scope.product.list = new Array();

        dbInv.each("select count(*) as count from product where stat_del = 0", function(err, row){
            nrow = row.count;

            if(nrow <= '20') {
                dbInv.each("select product_name, price, product_status, stock_amount, local_p_id from product where stat_del = 0 order by local_p_id", function(err, row){
                    $scope.product.list.push(row);
                    last_p_id = row.local_p_id;
                });
            } else {
                dbInv.each("select product_name, price, product_status, stock_amount, local_p_id from product where stat_del = 0 order by local_p_id limit 20", function(err, row){
                    $scope.product.list.push(row);
                    last_p_id = row.local_p_id;
                });
            }

            $scope.product.edit_prod = '#/inventory/edit_produk/';
            $scope.product.copy_prod = '#/inventory/tambah_produk/copy/';
            $scope.product.row       = nrow;
            $scope.product.last_id   = last_p_id;
            row = 1;
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

function upload_gambar(path, shop_id, fn){
    fs.stat(path, function(err, stats) {
        restler.post("http://192.168.6.195:8008/v1/products/image", {
            multipart: true,
            data: {
                "shop_id": shop_id,
                "image_file": restler.file(path, null, stats.size, null, "image/jpeg")
            }
        }).on("complete", function(data) {
            fn(data);
        });
    });
}

var rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

var token = function() {
    return rand() + rand(); // to make it longer
};

token();
