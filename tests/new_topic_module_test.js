var lib = require("../own_modules/new_topic_module.js");
var topic_module = require("../own_modules/topic_module.js").init('tests/data/adda.db');
var adda_records = require("../own_modules/user_module.js").init('tests/data/adda.db');

var assert = require('chai').assert;
var fs = require('fs');
var dbFileData = fs.readFileSync('tests/data/adda.db.backup');
var sqlite3 = require("sqlite3").verbose();
var TEST_DB_PATH='tests/data/adda.db';

var new_topic_module;
describe('#new_topic_module',function(){
	beforeEach(function(){
		fs.writeFileSync(TEST_DB_PATH,dbFileData);
		new_topic_module = lib.init(TEST_DB_PATH);
	});
	describe("#add_new_topic",function(){
		it("#adds a new topic step",function(done){
			var new_topic = {
				name : 'step',
				description : 'software technology excellence programme',
				email : 'ankur@ex.com'
			}
			new_topic_module.add_new_topic(new_topic,function(err,topic_id){
				assert.notOk(err);
				topic_module.get_topic_summary(topic_id,function(err,topic){
					assert.equal(topic.name,'step');
					assert.equal(topic.description,'software technology excellence programme');
					assert.equal(topic.close_time,undefined);
					assert.equal(topic.admin,'ankur');
					assert.lengthOf(topic.comments,0);
					adda_records.get_user_summary('ankur@ex.com',function(err,user){
						assert.equal(user.name,'ankur');
						assert.equal(user.email,'ankur@ex.com');
						assert.deepEqual(user.start_topic_ids,[7])		
						setTimeout(done,1);
					});
				})
			})
		})
	})

	describe('#search_topic_by_name',function(){
		it('#gives all topics with name sachin',function(done){
			new_topic_module.search_topic_by_name('cricket',function(err,topics){
				assert.lengthOf(topics,1);
				assert.deepEqual(topics[0],{id:1,name:"cricket"});
				done();
			})
		})

		it('#gives all topics containing the string c',function(done){
			var expected = [{id:1,name:"cricket"},{id:2,name:"music"},{id:3,name:"racing"},{id:5,name:"chess"},
				{id:6,name:"commedy"}];
			new_topic_module.search_topic_by_name('c',function(err,topics){
				assert.lengthOf(topics,5);
				assert.deepEqual(topics,expected);
				done();
			})	
		})
	})
	
	describe('#get_password_by_email',function(){
		it('#gives password of email_id ankur@ex.com',function(done){
			new_topic_module.get_password_by_email('ankur@ex.com',function(err,user){
				assert.notOk(err);
				assert.equal(user.password,'ankur12345');
				done();
			});
		});
	});

	describe("#get_top_5_topics",function(){
		it('#gives the latest 5 topics according to the time of comments',function(done){
			new_topic_module.get_top_5_topics(function(err,topics){
				assert.lengthOf(topics,5)
				done();
			})
		})
	})
});