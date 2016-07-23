var app = angular.module('LoginApp', []);

app.controller('LoginController', ['$scope', 'LoginFactory', function($scope, LoginFactory){
    $scope.email;
    $scope.password;
    
    $scope.doLogin = function(){
        LoginFactory.get_shop_id($scope.email).success(function(data, status){
            if(data.data.shop_id){
                console.log(data.data);
                var shop_id = data.data.shop_id;
                var user_id = data.data.user_id;
                LoginFactory.get_shop_info(data.data.shop_id).success(function(data, status){
                   
                   var util_shop_id =  {
                    key : "shop_id",
                    value : shop_id
                   }
                   UtilManager.UpdateUtil(util_shop_id);
                   
                   var util_shop_name =  {
                    key : "shop_name",
                    value : data.data.shop_name
                   }                   
                   UtilManager.UpdateUtil(util_shop_name);
                   
                   var util_user_id =  {
                    key : "user_id",
                    value : user_id
                   }                   
                   UtilManager.UpdateUtil(util_user_id);
                   
                   
                    setTimeout(function(){
                        window.location.href = "index.html";  
                    }, 1000);
                   
                });
            } else {
                
            }
        });
    }
}]);

app.factory('LoginFactory', ['$http', function($http){
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
        }
    }
}]);

$(document).ready(function() {
    // var shell = require('electron').shell;
    // open links externally by default
    $(document).on('click', 'a[href^="http"]', function(event) {
        event.preventDefault();
        shell.openExternal(this.href);
    });
});
