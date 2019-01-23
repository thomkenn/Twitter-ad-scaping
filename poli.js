var fs = require('fs');
var content= "";
var path = 'output.csv';
var i = 0;


setInterval(function(){ 
	var d = new Date();
	d = (1 + d.getMonth()) + "-" + d.getDate();
	fs.write(path, "\n" + d + ",", 'a');
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
			try {
				var x = page.evaluate(function() {
				try {
					var len = (document.getElementsByClassName("src-components-UserSpend-styles-module--row src-components-UserSpend-styles-module--totalRow src-components-Container-styles-module--dataRow src-components-Container-styles-module--withBorder")).length;
					return document.getElementsByClassName("src-components-UserSpend-styles-module--row src-components-UserSpend-styles-module--totalRow src-components-Container-styles-module--dataRow src-components-Container-styles-module--withBorder")[len-1];
				}
				catch (error) {
					x = null;
				}
			});
			}
			catch (error)
			{
				console.log("caught");
			}
			if (x) {
				console.log("x: " + x.textContent);
				x = "" + x.textContent;
				len = x.indexOf('$');
				if (len == -1)
					len = 0;
				x = x.substring(len+1,x.length);
				x = parseFloat(x);
				content = name + " " + x;
				fs.write(path, content + ',', 'a');
				page.close();
				return;
			}
			else{ 
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


