var db = require("./connection");

var UtilManager = {
  createProd: function(util){
    var field  = "key, value";
    var values = "'"+util.key+"','"+util.value+"'";

    var stmt = db.prepare("INSERT INTO product("+field+") VALUES ("+values+")");
    stmt.run();
    stmt.finalize();
  },
  UpdateProd: function(util){
    var values = "value='"+util.value+"'";
    var where  = "key='"+util.key+"'";

    var stmt = db.prepare("UPDATE product SET "+values+" WHERE "+where);
    stmt.run();
    stmt.finalize();
  }
}

module.exports = UtilManager;

