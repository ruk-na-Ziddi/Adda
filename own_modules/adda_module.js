var _ =require('lodash');
var lib={};
exports.lib = lib;

lib.get_last5_comments=function(comments){
	return _.last(_.sortBy(comments,'time'),5);
};

lib.get_Time_Date=function(milliseconds){
	console.log("gggg",milliseconds);
	if(!milliseconds){return ''};
	var currentDate=new Date(milliseconds);
	var hours=currentDate.getHours();
	var minutes=currentDate.getMinutes();
	var year=1900+currentDate.getYear();
	var month=1+currentDate.getMonth();
	var date=currentDate.getDate();
	return hours+":"+minutes+" "+date+"/"+month+"/"+year;
};