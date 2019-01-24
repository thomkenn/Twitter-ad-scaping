var fs = require('fs');
var path = 'output.csv';
var x = "";
var temp = "";
var date = "";
var auth = require('./auth.json');
var mysql = require('mysql');
var fstimeout = 0;
var content = 'hello';
var diditread = 0;

var con = mysql.createConnection({
	host: auth.SQLhost,
	user: auth.SQLuser,
	password: auth.SQLpassword,
	database: auth.SQLdatabase
});

//Watch file, detect changes
fs.watch(path, (event, filename) => {
  if (filename) {
		console.log("calling file watch with timeout == " + fstimeout);
		if (fstimeout == 0){
			console.log("file changed");
			setTimeout(function() {
				console.log("inner called");
				fstimeout = 0;
				readit();
				setTimeout(function() {
					console.log("destroy file? diditread == " + diditread);
					if (diditread == 1){
						fs.writeFile(path, '', function(){console.log('done')})
						diditread = 0; }
					}, 10000);
			}, 45000);
			console.log("setting fstimeout");
			fstimeout = 1;
	}
  }
});

//Just in case previous loop gets caught in bad logic 
function failsafe() {
	setTimeout( function() {
		if (fstimeout == 1)
		{
			fstimeout = 0; 
			console.log("failsafe called");
		}
	}, 600000);
}

function readit() {
fs.readFile(path, (err, data) => { 
    if (err) throw err; 
	var checkifran = 0;
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
			checkifran = 1
		}	
	}
	console.log("checkifran == " + checkifran);
	if (checkifran == 1)
	{
		console.log("returning 1");
		diditread = 1;
	}
	else
		diditread = 0;
    //console.log(data); 
}) 
}