var app       = angular.module('ManageProductController', []);
var row       = 0;
var nrow      = 0;
var last_p_id = 0;

app.controller('ManageProductController', function($scope) { 
    $scope.product = new Object();

    $("#datatable").dataTable();
    $('.switch').bootstrapSwitch();
    
    $('.icheck').iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green'
    });
    
    $("[data-toggle='tooltip']").tooltip();

    setInterval(function(){ 
    	if(row = 1) {
	    	$scope.$apply();
    	}
    }, 500);

    $scope.get_product = function(){
    	// Get total count row
    	if ($scope.product) {
    		last_p_id = $scope.product.last_id;
    	}

		$scope.product.list = new Array();

		dbInv.each("select count(*) as count from product where stat_del = 0", function(err, row){
			nrow = row.count;

			if(nrow <= '20') {
				dbInv.each("select product_name, price, product_status, stock_amount, local_p_id from product order by local_p_id", function(err, row){
					$scope.product.list.push(row);
					last_p_id = row.local_p_id;
				});
			} else {
				dbInv.each("select product_name, price, product_status, stock_amount, local_p_id from product where local_p_id > " + last_p_id + "order by local_p_id limit 20", function(err, row){
					$scope.product.list.push(row);
					last_p_id = row.local_p_id;
				});
			}

	        $scope.product.edit_prod = '#/inventory/tambah_produk/edit/';
	        $scope.product.copy_prod = '#/inventory/tambah_produk/copy/';
			$scope.product.row       = nrow;
			$scope.product.last_id   = last_p_id;
			row = 1;
		});
    };

    $scope.del_product = function(p_id){
    	ProdManager.RemoveProd(p_id);
		row = 1;
    };

	$scope.get_product();
});
