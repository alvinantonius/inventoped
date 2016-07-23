var app = angular.module('AddProductController', []);

app.controller('AddProductController', function($scope){
    $('.icheck').iCheck({
      checkboxClass: 'icheckbox_flat-green',
      radioClass: 'iradio_flat-green'
    });
    
    $('.switch').bootstrapSwitch();
});
