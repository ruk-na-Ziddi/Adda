var express = require('express');
var router = express.Router();
var topic_module = require('../own_modules/topic_module.js').init('./data/adda.db');
var new_topic_module = require('../own_modules/new_topic_module.js').init('./data/adda.db');
var user_module = require('../own_modules/user_module.js').init('./data/adda.db');
var res_module = require('../own_modules/res_module.js').init('./data/adda.db');
var lib = require('../own_modules/adda_module.js').lib;

var bc = require("bcryptjs");

router.get('/', function(req, res) {
	new_topic_module.get_top_5_topics(function(err,topics){
		res.render('index', {topics:topics,title:'Adda'});
	})
});

var requireLogin = function(req,res,next){
	req.session.user? next(): res.redirect('/login');
};

router.get('/logout',requireLogin, function(req, res) {
	req.session.destroy();
	res.redirect("/login");
})

router.get('/close/:id',requireLogin, function(req, res) {
	var request = {user:req.session.user,topic_id:req.params.id};
	topic_module.close_topic(request,function(err){
		var socket = router.getSocket();
		socket.broadcast.emit('close')
		socket.emit('close')
 		res.redirect("/topic/"+req.params.id);
 	})
})

router.get('/leave/:id',requireLogin, function(req, res) {
  var request = {user:req.session.user,topic_id:req.params.id};
 	topic_module.leave_topic(request,function(err){
 		res.redirect("/topic/"+req.params.id);
 	})
})

router.get('/join/:id',requireLogin, function(req, res) {
  var request = {user:req.session.user,topic_id:req.params.id};
 	topic_module.join_topic(request,function(err){
 		res.redirect("/topic/"+req.params.id);
 	})
})

router.get('/topic/:id',requireLogin,function(req, res) {
	topic_module.get_topic_summary(req.params.id,function(err,topic){
		var status_request ={topic_id:req.params.id,user:req.session.user};
		res.locals.status = topic_module.check_status(status_request,function(err,status){
			res.locals.status = status
			topic.start_time = lib.get_Time_Date(topic.start_time);
			topic.closed_time = lib.get_Time_Date(topic.closed_time);
			topic.comments = formatComments(topic.comments);
  			res.render('topic',topic);	
		})
	})
})

router.get('/getComments/:id',requireLogin, function(req, res) {
	topic_module.get_comments(req.params.id,function(err,comments){
		var formatedComments =  formatComments(comments);
  		res.json(formatedComments);
	})
})

var formatComments =function(comments){
	return comments.map(function(comment){
		comment.time = lib.get_Time_Date(comment.time);
		return comment;
	})
}

router.post('/newComment/:id',requireLogin, function(req, res) {
	console.log("content",req.body.content);
	var newComment = {
		content:req.body.content,
		email:req.session.user,
		topic_id:req.params.id
	}
	topic_module.add_new_comment(newComment,function(err,comment){
		comment.time = lib.get_Time_Date(new Date().getTime());
		broadcastOnSocket(comment)
		res.end();
	})
	
})

var broadcastOnSocket =function(comment){
	var socket = router.getSocket();
	console.log("socket:",socket.id);
	socket.broadcast.emit("new_comment",{comment:comment});
	socket.emit("new_comment",{comment:comment});
}

router.get('/topics',requireLogin,function(req, res){
	var topic_name =req.query.searchby;
	if(topic_name){
		new_topic_module.search_topic_by_name(topic_name,function(err,topics){
			res.render('topics',{topics:topics})
		})
		return;
	}
	res.render('topics');
})

router.post('/topics',requireLogin,function(req, res){
	var new_topic = req.body;
	new_topic.email = req.session.user;
	new_topic_module.add_new_topic(new_topic,function(err,id){
		res.redirect('topic/'+id)
	})
})

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
	var result = req.body;
	res_module.insert_new_user(result,function(err){
		req.session.user = result.email;
		res.redirect('/dashboard');
	});
});


router.get('/dashboard',requireLogin, function(req, res) {
	user_module.get_user_summary(req.session.user,function(err,user){
		res.render('dashboard',user);
	})
});

router.get("/login",function(req,res){
	if(req.session.user){
		res.redirect('/dashboard');
		return;
	}
	res.render("login");
})

router.post("/login",function(req,res){
	var user = req.body;
	new_topic_module.get_password_by_email(user.email,function(err,existing_user){
		if(existing_user){
			if(bc.compareSync(user.password,existing_user.password)){ 
				req.session.user = user.email;
  				res.redirect('/dashboard');
  				return;
			}		
		}
		res.render('login',{error:'Invalid username or password.'});
	})
});

module.exports = router;
