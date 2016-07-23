var app       = angular.module('ManageProductController', []);
var nrow      = 0;
var last_p_id = 0;

app.controller('ManageProductController', function($scope){
    $("#datatable").dataTable();
    $('.switch').bootstrapSwitch();
    
    $('.icheck').iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green'
    });
    
    $("[data-toggle='tooltip']").tooltip();

    $scope.get_product = function(){
    	// Get total count row
    	if ($scope.product != undefined) {
    		last_p_id = $scope.product.last_id;
    	}

		var detail     = new Array();
	    $scope.product = new Object();

		dbInv.each("select count(*) as count from product where stat_del = 0", function(err, row){
			nrow = row.count;

			if(nrow <= '20') {
				dbInv.each("select product_name, price, product_status, use_stock, local_p_id from product order by local_p_id", function(err, row){
					detail.push(row);
					last_p_id = row.local_p_id;
				});

				$scope.product.list    = detail;
				$scope.product.row     = nrow;
				$scope.product.last_id = last_p_id;
			} else {
				dbInv.each("select product_name, price, product_status, use_stock, local_p_id from product where local_p_id > " + last_p_id + "order by local_p_id limit 20", function(err, row){
					detail.push(row);
					last_p_id = row.local_p_id;
				});

				$scope.product.list    = detail;
				$scope.product.row     = nrow;
				$scope.product.last_id = last_p_id;
			}
		});
    };

	$scope.get_product();
});
