var app = angular.module('LoginApp', ['SyncData']);

app.controller('LoginController', ['$scope', 'SyncFactory', function($scope, SyncFactory){
    $scope.email;
    $scope.password;
    
    $scope.doLogin = function(){
        SyncFactory.get_shop_id($scope.email).success(function(data, status){
            if(data.data.shop_id){
                console.log(data.data);
                var shop_id = data.data.shop_id;
                var user_id = data.data.user_id;
                SyncFactory.get_shop_info(data.data.shop_id).success(function(data, status){
                   
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

$(document).ready(function() {
    // var shell = require('electron').shell;
    // open links externally by default
    $(document).on('click', 'a[href^="http"]', function(event) {
        event.preventDefault();
        shell.openExternal(this.href);
    });
});
