var app = angular.module('EditProductController', ['SyncData']);

app.controller('EditProductController', function($scope, $routeParams, SyncFactory){
    var local_p_id = $routeParams.id;
    
    
    $scope.product = {};
    dbInv.get("select * from product where local_p_id='"+local_p_id+"'", function(err, row){
        $scope.product = row;
        $scope.product.image = [];
        $scope.$apply();
    });
    
    $('#browse-image-button').click(function(event) {
        // $('#browse-image').trigger('click');
        $scope.add_image();
    });
    
    $('#browse-image').change(function(event){
        console.log(event);
    });
    
    $scope.add_image = function(){
        var filepath;
        dialog.showOpenDialog({ filters: [
             { name: 'image', extensions: ['jpg', 'png', 'jpeg'] }
            ]},
            function (fileNames) {
              if (fileNames === undefined) return;
              filepath = fileNames[0];
              
              
              var extension = filepath.substr(filepath.lastIndexOf('.') + 1)
              var newfilename = token();
              filename = newfilename+"."+extension;
              target_file = base_path+'/userimage/'+filename;
              file_url = 'userimage/'+filename;
              var image = {
                filename    : filename,
                path        : target_file,
                url         : file_url
              };
              
              $scope.product.image.push(image);
              
              fs.createReadStream(filepath).pipe(fs.createWriteStream(target_file));
              
              setTimeout(function(){
                  $scope.$apply();
              }, 300);
              
              // fs.readFile(fileName, 'utf-8', function (err, data) {
              //   document.getElementById("editor").value = data;
              // });
        }); 
    }
    
    $scope.edit_product = function(){
        ProdManager.UpdateProd($scope.product);
        
        check_conn(function(status){
           if(status == 1) {
            // send product data to server
            $scope.update_product();
           } else {
            window.location.href = "#/";
           }
        });
    }
    
    $scope.update_product = function(){
        var real_product = {
            data:{
            type:"products",
            attributes:{
                user_id         :parseInt(user_id),
                name            :$scope.product.product_name,
                description     :$scope.product.description,
                shop_id         :parseInt(shop_id),
                category_id     :1501,
                price_currency  :1,
                normal_price    :parseInt($scope.product.price),
                add_to_etalase  :1,
                etalase_id      :2405,
                add_to_catalog  :0,
                catalog_id      :0,
                returnable      :0,
                condition       :1,
                must_inssurance :1,
                min_order       :parseInt($scope.product.min_order),
                wholesale:[

                ]
                }   
            }
        }
        
        SyncFactory.update_product($scope.product.p_id, real_product).success(function(data, status){
            var servertime = data.server_time;
            
            $scope.product.last_sync = servertime;
            
            ProdManager.UpdateProd($scope.product);
            
            window.location.href = "#/";
        });
    }
});
