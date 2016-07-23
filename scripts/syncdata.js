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
        
        get_accepted_order : function(shop_id, last){
            
        }
    }
}]);
