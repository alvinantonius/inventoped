var app = angular.module('SyncData', []);

app.factory('SyncFactory', ['$http', function($http){
    var server_products = "http://192.168.6.195:8008";
    var server_tome     = "http://192.168.6.195:9000";
    return {
        get_shop_id: function(email){
            var parameter = JSON.stringify({user_email:email});
            dat = $http.post(server_products+"/v1/login", parameter)
            return dat;
        },
        
        get_shop_info : function(shop_id){
            dat = $http.get(server_tome+"/v1/shop?shop_id="+shop_id);
            return dat;
        }, 
        
        get_all_new_product : function(shop_id, last_product_id, last_sync_product){
            dat = $http.get(server_tome+"/v1/shop/products?shop_id="+shop_id+"&sync_time="+last_sync_product+"&last_product_id="+last_product_id);
            return dat;
        },
        
        get_product : function(product_id){
            dat = $http.get(server_tome+"/v1/product?product_id="+product_id);
            return dat;
        },
        
        get_accepted_order : function(shop_id, last_sync_order){
            dat = $http.get(server_tome+"/v1/tx/products?shop_id="+shop_id+"&sync_time="+last_sync_product);
            return dat;
        },
        
        
        post_product : function(product){
            
            // "data":{
            //     "type":"products",
            //     "attributes":{
            //         "user_id":2734,
            //         "name":"jual api product asdasdasd",
            //         "description":"deskripsi produk",
            //         "shop_id":1779,
            //         "category_id":1501,
            //         "price_currency":0,
            //         "normal_price":1230000,
            //         "add_to_etalase":1,
            //         "etalase_id":3241,
            //         "add_to_catalog":0,
            //         "catalog_id":0,
            //         "returnable":0,
            //         "condition":1,
            //         "must_inssurance":1,
            //         "min_order":1,
            //         "weight":{
            //             "unit":1,
            //             "numeric":2000
            //         },
            //         "wholesale":[
            //             {
            //                 "min_count":10,
            //                 "max_count":15,
            //                 "price":1190000
            //             },
            //             {
            //                 "min_count":3,
            //                 "max_count":9,
            //                 "price":1200000
            //             }
            //         ],
            //         "images":[
            //             {
            //                 "file_path": "/2016/7/23/1779/1779_7c45d464-772f-4a2a-92c5-3ca22b072cdf.jpg",
            //                 "description":"image sdasdadjad ajd"
            //             }
            //         ]
            //     }
            // }
            // var parameter = JSON.stringify(product);
            console.log(product);
            dat = $http.post(server_products+"/v1/product", product)
            return dat;
        }
        
    }
}]);
