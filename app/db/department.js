var db = require("./connection");

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

    var stmt = db.prepare("INSERT INTO department("+field+") VALUES ("+values+")");
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

    var stmt = db.prepare("UPDATE department SET "+values+" WHERE "+where);
    stmt.run();
    stmt.finalize();
  },
  RemoveDept: function(dept){
 	  var where = "d_id='"+dept.d_id+"'";

    var stmt = db.prepare("UPDATE department SET stat_del=1 WHERE "+where);
    stmt.run();
    stmt.finalize();
  }
}

module.exports = DeptManager;

