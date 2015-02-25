var lib = require("../own_modules/topic_module.js");
var assert = require('chai').assert;
var fs = require('fs');
var dbFileData = fs.readFileSync('tests/data/adda.db.backup');
var sqlite3 = require("sqlite3").verbose();
var TEST_DB_PATH='tests/data/adda.db';
var _ = require("lodash");

var adda_records;
describe('adda_records',function(){
	beforeEach(function(){
		fs.writeFileSync(TEST_DB_PATH,dbFileData);
		adda_records = lib.init(TEST_DB_PATH);
	});
	describe("get_topic_summary",function(){
		it("get information about topic 1",function(done){
			adda_records.get_topic_summary(1,function(err,topic){
				assert.equal(topic.name,'cricket');
				assert.equal(topic.id,1);
				assert.equal(topic.description,'sachin tendulkar');
				assert.equal(topic.start_time,123454);
				assert.equal(topic.close_time,undefined);
				assert.equal(topic.admin,'dolly');
				assert.lengthOf(topic.comments,2);
				assert.equal(2,10);
				done();	
			});
		});
	});

	describe("new_comment",function(){
		it("stores the new comment on topic 1",function(done){
			var new_comment = {content:"hi" , email : "ankur@ex.com" , topic_id : 1};
			adda_records.add_new_comment(new_comment,function(err){
				adda_records.get_topic_summary(1,function(err,topic){
					assert.lengthOf(topic.comments,3);
					var comment  = _.max(topic.comments,'time');
					assert.equal(comment.content,"hi");
					assert.equal(comment.name,"ankur");
					done();
				});					
			});
		});
	});
	
	describe("get_comments",function(){
		it("get all comments of topic 1",function(done){
			adda_records.get_comments(1,function(err,comments){
				assert.lengthOf(comments,2); 
				done();					
			});
		});
	});
	describe("check_user_status",function(){
		it("checks if user ankur@ex.com partisipate of topic 1 and dolly is starter of topic",function(done){

			adda_records.check_status({topic_id:'1',user:"ankur@ex.com"},function(err,status){
				assert.equal(status.starter,false);
				assert.equal(status.participate,true);

				adda_records.check_status({topic_id:'1',user:"dolly@ex.com"},function(err,status){
					assert.equal(status.starter,true);
					assert.equal(status.participate,false);
					done();					
				}); 				
			});
		});
	});
	describe("join_topic",function(){
		it("allow user to join new Topic",function(done){

			adda_records.join_topic({topic_id:'1',user:"dino@ex.com"},function(err){
				adda_records.check_status({topic_id:'1',user:"dino@ex.com"},function(err,status){
					assert.equal(status.starter,false);
					assert.equal(status.participate,true);
					done();					
				}); 				
			});

		});
	});
	describe("join_topic",function(){
		it("allow user to join new Topic",function(done){
			adda_records.join_topic({topic_id:'1',user:"dino@ex.com"},function(err){
				adda_records.check_status({topic_id:'1',user:"dino@ex.com"},function(err,status){
					assert.equal(status.starter,false);
					assert.equal(status.participate,true);
					done();					
				}); 				
			});
			
		});
	});
	describe("leave_topic",function(){
		it("allow user to leave Topic",function(done){
			adda_records.leave_topic({topic_id:'1',user:"ankur@ex.com"},function(err){
				adda_records.check_status({topic_id:'1',user:"ankur@ex.com"},function(err,status){
					assert.equal(status.starter,false);
					assert.equal(status.participate,false);
					done();					
				}); 				
			});
		});
	});
	describe("close_topic",function(){
		it("allow user to close_topic",function(done){
			adda_records.close_topic({topic_id:'1',user:"dolly@ex.com"},function(err){
				adda_records.get_topic_summary(1,function(err,topic){
					assert.ok(topic.closed_time);
					done();
				}) 				
			});
		});
	});
});