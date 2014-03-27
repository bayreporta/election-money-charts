// ------- GLOBALS ------- //
	var mayoralDB = [];
	var summaryDB = [];
	var tableDB = [];
	var tabletopOn = false;
	var maxBarWidth = 630;
	var updated = "Data Updated on 2/1/2014";
	var sectorList = ["Agribusiness","Communications","Construction","Consulting","Defense and Law Enforcement","Education","Elected Officials and Public Employees","Energy and Natural Resources","Finance, Insurance, and Real Estate","Health","Ideological/Single Issue","Labor","Lawyers and Lobbyists","Manufacturing","Misc. Business","Non-Profit","Other","Retired","Technology","Transportation"]
	var candidateDB = ["Patrick McCullough | Oaktown Data","Bryan Parker | Oaktown Data","Jean Quan | Oaktown Data","Libby Schaaf | Oaktown Data","Dan Siegel | Oaktown Data","Joe Tuman | Oaktown Data","Peter Yuan Liu | Oaktown Data","Nancy Sidebotham | Oaktown Data","Gregory Wade | Oaktown Data","Charles Ray Williams | Oaktown Data","Margaret Wrigley-Larson | Oaktown Data","Jason Kane Anderson | Oaktown Data","Courtney Ruby | Oaktown Data"]
	var currentBars = 2;
	var view = "Summary";
	var candidate; //stores which candidate page it is

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
			$("#loading h1:eq(0)").html("Tipping Dogecoin...");
		}
		else if (random === 1){
			$("#loading h1:eq(0)").html("Lubricating Political Wheels...");
		} 
		else if (random === 2){
			$("#loading h1:eq(0)").html("Dispersing Protesters...");
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
			$("#loading h1:eq(0)").html("Pillaging War Chests...");
		}
		else if (random === 7){
			$("#loading h1:eq(0)").html("Crossing T's and Dotting I's...");
		}
		else if (random === 8){
			$("#loading h1:eq(0)").html("Hacking Algorithms...");
		}
		else if (random === 9){
			$("#loading h1:eq(0)").html("Witty Loading Message...");
		}
		else if (random === 10){
			$("#loading h1:eq(0)").html("Connecting to Collective...");
		}
	});

// ------- TABLETOP ------- //
	var gsheet = "https://docs.google.com/spreadsheet/pub?key=0AnZDmytGK63SdDVyeE9ONFctMnRSU2VjanhZTUJsN1E&output=html";


	$(document).ready(function(){
			Tabletop.init( { key: gsheet,
		                     callback: setTheScene,
		                     wanted: ["admin","McCullough_Sum","Parker_Sum","Quan_Sum","Schaff_Sum","Siegel_Sum","Tuman_Sum","Liu_Sum","Sidebotham_Sum","Anderson_Sum","Wade_Sum","Williams_Sum","WL_Sum","Ruby_Sum"],
		                     debug: true } );
	});


// ------- GET AND POPULATE CANDIDATE INFO ------- //

	function setTheScene(data, tabletop){
		tabletopOn = true;
		
		$.each( tabletop.sheets("admin").all(), function(i, admin) {
			var insertRow = [];
			insertRow[0] = admin.candidate;
			insertRow[1] = admin.subhead;
			insertRow[2] = admin.link;
			insertRow[3] = admin.photo;
			insertRow[4] = admin.median;
			insertRow[5] = admin.avg;
			insertRow[6] = admin.contributions;
			insertRow[7] = admin.unique;
			insertRow[8] = admin.topemploy;
			insertRow[9] = admin.topemployamount;
			insertRow[10] = admin.summary;
			insertRow[11] = admin.updated;
			insertRow[12] = admin.rankraise;
			insertRow[13] = admin.rankspent;
			insertRow[14] = admin.list;
			insertRow[15] = admin.interface;
			mayoralDB.push(insertRow);
		});
		
		//size overview chart
		$("#cf-summary").animate({
			height:400
		});
		
		detectCandidate();
		populateSummary();

		//only grab the current candidate's info
		if (candidate === 0){
			$.each( tabletop.sheets("McCullough_Sum").all(), function(i, muccullough_sum) {
				var insertRow = [];
				insertRow[0] = muccullough_sum.info;
				insertRow[1] = parseInt(muccullough_sum.value);
				insertRow[2] = parseFloat(muccullough_sum.percent);
				summaryDB.push(insertRow);
			});
		}	
		else if (candidate === 1){
			$.each( tabletop.sheets("Parker_Sum").all(), function(i, parker_sum) {
				var insertRow = [];
				insertRow[0] = parker_sum.info;
				insertRow[1] = parseInt(parker_sum.value);
				insertRow[2] = parseFloat(parker_sum.percent);
				summaryDB.push(insertRow);
			});
		}
		else if (candidate === 2){
			$.each( tabletop.sheets("Quan_Sum").all(), function(i, quan_sum) {
				var insertRow = [];
				insertRow[0] = quan_sum.info;
				insertRow[1] = parseInt(quan_sum.value);
				insertRow[2] = parseFloat(quan_sum.percent);
				summaryDB.push(insertRow);
			});
		}
	 	else if (candidate === 3){
			$.each( tabletop.sheets("Schaff_Sum").all(), function(i, schaff_sum) {
				var insertRow = [];
				insertRow[0] = schaff_sum.info;
				insertRow[1] = parseInt(schaff_sum.value);
				insertRow[2] = parseFloat(schaff_sum.percent);
				summaryDB.push(insertRow);
			});
		}
		else if (candidate === 4){
			$.each( tabletop.sheets("Siegel_Sum").all(), function(i, siegel_sum) {
				var insertRow = [];
				insertRow[0] = siegel_sum.info;
				insertRow[1] = parseInt(siegel_sum.value);
				insertRow[2] = parseFloat(siegel_sum.percent);
				summaryDB.push(insertRow);
			});
		}
		else if (candidate === 5){
			$.each( tabletop.sheets("Tuman_Sum").all(), function(i, tuman_sum) {
				var insertRow = [];
				insertRow[0] = tuman_sum.info;
				insertRow[1] = parseInt(tuman_sum.value);
				insertRow[2] = parseFloat(tuman_sum.percent);
				summaryDB.push(insertRow);
			});
		}
		else if (candidate === 6){
			$.each( tabletop.sheets("Liu_Sum").all(), function(i, liu_sum) {
				var insertRow = [];
				insertRow[0] = liu_sum.info;
				insertRow[1] = parseInt(liu_sum.value);
				insertRow[2] = parseFloat(liu_sum.percent);
				summaryDB.push(insertRow);
			});
		}
		else if (candidate === 7){
			$.each( tabletop.sheets("Sidebotham_Sum").all(), function(i, sidebotham_sum) {
				var insertRow = [];
				insertRow[0] = sidebotham_sum.info;
				insertRow[1] = parseInt(sidebotham_sum.value);
				insertRow[2] = parseFloat(sidebotham_sum.percent);
				summaryDB.push(insertRow);
			});
		}
		/*
		else if (candidate === 8){
			$.each( tabletop.sheets("Wade_Sum").all(), function(i, wade_sum) {
				var insertRow = [];
				insertRow[0] = wade_sum.info;
				insertRow[1] = parseInt(wade_sum.value);
				insertRow[2] = parseFloat(wade_sum.percent);
				summaryDB.push(insertRow);
			});
		}
		else if (candidate === 10){
			$.each( tabletop.sheets("WL_Sum").all(), function(i, wl_sum) {
				var insertRow = [];
				insertRow[0] = wl_sum.info;
				insertRow[1] = parseInt(wl_sum.value);
				insertRow[2] = parseFloat(wl_sum.percent);
				summaryDB.push(insertRow);
			});
		}
		*/
		else if (candidate === 9){
			$.each( tabletop.sheets("Williams_Sum").all(), function(i, williams_sum) {
				var insertRow = [];
				insertRow[0] = williams_sum.info;
				insertRow[1] = parseInt(williams_sum.value);
				insertRow[2] = parseFloat(williams_sum.percent);
				summaryDB.push(insertRow);
			});
		}
		else if (candidate === 11){
			$.each( tabletop.sheets("Anderson_Sum").all(), function(i, anderson_sum) {
				var insertRow = [];
				insertRow[0] = anderson_sum.info;
				insertRow[1] = parseInt(anderson_sum.value);
				insertRow[2] = parseFloat(anderson_sum.percent);
				summaryDB.push(insertRow);
			});
		}
		else if (candidate === 12){
			$.each( tabletop.sheets("Ruby_Sum").all(), function(i, ruby_sum) {
				var insertRow = [];
				insertRow[0] = ruby_sum.info;
				insertRow[1] = parseInt(ruby_sum.value);
				insertRow[2] = parseFloat(ruby_sum.percent);
				summaryDB.push(insertRow);
			});
		}
		else {}
		
		//last updated
		$(".cf-head .cf-title h4").html(updated);
		
		//highlights
		var cashHand = commaSeparateNumber((summaryDB[0][1] - summaryDB[108][1]) + summaryDB[137][1]);
		$("#cash-hand h4").html("$" + cashHand);
		$("#raise-rank h4").html(mayoralDB[candidate][12]);
		$("#spend-rank h4").html(mayoralDB[candidate][13]);
		
		//loading
		$("#cand-intro").css("display","block");
		$("#cand-highlight").css("display","block");
		$("#cand-table").css("display","block");
		$("#cand-chart").css("visibility","visible").css("height","auto");;
		$("#loading").remove();
		
		//detect if there are contributions and react
		if (mayoralDB[candidate][15] === "No"){
			$("#cand-chart").add("#cand-highlight").remove();
			$("#cand-nointerface").css("display","block").css("border-top","10px double #4c5b52").css("padding-top","20px");
		}
		else {
			drawOverview()
		}
	
		
	}
	
// ------- DRAW CHARTS------- //	
	function drawOverview(){
		var data = [];
		var dataWidth = [];
		var commas = [];
		
		//size up data
		data[0] = summaryDB[0][1];
		commas[0] = commaSeparateNumber(summaryDB[0][1]);
		data[1] = summaryDB[142][1];
		commas[1] = commaSeparateNumber(summaryDB[142][1]);
		data[2] = summaryDB[171][1];
		commas[2] = commaSeparateNumber(summaryDB[171][1]);
		data[3] = summaryDB[172][1];
		commas[3] = commaSeparateNumber(summaryDB[172][1]);
		
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
		$("#cf-summary .cf-title h2").html("Overview of Campaign Finances 2013-14");
		$("#cf-summary .bar-data:eq(1)").css("background","#fc8d59");
		$("#cf-summary .bar-data:eq(2)").css("background","#ffffbf");
		$("#cf-summary").append("<p class=\"chart-footer\">Cash raised includes all cash raised by the candidate excluding non-monetary contributions and loans. Cash spent includes all expenses excluding accured expenses. Loans denote how much the candidate took out in loans (usually loans are paid back from contributions). Non-Cash Contributions are non-monetary gifts and services given to the candidate for their campaign, such as items to auction off in order to raise money or a landlord paying for rental space.</p>");
				
		sortBars();
	}
	
	function drawGeography(){
		var data = [];
		var dataWidth = [];
		var commas = [];
		var percent = [];

		//convert dollars
		data[0] = summaryDB[1][1]; //Oakland
		data[1] = summaryDB[2][1] - data[0]; //Bay Area minus Oakland
		data[2] = summaryDB[3][1] - (data[1] + data[0]); //California minus Bay Area
		data[3] = summaryDB[4][1]; //Outside California
		
		//data commas
		commas[0] = commaSeparateNumber(data[0]); //Oakland
		commas[1] = commaSeparateNumber(data[1]); //Bay Area minus Oakland
		commas[2] = commaSeparateNumber(data[2]); //California minus Bay Area
		commas[3] = commaSeparateNumber(data[3]); //Outside California
		
		//convert percentages
		percent[0] = (data[0] / (summaryDB[0][1] - summaryDB[5][1])) * 100; //Oakland
		percent[1] = (data[1] / (summaryDB[0][1] - summaryDB[5][1])) * 100; //Bay Area minus Oakland
		percent[2] = (data[2] / (summaryDB[0][1] - summaryDB[5][1])) * 100; //California minus Bay Area
		percent[3] = (data[3] / (summaryDB[0][1] - summaryDB[5][1])) * 100; //Outside California
		console.log(percent)
		var maxValue = Math.max.apply(null, data);
		for (i = 0 ; i < data.length ; i++){
			dataWidth[i] = (data[i] / maxValue) * maxBarWidth;
		}
		//populate data
		for (i=0 ; i < data.length ; i++){				
			$("#cf-summary .bar-row:eq(" + i + ")").attr("value",data[i]);
			$("#cf-summary .bar-data:eq(" + i + ") p").text("$" + commas[i] + " (" + Math.round(percent[i]) + "%)");
			$("#cf-summary .bar-data:eq(" + i + ")").animate({
				width:dataWidth[i]
			})
		}
		$("#cf-summary .cf-title h2").text("Where Contributions Came From");
		$("#cf-summary").append("<p class=\"chart-footer\">Bay Area contributions include contributions from all cities in the North, South and East Bay, including the Peninsula EXCLUDING Oakland. California contributions include all contributions from California EXCLUDING Bay Area.</p>");
		$("#cf-summary .bar-data:eq(0)").css("background","#2b83ba");
		$("#cf-summary .bar-data:eq(1)").css("background","#abdda4");
		$("#cf-summary .bar-data:eq(2)").css("background","#fdae61");
		$("#cf-summary .bar-data:eq(3)").css("background","#d7191c");
		
		
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
			var ii = i+6;
			data[i] = summaryDB[ii][1];
			commas[i] = commaSeparateNumber(summaryDB[ii][1]);
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

	function drawTop(){
		for (i=0 ; i < 5 ; i++){
			var topindy = [];
			var topindyamount = [];
			var topentity = [];
			var topentityamount = [];
			var topemploy = [];
			var topemployamount = [];

			topemploy = mayoralDB[candidate][8].split(",");
			topemployamount = mayoralDB[candidate][9].split(",");

			$("#top-employer li:eq(" + i + ")  span:eq(0)").html(topemploy[i]);
			$("#top-employer li:eq(" + i + ")  span:eq(1)").html(topemployamount[i]);
		}
		$("#cf-average h4").html("$" + Math.round(mayoralDB[candidate][5]));
		$("#cf-no h4").html(mayoralDB[candidate][6]);
		$("#cf-contribute").append("<p class=\"chart-footer\">Top employers include the total number of contributions from both individuals who work for the employer and contributions made by the employer itself. Contributions where a person who identified themself as Retired have been excluded from this list as it is an entire category in and of itself. Average amount per contribution based off of all reported contributions; contributions under $100 typically don't have to be reported.</p>");
	}

	function drawExpenses(){
		var data = [];
		var dataWidth = [];
		var commas = [];
		$(".bar-data").css("background","#91cf60")

		//size up data
		for (i=0 ; i < 27; i++){
			var ii = i + 144;
			data[i] = summaryDB[ii][1];
			commas[i] = commaSeparateNumber(summaryDB[ii][1]);

		}
		console.log(summaryDB)

		//get highest value in array
		var maxValue = Math.max.apply(null, data);

		//establish bar width
		for (i = 0 ; i < data.length ; i++){
			dataWidth[i] = (data[i] / maxValue) * maxBarWidth;
		}

		//populate sector data
		var x = 0; // tracks position on canvas
		for (i=0 ; i < data.length ; i++){
			$("#cf-summary .bar-row:eq(" + x + ")").attr("value",data[i]);
			$("#cf-summary .bar-data:eq(" + x + ") p").text("$" + commas[i]);
			$("#cf-summary .bar-data:eq(" + x + ")").animate({
				width:dataWidth[i]
			})
			x = x + 1;

		}
		$("#cf-summary .cf-title h2").text("Total Expenses by Type 2013-14");
		sortBars();
		var rowcount = 0;

		for (i = 0 ; i < 27 ; i++){
			var thisrow = $("#cf-summary .bar-row:eq(" + i + ")").attr("value");
			if (thisrow === "0"){
				//thisrow.remove();
			}
			else {
				rowcount = rowcount + 1;
			}
		}
		$(".bar-row[value='0']").remove();
		$("#cf-summary").animate({
			height: 160 + (rowcount * 40)
		})
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
					if (sector === "Lawyers and Lobbyists"){
						iRow = 2;
						iHeight = 240;
						iStart = 89;
					}
					else if (sector === "Construction"){
						iRow = 3;
						iHeight = 285;
						iStart = 24;
					}
					else if (sector === "Manufacturing"){
						iRow = 3;
						iHeight = 285;
						iStart = 92;
					}
					else if (sector === "Defense and Law Enforcement"){
						iRow = 4;
						iHeight = 320;
						iStart = 35;
					}
					else if (sector === "Ideological/Single Issue"){
						iRow = 4;
						iHeight = 320;
						iStart = 74;
					}
					else if (sector === "Health"){
						iRow = 4;
						iHeight = 320;
						iStart = 69;
					}
					else if (sector === "Other"){
						iRow = 4;
						iHeight = 320;
						iStart = 119;
					}
					else if (sector === "Technology"){
						iRow = 4;
						iHeight = 320;
						iStart = 131;
					}
					else if (sector === "Energy and Natural Resources"){
						iRow = 6;
						iHeight = 410;
						iStart = 53;
					}
					else if (sector === "Labor"){
						iRow = 6;
						iHeight = 410;
						iStart = 82;
					}
					else if (sector === "Education"){
						iRow = 5;
						iHeight = 370;
						iStart = 40;
					}
					else if (sector === "Transportation"){
						iRow = 6;
						iHeight = 410;
						iStart = 136;
					}
					else if (sector === "Elected Officials and Public Employees"){
						iRow = 6;
						iHeight = 410;
						iStart = 46;
					}
					else if (sector === "Agribusiness"){
						iRow = 7;
						iHeight = 455;
						iStart = 7;
					}
					else if (sector === "Communications"){
						iRow = 7;
						iHeight = 455;
						iStart = 15;
					}
					else if (sector === "Finance, Insurance, and Real Estate"){
						iRow = 8;
						iHeight = 500;
						iStart = 60;
					}
					else if (sector === "Non-Profit"){
						iRow = 8;
						iHeight = 500;
						iStart = 109;
					}
					else if (sector === "Misc. Business"){
						iRow = 10;
						iHeight = 590;
						iStart = 98;
					}
					
					
				

					//switch divs and clean canvas
					$("#cf-summary .bar-chart").css("display","none");
					$("#cf-industry .drill-bar-chart").css("display","block");
					$("#cf-summary").css("display","none");
					$("#cf-industry").css("display","block");
					$("#cf-industry .bar-row").remove();

					$("#cf-industry").animate({
						height:iHeight
					});

					//populate bars
					var e = iStart;
					for (i = 0 ; i < iRow ; i++){
						$("#cf-industry .drill-bar-chart").append("<div class=\"bar-row\" id=\"" + i + "\"><div class=\"bar-label\"><p class=\"the-label\">" + summaryDB[e][0] + "</p></div><div class=\"bar-data\"><p></p></div></div>");
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
			data[i] = summaryDB[ii][1];
			commas[i] = commaSeparateNumber(summaryDB[ii][1]);

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

// ------- DETECT CANDIDATE ------- //
	function detectCandidate(){
		/*var grabTitle = $(document).find("title").text();
		console.log(grabTitle)

		for (i = 0 ; i < candidateDB.length ; i++){
			if (grabTitle === candidateDB[i]){
				candidate = i;
			}
		}*/
		candidate = 2;
	}

// ------- POPULATE SUMMARY DATA ------- //
	function populateSummary() {
		$("#cand-header h2").html(mayoralDB[candidate][0]); //Candidate
		$("#cand-header h4").html(mayoralDB[candidate][1]); //Subtitle
		$("#cand-summary p:eq(0)").html(mayoralDB[candidate][10]); //Summary
		$("#cand-summary a:eq(0)").attr("href",mayoralDB[candidate][2]); //OaklandWiki
		$("#cand-photo img").attr("src",mayoralDB[candidate][3]); //image
		
		//Link to Sheet
		if (mayoralDB[candidate][14] === "#"){
			$("#cand-summary a:eq(1)").remove();
		}
		else {
			$("#cand-summary a:eq(1)").attr("href",mayoralDB[candidate][14]); 
		}


	}

// ------- CHART HOUSECLEANING ------- //

	function resetBars(view){
		//resort bars
		var $wrapper = $('.bar-chart'),
	        $articles = $wrapper.find('.bar-row');
	    [].sort.call($articles, function(a,b) {
	        return +$(a).attr('id') - +$(b).attr('id');
	    });
	    $articles.each(function(){
	        $wrapper.append(this);
	    });
		
		$("#cf-summary .bar-row").remove();
		$(".chart-footer").remove();
		if (view === "Sectors/Industries"){
			for (i = 0 ; i < 20 ; i++){
				$("#cf-summary .bar-chart").append("<div class=\"bar-row pointer\" id=\"" + i + "\"><div class=\"bar-label\"><p class=\"the-label\"></p></div><div class=\"bar-data\"><p></p></div></div>");
			}
		}
		else if (view === "Summary"){				
			for (i = 1 ; i < 5 ; i++){
				$("#cf-summary .bar-chart").append("<div class=\"bar-row\" style=\"cursor:none;\" id=\"" + i + "\"><div class=\"bar-label\"><p class=\"the-label\"></p></div><div class=\"bar-data\"><p></p></div></div>");
			}
		}
		else if (view === "Geography"){
			for (i = 1 ; i < 5 ; i++){
				$("#cf-summary .bar-chart").append("<div class=\"bar-row\" style=\"cursor:none;\" id=\"" + i + "\"><div class=\"bar-label\"><p class=\"the-label\"></p></div><div class=\"bar-data\"><p></p></div></div>");
			}
		}
		else if (view === "Expenses"){
			for (i = 1 ; i < 28 ; i++){
				$("#cf-summary .bar-chart").append("<div class=\"bar-row\" style=\"cursor:none;\" id=\"" + i + "\"><div class=\"bar-label\"><p class=\"the-label\"></p></div><div class=\"bar-data\"><p></p></div></div>");
			}
		}
		
	
		
	}
	
	function renameLabels(view){
		console.log(view)
		if (view === "Summary"){
			$("#cf-summary .bar-row:eq(0) .bar-label p").html("Cash Raised");
			$("#cf-summary .bar-row:eq(1) .bar-label p").html("Cash Spent");
			$("#cf-summary .bar-row:eq(2) .bar-label p").html("Loans");
			$("#cf-summary .bar-row:eq(3) .bar-label p").html("Non-Cash Contributions");
		}
		else if (view === "Geography"){
			$("#cf-summary .bar-row:eq(0) .bar-label p").html("Oakland");
			$("#cf-summary .bar-row:eq(1) .bar-label p").html("Bay Area");
			$("#cf-summary .bar-row:eq(2) .bar-label p").html("California");
			$("#cf-summary .bar-row:eq(3) .bar-label p").html("Outside California");
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
		else if (view === "Expenses"){
			for (i = 0 ; i < 27 ; i++){
				var ii = i + 144;
				$("#cf-summary .bar-row:eq(" + i + ") .bar-label p").html(summaryDB[ii][0]);
			}
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
	
	function commaSeparateNumber(val){
	    while (/(\d+)(\d{3})/.test(val.toString())){
	      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	    }
	    return val;
	}
	
// ------- CHART SHIFTING------- //
	$(document).ready(function(){
		$("#overall_options_chosen").on("click","ul > li", function(){
			view = $(this).html();
			$("#cf-summary .bar-chart").css("display","block");
			$("#cf-industry .drill-bar-chart").css("display","none");
			$("#cf-summary").css("display","block");
			$("#cf-industry").css("display","none");

			if (view === "Summary"){
				resetBars(view);
				renameLabels(view);
				$(".cf-canvas").css("display","none");
				$("#cf-summary").css("display","block").animate({
					height:400
				});
				drawOverview()
			}
			else if (view === "Top Contributors"){
				resetBars(view);
				renameLabels(view);
				$(".cf-canvas").css("display","none");
				$("#cf-contribute").css("display","block").animate({
					height:400
				});
				drawTop();
			}
			else if (view === "Geography"){
				resetBars(view);
				renameLabels(view);
				$(".cf-canvas").css("display","none");
				$("#cf-summary").css("display","block").animate({
					height:370
				});
				drawGeography();
			}
			else if (view === "Sectors/Industries"){
				resetBars(view)
				renameLabels(view);
				$(".cf-canvas").css("display","none");					
				$("#cf-summary").css("display","block").animate({
					height:1125
				});
				drawSectors()
			}
			else if (view === "Expenses"){
				resetBars(view)
				renameLabels(view);
				$(".cf-canvas").css("display","none");
				$("#cf-summary").css("display","block").animate({
					height:650
				});
				drawExpenses()
			}
		
		})
	});