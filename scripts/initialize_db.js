var location = process.argv[2];
var sqlite3 = require("sqlite3");
var db = new sqlite3.Database(location);
var runAllQueries = function(){	
	var runQuery = function(q){
		console.log(q);
		db.run(q,function(err){
			if(err){
				console.log(err);
				process.exit(1);
			}
		});
	};

	[	"create table users(email text primary key, name text, join_topic_ids text, start_topic_ids text);",
		"create table login(email text, password text not null,foreign key(email) references users(email));",
		"create table topics(id integer primary key autoincrement, name text, description text, start_time integer,closed_time integer, email text ,foreign key(email) references users(email));",
		"create table comments(id integer primary key autoincrement, content text, time integer, topic_id integer, email text, foreign key(topic_id) references topics(id),foreign key(email) references users(email))"	
	].forEach(runQuery)	;
};
db.serialize(runAllQueries);