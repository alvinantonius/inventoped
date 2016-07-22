var app = angular.module('ManageProductController', []);

app.controller('ManageProductController', function($scope){
    $("#datatable").dataTable();
    
    $('.switch').bootstrapSwitch();
    
    $('.icheck').iCheck({
      checkboxClass: 'icheckbox_flat-green',
      radioClass: 'iradio_flat-green'
    });
});
