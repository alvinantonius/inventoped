
var sqlite3 = require('sqlite3').verbose();
var dbInv   = new sqlite3.Database('./inventoped.sqlite3');

var ProdManager = {
  CreateProd: function(product){
  	var upd_time = new Date();
  	var field = "p_id, shop_id, product_name, " + 
  		"product_code, product_status, use_stock, " + 
  		"stock_amount, price, price_currency, " + 
  		"weight, weight_unit, condition, " + 
  		"description, category_id, menu_id," + 
  		"min_order, insurance, returnable, " + 
  		"synced, last_sync, update_time";

  	var values = "'"+product.p_id+"','"+product.shop_id+"','"+product.product_name+"','"+
  		product.product_code+"','"+product.product_status+"','"+product.use_stock+"','"+
  		product.stock_amount+"','"+product.price+"','"+product.price_currency+"','"+
  		product.weight+"','"+product.weight_unit+"','"+product.condition+"','"+
  		product.description+"','"+product.category_id+"','"+product.menu_id+"','"+
  		product.min_order+"','"+product.insurance+"','"+product.returnable+"','"+
  		product.synced+"','"+product.last_sync+"','"+upd_time+"'";

    var stmt = dbInv.prepare("INSERT INTO product("+field+") VALUES ("+values+")");

    stmt.run();
    stmt.finalize();
  },
  UpdateProd: function(product){
  	var upd_time = new Date();
  	var values = "p_id='"+product.p_id+"', shop_id='"+product.shop_id+"', product_name='"+product.product_name+
  		"', product_code='"+product.product_code+"', product_status='"+product.product_status+
  		"', use_stock='"+product.use_stock+"', stock_amount='"+product.stock_amount+
  		"', price='"+product.price+"', price_currency='"+product.price_currency+
  		"', weight='"+product.weight+"', weight_unit='"+product.weight_unit+
  		"', condition='"+product.condition+"', description='"+product.description+
  		"', category_id='"+product.category_id+"', menu_id='"+product.menu_id+
  		"', min_order='"+product.min_order+"', insurance='"+product.insurance+
  		"', returnable='"+product.returnable+"', synced='"+product.synced+
  		"', last_sync='"+product.last_sync+"', update_time='"+upd_time+"'";

  	var where = "local_p_id='"+product.local_p_id+"'";
    var stmt  = dbInv.prepare("UPDATE product SET "+values+" WHERE "+where);

    stmt.run();
    stmt.finalize();
  },
  RemoveProd: function(product){
 	  var where = "local_p_id='"+product.local_p_id+"'";
    var stmt  = dbInv.prepare("UPDATE product SET stat_del=1 WHERE "+where);

    stmt.run();
    stmt.finalize();
  }
}

var UtilManager = {
  CreateUtil: function(util){
    var field  = "key, value";
    var values = "'"+util.key+"','"+util.value+"'";
    var stmt   = dbInv.prepare("INSERT INTO product("+field+") VALUES ("+values+")");

    stmt.run();
    stmt.finalize();
  },
  UpdateUtil: function(util){
    var values = "value='"+util.value+"'";
    var where  = "key='"+util.key+"'";
    var stmt   = dbInv.prepare("UPDATE product SET "+values+" WHERE "+where);

    stmt.run();
    stmt.finalize();
  },
  GetUtil : function(key){
  	if (key == undefined) {
  		return dbInv.exec("select * from util");
  	} else {
  		return dbInv.exec("select * from util where key='"+key+"'");
  	}
  }
}

var DeptManager = {
  CreateDept: function(dept){
  	var upd_time = new Date();
  	var field = "name, description, weight, " + 
  		"status, parent, identifier, " + 
  		"tree, dir_view, dep_full_name, " + 
  		"adult, create_time, update_time, " + 
  		"css_class, title_tag, meta_description," + 
  		"long_description, title";

  	var values = "'"+dept.name+"','"+dept.description+"','"+dept.weight+"','"+
  		dept.status+"','"+dept.parent+"','"+dept.identifier+"','"+
  		dept.tree+"','"+dept.dir_view+"','"+dept.dep_full_name+"','"+
  		dept.adult+"','"+upd_time+"','"+upd_time+"','"+
  		dept.css_class+"','"+dept.title_tag+"','"+dept.meta_description+"','"+
  		dept.long_description+"','"+dept.title+"'";

    dbInv.exec("INSERT INTO department("+field+") VALUES ("+values+")");
    var stmt   = dbInv.prepare("UPDATE product SET "+values+" WHERE "+where);

    stmt.run();
    stmt.finalize();
  },
  UpdateDept: function(dept){
  	var upd_time = new Date();
  	var values = "name='"+dept.name+"', description='"+dept.description+"', weight='"+dept.weight+
  		"', status='"+dept.status+"', parent='"+dept.parent+"', identifier='"+dept.identifier+
      "', tree='"+dept.tree+"', dir_view='"+dept.dir_view+"', dep_full_name='"+dept.dep_full_name+
  		"', adult='"+dept.adult+"', update_time='"+upd_time+"', css_class='"+dept.css_class+
      "', title_tag='"+dept.title_tag+"', meta_description='"+dept.meta_description+
  		"', long_description='"+dept.long_description+"', title='"+dept.title+"'";

  	var where = "d_id='"+dept.d_id+"'";
    var stmt  = dbInv.prepare("UPDATE department SET "+values+" WHERE "+where);

    stmt.run();
    stmt.finalize();
  },
  RemoveDept: function(dept){
	  var where = "d_id='"+dept.d_id+"'";
    var stmt  = dbInv.prepare("UPDATE department SET stat_del=1 WHERE "+where);

    stmt.run();
    stmt.finalize();
  }
}

var PicManager = {
  CreatePic: function(picture){
  	var upd_time = new Date();
  	var field    = "p_id_local, description, file_name, status, stat_primary, update_time";
  	var values   = "'"+picture.p_id_local+"','"+picture.description+"','"+picture.file_name+
                   "','"+picture.status+"','"+picture.stat_primary+"','"+upd_time+"'";
    var stmt     = dbInv.prepare("INSERT INTO product_pic("+field+") VALUES ("+values+")");

    stmt.run();
    stmt.finalize();
  },
  UpdatePic: function(picture){
  	var upd_time = new Date();
  	var values   = "description='"+picture.description+"', file_name='"+picture.file_name+"', "+
                   "status='"+picture.status+"', stat_primary='"+picture.stat_primary+"', update_time='"+upd_time+"'";
  	var where    = "product_pic_id='"+picture.product_pic_id+"'";
    var stmt     = dbInv.prepare("UPDATE product_pic SET "+values+" WHERE "+where);

    stmt.run();
    stmt.finalize();
  },
  RemovePic: function(picture){
 	  var where = "product_pic_id='"+picture.product_pic_id+"'";
    var stmt  = dbInv.prepare("UPDATE product_pic SET status=2 WHERE "+where);

    stmt.run();
    stmt.finalize();
  }
}
