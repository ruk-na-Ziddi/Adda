var _ =require("lodash");
var sqlite3 = require("sqlite3").verbose(); 
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
		get_user_summary:operate(_get_user_summary)
	};
	return records;
};

var _get_user_summary = function(email,db,onComplete){
	var user_query = "select name, email, join_topic_ids,start_topic_ids"+
	" from users where email= '"+email+"'";
	db.get(user_query,function(err,user){
		user.join_topic_ids = user.join_topic_ids?JSON.parse(user.join_topic_ids):[]; 
		user.start_topic_ids = user.start_topic_ids?JSON.parse(user.start_topic_ids):[]; 
		get_topics_for_user(user,db,onComplete);
	});
}
var get_topics_for_user =function(user,db,onComplete){
	var all_topic_ids = user.join_topic_ids.concat(user.start_topic_ids);
	var lastId = _.last(all_topic_ids);
	user.topics = [];
	if(all_topic_ids.length==0){onComplete(null,user); return;}
	 var topic_query ="select id,name from topics where id=$topic_id";

	 all_topic_ids.forEach(function(id){
	 	db.get(topic_query,{"$topic_id":id},function(err,topic){
	 		user.topics.push(topic);
		 	(id==lastId) && onComplete(err,user);
	 	})
	})
}
exports.init =init;