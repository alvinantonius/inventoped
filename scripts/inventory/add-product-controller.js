var app = angular.module('AddProductController', ['SyncData']);

app.controller('AddProductController', function($scope, SyncFactory){
    
    $scope.product = {};
    $scope.product.image = [];
    
    $('.icheck').iCheck({
      checkboxClass: 'icheckbox_flat-green',
      radioClass: 'iradio_flat-green'
    });
    
    $('.switch').bootstrapSwitch();
    
    
    
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
    
    $scope.add_product = function(type){
        // 1 = add doang
        // 2 = add lagi
        local_product = {
            p_id                : "",
            shop_id             : shop_id,
            product_name        : $scope.product.name,
            product_status      : $scope.product.status,
            price               : $scope.product.price,
            stock_amount        : $scope.product.stock_amount,
            price_currency      : $scope.product.price_currency,
            returnable          : $scope.product.returnable,
            min_order           : $scope.product.min_order,
            insurance           : $scope.product.insurance,
            weight              : $scope.product.weight,
            menu_id             : $scope.product.menu_id,
            description         : $scope.product.description,
            stat_del            : 0
        };
        ProdManager.CreateProd(local_product);
        
        setTimeout(function(){
            dbInv.get("select MAX(local_p_id) AS local_p_id from product", function(err, row){
                var local_p_id = row.local_p_id;
                
                $scope.product.local_p_id = local_p_id;
                
                console.log(row);
                
                // insert product pic
                $.each($scope.product.image, function(index, val) {
                    var local_pic = {
                        p_id_local          : local_p_id,
                        file_name           : val.filename
                    };
                    PicManager.CreatePic(local_pic);
                });
                
                // insert product wholesale
                
            });
            
            check_conn(function(status){
               if(status == 1) {
                // send product data to server
                $scope.post_product();
               } else {
                window.location.href = "#/";
               }
            });
        }, 300);
        
    }
    
    $scope.post_product = function(){
        var real_product = {
            data:{
            type:"products",
            attributes:{
                user_id         :parseInt(user_id),
                name            :$scope.product.name,
                description     :$scope.product.description,
                shop_id         :parseInt(shop_id),
                category_id     :1501,
                price_currency  :0,
                normal_price    :parseInt($scope.product.price),
                add_to_etalase  :1,
                etalase_id      :2405,
                add_to_catalog  :0,
                catalog_id      :0,
                returnable      :0,
                condition       :1,
                must_inssurance :1,
                min_order       :parseInt($scope.product.min_order),
                weight :{
                    unit        :1,
                    numeric     :parseInt($scope.product.weight)
                },
                wholesale:[

                ]
                }   
            }
        }
        
        SyncFactory.post_product(real_product).success(function(data, status){
           var product_id = data.data.id;
           var servertime = data.server_time;

            local_product = {
                p_id                : product_id,
                local_p_id          : $scope.product.local_p_id,
                synced              : 1,
                last_sync           : servertime,
                shop_id             : shop_id,
                product_name        : $scope.product.name,
                product_status      : $scope.product.status,
                price               : $scope.product.price,
                stock_amount        : $scope.product.stock_amount,
                price_currency      : $scope.product.price_currency,
                returnable          : $scope.product.returnable,
                min_order           : $scope.product.min_order,
                insurance           : $scope.product.insurance,
                weight              : $scope.product.weight,
                menu_id             : $scope.product.menu_id,
                description         : $scope.product.description,
                stat_del            : 0
            };
            
            
            ProdManager.UpdateProd(local_product);
            
            // insert last product id
            var util_last_product_id =  {
                key : "last_product_id",
                value : product_id
            }                   
            UtilManager.UpdateUtil(util_last_product_id);
            
            // insert last sync product
            var util_last_sync_product =  {
                key : "last_sync_product",
                value : servertime
            }                   
            UtilManager.UpdateUtil(util_last_sync_product);
            
            window.location.href = "#/";
        });
    }
});
