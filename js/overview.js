	// ------- GLOBAL ------- //
		//input dimensions for graphic
		var dimensions = {
			overall:550, //entire app size
			label:125, //labels for bars
			maxBarWidth:400 //max bar length
		}
		//input options for stacked bar graphs
		var stackedControl = {
			geography:{
				footer:"Contributions shown here refer to itemized contributions with a location attached. Humboldt refers to all donations from incorporated and unincorporated communities in Humboldt County. California contributions include all contributions from California EXCLUDING Humboldt County. Numbers may not add up to 100% due to rounding.",
				legendItems:3,
				legendLabels:["Humboldt","California","Elsewhere"],
				legendColor:["#91cf60","#5FADCE","#CE5F75"],
				legendBars:{
					two:"<div class=\"stacked-bar-row\" id=\"0\"><div class=\"bar-label\"><p class=\"the-label\"></p></div><div class=\"bar-data\"><div id=\"geo1\" class=\"bar-seg\"></div><div id=\"geo2\" class=\"bar-seg\"></div></div>",
					three:"<div class=\"stacked-bar-row\" id=\"0\"><div class=\"bar-label\"><p class=\"the-label\"></p></div><div class=\"bar-data\"><div id=\"geo1\" class=\"bar-seg\"></div><div id=\"geo2\" class=\"bar-seg\"></div><div id=\"geo3\" class=\"bar-seg\"></div></div></div>",
					four:"<div class=\"stacked-bar-row\" id=\"0\"><div class=\"bar-label\"><p class=\"the-label\"></p></div><div class=\"bar-data\"><div id=\"geo1\" class=\"bar-seg\"></div><div id=\"geo2\" class=\"bar-seg\"></div><div id=\"geo3\" class=\"bar-seg\"></div><div id=\"geo4\" class=\"bar-seg\"></div></div></div>"
				}
			}	
		}
		var raceTotal = [8,4,2,2]; //manually enter the number of candidates for each race, in order you placed in list above
		var raceColumns = [2,6,2,4]; // manually enter the column where this race data starts on the Summary sheet of GSheet
		var gsheet = "https://docs.google.com/spreadsheet/pub?key=0AnZDmytGK63SdFo3Tnl5cmpnZXUydVloYUZSZnR5RHc&output=html"; 
		var candidateDB = [], mainDB = []; //stores all summary data
		var updated = "3/17/2014"; //when was the data updated?
		var view = "Summary"; //leave default
		var race = 0; //leave default
		var stacked = 0; //leave default
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
	// ------- ADJUST DIMENSIONS ------- //
	$(document).ready(function(){
		$("#loading").add("#cf-container").add("#cf-options").add("#cf-chart").add("#cf-legend").add(".stacked-bar-chart").add("#cand-highlight").add("#cf-options").add("#cf-choose").add("#cf-contribute").add(".bar-chart").add(".cf-stack-head").add(".cf-head").add(".cf-title").add("#cf-summary").add("#cf-overview").add(".summary-row").css("width",dimensions.overall);
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
			$("#loading h1:eq(0)").html("Connecting to Central Server...");
		}
		else if (random === 3){
			$("#loading h1:eq(0)").html("Circumventing NSA Snooping...");
		}
		else if (random === 4){
			$("#loading h1:eq(0)").html("Consulting Consultants...");
		}
		else if (random === 5){
			$("#loading h1:eq(0)").html("Populating Plazoids...");
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
			$("#loading h1:eq(0)").html("Handshaking Good Ole Boys...");
		}
		else if (random === 10){
			$("#loading h1:eq(0)").html("Communicating Telepathically...");
		}
	});
// ------- TABLETOP ------- //
	$(document).ready(function(){
			Tabletop.init( { key: gsheet,
		                     callback: setTheScene,
		                     wanted: ["Summary","Main"],
		                     debug: true } );
	});
// ------- GET AND POPULATE CANDIDATE INFO ------- //
	function setTheScene(data, tabletop){
		//pull spreadsheet data into arrays
		$.each( tabletop.sheets("Summary").all(), function(i, summary) {
			var insertRow = [];
			insertRow[0] = summary.category;
			insertRow[1] = summary.all;
			insertRow[2] = summary.bass;
			insertRow[3] = summary.kerrigan;
			insertRow[4] = summary.latour;
			insertRow[5] = summary.sundberg;
			insertRow[6] = summary.dollison;
			insertRow[7] = summary.firpo;
			insertRow[8] = summary.fleming;
			insertRow[9] = summary.klein;
			candidateDB.push(insertRow);
		});
		
		$.each( tabletop.sheets("Main").all(), function(i, main) {
			var insertRow = [];
			insertRow[0] = main.item;
			insertRow[1] = main.all;
			insertRow[2] = main.bass;
			insertRow[3] = main.kerrigan;
			insertRow[4] = main.latour;
			insertRow[5] = main.sundberg;
			insertRow[6] = main.dollison;
			insertRow[7] = main.firpo;
			insertRow[8] = main.fleming;
			insertRow[9] = main.klein;
			mainDB.push(insertRow);
		});			
		
		//when last updated
		$(".cf-title h4").html("Data Updated on " + updated); 

		//loading
		$("#cf-chart").css("visibility","visible").css("height","auto");
		$("#loading").remove();
		
		//draw first chart
		resetSummaryBars(view);
		renameSummaryLabels(view);
		$(".bar-label").css("width",dimensions.label);
		$(".cf-canvas").css("display","none");
		$("#cf-overview").css("display","block");
		drawSummary();
	}
	
	function drawSummary(){
		var data = [];
		//size up data
		var ii = raceColumns[race];				
		for (i=0 ; i < raceTotal[race]; i++){
			var temp = parseInt(mainDB[22][ii]);
			$(".summary-row:eq("+i+")").attr("value",temp);
			data[i] = new Array();
			data[i][0] = "$" + commaSeparateNumber(temp);
			switch(race){
				case 0:
					data[i][1] = mainDB[23][ii];
					data[i][2] = mainDB[25][ii];
					break;
				case 1:
					data[i][1] = mainDB[24][ii];
					data[i][2] = mainDB[26][ii];
					break;
				case 2:
					data[i][1] = mainDB[24][ii];
					data[i][2] = mainDB[26][ii];
					break;
				case 3:
					data[i][1] = mainDB[24][ii];
					data[i][2] = mainDB[26][ii];
					break;
			}
			ii = ii + 1;
		}
		
		//populate data
		for (i=0 ; i < data.length ; i++){
			$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(1) p:eq(0)").html(data[i][0]);
			$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(2) p:eq(0)").html(data[i][1]);
			$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(3) p:eq(0)").html(data[i][2]);
			
			//Ranking colors
			if (data[i][1] === "1st"){
				$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(2) p:eq(0)").css("color","#91cf60");
			}
			else if (data[i][1] === "2nd" || data[i][1] === "3rd"){
				$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(2) p:eq(0)").css("color","#5FADCE");
			}
			else {
				$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(2) p:eq(0)").css("color","#CE5F75");
			}
			if (data[i][2] === "1st"){
				$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(3) p:eq(0)").css("color","#91cf60");
			}
			else if (data[i][2] === "2nd" || data[i][2] === "3rd"){
				$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(3) p:eq(0)").css("color","#5FADCE");
			}
			else {
				$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(3) p:eq(0)").css("color","#CE5F75");
			}
		}
		sortSummary();
	}

	function drawTopDonors(){
		var data = [];
		//size up data
		var ii = raceColumns[race];				
		for (i=0 ; i < raceTotal[race]; i++){
			data[i] = new Array();
			data[i][0] = mainDB[10][ii];
			data[i][1] = "$" + commaSeparateNumber(parseInt(mainDB[9][ii]));
			data[i][2] = mainDB[28][ii];
			data[i][3] = "$" + commaSeparateNumber(parseInt(mainDB[27][ii]));
			data[i][4] = mainDB[30][ii];
			data[i][5] = "$" + commaSeparateNumber(parseInt(mainDB[29][ii]));
			data[i][6] = mainDB[12][ii];
			data[i][7] = "$" + commaSeparateNumber(parseInt(mainDB[11][ii]));
			data[i][8] = mainDB[14][ii];
			data[i][9] = "$" + commaSeparateNumber(parseInt(mainDB[13][ii]));
			data[i][10] = mainDB[16][ii];
			data[i][11] = "$" + commaSeparateNumber(parseInt(mainDB[15][ii]));
			ii = ii + 1;
		}
		
		//populate data
		for (i=0 ; i < data.length ; i++){
			$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(1) p:eq(0) span:eq(0)").html(data[i][0]);
			$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(1) p:eq(0) span:eq(1)").html(data[i][1]);
			$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(1) p:eq(1) span:eq(0)").html(data[i][2]);
			$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(1) p:eq(1) span:eq(1)").html(data[i][3]);
			$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(1) p:eq(2) span:eq(0)").html(data[i][4]);
			$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(1) p:eq(2) span:eq(1)").html(data[i][5]);
			$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(2) p:eq(0) span:eq(0)").html(data[i][6]);
			$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(2) p:eq(0) span:eq(1)").html(data[i][7]);
			$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(2) p:eq(1) span:eq(0)").html(data[i][8]);
			$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(2) p:eq(1) span:eq(1)").html(data[i][9]);
			$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(2) p:eq(2) span:eq(0)").html(data[i][10]);
			$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(2) p:eq(2) span:eq(1)").html(data[i][11]);		
			
			var $a = $("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(1) p:eq(0) span:eq(1)").html();
			var $b = $("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(1) p:eq(1) span:eq(1)").html();
			var $c = $("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(1) p:eq(2) span:eq(1)").html();
			var $d = $("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(2) p:eq(0) span:eq(1)").html();
			var $e = $("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(2) p:eq(1) span:eq(1)").html();
			var $f = $("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(2) p:eq(2) span:eq(1)").html();
			
			if ($a === "$NaN"){
				$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(1) p:eq(0) span:eq(1)").remove();
			}
			if ($b === "$NaN"){
				$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(1) p:eq(1) span:eq(1)").remove();
			}
			if ($c === "$NaN"){
				$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(1) p:eq(2) span:eq(1)").remove();
			}
			if ($d === "$NaN"){
				$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(2) p:eq(0) span:eq(1)").remove();
			}
			if ($e === "$NaN"){
				$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(2) p:eq(1) span:eq(1)").remove();
			}
			if ($f === "$NaN"){
				$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(2) p:eq(2) span:eq(1)").remove();
			}
				
		}			
		if ($("#cf-donors .donor-row .donor-cell p span").html() === "$NaN"){
			$("#cf-donors .donor-row:eq("+ i +") .donor-cell p").remove();
		}		
	}
	
	function drawContributions(){
		var data = [];
		var all = 0;
		var dataWidth = [];
		var commas = [];

		//size up data
		var ii = raceColumns[race];
		for (i=0 ; i < raceTotal[race]; i++){
			data[i] = parseInt(candidateDB[5][ii]) + parseInt(candidateDB[11][ii]);
			commas[i] = commaSeparateNumber(data[i]);
			ii = ii + 1;
		}

		//find total
		for (i=0 ; i < data.length ; i++){
			all = all + data[i]
		}
		
		//find highest value in array
		var maxValue = Math.max.apply(null, data);
		
		//figure out the width for each bar
		for (i = 0 ; i < data.length ; i++){
			dataWidth[i] = (data[i] / maxValue) * dimensions.maxBarWidth;
		}

		//populate data
		for (i=0 ; i < data.length ; i++){
			$("#cf-summary .bar-row:eq(" + i + ")").attr("value",data[i]);
			$("#cf-summary .bar-data:eq(" + i + ") p").text("$" + commas[i]);
			$("#cf-summary .bar-data:eq(" + i + ")").animate({
				width:dataWidth[i]
			})
		}
		
		//meta
		$(".bar-data").css("background","#91cf60");
		$("#cf-summary .cf-title h2").text("Total Cash Raised 2013-14");
		$("#cf-summary").append("<h4 class=\"chart-h4\">$" + commaSeparateNumber(all) + " contributed total</h4>");
		$("#cf-summary").append("<p class=\"chart-footer\">Cash raised includes all cash raised by the candidate excluding non-monetary contributions and loans, but including miscellaneous increases in cash, usually from auctioning items given to a candidate through non-monetary contributions.</p>");
		sortBars();
	}

	function drawLoans(){
		var data = [];
		var all = 0;
		var dataWidth = [];
		var commas = [];

		//size up data
		var ii = raceColumns[race];
		for (i=0 ; i < raceTotal[race]; i++){
			data[i] = parseInt(candidateDB[12][ii]);
			commas[i] = commaSeparateNumber(data[i]);
			ii = ii + 1;
		}
		console.log(data)
		//find total
		for (i=0 ; i < data.length ; i++){
			all = all + data[i]
		}
		
		//find highest value in array
		var maxValue = Math.max.apply(null, data);
		
		//figure out the width for each bar
		for (i = 0 ; i < data.length ; i++){
			dataWidth[i] = (data[i] / maxValue) * dimensions.maxBarWidth;
		}

		//populate data
		for (i=0 ; i < data.length ; i++){
			$("#cf-summary .bar-row:eq(" + i + ")").attr("value",data[i]);
			$("#cf-summary .bar-data:eq(" + i + ") p").text("$" + commas[i]);
			$("#cf-summary .bar-data:eq(" + i + ")").animate({
				width:dataWidth[i]
			})
		}
		
		
		//meta
		$(".bar-data").css("background","#5FADCE");
		$("#cf-summary .cf-title h2").text("Loans: 2013-14");
		$("#cf-summary").append("<h4 class=\"chart-h4\" style=\"color:#5FADCE;>$" + commaSeparateNumber(all) + " contributed total</h4>");
		$("#cf-summary").append("<p class=\"chart-footer\">A candidate or others can loan money to a committee, but that loan must be paid off by a predesignated time, such as through contributions.</p>");
		sortBars();
	}

	function drawRetired(){
		var data = [];
		var all = 0;
		var dataWidth = [];
		var commas = [];

		//size up data
		var ii = raceColumns[race];
		for (i=0 ; i < raceTotal[race]; i++){
			data[i] = parseInt(mainDB[21][ii]);
			commas[i] = commaSeparateNumber(data[i]);
			ii = ii + 1;
		}
		//find total
		for (i=0 ; i < data.length ; i++){
			all = all + data[i]
		}
		
		//find highest value in array
		var maxValue = Math.max.apply(null, data);
		
		//figure out the width for each bar
		for (i = 0 ; i < data.length ; i++){
			dataWidth[i] = (data[i] / maxValue) * dimensions.maxBarWidth;
		}

		//populate data
		for (i=0 ; i < data.length ; i++){
			$("#cf-summary .bar-row:eq(" + i + ")").attr("value",data[i]);
			$("#cf-summary .bar-data:eq(" + i + ") p").text("$" + commas[i]);
			$("#cf-summary .bar-data:eq(" + i + ")").animate({
				width:dataWidth[i]
			})
		}
		
		//meta
		$(".bar-data").css("background","#91cf60");
		$("#cf-summary .cf-title h2").text("Total Cash from Retirees: 2013-14");
		$("#cf-summary").append("<h4 class=\"chart-h4\">$" + commaSeparateNumber(all) + " contributed total</h4>");
		$("#cf-summary").append("<p class=\"chart-footer\">This includes all reported contributions and miscellaneous increases to cash from people who identified themselves as Retired.</p>");
		sortBars();
	}

	function drawSpent(){
		var data = [];
		var all = 0;
		var dataWidth = [];
		var commas = [];

		//size up data
		var ii = raceColumns[race];
		for (i=0 ; i < raceTotal[race] ;  i++){
			data[i] = parseInt(candidateDB[20][ii]);
			commas[i] = commaSeparateNumber(data[i]);
			ii = ii + 1;
		}

		//find total
		for (i=0 ; i < data.length ; i++){
			all = all + data[i]
		}
		
		//find highest value in array
		var maxValue = Math.max.apply(null, data);
		
		//figure out the width for each bar
		for (i = 0 ; i < data.length ; i++){
			dataWidth[i] = (data[i] / maxValue) * dimensions.maxBarWidth;
			console.log(dataWidth[i])
		}

		//populate data
		for (i=0 ; i < data.length ; i++){
			$("#cf-summary .bar-row:eq(" + i + ")").attr("value",data[i]);
			$("#cf-summary .bar-data:eq(" + i + ") p").text("$" + commas[i]);
			$("#cf-summary .bar-data:eq(" + i + ")").animate({
				width:dataWidth[i]
			})
		}
		
		$("#cf-summary .bar-data").css("background","#CE5F75");
		$("#cf-summary .cf-title h2").text("Total Cash Spent 2013-14");
		$("#cf-summary").append("<h4 class=\"chart-h4\" style=\"color:#CE5F75;\">$" + commaSeparateNumber(all) + " spent total</h4>");
		$("#cf-summary").append("<p class=\"chart-footer\">Cash spent includes all expenses including accured expenses. Numbers are rounded to nearest dollar.</p>");
		sortBars();
	}

	function drawGeography(){
		var data = [], dataWidth = [], total = [], commas = [], colors = [], dataWidth = [];
		//unhide stacked option
		$("#stacked_options_chosen").css("visibility","visible");		
		if (stacked === 0){
			//size up data
			var ii = raceColumns[race];
			for (i=0 ; i < raceTotal[race] ;  i++){
				data[i] = new Array();
				commas[i] = new Array();
				data[i][0] = parseInt(candidateDB[21][ii]);
				data[i][1] = parseInt(candidateDB[23][ii]);
				data[i][2] = parseInt(candidateDB[24][ii]);
				commas[i][0] = commaSeparateNumber(data[i][0]);
				commas[i][1] = commaSeparateNumber(data[i][1]);
				commas[i][2] = commaSeparateNumber(data[i][2]);
				ii = ii + 1;
			}
			//calculate the total for each candidate
			for (i=0 ; i < raceTotal[race] ; i++){
				total[i] = (data[i][0] + data[i][1] + data[i][2]);
			}
			//sorting by first legend item
			for (i=0 ; i < raceTotal[race] ; i++){
				$("#cf-stacked .stacked-bar-row:eq(" + i + ")").attr("value",((data[i][0] / total[i]) * 100));
			}
			//populate data
			colors = stackedControl.geography.legendColor;
			for (i=0 ; i < raceTotal[race] ; i++){
				for (x = 0 ; x < stackedControl.geography.legendItems ; x++){
					$("#cf-stacked .stacked-bar-row:eq(" + i + ") .bar-seg:eq(" + x + ")").css("background",colors[x] ).animate({
						width:((data[i][x] / total[i]) * 100) + "%"
					}).attr("value", data[i][x]);
					$("#cf-stacked .stacked-bar-row:eq(" + i + ") .bar-seg:eq(" + x + ")").caltip({
						title:stackedControl.geography.legendLabels[x],
						content:"$" + commas[i][x] + " (" + Math.round(((data[i][x] / total[i]) * 100)) + "%" + ")"
					})
				}
			}
			//footer
			$("#cf-stacked").append("<p class=\"chart-footer\">" + stackedControl.geography.footer + "</p>");
		}		
		else if (stacked === 1){
			//size up data
			var ii = raceColumns[race];
			for (i=0 ; i < raceTotal[race] ;  i++){
				data[i] = new Array();
				commas[i] = new Array();
				data[i][0] = parseInt(candidateDB[21][ii]);
				data[i][1] = parseInt(candidateDB[23][ii]);
				data[i][2] = parseInt(candidateDB[24][ii]);
				commas[i][0] = commaSeparateNumber(data[i][0]);
				commas[i][1] = commaSeparateNumber(data[i][1]);
				commas[i][2] = commaSeparateNumber(data[i][2]);
				ii = ii + 1;
			}
			//calculate the total for each candidate
			for (i=0 ; i < raceTotal[race] ; i++){
				total[i] = (data[i][0] + data[i][1] + data[i][2]);
			}
			//sorting by first legend item
			for (i=0 ; i < raceTotal[race] ; i++){
				$("#cf-stacked .stacked-bar-row:eq(" + i + ")").attr("value",((data[i][0] / total[i]) * 100));
			}
			//find highest value in array
			var maxValue = Math.max.apply(null, total);
			//figure out the width for each bar
			for (i = 0 ; i < total.length ; i++){
				dataWidth[i] = (total[i] / maxValue) * dimensions.maxBarWidth;
			}
			//populate data
			colors = stackedControl.geography.legendColor;
			for (i=0 ; i < raceTotal[race] ; i++){
				for (x = 0 ; x < stackedControl.geography.legendItems ; x++){
					$("#cf-stacked .stacked-bar-row:eq(" + i + ") .bar-seg:eq(" + x + ")").css("background",colors[x] ).animate({
						width:((data[i][x] / total[i]) * 100) + "%"
					}).attr("value", data[i][x]);
					$("#cf-stacked .stacked-bar-row:eq(" + i + ") .bar-seg:eq(" + x + ")").caltip({
						title:stackedControl.geography.legendLabels[x],
						content:"$" + commas[i][x] + " (" + Math.round(((data[i][x] / total[i]) * 100)) + "%" + ")"
					})
				}
			}				
			for (i=0 ; i < total.length ; i++){
				$("#cf-stacked .stacked-bar-row:eq(" + i + ")").attr("value",total[i]);
				$("#cf-stacked .bar-data:eq(" + i + ")").animate({
					width:dataWidth[i] + "px"
				})
			}
			//footer
			$("#cf-stacked").append("<p class=\"chart-footer\">" + stackedControl.geography.footer + "</p>");
		}		
		sortGeo();
		
	}

	function resetSummaryBars(view){
		//visibility stacked option
		$("#stacked_options_chosen").css("visibility","hidden");
		//reset text and colors for chart
		$(".chart-h4").add(".chart-footer").add(".bar-row").add(".stacked-bar-row").add(".cf-legend-opt").add(".summary-row").add(".donor-row").remove();

		if (view === "Cash Raised" || view === "Retirees" || view === "Loans" || view === "Cash Spent"){
			for (i = 1 ; i < raceTotal[race] + 1; i++){
				$("#cf-summary .bar-chart").append("<div class=\"bar-row\" id=\"" + i + "\"><div class=\"bar-label\"><p class=\"the-label\"></p></div><div class=\"bar-data\"><p></p></div></div>");
			}
		}		
		else if (view === "Geography"){
			var geographyStackedSubBars;
			//determine number of stacked sub bars
			switch(stackedControl.geography.legendItems){
				case 2:
					geographyStackedSubBars = stackedControl.geography.legendBars.two;
					break;
				case 3:
					geographyStackedSubBars = stackedControl.geography.legendBars.three;
					break;
				case 4:
					geographyStackedSubBars = stackedControl.geography.legendBars.four;
					break;
			}
			//populate bars based on number of candidates
			for (i = 1 ; i < raceTotal[race] + 1; i++){
				$(".stacked-bar-chart").append(geographyStackedSubBars);
			}				
			//tag each row with unique ID
			for (i = 1 ; i < raceTotal[race] + 1; i++){
				$("#cf-stacked .stacked-bar-row:eq(" + i + ")").attr("id", i);
			}
			//Give Max Width to Bars
			$(".stacked-bar-row").css("width", dimensions.overall);
			$(".stacked-bar-row .bar-data").css("width", dimensions.maxBarWidth);
			//populate legend
			for (i = 0 ; i < stackedControl.geography.legendItems ; i++){
				$("#cf-legend").append("<div class=\"cf-legend-opt\"><p>" + stackedControl.geography.legendLabels[i] + "</p></div>");
				$(".cf-legend-opt:eq(" + i + ")").css("background", stackedControl.geography.legendColor[i]);
			}

		}			
		else if (view === "Summary"){
			for (i = 1 ; i < raceTotal[race] + 1; i++){
				$("#cf-overview").append("<div class=\"summary-row\" id=\""+i+"\"><div class=\"summary-cell\"><img src=\"\"><p></p><p></p></div><div class=\"summary-cell\"><p></p><p>War Chest</p></div><div class=\"summary-cell\"><p></p><p>Cash Raised</p></div><div class=\"summary-cell\"><p></p><p>Cash Spent</p></div></div>");
			}
		}
		else if (view === "Top Donors"){
			for (i = 1 ; i < raceTotal[race] + 1; i++){
				$("#cf-donors").append("<div class=\"donor-row\" id=\""+i+"\"><div class=\"donor-cell\"><img src=\"\"><p></p><p></p></div><div class=\"donor-cell\"><p><span></span><br><span></span></p><p><span></span><br><span></span></p><p><span></span><br><span></span></p></div><div class=\"donor-cell\"><p><span></span><br><span></span></p><p><span></span><br><span></span></p><p><span></span><br><span></span></p></div></div>");
			}				
			$("#cf-donors").append("<p class=\"chart-footer\">Top employers include the total number of contributions from both individuals who work for the employer and contributions made by the employer itself. Contributions where a person who identified themself as Retired have been excluded from this list as it is an entire category in and of itself.</p>");
		}
		//resize labels
		$(".bar-label").css("width",dimensions.label);			
	}

	function renameSummaryLabels(view){
		var ii = raceColumns[race];
		if (view === "Cash Raised" || view === "Cash Spent" || view === "Retirees" || view === "Loans"){
			for (i = 0; i < raceTotal[race]; i++){
				$("#cf-summary .bar-row:eq("+ i +") .bar-label p").html(candidateDB[0][ii]);
				ii = ii + 1;
			}
		}
		else if (view === "Geography"){
			for (i = 0; i < raceTotal[race]; i++){
				$("#cf-stacked .stacked-bar-row:eq("+ i +") .bar-label p").html(candidateDB[0][ii]);
				ii = ii + 1;
			}
		}
		else if (view === "Summary"){
			for (i = 0; i < raceTotal[race]; i++){
				$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(0) img").attr("src", mainDB[2][ii]);
				$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(0) p:eq(0)").html(candidateDB[0][ii]);
				$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(0) p:eq(1)").html(candidateDB[1][ii]);
				ii = ii + 1;
			}
		}
		else if (view === "Top Donors"){
			for (i = 0; i < raceTotal[race]; i++){
				$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(0) img").attr("src", mainDB[2][ii]);
				$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(0) p:eq(0)").html(candidateDB[0][ii]);
				$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(0) p:eq(1)").html(candidateDB[1][ii]);
				ii = ii + 1;
			}
		}			
	}

	function sortSummary(){
		var $wrapper = $('#cf-overview'),
	        $articles = $wrapper.find('.summary-row');
	    [].sort.call($articles, function(a,b) {
	        return +$(b).attr('value') - +$(a).attr('value');
	    });
	    $articles.each(function(){
	        $wrapper.append(this);
	    });
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

	function sortGeo(){
		//percent or total sort
		if (stacked === 0){
			var $wrapper = $('.stacked-bar-chart'),
		        $articles = $wrapper.find('.stacked-bar-row');
		    [].sort.call($articles, function(a,b) {
		        return +$(b).attr('value') - +$(a).attr('value');
		    });
		    $articles.each(function(){
		        $wrapper.append(this);
		    });
		}
		else {
			var $wrapper = $('.stacked-bar-chart'),
		        $articles = $wrapper.find('.stacked-bar-row');
		    [].sort.call($articles, function(a,b) {
		        return +$(b).attr('value') - +$(a).attr('value');
		    });
		    $articles.each(function(){
		        $wrapper.append(this);
		    });
		}
	}
// ------- COMMAS!!------- //
	function commaSeparateNumber(val){
	    while (/(\d+)(\d{3})/.test(val.toString())){
	      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	    }
	    return val;
	}
// ------- WHAT TO DRAW?------- //
	function redrawCanvas(){
		//magically hide and show chart divs
		$("#cf-summary .bar-chart").css("display","block");
		$("#cf-industry .drill-bar-chart").css("display","none");
		$("#cf-summary").css("display","block");
		$("#cf-industry").css("display","none");
		//Change view
		if (view === "Cash Raised"){
			resetSummaryBars(view);
			renameSummaryLabels(view);
			$(".cf-canvas").css("display","none");
			$("#cf-summary").css("display","block");
			drawContributions()
		}
		else if (view === "Top Contributors"){
			resetSummaryBars(view);
			renameSummaryLabels(view);
			$(".cf-canvas").css("display","none");
			$("#cf-contribute").css("display","block");
			$("#cf-contribute").append("<p class=\"chart-footer\">Top employers include the total number of contributions from both individuals who work for the employer and contributions made by the employer itself. Contributions where a person who identified themself as Retired have been excluded from this list as it is an entire category in and of itself. Average amount per contribution based off of all reported contributions; contributions under $100 typically don't have to be reported.</p>");
		}
		else if (view === "Summary"){
			resetSummaryBars(view);
			renameSummaryLabels(view);
			$(".cf-canvas").css("display","none");
			$("#cf-overview").css("display","block");
			drawSummary();
		}
		else if (view === "Top Donors"){
			resetSummaryBars(view);
			renameSummaryLabels(view);
			$(".cf-canvas").css("display","none");
			$("#cf-donors").css("display","block");
			drawTopDonors();
		}
		else if (view === "Loans"){
			resetSummaryBars(view);
			renameSummaryLabels(view);
			$(".cf-canvas").css("display","none");
			$("#cf-summary").css("display","block");
			drawLoans();
		}
		else if (view === "Retirees"){
			resetSummaryBars(view);
			renameSummaryLabels(view);
			$(".cf-canvas").css("display","none");
			$("#cf-summary").css("display","block");
			drawRetired();
		}
		else if (view === "Geography"){
			$(".cf-canvas").css("display","none");
			$("#cf-stacked").css("display","block");
			resetSummaryBars(view);
			renameSummaryLabels(view);
			drawGeography();
		}
		else if (view === "Cash Spent"){
			resetSummaryBars(view)
			renameSummaryLabels(view);
			$(".cf-canvas").css("display","none");
			$("#cf-summary").css("display","block");
			drawSpent()
		}
		else if (view === "Achievements"){
			$(".cf-canvas").css("display","none");
			$("#cf-achieve").css("display","block").animate({
				height:300
			});
		}
	}
// ------- CHART SHIFTING------- //
	$(document).ready(function(){
		$("#race_options_chosen").on("click","ul > li", function(){
			race = parseInt($(this).attr("value"));	
			redrawCanvas();			
		})
		
		$("#overall_options_chosen").on("click","ul > li", function(){
			view = $(this).html(); //detect view
			redrawCanvas();
		})
		
		$("#stacked_options_chosen").on("click","ul > li", function(){
			var $x = $(this).html(); //detect view
			if ($x === "Percent of Contributions"){
				stacked = 0;
			}
			else {
				stacked = 1;
			}
			redrawCanvas();
		})
	});