var fs = require('fs');
var path = 'output.csv';
var x = "";
var temp = "";
var date = "";
var auth = require('./auth.json');
var mysql = require('mysql');
var fstimeout = 0;
var content = 'hello';

var con = mysql.createConnection({
	host: auth.SQLhost,
	user: auth.SQLuser,
	password: auth.SQLpassword,
	database: auth.SQLdatabase
});

fs.watch(path, (event, filename) => {
  if (filename) {
		if (fstimeout == 0){
			console.log("file changed");
			setTimeout(function() {
				console.log("inner called");
				fstimeout = 0;
				readit();
				fs.writeFile(path, '', function(){console.log('done')})
			}, 45000);
			fstimeout = 1;
	}
  }
});

function readit() {
fs.readFile(path, (err, data) => { 
    if (err) throw err; 
	
	x = data.toString();
	x = x.split(',');

	for (i in x) {
		if (x[i] == "\n" || x[i] == "")
		{
			console.log("empty");
		}
		else if (x[i].includes("\n"))
		{
			date = x[i].toString().substring(1, x[i].toString().length);
		}
		else {
			temp = x[i].split(' ');
			temp = "insert into " + temp[0] + " values ('" + date + "', " + temp[1] + ")" 
			con.query(temp);
			con.query("commit");
			console.log(temp);
		}	
			//console.log("new line");
	}
    //console.log(data); 
}) 
}