	// ------- GLOBAL ------- //
		var uagent = navigator.userAgent.toLowerCase();		
		var race = 0; //leave default
		var raceTotal = [2]; //manually enter the number of candidates for each race, in order you placed in list above
		var raceColumns = [2]; // leave default
		var gsheet = "https://docs.google.com/spreadsheets/d/1g5KNx7xhMCE6Z3-wWWNVlPiZLWXEkCIhgJC9EHPiNm8/pubhtml"; 
		var summaryDB = [], mainDB = [], ieDB = [], controlDB = []; //stores all summary data
		var updated, ieUpdated; //when was the data updated?
		var stacked = 0; //leave default
		var thisCandidate = 2; //leave default
		var ieLength; //ie length
		var ieTotal; //balances for IE Candidate view
		var mobileUser = false; //are you on mobile?
		var mobileNav = document.getElementsByName("mobile-nav"); //grabs all mobile nav elements
		var subNav;

		//input dimensions for graphic
		var dimensions = {
			overall:0, //entire app size
			label:0, //labels for bars
			maxBarWidth:0, //max bar length
			cellHeight:0,
		}
		//candidate names, IE committees and measures
		var candidateDB = [], candidateList = [], ieNames = [];

		//input options for stacked bar graphs
		var chartControl = {
			view:"",
			defaultSubTopics:[],
			summary:{
				ranking:true,
				stats:true,
				titleRanking:"",
				titleStats:"",
				footerRanking:"",
				footerStats:""
			},
			nonmon:{
				nonmonTitle:"Non-Cash Contributions",
				footerNonmon:"Non-Cash Contributions are contributions of services or items given to a candidate. These types of contributions must be used for a candidate or measure's campaign."
			},
			cashRaised:{
				cashRaised:true,
				cashPerDay:true,
				loans:true,
				retiree:true,
				cashRaisedTitle:"",
				cashPerDayTitle:"",
				loansTitle:"",
				retireeTitle:"",
				summaryTitle:"Contributor Groups of Interest",
				summaryLegendColors:["#479a60","#9a8a47","#47819a","#9a4781","#9a6047"],
				summaryLegendLabels:["Retired","Homemaker","Not Employed","Candidate Committees","Union"],
				legendBars:{
					three:"<div class=\"stacked-bar-row\" id=\"0\"><div class=\"bar-label\"><p class=\"the-label\"></p></div><div class=\"bar-data\"><div id=\"geo1\" class=\"bar-seg\"></div><div id=\"geo2\" class=\"bar-seg\"></div><div id=\"geo3\" class=\"bar-seg\"></div><div id=\"geo4\" class=\"bar-seg\"></div><div id=\"geo5\" class=\"bar-seg\"></div><p class=\"interest-total\"></p></div></div>",
				},
				footerSummary:"",
				footerCashRaised:"",
				footerCashPerDay:"",
				footerLoans:"",
				footerRetiree:"The groups included here collectively represent a significant portion of the candidate's total contributions. This is based on how contributors voluntarily disclosed their employer and occupation. \"Candidate Committees\" are contributions from other candidates made through their candidate committees. \"Unions\" are contributions by organized labor groups, Political Action Committees, and other types of committees."
			},
			cashSpent:{
				cashSpent:true,
				expenseType:true,
				cashSpentTitle:"",
				expenseTypeTitle:"",
				footerCashSpent:"",
				footerExpenseType:""
			},
			donors:{
				topDonors:true,
				allDonors:true,
				titleTop:"",
				titleAll:"",
				footerTop:"",
				footerAll:""
			},
			ie:{
				overview:true,
				committees:true,
				candidates:true,
				titleOverview:"",
				titleCommittees:"",
				titleCandidates:"",
				footerOverview:"",
				footerCommittees:"",
				footerCandidates:"",
				legendItems:2,
				legendLabels:["Supporting Candidate","Opposing Candidate"],
				legendColor:["#91cf60","#6C9B48"],
				legendBars:"<div class=\"ie-bar-row\" id=\"0\"><div class=\"bar-label\"><a href=\"\" target=\"_blank\"><p class=\"the-label\"></p></a></div><div class=\"bar-data\"><div id=\"geo1\" class=\"bar-seg\"></div><div id=\"geo2\" class=\"bar-seg\"></div><p></p></div>"
			},
			geography:{
				geography:true,
				geographyTitle:"",
				footer:"",
				legendItems:4,
				legendLabels:[],
				legendColor:[],
				legendBars:{
					two:"<div class=\"stacked-bar-row\" id=\"0\"><div class=\"bar-label\"><p class=\"the-label\"></p></div><div class=\"bar-data\"><div id=\"geo1\" class=\"bar-seg\"></div><div id=\"geo2\" class=\"bar-seg\"></div></div>",
					three:"<div class=\"stacked-bar-row\" id=\"0\"><div class=\"bar-label\"><p class=\"the-label\"></p></div><div class=\"bar-data\"><div id=\"geo1\" class=\"bar-seg\"></div><div id=\"geo2\" class=\"bar-seg\"></div><div id=\"geo3\" class=\"bar-seg\"></div></div></div>",
					four:"<div class=\"stacked-bar-row\" id=\"0\"><div class=\"bar-label\"><p class=\"the-label\"></p></div><div class=\"bar-data\"><div id=\"geo1\" class=\"bar-seg\"></div><div id=\"geo2\" class=\"bar-seg\"></div><div id=\"geo3\" class=\"bar-seg\"></div><div id=\"geo4\" class=\"bar-seg\"></div></div></div>"
				}
			}	
		}
		// ------- UTILITY FUNCTIONS------- //
		var utilityFunctions = {
			detectBrowser:function(device){
				var expression = device;
				var test = /(android|ipad|iphone|touch|nexus|tablet)/i
				//var macTest = /macintosh/i;				
				var result = expression.match(test);
				if (result !== null){
					$(".desktop-only").css("display","none");
					$(".mobile-only").css("display","block");
					$("#cf-header h1").css("font-size",".7em");
					$("#cf-header h4").css("font-size",".4em");
					mobileUser = true;
				}
				else {
					$(".desktop-only").css("display","block");
					$(".mobile-only").css("display","none");
				}
			},
			chartDefaults:function(){
				//size of chart and items
				dimensions.overall = controlDB[22][1];
				dimensions.label = controlDB[23][1];
				dimensions.maxBarWidth = controlDB[24][1];
				dimensions.cellHeight = controlDB[25][1];
				if (dimensions.cellHeight === "FALSE"){
					dimensions.cellHeight = 200;
				}
				
				//CSS for mobile and desktop checker
				if (mobileUser == false){
					$("#cf-overview .cf-head").css("height","75px");
					$("#loading").add("#cf-choose-text").add("#cf-container").add("#cf-options").add("#cf-chart").add("#cf-legend").add(".ie-bar-chart").add(".stacked-bar-chart").add("#cand-highlight").add("#cf-options").add("#cf-choose").add("#cf-contribute").add(".bar-chart").add(".cf-stack-head").add(".cf-head").add(".cf-title").add("#cf-summary").add("#cf-overview").add(".summary-row").css("width",dimensions.overall);
				}
				else {
					$("#loading").add("#cf-choose-text").add("#cf-container").add("#cf-options").add("#cf-chart").add("#cf-legend").add(".ie-bar-chart").add(".stacked-bar-chart").add("#cand-highlight").add("#cf-options").add("#cf-choose").add("#cf-contribute").add(".bar-chart").add(".cf-stack-head").add(".cf-head").add(".cf-title").add("#cf-summary").add("#cf-overview").add(".summary-row").css("width","100%");
					$("#cf-header").css("font-size","4.5em");
					$("#cf-container h2").css("font-size","3em");
					$(".cf-title h4").css("font-size","1.5em");
				}
				
				//chart titles
				chartControl.summary.titleRanking = controlDB[27][1];
				chartControl.summary.titleStats = controlDB[28][1];
				chartControl.cashRaised.cashRaisedTitle = controlDB[29][1];
				chartControl.cashRaised.cashPerDayTitle = controlDB[30][1];
				chartControl.cashRaised.loansTitle = controlDB[31][1];
				chartControl.cashRaised.retireeTitle = controlDB[32][1];
				chartControl.cashSpent.cashSpentTitle = controlDB[33][1];
				chartControl.cashSpent.expenseTypeTitle = controlDB[34][1];
				chartControl.ie.titleOverview = controlDB[35][1];
				chartControl.ie.titleCommittees = controlDB[36][1];
				chartControl.ie.titleCandidates = controlDB[37][1];
				chartControl.donors.titleTop = controlDB[38][1];
				chartControl.donors.titleAll = controlDB[39][1];
				chartControl.geography.geographyTitle = controlDB[40][1];
				//default charts
				var ii = 42;
				for (i=0;i < 4;i++){
					chartControl.defaultSubTopics[i] = controlDB[ii][1];
					ii = ii + 1;
				}
				//footer
				chartControl.summary.footerRanking = controlDB[50][1];
				chartControl.summary.footerStats = controlDB[51][1];
				chartControl.cashRaised.footerCashRaised = controlDB[52][1];
				chartControl.cashRaised.footerCashPerDay = controlDB[55][1];
				chartControl.cashRaised.footerLoans = controlDB[53][1];
				chartControl.cashRaised.footerRetiree = controlDB[55][1];
				chartControl.cashSpent.footerCashSpent = controlDB[56][1];
				chartControl.cashSpent.footerExpenseType = controlDB[57][1];
				chartControl.ie.footerOverview = controlDB[60][1];
				chartControl.ie.footerCommittees = controlDB[61][1];
				chartControl.ie.footerCandidates = controlDB[62][1];
				chartControl.donors.footerTop = controlDB[58][1];
				chartControl.donors.footerAll = controlDB[59][1];
				chartControl.geography.footer = controlDB[63][1];
				//geography control
				var tempLabelSplit = controlDB[66][1].split(",");
				var tempColorSplit = controlDB[67][1].split(",");
				chartControl.geography.legendItems = parseInt(controlDB[65][1]);
				for (i=0 ; i < tempLabelSplit.length ; i++){
					chartControl.geography.legendColor[i] = tempColorSplit[i];
					chartControl.geography.legendLabels[i] = tempLabelSplit[i];
				}
			},
			mobileStyle:function(){
				if (mobileUser == true){
					$(".chart-footer").css("font-size","1em");
				}
			},
			populateTopics:function(){
				var ii = 2, iii = 10;
				//determine topics
				for (i=0 ; i < 7 ; i++){
					if (controlDB[ii][1] === "FALSE"){
						$("#cf-choose option[value='"+ controlDB[ii][0] + "']").remove();
					}
					ii = ii + 1;
				}

				//determine charts
				for (i=0 ; i < 13 ; i++){
					if (controlDB[iii][1] === "FALSE"){
						$("#cf-choose option[value='"+ controlDB[iii][0] + "']").remove();
					}
					iii = iii + 1;
				}		

				//temp Non-Mon
				if (controlDB[iii][1] === "FALSE"){
					$("#cf-choose option[value='"+ controlDB[69][0] + "']").remove();
				}
			},
			populateLeadChart:function(){
				chartControl.view = controlDB[0][1];
				chartFunctions.redrawCanvas();
				$(".bar-label").css("width",dimensions.label);
				if (controlDB[0][1] === "Stats"){
					$("#summary_options_chosen .chosen-single span").text("Statistics");
				}
				else if (controlDB[0][1] === "Loans"){
					$("#contribute_options_chosen .chosen-single span").text("Loans");
				}	
				else if (controlDB[0][1] === "CPD"){
					$("#contribute_options_chosen .chosen-single span").text("Cash per Day");
				}
				else if (controlDB[0][1] === "Retirees"){
					$("#contribute_options_chosen .chosen-single span").text("Retirees");
				}
				else if (controlDB[0][1] === "Expense Type"){
					$("#expenses_options_chosen .chosen-single span").text("Expense Type");
				}
				else if (controlDB[0][1] === "IE Committees"){
					$("#ie_options_chosen .chosen-single span").text("IE Committees");
				}
				else if (controlDB[0][1] === "IE Candidates"){
					$("#ie_options_chosen .chosen-single span").text("IE Candidates");
				}	
				else if (controlDB[0][1] === "Geography"){
					$("#overall_options_chosen .chosen-single span").text("Geography");
				}

			},
			executeChosen:function(){
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

				//connect listeners to Chosen elements
				$("#race_options_chosen").on("click","ul > li", function(){
					race = parseInt($(this).attr("value"));	
					thisCandidate = raceColumns[race];
					$("#candidates_options_"+race+"_chosen .chosen-single span").text(candidateDB[race][0]);
					chartFunctions.redrawCanvas();			
				})

				$("#overall_options_chosen").on("click","ul > li", function(){
					chartControl.view = $(this).attr("value"); //detect view
					chartFunctions.redrawCanvas();
				})
	
				$("#stacked_options_chosen").on("click","ul > li", function(){
					chartControl.view = $(this).attr("value"); //detect view
					chartFunctions.redrawCanvas();
				})
				$("#contribute_options_chosen").on("click","ul > li", function(){
					chartControl.view = $(this).attr("value"); //detect view
					chartFunctions.redrawCanvas();			
				})
				$("#expenses_options_chosen").on("click","ul > li", function(){
					chartControl.view = $(this).attr("value"); //detect view
					chartFunctions.redrawCanvas();			
				})
				$("#summary_options_chosen").on("click","ul > li", function(){
					chartControl.view = $(this).attr("value"); //detect view
					chartFunctions.redrawCanvas();			
				})
				$("#ie_options_chosen").on("click","ul > li", function(){
					chartControl.view = $(this).attr("value"); //detect view
					chartFunctions.redrawCanvas();			
				})
				for(i=0 ; i < raceTotal.length ; i++){
					$("#candidates_options_"+i+"_chosen").on("click","ul > li", function(){
						thisCandidate = parseInt($(this).attr("value")); //detect candidate
						chartFunctions.redrawCanvas();			
					})
				}				
				
			},
			mobileNavigation:function(){
				//main
				for (i=0 ; i < mobileNav.length ; i++){
					mobileNav[i].addEventListener("touchend", utilityFunctions.executeMobileNav, false);
				}
			},
			mobileSubNavigation:function(){
				subNav = document.getElementsByName("mobile-sub-nav");
				for (i=0 ; i < subNav.length ; i++){
					console.log("?")
					subNav[i].addEventListener("touchend", utilityFunctions.executeMobileNav, false);
				}
			},
			executeMobileNav:function(){
				chartControl.view = $(this).attr("value"); //detect view
				chartFunctions.redrawCanvas();
			},
			commaSeparateNumber:function(val){
			    while (/(\d+)(\d{3})/.test(val.toString())){
			      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
			    }
			    return val;
			},
			dateDetectIE:function(){
				var dates = [], z;
				//determine last update
				for (i=0 ; i < ieLength ; i++){
					dates[i] = ieDB[i][2];

				}
				z = new Date(Math.max.apply(null,dates)).toString();
				split = z.split(" ")
				ieUpdated = split[1] + " " + split[2] + ", " + split[3];
				$("#cf-ie .cf-title h4").text("Data Updated on " + ieUpdated);
			},
			grabIEcommittees:function(){
				var ii = 0;
				for (i=0 ; i < ieLength / 2 ; i++){
					ieNames[i] = ieDB[ii][0];
					ii = ii + 2;
				}
				ieTotal = ieNames.length * 2; 
			},
			grabCandidates:function(){
				var tempNames = [], tempRaces = [], parseRaces = [];
				var ii = 0, iii = 0, iv = 0, v = 2, vi = 2, countRaces = 0, countCandidates = 0;
				//grab names and races
				for (i = 2 ; i < mainDB[0].length ; i++){
					tempNames[ii] = mainDB[0][i];
					tempRaces[ii] = mainDB[1][i];
					ii = ii + 1;
				}				


				//Get unique races and count of total number of races
				parseRaces = _.uniq(tempRaces);
				countRaces = parseRaces.length;

				//create arrays within candidateDB for each race
				for (i = 0 ; i < countRaces ; i++){
					candidateDB[i] = new Array();
				}

				//Determine which candidate applies to which race
				for (i=0; i < tempRaces.length ; i++){
					var thisRace = tempRaces[i];
					if (thisRace === parseRaces[iii]){
						candidateDB[iii][iv] = tempNames[i];
						iv = iv + 1;
						countCandidates = countCandidates + 1;
					}
					else if (thisRace !== parseRaces[iii]){
						raceTotal[iii] = countCandidates;
						countCandidates = 1;
						iii = iii + 1;
						iv = 0;
						candidateDB[iii][iv] = tempNames[i];
						iv = iv + 1;		
						//get first column on GSheet for race
						raceColumns[iii] = v; 	

					}
					v = v + 1;
				}		
				raceTotal[iii] = countCandidates;

				//populate selection dropdown for candidates per race
				for (i=0 ; i < countRaces ; i++){
					$("#cf-expense-type .cf-title").append("<select id=\"candidates-options-"+i+"\" class=\"candidate-options chosen-select\" value=" + i + " class=\"chosen-select\" style=\"width:200px;float:left;\" tabindex=\"2\"></select>");
					for (x=0 ; x < candidateDB[i].length ; x++){
						$("#candidates-options-"+i+"").append("<option value=" + vi + ">" + candidateDB[i][x] + "</option>");
						vi = vi + 1;
					}
				}		
			}
		}
		// ------- ALL CHARING FUNCTIONS HERE ------- //
		var chartFunctions = {
			// ------- INITIALIZE FIRST CHART ------- //
			setTheScene:function(data, tabletop){
				//pull spreadsheet data into arrays
				$.each( tabletop.sheets("Summary").all(), function(i, summary) {
					var insertRow = [];
					insertRow[0] = summary.category;
					insertRow[1] = summary.all;
					insertRow[2] = summary.fudge;
					insertRow[3] = summary.gore;
					summaryDB.push(insertRow);
				});

				$.each( tabletop.sheets("Main").all(), function(i, main) {
					var insertRow = [];
					insertRow[0] = main.item;
					insertRow[1] = main.all;
					insertRow[2] = main.fudge;
					insertRow[3] = main.gore;
					mainDB.push(insertRow);
				});	

				$.each( tabletop.sheets("IE_Overview").all(), function(i, ie) {
					var insertRow = [];
					insertRow[0] = ie.committee;
					insertRow[1] = ie.position;
					insertRow[2] = new Date(ie.updated);
					insertRow[3] = ie.total;
					insertRow[4] = ie.fudge;
					insertRow[5] = ie.gore;
					ieDB.push(insertRow);
				});	

				$.each(tabletop.sheets("Control").all(), function(i, control){
					var insertRow = [];
					insertRow[0] = control.option;
					insertRow[1] = control.command;
					controlDB.push(insertRow)
				})

				$.each(tabletop.sheets("Control").all(), function(i, control){
					var insertRow = [];
					insertRow[0] = control.option;
					insertRow[1] = control.command;
					controlDB.push(insertRow)
				})

				//chart defaults
				utilityFunctions.chartDefaults();

				//determine what topics and subtopics are in use
				utilityFunctions.populateTopics();

				//determine number of IE committees
				ieLength = ieDB.length;

				//when last updated non-IE
				updated = mainDB[5][1];
				$("#cf-header h4").html("Data Updated on " + updated); 

				//when last updated IE
				utilityFunctions.dateDetectIE();

				//loading
				$("#cf-chart").css("visibility","visible");
				$("#cf-choose").css("visibility","visible");
				$("#cf-header").css("display","block");
				$("#loading").remove();
				$("#cf-mobile-choose p").css("display","block");

				//populate candidates and measures
				utilityFunctions.grabCandidates();

				//populate IE committees
				utilityFunctions.grabIEcommittees();

				//establish navigation
				if (mobileUser == true){
					//mobile navigation
					utilityFunctions.mobileNavigation();
				}
				else {
					//chosen
					utilityFunctions.executeChosen();
				}

				//toggle lead chart
				utilityFunctions.populateLeadChart();

			},
			// ------- DRAWING CHARTS BY TYPE ------- //
			drawSummary:function(){
				var data = [], check = [], colors = [], ii = 2, iii = 1;
				var titles = ["Cash on Hand","Money Raised","Money Spent","Outside Money Supporting","Outside Money Opposing","No. of Contributions","Days Fundraising","Average Contributions","Median Contributions"];
				//var colors = ["#5FADCE","#91cf60","#CE5F75","#91cf60","#CE5F75","#5FADCE","#5FADCE","#91cf60","#91cf60"];
				var color = "#4c5b52";
				
				//grab data
				for (i=0 ; i < 2 ; i++){
					data[i] = new Array();
					data[i][0] = "$" + utilityFunctions.commaSeparateNumber(mainDB[26][ii]);
					data[i][1] = "$" + utilityFunctions.commaSeparateNumber(summaryDB[5][ii]);
					data[i][2] = "$" + utilityFunctions.commaSeparateNumber(summaryDB[18][ii]);
					data[i][3] = "$" + utilityFunctions.commaSeparateNumber(mainDB[30][ii]);
					data[i][4] = "$" + utilityFunctions.commaSeparateNumber(mainDB[31][ii]);
					data[i][5] = utilityFunctions.commaSeparateNumber(mainDB[8][ii]);
					data[i][6] = utilityFunctions.commaSeparateNumber(mainDB[6][ii]);
					data[i][7] = "$" + utilityFunctions.commaSeparateNumber(mainDB[9][ii]);
					data[i][8] = "$" + utilityFunctions.commaSeparateNumber(mainDB[10][ii]);
					ii = ii + 1;
				}
				ii = 2
				
				for (i=0 ; i < 2 ; i++){
					check[i] = new Array();
					check[i][0] = parseInt(mainDB[26][ii]);
					check[i][1] = parseInt(summaryDB[5][ii]);
					check[i][2] = parseInt(summaryDB[18][ii]);
					check[i][3] = parseInt(mainDB[30][ii]);
					check[i][4] = parseInt(mainDB[31][ii]);
					check[i][5] = parseInt(mainDB[8][ii]);
					check[i][6] = parseInt(mainDB[6][ii]);
					check[i][7] = parseInt(mainDB[9][ii]);
					check[i][8] = parseInt(mainDB[10][ii]);
					ii = ii + 1;
				}
				//populate titles
				for (i=0 ; i < titles.length ; i++){
					$("#cf-overview .summary-row:eq("+iii+") p:eq(0)").text(titles[i]);
					iii = iii + 1;
				}
				iii = 1;
				
				//populate data
				for (i=0 ; i < 10 ; i++){
					$("#cf-overview .summary-row:eq("+iii+") p:eq(1)").html(data[0][i]);
					$("#cf-overview .summary-row:eq("+iii+") p:eq(2)").html(data[1][i]);
					iii = iii + 1;
				}
				iii = 1;
				
				//color the data
				for (i=0 ; i < 10 ; i++){
					if (check[0][i] > check[1][i]){
						$("#cf-overview .summary-row:eq("+iii+") p:eq(1)").css("color", color).css("font-weight", "700");
						$("#cf-overview .summary-row:eq("+iii+") p:eq(2)").css("color", color);
					}
					else if (check[1][i] > check[0][i]){
						$("#cf-overview .summary-row:eq("+iii+") p:eq(1)").css("color", color);
						$("#cf-overview .summary-row:eq("+iii+") p:eq(2)").css("color", color).css("font-weight", "700");
					}
					iii = iii + 1;
				}

				//Descriptives
				$(".cf-title h2").html(chartControl.summary.titleRanking);
				////$("#cf-overview .cf-title").append("<p>(Area below may be scrollable)</p>");
				$(".cf-title").append("<p class=\"chart-footer\">" + chartControl.summary.footerRanking + "</p>");
				
				//adjust for new elements just added, style for mobile
				utilityFunctions.mobileStyle();

			},
			drawTopDonors:function(){
				var data = [], real = [];
				//size up data
				var ii = raceColumns[race];				
				for (i=0 ; i < raceTotal[race]; i++){
					//top contributors
					data[i] = new Array();
					data[i][0] = mainDB[12][ii];
					data[i][1] = "$" + utilityFunctions.commaSeparateNumber(parseInt(mainDB[11][ii]));
					data[i][2] = mainDB[14][ii];
					data[i][3] = "$" + utilityFunctions.commaSeparateNumber(parseInt(mainDB[13][ii]));
					data[i][4] = mainDB[16][ii];
					data[i][5] = "$" + utilityFunctions.commaSeparateNumber(parseInt(mainDB[15][ii]));
					
					//top employers
					data[i][6] = mainDB[18][ii];
					data[i][7] = "$" + utilityFunctions.commaSeparateNumber(parseInt(mainDB[17][ii]));
					data[i][8] = mainDB[20][ii];
					data[i][9] = "$" + utilityFunctions.commaSeparateNumber(parseInt(mainDB[19][ii]));
					data[i][10] = mainDB[22][ii];
					data[i][11] = "$" + utilityFunctions.commaSeparateNumber(parseInt(mainDB[21][ii]));
					data[i][12] = mainDB[24][ii];
					data[i][13] = "$" + utilityFunctions.commaSeparateNumber(parseInt(mainDB[23][ii]));
					data[i][14] = mainDB[36][ii];
					data[i][15] = "$" + utilityFunctions.commaSeparateNumber(parseInt(mainDB[35][ii]));
					data[i][16] = mainDB[38][ii];
					data[i][17] = "$" + utilityFunctions.commaSeparateNumber(parseInt(mainDB[37][ii]));
					ii = ii + 1;
				}
				
				//filer our retired, homemakers, and not employed
				for (i=0 ; i < raceTotal[race]; i++){
					real[i] = new Array();
					var ii = 0, iii = 1;
					//1
					if (data[i][6] === "Retired" || data[i][6] === "Homemaker" || data[i][6] === "Not Employed" || data[i][6] === "Candidate Committees"){
						
					}
					else {
						real[i][ii] = data[i][6];
						real[i][iii] = data[i][7];
						ii = ii + 2;
						iii = iii + 2;
					}
					//2
					if (data[i][8] === "Retired" || data[i][8] === "Homemaker" || data[i][8] === "Not Employed" || data[i][8] === "Candidate Committees"){
						
					}
					else {
						real[i][ii] = data[i][8];
						real[i][iii] = data[i][9];
						ii = ii + 2;
						iii = iii + 2;
					}
					//3
					if (data[i][10] === "Retired" || data[i][10] === "Homemaker" || data[i][10] === "Not Employed" || data[i][10] === "Candidate Committees"){
						
					}
					else {
						real[i][ii] = data[i][10];
						real[i][iii] = data[i][11];
						ii = ii + 2;
						iii = iii + 2;
					}
					//4
					if (data[i][12] === "Retired" || data[i][12] === "Homemaker" || data[i][12] === "Not Employed" || data[i][12] === "Candidate Committees"){
						
					}
					else {
						real[i][ii] = data[i][12];
						real[i][iii] = data[i][13];
						ii = ii + 2;
						iii = iii + 2;
					}
					//5
					if (data[i][14] === "Retired" || data[i][14] === "Homemaker" || data[i][14] === "Not Employed" || data[i][14] === "Candidate Committees"){
						
					}
					else {
						real[i][ii] = data[i][14];
						real[i][iii] = data[i][15];
						ii = ii + 2;
						iii = iii + 2;
					}
					//6
					if (data[i][16] === "Retired" || data[i][16] === "Homemaker" || data[i][16] === "Not Employed" || data[i][16] === "Candidate Committees"){
						
					}
					else {
						real[i][ii] = data[i][16];
						real[i][iii] = data[i][17];
						ii = ii + 2;
						iii = iii + 2;
					}
				}
				

				//populate data
				for (i=0 ; i < data.length ; i++){
					$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(1) p:eq(0) span:eq(0)").html(data[i][0]);
					$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(1) p:eq(0) span:eq(1)").html(data[i][1]);
					$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(1) p:eq(1) span:eq(0)").html(data[i][2]);
					$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(1) p:eq(1) span:eq(1)").html(data[i][3]);
					$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(1) p:eq(2) span:eq(0)").html(data[i][4]);
					$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(1) p:eq(2) span:eq(1)").html(data[i][5]);
					$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(2) p:eq(0) span:eq(0)").html(real[i][0]);
					$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(2) p:eq(0) span:eq(1)").html(real[i][1]);
					$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(2) p:eq(1) span:eq(0)").html(real[i][2]);
					$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(2) p:eq(1) span:eq(1)").html(real[i][3]);
					$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(2) p:eq(2) span:eq(0)").html(real[i][4]);
					$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(2) p:eq(2) span:eq(1)").html(real[i][5]);

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

				//descriptives
				$("#cf-donors .cf-title h2").html(chartControl.donors.titleTop);
				$(".cf-title").append("<p class=\"chart-footer\">" + chartControl.donors.footerTop + "</p>");
				$("#cf-donors .cf-title").append("<p style=\"border-bottom: 1px solid #8c9b93;padding:0 0 10px 0;\"><span>Top Contributors</span><span>Top Entities</span></p>");

				//remove unused cells
				if ($("#cf-donors .donor-row .donor-cell p span").html() === "$NaN"){
					$("#cf-donors .donor-row:eq("+ i +") .donor-cell p").remove();
				}
				
				//adjust for new elements just added, style for mobile
				utilityFunctions.mobileStyle();
			},
			drawContributions:function(){
				var data = [], commas = [], dataWidth = [], links = [];
				var all = 0;
				//size up data
				var ii = raceColumns[race];
				for (i=0 ; i < raceTotal[race]; i++){
					data[i] = parseInt(summaryDB[5][ii]) + parseInt(summaryDB[11][ii]);
					commas[i] = utilityFunctions.commaSeparateNumber(data[i]);
					links[i] = mainDB[3][ii];
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
				$("#cf-summary .cf-title h2").html(chartControl.cashRaised.cashRaisedTitle);
				$("#cf-summary").append("<h4 class=\"chart-h4\">$" + utilityFunctions.commaSeparateNumber(all) + " contributed total</h4>");
				$(".cf-title").append("<p class=\"chart-footer\">" + chartControl.cashRaised.footerCashRaised + "</p>");
				chartFunctions.sortBars();
				$(".bar-row[value='0']").css("display","none");
				
				//adjust for new elements just added, style for mobile
				utilityFunctions.mobileStyle();
			},
			drawExpenseType:function(){
				var all = 0, data = [], commas = [], ii = 23, dataWidth = [], $thisBar, workaround = [], workaroundCommas = [];

				$("#candidates_options_" + race + "_chosen").css("visibility","visible").insertAfter("#cf-expense-type .cf-title");
				$("#expenses_options_chosen").css("visibility","visible").insertAfter("#overall_options_chosen");
				$("#cf-choose-text h4:eq(1)").css("display","block");	
				
				//get data
				for (i=0 ; i < 28;  i++){
					data[i] = parseInt(summaryDB[ii][thisCandidate]);
					commas[i] = utilityFunctions.commaSeparateNumber(data[i]);
					all = all + data[i];
					ii = ii + 1;
				}
				//find highest value in array
				var maxValue = Math.max.apply(null, data);

				//figure out the width for each bar
				for (i = 0 ; i < data.length ; i++){
					dataWidth[i] = (data[i] / maxValue) * dimensions.maxBarWidth;
				}

				//populate data vlaues for sorting
				for (i=0 ; i < data.length ; i++){
					$("#cf-expense-type .bar-row:eq(" + i + ")").attr("value",data[i]);
				}

				//sort
				chartFunctions.sortBars();

				//weird sorting/drawing workaround (EVALUATE MORE LATER)
				for (i=0 ; i < data.length ; i++){
					workaround[i] = parseInt($("#cf-expense-type .bar-row:eq(" + i + ")").attr("id") - 1);
				}

				//draw charts
				for (i=0 ; i < data.length ; i++){
					$("#cf-expense-type .bar-data:eq(" + i + ") p").text("$" + commas[workaround[i]]);
					$("#cf-expense-type .bar-data:eq(" + i + ")").animate({
						width:dataWidth[workaround[i]]
					})
				}

				//destroy no value bars
				$(".bar-row[value='0']").css("display","none");

				$("#cf-expense-type .bar-data").css("background","#CE5F75");
				$("#cf-expense-type .cf-title h2").html(chartControl.cashSpent.expenseTypeTitle);
				$("#cf-expense-type").append("<h4 class=\"chart-h4\" style=\"color:rgb(206, 95, 117);\">$" + utilityFunctions.commaSeparateNumber(all) + " spent total</h4>");
				$(".cf-title").append("<p class=\"chart-footer\">"+ chartControl.cashSpent.footerExpenseType + "</p>");
				
				//adjust for new elements just added, style for mobile
				utilityFunctions.mobileStyle();
			},
			drawSpent:function(){
				var data = [], commas = [], dataWidth = [], links = [];
				var all = 0;
				$("#expenses_options_chosen").css("visibility","visible").insertAfter("#overall_options_chosen");
				$("#expenses_options_chosen .chosen-single span").text(chartControl.defaultSubTopics[2]);
				$("#cf-choose-text h4:eq(1)").css("display","block");
				
				//size up data
				var ii = raceColumns[race];
				for (i=0 ; i < raceTotal[race] ;  i++){
					data[i] = parseInt(summaryDB[18][ii]);
					commas[i] = utilityFunctions.commaSeparateNumber(data[i]);
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
					$("#cf-summary .bar-row:eq("+ i +") a").attr("href", links[i]);
					$("#cf-summary .bar-data:eq(" + i + ") p").text("$" + commas[i]);
					$("#cf-summary .bar-data:eq(" + i + ")").animate({
						width:dataWidth[i]
					})
				}

				$("#cf-summary .bar-data").css("background","#CE5F75");
				$("#cf-summary .cf-title h2").html(chartControl.cashSpent.cashSpentTitle);
				$("#cf-summary").append("<h4 class=\"chart-h4\" style=\"color:#CE5F75;\">$" + utilityFunctions.commaSeparateNumber(all) + " spent total</h4>");
				$(".cf-title").append("<p class=\"chart-footer\">"+ chartControl.cashSpent.footerCashSpent +"</p>");
				chartFunctions.sortBars();
				$(".bar-row[value='0']").css("display","none");
				
				//adjust for new elements just added, style for mobile
				utilityFunctions.mobileStyle();
			},
			drawGeoPercent:function(){
				var data = [], dataWidth = [], total = [], commas = [], colors = [], links = [];
				//unhide stacked option
				$("#stacked_options_chosen").css("visibility","visible").insertAfter("#overall_options_chosen");
				$("#cf-choose-text h4:eq(1)").css("display","block");
				//size up data
				var ii = raceColumns[race];
				for (i=0 ; i < raceTotal[race] ;  i++){
					data[i] = new Array();
					commas[i] = new Array();
					data[i][0] = parseInt(summaryDB[20][ii]);
					data[i][1] = parseInt(summaryDB[21][ii]);
					data[i][2] = parseInt(summaryDB[22][ii]);
					commas[i][0] = utilityFunctions.commaSeparateNumber(data[i][0]);
					commas[i][1] = utilityFunctions.commaSeparateNumber(data[i][1]);
					commas[i][2] = utilityFunctions.commaSeparateNumber(data[i][2]);
					ii = ii + 1;
				}
				//calculate the total for each candidate
				for (i=0 ; i < raceTotal[race] ; i++){
					total[i] = (data[i][0] + data[i][1] + data[i][2]);
				}
				//sorting by first legend item
				for (i=0 ; i < raceTotal[race] ; i++){
					$("#cf-stacked .stacked-bar-row:eq(" + i + ")").attr("value",((data[i][0] / total[i]) * 100));
					$("#cf-stacked a").attr("href", data[i][4]);
				}
				//populate data
				colors = chartControl.geography.legendColor;
				for (i=0 ; i < raceTotal[race] ; i++){
					for (x = 0 ; x < chartControl.geography.legendItems ; x++){
						$("#cf-stacked .stacked-bar-row:eq(" + i + ") .bar-seg:eq(" + x + ")").css("background",colors[x] ).animate({
							width:((data[i][x] / total[i]) * 100) + "%"
						}).attr("value", data[i][x]);
						$("#cf-stacked .stacked-bar-row:eq(" + i + ") .bar-seg:eq(" + x + ")").caltip({
							title:chartControl.geography.legendLabels[x],
							content:"$" + commas[i][x] + " (" + Math.round(((data[i][x] / total[i]) * 100)) + "%" + ")"
						})
					}
				}
				//descriptives
				$(".cf-title h2").html(chartControl.geography.geographyTitle);
				$("#cf-stacked .cf-title").append("<p style=\"color:#8c9b93\">(Hover over bars for details)</p>");
				$(".cf-title").append("<p class=\"chart-footer\">" + chartControl.geography.footer + "</p>");
				$(".stacked-bar-row[value='0']").add(".stacked-bar-row[value='NaN']").css("display","none");
				if (mobileUser == true){
					$("#cf-stacked .cf-title").append("<p name=\"mobile-sub-nav\" style=\"display:block;\" value=\"Percent of Contributions\">Percent</p>");
					$("#cf-stacked .cf-title").append("<p name=\"mobile-sub-nav\" style=\"display:block;\" value=\"Total Contributions\">Total</p>");
					utilityFunctions.mobileSubNavigation();
				}
				
				//adjust for new elements just added, style for mobile
				utilityFunctions.mobileStyle();
			},
			drawGeoTotal:function(){
				var data = [], dataWidth = [], total = [], commas = [], colors = [], links = [];
				//unhide stacked option
				$("#stacked_options_chosen").css("visibility","visible").insertAfter("#overall_options_chosen");
				$("#cf-choose-text h4:eq(1)").css("display","block");
				//size up data
				var ii = raceColumns[race];
				for (i=0 ; i < raceTotal[race] ;  i++){
					data[i] = new Array();
					commas[i] = new Array();
					data[i][0] = parseInt(summaryDB[19][ii]);
					data[i][1] = parseInt(summaryDB[20][ii]);
					data[i][2] = parseInt(summaryDB[21][ii]);
					commas[i][0] = utilityFunctions.commaSeparateNumber(data[i][0]);
					commas[i][1] = utilityFunctions.commaSeparateNumber(data[i][1]);
					commas[i][2] = utilityFunctions.commaSeparateNumber(data[i][2]);
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
				colors = chartControl.geography.legendColor;
				for (i=0 ; i < raceTotal[race] ; i++){
					for (x = 0 ; x < chartControl.geography.legendItems ; x++){
						$("#cf-stacked .stacked-bar-row:eq(" + i + ") .bar-seg:eq(" + x + ")").css("background",colors[x] ).animate({
							width:((data[i][x] / total[i]) * 100) + "%"
						}).attr("value", data[i][x]);
						$("#cf-stacked .stacked-bar-row:eq(" + i + ") .bar-seg:eq(" + x + ")").caltip({
							title:chartControl.geography.legendLabels[x],
							content:"$" + commas[i][x] + " (" + Math.round(((data[i][x] / total[i]) * 100)) + "%" + ")"
						})
					}
				}				
				for (i=0 ; i < total.length ; i++){
					$("#cf-stacked .stacked-bar-row:eq(" + i + ")").attr("value",total[i]);
					$("#cf-stacked a").attr("href", data[i][4]);
					$("#cf-stacked .bar-data:eq(" + i + ")").animate({
						width:dataWidth[i] + "px"
					})
				}
				//descriptives
				$(".cf-title h2").html(chartControl.geography.geographyTitle);
				$("#cf-stacked .cf-title").append("<p style=\"color:#8c9b93\">(Hover over bars for details)</p>");
				$(".cf-title").append("<p class=\"chart-footer\">" + chartControl.geography.footer + "</p>");
				$(".stacked-bar-row[value='0']").add(".stacked-bar-row[value='NaN']").css("display","none");
				if (mobileUser == true){
					$("#cf-stacked .cf-title").append("<p name=\"mobile-sub-nav\" style=\"display:block;\" value=\"Percent of Contributions\">Percent</p>");
					$("#cf-stacked .cf-title").append("<p name=\"mobile-sub-nav\" style=\"display:block;\" value=\"Total Contributions\">Total</p>");
					utilityFunctions.mobileSubNavigation();
				}
				chartFunctions.sortGeo();
				
				//adjust for new elements just added, style for mobile
				utilityFunctions.mobileStyle();
			},
			drawAllDonors:function(){
				$("#candidates_options_" + race + "_chosen").css("visibility","visible").insertAfter("#cf-iframe .cf-title");
				$(".cf-iframe-hold").append(mainDB[29][thisCandidate]);	

				//descriptives
				$("#cf-iframe .cf-title h2").html(chartControl.donors.titleAll);
				$("#cf-iframe .cf-title").append("<p>(Area below may be scrollable)</p>");
				
				//adjust for new elements just added, style for mobile
				utilityFunctions.mobileStyle();
			},
			drawIEoverview:function(){
				var data = [], split, ieUpdated, dataWidth = [], commas = [], colors = [], total = [], all = 0, dataCheck = [];
				var candidate = ["Torlakson", "Tuck"];
				
				$("#ie_options_chosen").css("visibility","visible").insertAfter("#overall_options_chosen");
				$("#ie_options_chosen .chosen-single span").text(chartControl.defaultSubTopics[3]);
				$("#cf-choose-text h4:eq(1)").css("display","block");
				
				//size up data
				var ii = raceColumns[race] + 2;
				for (i=0 ; i < raceTotal[race] ;  i++){
					var support = 0, oppose = 0, iii = 0, iv = 1;
					data[i] = new Array();
					commas[i] = new Array();
					for (x=0 ; x < ieNames.length ; x++){
						support = support + parseInt(ieDB[x+iii][ii]);
						oppose = oppose + parseInt(ieDB[x+iv][ii]);
						iii = iii + 1;
						iv = iv + 1;
					}
					data[i][0] = support; //support total
					data[i][1] = oppose;
					commas[i][0] = utilityFunctions.commaSeparateNumber(data[i][0]);
					commas[i][1] = utilityFunctions.commaSeparateNumber(data[i][1]);
					ii = ii + 1;
				}
				//calculate the total for each candidate
				for (i=0 ; i < raceTotal[race] ; i++){
					total[i] = (data[i][0] + data[i][1]);
				}
				
				//grab all values
				ii = 1;
				iii = 0;
				for (i = 0 ; i < raceTotal[race] ; i++){
					dataCheck[iii] = data[i][0];
					dataCheck[ii] = data[i][1];
					ii = ii + 2;
					iii = iii + 2;
				}
				
				//find highest value in array
				var maxValue = parseInt(Math.max.apply(null, dataCheck));
				console.log(maxValue)
				//get total overall
				for (i=0; i < total.length; i++){
					all = all + total[i];
				}

				//figure out the width for each bar
				ii = 1;
				var iii = 0;
				for (i = 0 ; i < total.length ; i++){
					dataWidth[iii] = (data[i][0] / maxValue) * dimensions.maxBarWidth;
					dataWidth[ii] = (data[i][1] / maxValue) * dimensions.maxBarWidth;
					ii = ii + 2;
					iii = iii + 2;
				
					
				}
				
				//populate data
				iii = 0;
				ii = 1;
				colors = chartControl.ie.legendColor;
				for (i=0 ; i < raceTotal[race] ; i++){
						$("#cf-ie .ie-bar-row-overview:eq(" + iii + ") .bar-data").css("background",colors[0] ).animate({
							width:dataWidth[iii]
						}).attr("value", data[i][0]);

						$("#cf-ie .ie-bar-row-overview:eq(" + ii + ") .bar-data").css("background",colors[1] ).animate({
							width:dataWidth[ii]
						}).attr("value", data[i][1]);

						$("#cf-ie .bar-data:eq(" + iii + ") p").text("$" + utilityFunctions.commaSeparateNumber(commas[i][0]));
						$("#cf-ie .bar-data:eq(" + ii + ") p").text("$" + utilityFunctions.commaSeparateNumber(commas[i][1]));

						$("#cf-ie .ie-bar-row-overview:eq(" + iii + ")").caltip({
							title:"Outside Money Supporting " + candidate[i],
							content:"$" + commas[i][0]
						})

						$("#cf-ie .ie-bar-row-overview:eq(" + ii + ")").caltip({
							title:"Outside Money Opposing " + candidate[i],
							content:"$" + commas[i][1]
						})
						
						ii = ii + 2;
						iii = iii + 2;
				}	
				
				//Descriptives
				$("#cf-ie .cf-title h2").html(chartControl.ie.titleOverview);
				$("#cf-ie .cf-title").append("<p style=\"color:#8c9b93\">(Hover over bars for details)</p>");
				$("#cf-ie").append("<h4 class=\"chart-h4\" style=\"color:#486730\">$" + utilityFunctions.commaSeparateNumber(all) + " spent total</h4>");
				$(".cf-title").append("<p class=\"chart-footer\">" + chartControl.ie.footerOverview + "</p>");
				if (mobileUser == true){
					$("#cf-ie .cf-title").append("<p name=\"mobile-sub-nav\" style=\"display:block;\" value=\"IE Overview\">Overview</p>");
					$("#cf-ie .cf-title").append("<p name=\"mobile-sub-nav\" style=\"display:block;\" value=\"IE Candidates\">Candidate Breakdown</p>");
					utilityFunctions.mobileSubNavigation();
				}
				
				//adjust for new elements just added, style for mobile
				utilityFunctions.mobileStyle();
			},
			drawIEcandidates:function(){
				$("#ie_options_chosen").css("visibility","visible").insertAfter("#overall_options_chosen");
				$("#cf-choose-text h4:eq(1)").css("display","block");
				$("#candidates_options_" + race + "_chosen").css("visibility","visible").insertAfter("#cf-ie-legend");

				$("#ie_options_chosen").css("visibility","visible").insertAfter("#overall_options_chosen");
				$("#cf-choose-text h4:eq(1)").css("display","block");
				
				
				var data = [], check = [], colors = [], ii = 1, iii = 1;
				var titles = [];
				var supportColor = "#6aae35";
				var opposeColor = "#ac354c";
				var noneColor = "#6f8578";
				
				
				//populate committees
				for (i=0 ; i < ieNames.length ; i++){
					$("#cf-overview .summary-row:eq("+iii+") p:eq(0)").text(ieNames[i]);
					iii = iii + 1;
				}
				
				//grab data
				for (i=0 ; i < ieTotal ; i++){
					data[i] = new Array();
					data[i][0] = "$" + utilityFunctions.commaSeparateNumber(Math.round(parseInt(ieDB[i][4])));
					data[i][1] = "$" + utilityFunctions.commaSeparateNumber(Math.round(parseInt(ieDB[i][5])));
				}
				
				//check data
				iii = 0;
				for (x = 0 ; x < raceColumns[race] ; x++){
					check[x] = new Array();
					colors[x] = new Array();
					for (i=0 ; i < ieNames.length ; i++){
						if (data[iii][x] === "$0" && data[ii][x] === "$0"){
							check[x][i] = "$0";
							colors[x][i] = noneColor;
						}	
						else if (data[iii][x] === "$0" && data[ii][x] !== "$0"){
							check[x][i] = data[ii][x];
							colors[x][i] = opposeColor;
						}
						else if (data[iii][x] !== "$0" && data[ii][x] === "$0"){
							check[x][i] = data[iii][x];
							colors[x][i] = supportColor;
						}
						ii = ii + 2;
						iii = iii + 2;
						console.log(colors[x])
					}
					ii = 1;
					iii = 0;
				}
			
				//populate data
				iii = 1;
				for (i=0 ; i < ieNames.length ; i++){
					$("#cf-overview .summary-row:eq("+iii+") p:eq(1)").html(check[0][i]).css({
						color:colors[0][i],
						"font-weight":700
					});
					$("#cf-overview .summary-row:eq("+iii+") p:eq(2)").html(check[1][i]).css({
						color:colors[1][i],
						"font-weight":700
					});
					iii = iii + 1;
				}

				//Descriptives
				$(".cf-title h2").html(chartControl.ie.titleCandidates);
				$(".cf-title").append("<p class=\"chart-footer\">" + chartControl.ie.footerCandidates + "</p>");
				
				//adjust for new elements just added, style for mobile
				utilityFunctions.mobileStyle();
			},
			// ------- REFRESHING CANVAS ------- //
			redrawCanvas:function(){
				//magically hide and show chart divs
				//$("#cf-summary .bar-chart").css("display","block");
				//$("#cf-summary").css("display","block");
				//Change view
				if (chartControl.view === "Cash Contributions" || chartControl.view === "Cash Raised"){
					chartFunctions.resetCanvas(chartControl.view);
					chartFunctions.renameCanvas(chartControl.view);
					$(".cf-canvas").css("display","none");
					$("#cf-summary").css("display","block");
					chartFunctions.drawContributions();
				}
				else if (chartControl.view === "IE Overview" || chartControl.view === "Outside Money"){
					chartFunctions.resetCanvas(chartControl.view);
					chartFunctions.renameCanvas(chartControl.view);
					$(".cf-canvas").css("display","none");
					$("#cf-ie").css("display","block");
					chartFunctions.drawIEoverview();
				}
				else if (chartControl.view === "Non-Cash Givings"){
					chartFunctions.resetCanvas(chartControl.view);
					chartFunctions.renameCanvas(chartControl.view);
					$(".cf-canvas").css("display","none");
					$("#cf-summary").css("display","block");
					chartFunctions.drawNonMon();
				}
				else if (chartControl.view === "IE Committees"){
					chartFunctions.resetCanvas(chartControl.view);
					chartFunctions.renameCanvas(chartControl.view);
					$(".cf-canvas").css("display","none");
					$("#cf-ie").css("display","block");
					chartFunctions.drawIEcommittees();
				}
				else if (chartControl.view === "IE Candidates"){
					chartFunctions.resetCanvas(chartControl.view);
					chartFunctions.renameCanvas(chartControl.view);
					$(".cf-canvas").css("display","none");
					$("#cf-overview").css("display","block");
					chartFunctions.drawIEcandidates();
				}
				else if (chartControl.view === "All Donors"){
					chartFunctions.resetCanvas(chartControl.view);
					chartFunctions.renameCanvas(chartControl.view);
					$(".cf-canvas").css("display","none");
					$("#cf-iframe").css("display","block");
					chartFunctions.drawAllDonors();
				}
				else if (chartControl.view === "Summary" || chartControl.view === "Ranking"){
					chartFunctions.resetCanvas(chartControl.view);
					chartFunctions.renameCanvas(chartControl.view);
					$(".cf-canvas").css("display","none");
					$("#cf-overview").css("display","block");
					chartFunctions.drawSummary();
				}
				else if (chartControl.view === "Top Donors"){
					chartFunctions.resetCanvas(chartControl.view);
					chartFunctions.renameCanvas(chartControl.view);
					$(".cf-canvas").css("display","none");
					$("#cf-donors").css("display","block");
					chartFunctions.drawTopDonors();
				}
				else if (chartControl.view === "Geography" || chartControl.view === "Percent of Contributions"){
					$(".cf-canvas").css("display","none");
					$("#cf-stacked").css("display","block");
					chartFunctions.resetCanvas(chartControl.view);
					chartFunctions.renameCanvas(chartControl.view);
					chartFunctions.drawGeoPercent();
				}
				else if (chartControl.view === "Total Contributions"){
					$(".cf-canvas").css("display","none");
					$("#cf-stacked").css("display","block");
					chartFunctions.resetCanvas(chartControl.view);
					chartFunctions.renameCanvas(chartControl.view);
					chartFunctions.drawGeoTotal();
				}
				else if (chartControl.view === "Cash Spent" || chartControl.view === "Expenses Summary"){
					chartFunctions.resetCanvas(chartControl.view)
					chartFunctions.renameCanvas(chartControl.view);
					$(".cf-canvas").css("display","none");
					$("#cf-summary").css("display","block");
					chartFunctions.drawSpent()
				}
				else if (chartControl.view === "Expense Type"){
					chartFunctions.resetCanvas(chartControl.view)
					chartFunctions.renameCanvas(chartControl.view);
					$(".cf-canvas").css("display","none");
					$("#cf-expense-type").css("display","block");
					chartFunctions.drawExpenseType()
				}
			},
			resetCanvas:function(view){
				//visibility stacked and summary options
				$("#stacked_options_chosen").css("visibility","hidden");
				$("#summary_options_chosen").css("visibility","hidden");
				$("#contribute_options_chosen").css("visibility","hidden");
				$("#expenses_options_chosen").css("visibility","hidden");
				$("#ie_options_chosen").css("visibility","hidden");
				$("#cf-choose-text h4:eq(1)").css("display","none");
				$("#cf-chart").css("overflow-y","auto");
				for (i = 0 ; i < raceTotal.length ; i++){
					$("#candidates_options_"+i+"_chosen").css("visibility","hidden");
				}
				//reset title
				$(".cf-title p").remove();
				//reset text and colors for chart
				$(".chart-h4").add(".ie-bar-row-overview").add(".chart-footer").add(".bar-row").add(".stacked-bar-row").add(".ie-bar-row").add(".cf-legend-opt").add(".cf-ie-legend-opt").add(".summary-row").add(".donor-row").remove();

				if (chartControl.view === "Cash Contributions" || chartControl.view === "Cash Raised" || chartControl.view === "Non-Cash Givings" || chartControl.view === "CPD" || chartControl.view === "Loans" || chartControl.view === "Cash Spent" || chartControl.view === "Expenses Summary"){			
					for (i = 1 ; i < raceTotal[race] + 1; i++){
						$("#cf-summary .bar-chart").append("<div class=\"bar-row\" id=\"" + i + "\"><div class=\"bar-label\"><p class=\"the-label\"></p></div><div class=\"bar-data\"><p></p></div></div>");
					}
				}		
				else if (chartControl.view === "IE Overview" || chartControl.view === "Outside Money"){
					$(".cf-ie-head").css("height","215px");
					//populate bars based on number of candidates
					for (i = 1 ; i < raceTotal[race] + 1; i++){
						$(".ie-bar-chart").append("<div class=\"ie-bar-row-overview\"><div class=\"bar-label\"><p class=\"the-label\"></p></div><div class=\"bar-data\"><p></p></div>");
						$(".ie-bar-chart").append("<div class=\"ie-bar-row-overview bar-buffer\"><div class=\"bar-label\"><p class=\"ie-overview-label\"></p></div><div class=\"bar-data\"><p></p></div>");
						
					}				
					//Give Max Width to Bars
					$(".ie-bar-row-overview").css("width", dimensions.overall);
					$(".ie-bar-row-overview .bar-data").css("width", dimensions.maxBarWidth);
					//populate legend
					for (i = 0 ; i < chartControl.ie.legendItems ; i++){
						$("#cf-ie-legend").append("<div class=\"cf-ie-legend-opt\"><p>" + chartControl.ie.legendLabels[i] + "</p></div>");
						$(".cf-ie-legend-opt:eq(" + i + ")").css("background", chartControl.ie.legendColor[i]);
					}					
				}
				else if (chartControl.view === "IE Committees"){
					$(".cf-ie-head").css("height","215px");
					//populate IE committees
					for (i=1 ; i < ieNames.length + 1; i++){
						$(".ie-bar-chart").append(chartControl.ie.legendBars);
					}
					//tag each row with unique ID
					for (i = 1 ; i < ieNames.length + 1; i++){
						$("#cf-ie .ie-bar-row:eq(" + i + ")").attr("id", i);
					}
					//Give Max Width to Bars
					$(".ie-bar-row").css("width", dimensions.overall);
					$(".ie-bar-row .bar-data").css("width", dimensions.maxBarWidth);
					//populate legend
					for (i = 0 ; i < chartControl.ie.legendItems ; i++){
						$("#cf-ie-legend").append("<div class=\"cf-ie-legend-opt\"><p>" + chartControl.ie.legendLabels[i] + "</p></div>");
						$(".cf-ie-legend-opt:eq(" + i + ")").css("background", chartControl.ie.legendColor[i]);
					}
				}
				else if (chartControl.view === "IE Candidates"){
					$("#cf-overview").append("<div class=\"summary-row\" id=\"overview-header\"><div class=\"summary-cell\"></div><div class=\"summary-cell\"><img src=\"\"><p></p><p></p></div><div class=\"summary-cell\"><img src=\"\"><p></p><p></p></div></div>");
					for (i = 1 ; i < ieNames.length + 1; i++){
						$("#cf-overview").append("<div style=\"height:15px;\" class=\"summary-row\" id=\""+i+"\"><div class=\"summary-cell\"><p></p></div><div class=\"summary-cell\"><p></p></div><div class=\"summary-cell\"><p></p></div></div>");
					}
				}
				else if (chartControl.view === "Expense Type"){
					for (i = 1 ; i < 29; i++){
						$("#cf-expense-type .bar-chart").append("<div class=\"bar-row\" id=\"" + i + "\"><div class=\"bar-label\"><p class=\"the-label\"></p></div><div class=\"bar-data\"><p></p></div></div>");
					}
				}
				else if (chartControl.view === "All Donors"){
					$("#cf-chart").css("overflow-y","hidden");
					$("#cf-iframe iframe").remove();
				}
				else if (chartControl.view === "Geography" || chartControl.view === "Percent of Contributions" || chartControl.view === "Total Contributions"){				
					var geographyStackedSubBars;
					//determine number of stacked sub bars
					switch(chartControl.geography.legendItems){
						case 2:
							geographyStackedSubBars = chartControl.geography.legendBars.two;
							break;
						case 3:
							geographyStackedSubBars = chartControl.geography.legendBars.three;
							break;
						case 4:
							geographyStackedSubBars = chartControl.geography.legendBars.four;
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
					for (i = 0 ; i < chartControl.geography.legendItems ; i++){
						$("#cf-legend").append("<div class=\"cf-legend-opt\"><p>" + chartControl.geography.legendLabels[i] + "</p></div>");
						$(".cf-legend-opt:eq(" + i + ")").css("background", chartControl.geography.legendColor[i]);
					}
				}	
				else if (chartControl.view === "Summary" || chartControl.view === "Ranking"){
					$("#cf-overview").append("<div class=\"summary-row\" id=\"overview-header\"><div class=\"summary-cell\"></div><div class=\"summary-cell\"><img src=\"\"><p></p><p></p></div><div class=\"summary-cell\"><img src=\"\"><p></p><p></p></div></div>");
					for (i = 1 ; i < 11; i++){
						$("#cf-overview").append("<div class=\"summary-row\" id=\""+i+"\"><div class=\"summary-cell\"><p></p></div><div class=\"summary-cell\"><p></p></div><div class=\"summary-cell\"><p></p></div></div>");
					}
				}
				else if (chartControl.view === "Top Donors"){
					for (i = 1 ; i < raceTotal[race] + 1; i++){
						$("#cf-donors").append("<div class=\"donor-row\" id=\""+i+"\"><div class=\"donor-cell\"><img src=\"\"><p></p><p></p></div><div class=\"donor-cell\"><p><span></span><br><span></span></p><p><span></span><br><span></span></p><p><span></span><br><span></span></p></div><div class=\"donor-cell\"><p><span></span><br><span></span></p><p><span></span><br><span></span></p><p><span></span><br><span></span></p></div></div>");
					}
				}	
				//resize labels
				$(".bar-label").css("width",dimensions.label);
			},
			renameCanvas:function(view){
					var ii = raceColumns[race];
					if (chartControl.view === "Cash Contributions" || chartControl.view === "Cash Raised" || chartControl.view === "Non-Cash Givings" || chartControl.view === "Cash Spent" || chartControl.view === "CPD" || chartControl.view === "Loans" || chartControl.view === "Expenses Summary"){
						for (i = 0; i < raceTotal[race]; i++){
							$("#cf-summary .bar-row:eq("+ i +") .bar-label p").html(summaryDB[0][ii]);
							ii = ii + 1;
						}			
					}
					else if (chartControl.view === "Expense Type"){
						var iii = 23;
						for (i = 0; i < 28; i++){
							$("#cf-expense-type .bar-row:eq("+ i +") .bar-label p").html(summaryDB[iii][0]);
							iii = iii + 1;
						}
					}
					else if (chartControl.view === "IE Overview" || chartControl.view === "Outside Money"){
						var iii = 0;
						for (i = 0; i < raceTotal[race]; i++){
							$("#cf-ie .bar-buffer .bar-label p:eq("+i+")").html(summaryDB[0][ii]);
							ii = ii + 1;
						}
					}
					else if (chartControl.view === "IE Committees"){
						for (i=0 ; i < ieNames.length ; i++){
							$("#cf-ie .ie-bar-row:eq("+ i +") .bar-label p").html(ieNames[i]);
						}

					}
					else if (chartControl.view === "Geography" || chartControl.view === "Percent of Contributions" || chartControl.view === "Total Contributions"){
						for (i = 0; i < raceTotal[race]; i++){
							$("#cf-stacked .stacked-bar-row:eq("+ i +") .bar-label p").html(summaryDB[0][ii]);
							ii = ii + 1;
						}
					}
					else if (chartControl.view === "Summary" || chartControl.view === "Ranking" || chartControl.view === "IE Candidates"){
						//populate candidates
						for (i=1 ; i < 3 ; i++){
							$("#overview-header .summary-cell:eq("+i+") img").attr("src", mainDB[2][ii]);
							$("#overview-header .summary-cell:eq("+i+") p:eq(0)").html(summaryDB[0][ii]);
							$("#overview-header .summary-cell:eq("+i+") p:eq(1)").html(mainDB[32][ii]);
							ii = ii + 1;
						}
					}
					else if (chartControl.view === "Top Donors"){
						for (i = 0; i < raceTotal[race]; i++){
							$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(0) img").attr("src", mainDB[2][ii]);
							$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(0) p:eq(0)").html(summaryDB[0][ii]);
							$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(0) p:eq(1)").html(mainDB[32][ii]);
							ii = ii + 1;
						}
					}
			},
			// ------- SORTING ------- //
			sortStacked:function(){
					var $wrapper = $('.stacked-bar-chart #0 .bar-data'),
				        $articles = $wrapper.find('.bar-seg');
				    [].sort.call($articles, function(a,b) {
				        return +$(b).attr('value') - +$(a).attr('value');
				    });
				    $articles.each(function(){
				        $wrapper.append(this);
				    });
				
					var $wrapper = $('.stacked-bar-chart #1 .bar-data'),
				        $articles = $wrapper.find('.bar-seg');
				    [].sort.call($articles, function(a,b) {
				        return +$(b).attr('value') - +$(a).attr('value');
				    });
				    $articles.each(function(){
				        $wrapper.append(this);
				    });
				
					$("#cf-stacked .bar-data:eq(0) p").insertAfter("#cf-stacked .bar-data:eq(0) .bar-seg:last");
					$("#cf-stacked .bar-data:eq(1) p").insertAfter("#cf-stacked .bar-data:eq(1) .bar-seg:last");
			},
			sortSummary:function(){
					var $wrapper = $('#cf-overview'),
				        $articles = $wrapper.find('.summary-row');
				    [].sort.call($articles, function(a,b) {
				        return +$(b).attr('value') - +$(a).attr('value');
				    });
				    $articles.each(function(){
				        $wrapper.append(this);
				    });
			},
			sortStatistics:function(){
				var $wrapper = $('#cf-overview'),
			        $articles = $wrapper.find('.summary-row');
			    [].sort.call($articles, function(a,b) {
			        return +$(b).attr('value') - +$(a).attr('value');
			    });
			    $articles.each(function(){
			        $wrapper.append(this);
			    });
			},
			sortGeo:function(){
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
			},
			sortBars:function(){
				var $wrapper = $('.bar-chart'),
			        $articles = $wrapper.find('.bar-row');
			    [].sort.call($articles, function(a,b) {
			        return +$(b).attr('value') - +$(a).attr('value');
			    });
			    $articles.each(function(){
			        $wrapper.append(this);
			    });
			},
			sortIE:function(){
				var $wrapper = $('.ie-bar-chart'),
			        $articles = $wrapper.find('.ie-bar-row');
			    [].sort.call($articles, function(a,b) {
			        return +$(b).attr('value') - +$(a).attr('value');
			    });
			    $articles.each(function(){
			        $wrapper.append(this);
			    });
			}
		}

// ------- TABLETOP ------- //
	$(document).ready(function(){
			utilityFunctions.detectBrowser(uagent);
			Tabletop.init( { key: gsheet,
		                     callback: chartFunctions.setTheScene,
		                     wanted: ["Control","Summary","Main","IE_Overview"],
		                     debug: true } );
	});

