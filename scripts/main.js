var app = angular.module('Controllers', [

    'HomeController',
    'ManageProductController',
    'NotifController'

]);

var fs = require('fs');
var base_path = __dirname;

var remote = require('remote'); 
var dialog = remote.require('dialog'); 
var shop_id = 0;
var user_id = 0;

$(document).ready(function() {
    
    // cek dulu udah login apa belum
    // kalo belum, lempar ke halaman login
    
    dbInv.get("select * from util where key='shop_id'", function(err, row){
        shop_id = row.value;
        
        if(!(shop_id > 0)){
            window.location.href = "login.html";
        }
    });
    
    dbInv.get("select * from util where key='user_id'", function(err, row){
        user_id = row.value;
        
        if(!(user_id > 0)){
            window.location.href = "login.html";
        }
    });
        
    
    var shell = require('electron').shell;
    // open links externally by default
    $(document).on('click', 'a[href^="http"]', function(event) {
        event.preventDefault();
        shell.openExternal(this.href);
    });
    
    fs.exists(base_path+'/userimage',function(exists){
        if(exists){
        }else{
            fs.mkdir(base_path+'/userimage');
        }
    });
});

function check_conn(fn){
    var connect = 0;
    $.get('http://192.168.6.195:8008/ping', function(data) {
        if(data){
            connect = 1
        }
        fn(connect);
    });
}

var rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

var token = function() {
    return rand() + rand(); // to make it longer
};

token();
