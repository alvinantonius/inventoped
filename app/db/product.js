var db = require("./connection");

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

    var stmt = db.prepare("INSERT INTO product("+field+") VALUES ("+values+")");
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

    var stmt = db.prepare("UPDATE product SET "+values+" WHERE "+where);
    stmt.run();
    stmt.finalize();
  },
  RemoveProd: function(product){
 	var where = "local_p_id='"+product.local_p_id+"'";

    var stmt = db.prepare("UPDATE product SET stat_del=1 WHERE "+where);
    stmt.run();
    stmt.finalize();
  }
}

module.exports = ProdManager;

