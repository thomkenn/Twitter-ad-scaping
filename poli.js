var fs = require('fs');
var content= "";
var path = 'output.csv';
var temp = 0;

console.log("starting");

setInterval(function(){ 
	console.log("going");
	var d = new Date();
	d = (1 + d.getMonth()) + "-" + d.getDate();
	fs.write(path, "\n" + d + ",", 'a');
	//twitteranalysis("https://ads.twitter.com/transparency/sherrodbrown", "Brown");
	twitteranalysis("https://ads.twitter.com/transparency/SenGillibrand", "Gillibrand");  //no i assume
	twitteranalysis("https://ads.twitter.com/transparency/KamalaHarris", "Kamala");
	twitteranalysis("https://ads.twitter.com/transparency/BetoORourke","Beto"); //no
	twitteranalysis("https://ads.twitter.com/transparency/BernieSanders","Bernie"); //no
	twitteranalysis("https://ads.twitter.com/transparency/ewarren","Warren"); //no
	twitteranalysis("https://ads.twitter.com/transparency/amyklobuchar","Klobuchar"); //no
	},86400000);

function twitteranalysis(url,name) {
	var page = require('webpage').create();
	page.open(url, function() {
			window.setTimeout(function () {
				page.evaluate(function( mouseclick_fn ) {
					var element = document.querySelectorAll('button')[2];
					//console.log(element.id);
					mouseclick_fn( element );
				},
				mouseclick
				);
			}, 10000); // this selects the button 
			window.setTimeout(function () {
				var lencheck = page.evaluate(function() {
					return ((document.getElementsByClassName("src-components-UserSpend-styles-module--row src-components-UserSpend-styles-module--totalRow src-components-Container-styles-module--dataRow src-components-Container-styles-module--withBorder")).length);
				});
				console.log(lencheck + "LENCHECK IS " + name + "and the name is");
				if (lencheck == 1){
					var x = page.evaluate(function() {
					try {
						var len = (document.getElementsByClassName("src-components-UserSpend-styles-module--row src-components-UserSpend-styles-module--totalRow src-components-Container-styles-module--dataRow src-components-Container-styles-module--withBorder")).length;
						return document.getElementsByClassName("src-components-UserSpend-styles-module--row src-components-UserSpend-styles-module--totalRow src-components-Container-styles-module--dataRow src-components-Container-styles-module--withBorder")[len-1];
					}
					catch (error) {
						return null;
					}
					});
				} else if (lencheck > 1) {
					var x = [];
					if (lencheck > 0)
						x.push(page.evaluate(function() {
							return document.getElementsByClassName("src-components-UserSpend-styles-module--row src-components-UserSpend-styles-module--totalRow src-components-Container-styles-module--dataRow src-components-Container-styles-module--withBorder")[0];
						}));
					if (lencheck > 1)
						x.push(page.evaluate(function() {
							return document.getElementsByClassName("src-components-UserSpend-styles-module--row src-components-UserSpend-styles-module--totalRow src-components-Container-styles-module--dataRow src-components-Container-styles-module--withBorder")[1];
						}));
						
					if (lencheck > 2)
						x.push(page.evaluate(function() {
							return document.getElementsByClassName("src-components-UserSpend-styles-module--row src-components-UserSpend-styles-module--totalRow src-components-Container-styles-module--dataRow src-components-Container-styles-module--withBorder")[2];
						}));
						
					if (lencheck > 3)
						x.push(page.evaluate(function() {
							return document.getElementsByClassName("src-components-UserSpend-styles-module--row src-components-UserSpend-styles-module--totalRow src-components-Container-styles-module--dataRow src-components-Container-styles-module--withBorder")[3];
						}));
						
					if (lencheck > 4)
						x.push(page.evaluate(function() {
							return document.getElementsByClassName("src-components-UserSpend-styles-module--row src-components-UserSpend-styles-module--totalRow src-components-Container-styles-module--dataRow src-components-Container-styles-module--withBorder")[4];
						}));
						
					if (lencheck > 5)
						x.push(page.evaluate(function() {
							return document.getElementsByClassName("src-components-UserSpend-styles-module--row src-components-UserSpend-styles-module--totalRow src-components-Container-styles-module--dataRow src-components-Container-styles-module--withBorder")[5];
						}));
					console.log();
				} else	 {
					var x = null;
				}
				
				if (x) {
					if(typeof(x.length) == "undefined") {
						console.log("x: " + x.textContent);
						x = "" + x.textContent;
						len = x.indexOf('$');
						if (len == -1)
							len = 0;
						x = x.substring(len+1,x.length);
						x = (parseFloat(x)).toFixed(2);
					} else if (typeof(x.length) != "undefined") {
						var temp1 = "";
						if (typeof(x.length) != "undefined") {
							for( var i = 0; i < lencheck; i++) {
								console.log("x: " + x[i].textContent);
								temp = "" + x[i].textContent;
								len = temp.indexOf('$');
								if (len == -1)
									len = 0;
								temp = temp.substring(len+1,temp.length-1);
								console.log(temp);
								if(temp1 == "")
									temp1 = parseFloat(temp);
								else
									temp1 = parseFloat(temp) + temp1;
							}
							x = temp1;
							console.log(x);
						}
					}
					content = name + " " + x;
					fs.write(path, content + ',', 'a');
					console.log(content);
					page.close();
					return;
				} else{ 
					content = name + " 0";
					fs.write(path, content + ',', 'a');
					console.log("no data");
					page.close();
					return null;
				}
				//phantom.exit();
			}, 15000);	
	});
}

function mouseclick( element ) {
    // create a mouse click event
    var event = document.createEvent( 'MouseEvents' );
    event.initMouseEvent( 'click', true, true, window, 1, 0, 0 );
 
    // send click to element
    element.dispatchEvent( event );
}


