var db = require("./connection");

var PicManager = {
  CreatePic: function(picture){
  	var upd_time = new Date();
  	var field    = "p_id_local, description, file_name, status, stat_primary, update_time";
  	var values   = "'"+picture.p_id_local+"','"+picture.description+"','"+picture.file_name+
                   "','"+picture.status+"','"+picture.stat_primary+"','"+upd_time+"'";

    var stmt = db.prepare("INSERT INTO product_pic("+field+") VALUES ("+values+")");
    stmt.run();
    stmt.finalize();
  },
  UpdatePic: function(picture){
  	var upd_time = new Date();
  	var values   = "description='"+picture.description+"', file_name='"+picture.file_name+"', "+
                   "status='"+picture.status+"', stat_primary='"+picture.stat_primary+"', update_time='"+upd_time+"'";
  	var where    = "product_pic_id='"+picture.product_pic_id+"'";

    var stmt = db.prepare("UPDATE product_pic SET "+values+" WHERE "+where);
    stmt.run();
    stmt.finalize();
  },
  RemoveProd: function(picture){
 	  var where = "product_pic_id='"+picture.product_pic_id+"'";

    var stmt = db.prepare("UPDATE product_pic SET status=2 WHERE "+where);
    stmt.run();
    stmt.finalize();
  }
}

module.exports = PicManager;

