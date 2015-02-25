var sqlite3 = require("sqlite3").verbose();
var squel = require("squel");
var bc = require("bcryptjs");

var insert_new_user = function(new_user){
	return(
    squel.insert()
        .into("users")
        .set("name",new_user.name)
        .set("email", new_user.email)
        .set("join_topic_ids", '')
        .set("start_topic_ids", '')
	).toString();
};

var insert_new_password = function(new_user){
	return(
    squel.insert()
        .into("login")
        .set("email", new_user.email)
        .set("password", get_hash_password(new_user.password))
	).toString();
};

var get_hash_password = function(password){
	return bc.hashSync(password);
};

var _insert_new_user=function(new_user,db,onComplete){
	var insert_user_query=insert_new_user(new_user);
	var insert_pwd_query=insert_new_password(new_user);
	db.run(insert_user_query,function(err){
		db.run(insert_pwd_query,function(err){
			onComplete(null);
		});
	});
};

var init = function(location){
	var operate = function(operation){
		return function(){
			var onComplete = (arguments.length == 2)?arguments[1]:arguments[0];
			var arg = (arguments.length == 2) && arguments[0];

			var onDBOpen = function(err){
				if(err){onComplete(err);return;}
				db.run("PRAGMA foreign_keys = 'ON';");
				arg && operation(arg,db,onComplete);
				arg || operation(db,onComplete);
				db.close();
			};
			var db = new sqlite3.Database(location,onDBOpen);
		};	
	};

	var records  = {
		insert_new_user:operate(_insert_new_user)
	};
	return records;
};

exports.init = init;