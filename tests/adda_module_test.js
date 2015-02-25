var lib = require("../own_modules/adda_module.js").lib;
var assert = require('chai').assert;

describe("last5_comments_on_topic",function(){
	it("gives last five comments from all comments",function(){
		var comments = [{content:"hi" , email : "ankur@ex.com" , topic_id : 1,time:12345},
		{content:"hi neeee" , email : "ddd@ex.com" , topic_id : 1,time:23451},
		{content:"hiiii" , email : "ee@ex.com" , topic_id : 1,time:34512},
		{content:"hi babu" , email : "ffff@ex.com" , topic_id : 1,time:45123},
		{content:"hi ramu" , email : "ssss@ex.com" , topic_id : 1,time:51234},
		{content:"hi there" , email : "www@ex.com" , topic_id : 1,time:52234},
		{content:"hiu" , email : "weee@ex.com" , topic_id : 1,time:34443}];
		var last5_comments =lib.get_last5_comments(comments);
		var expected =[{content:"hiu" , email : "weee@ex.com" , topic_id : 1,time:34443},
		{content:"hiiii" , email : "ee@ex.com" , topic_id : 1,time:34512},
		{content:"hi babu" , email : "ffff@ex.com" , topic_id : 1,time:45123},
		{content:"hi ramu" , email : "ssss@ex.com" , topic_id : 1,time:51234},		
		{content:"hi there" , email : "www@ex.com" , topic_id : 1,time:52234}
		];
		assert.deepEqual(expected,last5_comments);
	});
});