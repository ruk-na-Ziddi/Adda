var lib = require("../own_modules/user_module.js");
var assert = require('chai').assert;
var fs = require('fs');
var dbFileData = fs.readFileSync('tests/data/adda.db.backup');
var sqlite3 = require("sqlite3").verbose();
var TEST_DB_PATH='tests/data/adda.db';
var _ = require("lodash");

var adda_records;
describe('user_module',function(){
	beforeEach(function(){
		fs.writeFileSync(TEST_DB_PATH,dbFileData);
		adda_records = lib.init(TEST_DB_PATH);
	});
	describe("user_summary",function(){
		it("get information about user whose email is ankur@ex.com",function(done){
			adda_records.get_user_summary('ankur@ex.com',function(err,user){
				assert.equal(user.name,'ankur');
				assert.equal(user.email,'ankur@ex.com');
				assert.lengthOf(user.topics,1);
				assert.deepEqual(user.topics[0],{id:1,name:"cricket"});			
				done();	
			});
		});
	});
});