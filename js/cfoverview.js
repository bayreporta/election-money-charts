// ------- GLOBAL ------- //
	var mayoralDB = [];
	var maxBarWidth = 630;
	var updated = "Data Updated on 2/1/2014";
	var mayoralCand = ["Patrick McCullough","Bryan Parker","Jean Quan","Libby Schaff","Dan Siegel","Joe Tuman"];
	var sectorList = ["Agribusiness","Communications","Construction","Consulting","Defense and Law Enforcement","Education","Elected Officials and Public Employees","Energy and Natural Resources","Finance, Insurance, and Real Estate","Health","Ideological/Single Issue","Labor","Lawyers and Lobbyists","Manufacturing","Misc. Business","Non-Profit","Other","Retired","Technology","Transportation"]
	var currentBars = 6;
	var view = "Cash Raised";
	
// ------- CHOSEN ------- //	
	$(document).ready(function(){
		var config = {
	      '.chosen-select'           : {},
	      '.chosen-select-deselect'  : {allow_single_deselect:true},
	      '.chosen-select-no-single' : {disable_search_threshold:10},
	      '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
	      '.chosen-select-width'     : {width:"95%"}
	    }
	    for (var selector in config) {
	      $(selector).chosen(config[selector]);
	    }
	});

// ------- FUNNY GREETINGS ------- //
	$(document).ready(function(){
		var random = Math.round(Math.random() * 10);
		if (random === 0){
			$("#loading h1:eq(0)").html("Scanning Disclosure Forms...");
		}
		else if (random === 1){
			$("#loading h1:eq(0)").html("Lubricating Political Wheels...");
		} 
		else if (random === 2){
			$("#loading h1:eq(0)").html("Connecting to DAC Central Server...");
		}
		else if (random === 3){
			$("#loading h1:eq(0)").html("Circumventing NSA Snooping...");
		}
		else if (random === 4){
			$("#loading h1:eq(0)").html("Consulting Consultants...");
		}
		else if (random === 5){
			$("#loading h1:eq(0)").html("Populating Pixels...");
		}
		else if (random === 6){
			$("#loading h1:eq(0)").html("Sizing Up War Chests...");
		}
		else if (random === 7){
			$("#loading h1:eq(0)").html("Crossing T's and Dotting I's...");
		}
		else if (random === 8){
			$("#loading h1:eq(0)").html("Verifying Accounting...");
		}
		else if (random === 9){
			$("#loading h1:eq(0)").html("Loading Stuff and Things...");
		}
		else if (random === 10){
			$("#loading h1:eq(0)").html("Communicating Telepathically...");
		}
	});

// ------- TABLETOP ------- //
	var gsheet = "https://docs.google.com/spreadsheet/pub?key=0AnZDmytGK63SdDVyeE9ONFctMnRSU2VjanhZTUJsN1E&output=html";


	$(document).ready(function(){
			Tabletop.init( { key: gsheet,
		                     callback: setTheScene,
		                     wanted: ["admin","overall"],
		                     debug: true } );
	});



// ------- GET AND POPULATE CANDIDATE INFO ------- //

	function setTheScene(data, tabletop){
		$.each( tabletop.sheets("overall").all(), function(i, overall) {
			var insertRow = [];
			insertRow[0] = overall.item;
			insertRow[1] = parseInt(overall.amount);
			mayoralDB.push(insertRow);
		});
		$(".cf-title h4").html(updated); //when last updated
		
		//loading
		$("#cf-chart").css("visibility","visible").css("height","auto");
		$("#loading").remove();
		
	
		drawSummary()
	}
	
	function drawSummary(){
		var data = [];
		var dataWidth = [];
		var commas = [];
		
		//size up data
		for (i=0 ; i < 6 ; i++){
			var ii = i+1;
			data[i] = mayoralDB[ii][1];
			commas[i] = commaSeparateNumber(mayoralDB[ii][1]);
			
		}
		
		var maxValue = Math.max.apply(null, data);
		for (i = 0 ; i < data.length ; i++){
			dataWidth[i] = (data[i] / maxValue) * maxBarWidth;
		}
		
		//populate data
		for (i=0 ; i < data.length ; i++){
			$("#cf-summary .bar-row:eq(" + i + ")").attr("value",data[i]);
			$("#cf-summary .bar-data:eq(" + i + ") p").text("$" + commas[i]);
			$("#cf-summary .bar-data:eq(" + i + ")").animate({
				width:dataWidth[i]
			})
		}
		$("#cf-summary .cf-title h2").text("Total Cash Raised 2013-14");
		$("#cf-summary").append("<h4 class=\"chart-h4\">$" + commaSeparateNumber(data[0] + data[1] + data[2] + data[3] + data[4] + data[5]) + " contributed total</h4>");
		$("#cf-summary").append("<p class=\"chart-footer\">Cash raised includes all cash raised by the candidate excluding non-monetary contributions and loans.</p>");
		sortBars();
	}
	
	function drawSpent(){
		var data = [];
		var dataWidth = [];
		var commas = [];
		
		//size up data
		for (i=0 ; i < 6 ; i++){
			var ii = i+8;
			data[i] = mayoralDB[ii][1];
			commas[i] = commaSeparateNumber(mayoralDB[ii][1]);
			
		}
		
		var maxValue = Math.max.apply(null, data);
		for (i = 0 ; i < data.length ; i++){
			dataWidth[i] = (data[i] / maxValue) * maxBarWidth;
		}
		
		//populate data
		for (i=0 ; i < data.length ; i++){
			$("#cf-summary .bar-row:eq(" + i + ")").attr("value",data[i]);
			$("#cf-summary .bar-data:eq(" + i + ") p").text("$" + commas[i]);
			$("#cf-summary .bar-data:eq(" + i + ")").animate({
				width:dataWidth[i]
			})
		}
		$("#cf-summary .bar-data").css("background","#fc8d59");
		$("#cf-summary .cf-title h2").text("Total Cash Spent 2013-14");
		$("#cf-summary").append("<h4 class=\"chart-h4\" style=\"color:#fc8d59;\">$" + commaSeparateNumber(data[0] + data[1] + data[2] + data[3] + data[4] + data[5]) + " spent total</h4>");
		$("#cf-summary").append("<p class=\"chart-footer\">Cash spent includes all expenses excluding accured expenses.</p>");
		sortBars();
	}
	
	function drawSectors(){
		var data = [];
		var dataWidth = [];
		var commas = [];

		//reset color
		$(".bar-data").css("background","#91cf60");

		//size up data
		for (i=0 ; i < 136 ; i++){
			var ii = i+14;
			data[i] = mayoralDB[ii][1];
			commas[i] = commaSeparateNumber(mayoralDB[ii][1]);
		}

		//get highest value in array
		var maxValue = Math.max.apply(null, data);
		
		//establish bar width
		for (i = 0 ; i < data.length ; i++){
			dataWidth[i] = (data[i] / maxValue) * maxBarWidth;
		}

		//populate sector data
		var x = 0; // tracks position on canvas
		for (i=0 ; i < data.length ; i++){
			if ( i === 0 || i === 8 ||i === 17 ||i === 21 || i === 28 || i === 33 || i === 39 || i === 46 || i === 53 || i === 62 || i === 67 || i === 75 || i === 82 || i === 85 || i === 91 || i === 102 || i === 112 || i === 117 || i === 124 || i === 129 ){
				$("#cf-summary .bar-row:eq(" + x + ")").attr("value",data[i]);
				$("#cf-summary .bar-data:eq(" + x + ") p").text("$" + commas[i]);
				$("#cf-summary .bar-data:eq(" + x + ")").animate({
					width:dataWidth[i]
				})
				x = x + 1;
			}
		}
		$("#cf-summary .cf-title h2").html("Total Contributions by Sector/Industry 2013-14<br>(click on bar to drill down)");
		$("#cf-summary").append("<p class=\"chart-footer\">Sector and industry classifications are the result of an analysis of contributors and best reflects the type of business an employer is engaged in. The classifications may change after further analysis is conducted.</p>");
		sortBars();
	}
	
	function drawGeography(){
			var data = [];
			var dataWidth = [];
			var total = [];
			var commas = [];
			

			//size up data
			for (i=0 ; i < 24 ; i++){
				var ii = i+205;
				data[i] = mayoralDB[ii][1];
				commas[i] = commaSeparateNumber(mayoralDB[ii][1]);
			}
			
			var ii= 0;
			var iii = 1;
			var iv = 2;
			var v = 3;
			for (i=0 ; i < 6 ; i++){
				total[i] = (data[ii] + data[iii] + data[iv] + data[v]);
				ii = ii + 4;
				iii = iii +4;
				iv = iv +4;
				v = v +4;
			}
			

			//populate data
			$("#cf-stacked .stacked-bar-row:eq(0)").attr("value",((data[0] / total[0]) * 100));
			$("#cf-stacked .stacked-bar-row:eq(1)").attr("value",((data[4] / total[1]) * 100));
			$("#cf-stacked .stacked-bar-row:eq(2)").attr("value",((data[8] / total[2]) * 100));
			$("#cf-stacked .stacked-bar-row:eq(3)").attr("value",((data[12] / total[3]) * 100));
			$("#cf-stacked .stacked-bar-row:eq(4)").attr("value",((data[16] / total[4]) * 100));
			$("#cf-stacked .stacked-bar-row:eq(5)").attr("value",((data[20] / total[5]) * 100));
			
			ii=0
			iii = 1;
			iv = 2;
			v = 3;
			for (i=0 ; i < 6 ; i++){
				$("#cf-stacked .bar-data:eq(" + i + ") .bar-seg:eq(0)").animate({
					width:((data[ii] / total[i]) * 100) + "%"
				})
				$("#cf-stacked .bar-data:eq(" + i + ") .bar-seg:eq(0)").caltip({
					title:"Oakland",
					content:"$" + commas[ii] + " (" + Math.round(((data[ii] / total[i]) * 100)) + "%" + ")"
				})
				$("#cf-stacked .bar-data:eq(" + i + ") .bar-seg:eq(1)").animate({
					width:((data[iii] / total[i]) * 100) + "%"
				})
				$("#cf-stacked .bar-data:eq(" + i + ") .bar-seg:eq(1)").caltip({
					title:"Bay Area",
					content:"$" + commas[iii] + " (" + Math.round(((data[iii] / total[i]) * 100)) + "%" + ")"
				})
				$("#cf-stacked .bar-data:eq(" + i + ") .bar-seg:eq(2)").animate({
					width:((data[iv] / total[i]) * 100) + "%"
				})
				$("#cf-stacked .bar-data:eq(" + i + ") .bar-seg:eq(2)").caltip({
					title:"California",
					content:"$" + commas[iv] + " (" + Math.round(((data[iv] / total[i]) * 100)) + "%" + ")"
				})
				$("#cf-stacked .bar-data:eq(" + i + ") .bar-seg:eq(3)").animate({
					width:((data[v] / total[i]) * 100) + "%"
				})
				$("#cf-stacked .bar-data:eq(" + i + ") .bar-seg:eq(3)").caltip({
					title:"Outside California",
					content:"$" + commas[v] + " (" + Math.round(((data[v] / total[i]) * 100)) + "%" + ")"
				})
				ii = ii + 4;
				iii = iii +4;
				iv = iv +4;
				v = v +4;
			}
			//adjust for siegel
			$("#cf-stacked .stacked-bar-row:eq(4)").remove();
			$("#cf-stacked").append("<p class=\"chart-footer\">Bay Area contributions include contributions from all cities in the North, South and East Bay, including the Peninsula EXCLUDING Oakland. California contributions include all contributions from California EXCLUDING Bay Area. Candidates with no contributions excluded from chart.</p>");
			sortGeo();
	}
	
	function resetBars(view){
		//reset text and colors for chart
		$(".chart-h4").remove();
		$(".chart-footer").remove();
		$(".bar-row").remove();
		
		if (view === "Sectors/Industries"){
			for (i = 1 ; i < 20 ; i++){
				$("#cf-summary .bar-chart").append("<div class=\"bar-row pointer\" id=\"" + i + "\"><div class=\"bar-label\"><p class=\"the-label\"></p></div><div class=\"bar-data\"><p></p></div></div>");
			}
		}
		else if (view === "Cash Raised"){
			for (i = 1 ; i < 7 ; i++){
				$("#cf-summary .bar-chart").append("<div class=\"bar-row\" id=\"" + i + "\"><div class=\"bar-label\"><p class=\"the-label\"></p></div><div class=\"bar-data\"><p></p></div></div>");
			}
		}
		else if (view === "Cash Spent"){
			for (i = 1 ; i < 7 ; i++){
				$("#cf-summary .bar-chart").append("<div class=\"bar-row\" id=\"" + i + "\"><div class=\"bar-label\"><p class=\"the-label\"></p></div><div class=\"bar-data\"><p></p></div></div>");
			}
		}		
	}
	
	function renameLabels(view){
		console.log(view)
		if (view === "Cash Raised" || view === "Cash Spent"){
			$("#cf-summary .bar-row:eq(0) .bar-label p").html(mayoralCand[0]);
			$("#cf-summary .bar-row:eq(1) .bar-label p").html(mayoralCand[1]);
			$("#cf-summary .bar-row:eq(2) .bar-label p").html(mayoralCand[2]);
			$("#cf-summary .bar-row:eq(3) .bar-label p").html(mayoralCand[3]);
			$("#cf-summary .bar-row:eq(4) .bar-label p").html(mayoralCand[4]);
			$("#cf-summary .bar-row:eq(5) .bar-label p").html(mayoralCand[5]);
		}
		else if (view === "Sectors/Industries" ){
			$("#cf-summary .bar-row:eq(0) .bar-label p").html(sectorList[0]);
			$("#cf-summary .bar-row:eq(1) .bar-label p").html(sectorList[1]);
			$("#cf-summary .bar-row:eq(2) .bar-label p").html(sectorList[2]);
			$("#cf-summary .bar-row:eq(3) .bar-label p").html(sectorList[3]);
			$("#cf-summary .bar-row:eq(4) .bar-label p").html(sectorList[4]);
			$("#cf-summary .bar-row:eq(5) .bar-label p").html(sectorList[5]);
			$("#cf-summary .bar-row:eq(6) .bar-label p").html(sectorList[6]);
			$("#cf-summary .bar-row:eq(7) .bar-label p").html(sectorList[7]);
			$("#cf-summary .bar-row:eq(8) .bar-label p").html(sectorList[8]);
			$("#cf-summary .bar-row:eq(9) .bar-label p").html(sectorList[9]);
			$("#cf-summary .bar-row:eq(10) .bar-label p").html(sectorList[10]);
			$("#cf-summary .bar-row:eq(11) .bar-label p").html(sectorList[11]);
			$("#cf-summary .bar-row:eq(12) .bar-label p").html(sectorList[12]);
			$("#cf-summary .bar-row:eq(13) .bar-label p").html(sectorList[13]);
			$("#cf-summary .bar-row:eq(14) .bar-label p").html(sectorList[14]);
			$("#cf-summary .bar-row:eq(15) .bar-label p").html(sectorList[15]);
			$("#cf-summary .bar-row:eq(16) .bar-label p").html(sectorList[16]);
			$("#cf-summary .bar-row:eq(17) .bar-label p").html(sectorList[17]);
			$("#cf-summary .bar-row:eq(18) .bar-label p").html(sectorList[18]);
			$("#cf-summary .bar-row:eq(19) .bar-label p").html(sectorList[19]);
			$("#cf-summary .bar-row:eq(20) .bar-label p").html(sectorList[20]);
		}
	}
		
	function sortBars(){
		var $wrapper = $('.bar-chart'),
	        $articles = $wrapper.find('.bar-row');
	    [].sort.call($articles, function(a,b) {
	        return +$(b).attr('value') - +$(a).attr('value');
	    });
	    $articles.each(function(){
	        $wrapper.append(this);
	    });
	}
	
	function sortIndustry(){
		var $wrapper = $('.drill-bar-chart'),
	        $articles = $wrapper.find('.bar-row');
	    [].sort.call($articles, function(a,b) {
	        return +$(b).attr('value') - +$(a).attr('value');
	    });
	    $articles.each(function(){
	        $wrapper.append(this);
	    });
	}
	
	function sortGeo(){
		var $wrapper = $('.stacked-bar-chart'),
	        $articles = $wrapper.find('.stacked-bar-row');
	    [].sort.call($articles, function(a,b) {
	        return +$(b).attr('value') - +$(a).attr('value');
	    });
	    $articles.each(function(){
	        $wrapper.append(this);
	    });
	}

// ------- COMMAS!!------- //

	function commaSeparateNumber(val){
	    while (/(\d+)(\d{3})/.test(val.toString())){
	      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	    }
	    return val;
	}

// ------- SECTOR/INDUSTRY DRILLDOWN------- //
	$(document).ready(function(){
		$("#cf-summary .bar-chart").on("click",".bar-row", function(){
			var sector = $(this).find(".bar-label p").html();
			var iRow, iHeight, iStart;
			
			if (view === "Sectors/Industries"){
				if (sector === "Retired" || sector === "Consulting"){
					return;
				}
				else {
					//establish number of industries
					if (sector === "Agribusiness"){
						iRow = 7;
						iHeight = 455;
						iStart = 15;
					}
					else if (sector === "Communications"){
						iRow = 7;
						iHeight = 455;
						iStart = 23;
					}
					else if (sector === "Construction"){
						iRow = 3;
						iHeight = 285;
						iStart = 32;
					}
					else if (sector === "Defense and Law Enforcement"){
						iRow = 4;
						iHeight = 320;
						iStart = 29;
					}
					else if (sector === "Technology"){
						iRow = 4;
						iHeight = 320;
						iStart = 139;
					}
					else if (sector === "Education"){
						iRow = 5;
						iHeight = 370;
						iStart = 48;
					}
					else if (sector === "Elected Officials and Public Employees"){
						iRow = 6;
						iHeight = 410;
						iStart = 54;
					}
					else if (sector === "Energy and Natural Resources"){
						iRow = 6;
						iHeight = 410;
						iStart = 61;
					}
					else if (sector === "Finance, Insurance, and Real Estate"){
						iRow = 8;
						iHeight = 500;
						iStart = 68;
					}
					else if (sector === "Health"){
						iRow = 4;
						iHeight = 320;
						iStart = 77;
					}
					else if (sector === "Ideological/Single Issue"){
						iRow = 4;
						iHeight = 320;
						iStart = 82;
					}
					else if (sector === "Labor"){
						iRow = 6;
						iHeight = 410;
						iStart = 90;
					}
					else if (sector === "Lawyers and Lobbyists"){
						iRow = 2;
						iHeight = 240;
						iStart = 97;
					}
					else if (sector === "Manufacturing"){
						iRow = 3;
						iHeight = 285;
						iStart = 100;
					}
					else if (sector === "Misc. Business"){
						iRow = 10;
						iHeight = 590;
						iStart = 106;
					}
					else if (sector === "Non-Profit"){
						iRow = 8;
						iHeight = 500;
						iStart = 117;
					}
					else if (sector === "Other"){
						iRow = 4;
						iHeight = 320;
						iStart = 127;
					}
					else if (sector === "Transportation"){
						iRow = 6;
						iHeight = 410;
						iStart = 144;
					}
					
					//switch divs and clean canvas
					$("#cf-summary .bar-chart").css("display","none");
					$("#cf-industry .drill-bar-chart").css("display","block");
					$("#cf-summary").css("display","none");
					$("#cf-industry").css("display","block");
					$("#cf-industry .bar-row").remove();

					$("#cf-summary").animate({
						height:iHeight
					});

					//populate bars
					var e = iStart;
					for (i = 0 ; i < iRow ; i++){
						$("#cf-industry .drill-bar-chart").append("<div class=\"bar-row\" id=\"" + i + "\"><div class=\"bar-label\"><p class=\"the-label\">" + mayoralDB[e][0] + "</p></div><div class=\"bar-data\"><p></p></div></div>");
						e = e + 1;
					}
					drawIndustry(iStart, iRow);
					
				}
			}
			else {
				return;
			}
			
		});
	});
	
	function drawIndustry(iStart, iRow){
		var data = [];
		var dataWidth = [];
		var commas = [];
		
		//size up data
		for (i=0 ; i < iRow ; i++){
			var ii = i+iStart;
			console.log(iStart)
			data[i] = mayoralDB[ii][1];
			commas[i] = commaSeparateNumber(mayoralDB[ii][1]);
			
		}
		
		var maxValue = Math.max.apply(null, data);
		for (i = 0 ; i < data.length ; i++){
			dataWidth[i] = (data[i] / maxValue) * maxBarWidth;
		}
		
		//populate data
		for (i=0 ; i < data.length ; i++){
			$("#cf-industry .bar-row:eq(" + i + ")").attr("value",data[i]);
			$("#cf-industry .bar-data:eq(" + i + ") p").text("$" + commas[i]);
			$("#cf-industry .bar-data:eq(" + i + ")").animate({
				width:dataWidth[i]
			})

		
		}
		$("#cf-industry .cf-title h2").text(view + " Drilldown 2013-14");
		sortIndustry();
	}


// ------- CHART BACK TO SECTOR FROM INDUSTRY------- //
	$(document).ready(function(){
		$(".cf-detail").on("click", function(){
			$("#cf-summary .bar-chart").css("display","block");
			$("#cf-industry .drill-bar-chart").css("display","none");
			$("#cf-summary").css("display","block");
			$("#cf-industry").css("display","none");
			resetBars(view)
			renameLabels(view);
			$(".cf-canvas").css("display","none");					
			$("#cf-summary").css("display","block").animate({
				height:1125
			});
			drawSectors()
		})
	});
	
// ------- CHART SHIFTING------- //
	$(document).ready(function(){
		$("#overall_options_chosen").on("click","ul > li", function(){
			view = $(this).html(); //detect view
			
			//magically hide and show chart divs
			$("#cf-summary .bar-chart").css("display","block");
			$("#cf-industry .drill-bar-chart").css("display","none");
			$("#cf-summary").css("display","block");
			$("#cf-industry").css("display","none");
			
			//Change view
			if (view === "Cash Raised"){
				resetBars(view);
				renameLabels(view);
				$(".cf-canvas").css("display","none");
				$("#cf-summary").css("display","block").animate({
					height:500
				});
				drawSummary()
			}
			else if (view === "Top Contributors"){
				resetBars(view);
				renameLabels(view);
				$(".cf-canvas").css("display","none");
				$("#cf-contribute").css("display","block").animate({
					height:400
				});
				$("#cf-contribute").append("<p class=\"chart-footer\">Top employers include the total number of contributions from both individuals who work for the employer and contributions made by the employer itself. Contributions where a person who identified themself as Retired have been excluded from this list as it is an entire category in and of itself. Average amount per contribution based off of all reported contributions; contributions under $100 typically don't have to be reported.</p>");
			}
			else if (view === "Geography"){
				$(".cf-canvas").css("display","none");
				$("#cf-stacked").css("display","block").animate({
					height:420
				});
				drawGeography();
			}
			else if (view === "Sectors/Industries"){
				resetBars(view)
				renameLabels(view);
				$(".cf-canvas").css("display","none");					
				$("#cf-summary").css("display","block").animate({
					height:1075
				});
				drawSectors()
			}
			else if (view === "Cash Spent"){
				resetBars(view)
				renameLabels(view);
				$(".cf-canvas").css("display","none");
				$("#cf-summary").css("display","block").animate({
					height:500
				});
				drawSpent()
			}
			else if (view === "Achievements"){
				$(".cf-canvas").css("display","none");
				$("#cf-achieve").css("display","block").animate({
					height:300
				});
			}
		})
	});
