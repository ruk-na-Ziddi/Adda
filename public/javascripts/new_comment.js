var  loadComments = function(){
	$.ajax("/getComments/"+getId())
		.done(function(data){
			console.log(data);
			var listed_data =getLists(data);
			$("#allComments").html(listed_data);
		});
}
var getLists = function(comments){
	return comments.map(list).join("\r\n");
}
var list =function(comment){
		return '<li><div><b>'+comment.name+":</b> "+comment.content+"<br>"+comment.time+"</div></li><br>";
}
var getId = function(){
	var location = window.location.href.split('/');
	var id = location[location.length-1];
	return id;
}
var onPageLoad =function(){
	var socket = io.connect(window.location.hostname);

	socket.on('new_comment',function(data){
	 	var comment=$("#allComments").html();
	 	comment += list(data.comment);
	 	$("#allComments").html(comment); 		
	});
	socket.on('close',function(data){
	 	window.location.reload() 		
	});

	$("#btn_comment").click(function(){
		var id = getId();
		var content =$("#cmt_box").val();
		$("#cmt_box").val('');
		$.ajax({url:"/newComment/"+id,type:"POST", dataType: "json",data:{content:content}});
	});
	
	$("#btn_loadComplete").click(loadComments)

	$("#cmt_box").keypress(function(e){
		e.keyCode == 13 && $("#btn_comment").click();
	})
}

$(onPageLoad);