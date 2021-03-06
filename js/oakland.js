	// ------- GLOBAL ------- //
		var race = 0; //leave default
		var raceTotal = []; //manually enter the number of candidates for each race, in order you placed in list above
		var raceColumns = [2]; // leave default
		var gsheet = "https://docs.google.com/spreadsheets/d/1fK-Hxk3IM63pL_ExIwXpRcDqP6Wh6ogs5TUWgrY4BvU/pubhtml"; 
		var summaryDB = [], mainDB = [], ieDB = [], controlDB = []; //stores all summary data
		var updated, ieUpdated; //when was the data updated?
		var stacked = 0; //leave default
		var thisCandidate = 2; //leave default
		var ieLength; //ie length
		
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
				summaryTitle:"Percentage of Contributions by Type",
				summaryLegendColors:["#47819A","#5fadce","#B0D6E7"],
				summaryLegendLabels:["Candidate Financed","Cash Raised","Non-Cash"],
				footerSummary:"Candidate Financed includes any cash, non-monetary contributions, or loans the candidate gave to their campaign. Cash Raised is all itemized and unitemized cash the candidate raised minus their own contributions. Non-cash is any non-monetary contributions a candidate received minus their contributions. ",
				footerCashRaised:"",
				footerCashPerDay:"",
				footerLoans:"",
				footerRetiree:""
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
				legendLabels:["Support","Oppose"],
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
					two:"<div class=\"stacked-bar-row\" id=\"0\"><div class=\"bar-label\"><a href=\"\" target=\"_blank\"><p class=\"the-label\"></p></a></div><div class=\"bar-data\"><div id=\"geo1\" class=\"bar-seg\"></div><div id=\"geo2\" class=\"bar-seg\"></div></div>",
					three:"<div class=\"stacked-bar-row\" id=\"0\"><div class=\"bar-label\"><a href=\"\" target=\"_blank\"><p class=\"the-label\"></p></a></div><div class=\"bar-data\"><div id=\"geo1\" class=\"bar-seg\"></div><div id=\"geo2\" class=\"bar-seg\"></div><div id=\"geo3\" class=\"bar-seg\"></div></div></div>",
					four:"<div class=\"stacked-bar-row\" id=\"0\"><div class=\"bar-label\"><a href=\"\" target=\"_blank\"><p class=\"the-label\"></p></a></div><div class=\"bar-data\"><div id=\"geo1\" class=\"bar-seg\"></div><div id=\"geo2\" class=\"bar-seg\"></div><div id=\"geo3\" class=\"bar-seg\"></div><div id=\"geo4\" class=\"bar-seg\"></div></div></div>"
				}
			}	
		}
		// ------- UTILITY FUNCTIONS------- //
		var utilityFunctions = {
			chartDefaults:function(){
				//size of chart and items
				dimensions.overall = controlDB[22][1];
				dimensions.label = controlDB[23][1];
				dimensions.maxBarWidth = controlDB[24][1];
				dimensions.cellHeight = controlDB[25][1];
				if (dimensions.cellHeight === "FALSE"){
					dimensions.cellHeight = 200;
				}
				$("#loading").add("#cf-choose-text").add("#cf-container").add("#cf-options").add("#cf-chart").add("#cf-legend").add(".ie-bar-chart").add(".stacked-bar-chart").add("#cand-highlight").add("#cf-options").add("#cf-choose").add("#cf-contribute").add(".bar-chart").add(".cf-stack-head").add(".cf-head").add(".cf-title").add("#cf-summary").add("#cf-overview").add(".summary-row").css("width",dimensions.overall);
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
					chartControl.view = $(this).html(); //detect view
					chartFunctions.redrawCanvas();
				})

				$("#stacked_options_chosen").on("click","ul > li", function(){
					var $x = $(this).html(); //detect view
					if ($x === "Percent"){
						stacked = 0;
					}
					else {
						stacked = 1;
					}
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
				
				//populate races in race tab
				for (i=0 ; i < parseRaces.length ; i++){
					$("#race-options").append("<option value=" + i + ">" + parseRaces[i] + "</option>")
				}

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
					insertRow[2] = summary.anderson;
					insertRow[3] = summary.mccullough;
					insertRow[4] = summary.kaplan;
					insertRow[5] = summary.parker;
					insertRow[6] = summary.quan;
					insertRow[7] = summary.ruby;
					insertRow[8] = summary.schaaf;
					insertRow[9] = summary.siegel;
					insertRow[10] = summary.tuman;
					insertRow[11] = summary.washington;
					insertRow[12] = summary.williams;
					summaryDB.push(insertRow);
				});

				$.each( tabletop.sheets("Main").all(), function(i, main) {
					var insertRow = [];
					insertRow[0] = main.item;
					insertRow[1] = main.all;
					insertRow[2] = main.anderson;
					insertRow[3] = main.mccullough;
					insertRow[4] = main.kaplan;
					insertRow[5] = main.parker;
					insertRow[6] = main.quan;
					insertRow[7] = main.ruby;
					insertRow[8] = main.schaaf;
					insertRow[9] = main.siegel;
					insertRow[10] = main.tuman;
					insertRow[11] = main.washington;
					insertRow[12] = main.williams;
					mainDB.push(insertRow);
				});	
				
				/*$.each( tabletop.sheets("IE_Overview").all(), function(i, ie) {
					var insertRow = [];
					insertRow[0] = ie.committee;
					insertRow[1] = ie.position;
					insertRow[2] = new Date(ie.updated);
					insertRow[3] = ie.total;
					insertRow[4] = ie.anderson;
					insertRow[5] = ie.mccullough;
					insertRow[6] = ie.kaplan;
					insertRow[7] = ie.parker;
					insertRow[8] = ie.quan;
					insertRow[9] = ie.ruby;
					insertRow[10] = ie.schaaf;
					insertRow[11] = ie.siegel;
					insertRow[12] = ie.tuman;
					insertRow[11] = ie.washington;
					insertRow[12] = ie.williams;
					ieDB.push(insertRow);
				});		*/

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
				$(".cf-title h4").html("Data Updated on " + updated); 
				
				//when last updated IE
				utilityFunctions.dateDetectIE();

				//loading
				$("#cf-chart").css("visibility","visible");
				$("#cf-choose").css("visibility","visible");
				$("#loading").remove();

				//populate candidates and measures
				utilityFunctions.grabCandidates();
				
				//populate IE committees
				utilityFunctions.grabIEcommittees();

				//chosen
				utilityFunctions.executeChosen();			
				
				//toggle lead chart
				utilityFunctions.populateLeadChart();
				
			},
			// ------- DRAWING CHARTS BY TYPE ------- //
			drawSummary:function(){
				var data = [], maxRaisedArray = [], maxSpentArray = [];
				$("#summary_options_chosen").css("visibility","visibile").insertAfter("#overall_options_chosen");
				$("#summary_options_chosen .chosen-single span").text(chartControl.defaultSubTopics[0]);
				$("#cf-choose-text h4:eq(2)").css("display","block");
				$(".summary-row").css("height", dimensions.cellHeight + "px");
				
				//size up data
				var ii = raceColumns[race];				
				for (i=0 ; i < raceTotal[race]; i++){
					var temp = parseInt(mainDB[26][ii]);
					$(".summary-row:eq("+i+")").attr("value",temp);
					data[i] = new Array();
					data[i][0] = "$" + utilityFunctions.commaSeparateNumber(temp);
					data[i][1] = parseInt(mainDB[27][ii]);
					data[i][2] = parseInt(mainDB[28][ii]);
					data[i][3] = mainDB[3][ii];
					maxRaisedArray[i] = data[i][1];
					maxSpentArray[i] = data[i][2];
					ii = ii + 1;
				}
				//caluculate lowest/highest
				var maxRaised = _.max(maxRaisedArray);
				var maxSpent = _.max(maxSpentArray);
				
				//populate data
				for (i=0 ; i < data.length ; i++){
					//deafult style
					$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(2) p:eq(0)").css({color:"#8c9b93","font-weight":300});
					$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(3) p:eq(0)").css({color:"#8c9b93","font-weight":300});
					
					//Rank Raised
					if (data[i][1] === maxRaised){
						$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(2) p:eq(0)").css({color:"#CE5F75","font-weight":700,"font-size":"2em"});
					}
					if (data[i][1] === 1){
						data[i][1] = data[i][1] + "st";
						$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(2) p:eq(0)").css({color:"#6aae35","font-weight":700,"font-size":"2em"});
					}
					else if (data[i][1] === 2){
						data[i][1] = data[i][1] + "nd";
					}
					else if (data[i][1] === 3){
						data[i][1] = data[i][1] + "rd";
					}
					else {
						data[i][1] = data[i][1] + "th";
					}
					
					//Rank Spent
					if (data[i][2] === maxSpent){
						$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(3) p:eq(0)").css({color:"#CE5F75","font-weight":700,"font-size":"2em"});
					}
					if (data[i][2] === 1){
						data[i][2] = data[i][2] + "st";
						$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(3) p:eq(0)").css({color:"#6aae35","font-weight":700,"font-size":"2em"});
					}
					else if (data[i][2] === 2){
						data[i][2] = data[i][2] + "nd";
					}
					else if (data[i][2] === 3){
						data[i][2] = data[i][2] + "rd";
					}
					else {
						data[i][2] = data[i][2] + "th";
					}
					
					//check for NaN
					if (data[i][1] === "NaNth"){
						data[i][1] = "None";
					}
					if (data[i][2] === "NaNth"){
						data[i][2] = "None";
					}
					
					$("#cf-overview .summary-row:eq("+ i +") a").attr("href", data[i][3]);		
					$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(1) p:eq(0)").html(data[i][0]);
					$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(2) p:eq(0)").html(data[i][1]);
					$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(3) p:eq(0)").html(data[i][2]);
				}
				
				//Descriptives
				$(".cf-title h2").html(chartControl.summary.titleRanking);
				$("#cf-overview .cf-title").append("<p>(Area below may be scrollable)</p>");
				$("#cf-overview").append("<p class=\"chart-footer\">" + chartControl.summary.footerRanking + "</p>");
				
				
				//Sorting
				chartFunctions.sortSummary();
			},
			drawStatistics:function(){
				var data = [];
				$("#summary_options_chosen").css("visibility","visibile").insertAfter("#overall_options_chosen");
				$("#cf-choose-text h4:eq(2)").css("display","block");
				$(".summary-row").css("height", dimensions.cellHeight + "px");
				
				//size up data
				var ii = raceColumns[race];				
				for (i=0 ; i < raceTotal[race]; i++){
					var temp = parseInt(mainDB[10][ii]); //grabbing median contribution amount
					$(".summary-row:eq("+i+")").attr("value",temp); //for sorting
					data[i] = new Array();
					data[i][0] = parseInt(mainDB[8][ii]); //grab # of contributions
					data[i][1] = "$" + utilityFunctions.commaSeparateNumber(temp); //median contribution
					data[i][2] = parseInt(mainDB[6][ii]); //days since first disclosed contributions
					data[i][3] = mainDB[3][ii];
					ii = ii + 1;
				}

				//populate data
				for (i=0 ; i < data.length ; i++){
					$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(1) p:eq(0)").html(data[i][0]);
					$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(2) p:eq(0)").html(data[i][1]);
					$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(3) p:eq(0)").html(data[i][2]);
					$("#cf-overview .summary-row:eq("+ i +") a").attr("href", data[i][3]);
				}

				//sorting
				chartFunctions.sortStatistics();
				
				//descriptives
				$("#cf-overview .cf-title h2").html(chartControl.summary.titleStats);
				$("#cf-overview").append("<p class=\"chart-footer\">" + chartControl.summary.footerStats + "</p>");
				$("#cf-overview .cf-title").append("<p>(Area below may be scrollable)</p>");
				
				//styles
				$("#cf-overview .summary-row:eq(0) .summary-cell:eq(2) p:eq(0)").css({color:"#6aae35","font-weight":700,"font-size":"2em"});;
			},
			drawTopDonors:function(){
				var data = [];
				//size up data
				var ii = raceColumns[race];				
				for (i=0 ; i < raceTotal[race]; i++){
					var rTest = false;
					data[i] = new Array();
					data[i][0] = mainDB[12][ii];
					data[i][1] = "$" + utilityFunctions.commaSeparateNumber(parseInt(mainDB[11][ii]));
					data[i][2] = mainDB[14][ii];
					data[i][3] = "$" + utilityFunctions.commaSeparateNumber(parseInt(mainDB[13][ii]));
					data[i][4] = mainDB[16][ii];
					data[i][5] = "$" + utilityFunctions.commaSeparateNumber(parseInt(mainDB[15][ii]));
					data[i][6] = mainDB[3][ii];
							
					//test 1
					if (mainDB[18][ii] === "Retired"){
						data[i][6] = mainDB[20][ii];
						data[i][7] = "$" + utilityFunctions.commaSeparateNumber(parseInt(mainDB[19][ii]));		
						rTest = true;				
					}
					else {
						data[i][6] = mainDB[18][ii];
						data[i][7] = "$" + utilityFunctions.commaSeparateNumber(parseInt(mainDB[17][ii]));
					}
					
					//test 2
					if (mainDB[20][ii] === "Retired"){
						data[i][8] = mainDB[22][ii];
						data[i][9] = "$" + utilityFunctions.commaSeparateNumber(parseInt(mainDB[21][ii]));	
						rTest = true;					
					}
					else if (rTest == true){
						data[i][8] = mainDB[22][ii];
						data[i][9] = "$" + utilityFunctions.commaSeparateNumber(parseInt(mainDB[21][ii]));
					}
					else {
						data[i][8] = mainDB[20][ii];
						data[i][9] = "$" + utilityFunctions.commaSeparateNumber(parseInt(mainDB[19][ii]));
					}
					
					//test 3
					if (mainDB[22][ii] === "Retired"){
						data[i][10] = mainDB[24][ii];
						data[i][11] = "$" + utilityFunctions.commaSeparateNumber(parseInt(mainDB[23][ii]));		
						rTest = true;				
					}
					else if (rTest == true){
						data[i][10] = mainDB[24][ii];
						data[i][11] = "$" + utilityFunctions.commaSeparateNumber(parseInt(mainDB[23][ii]));
					}
					else {
						data[i][10] = mainDB[22][ii];
						data[i][11] = "$" + utilityFunctions.commaSeparateNumber(parseInt(mainDB[21][ii]));
					}
		
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
				
				//descriptives
				$("#cf-donors .cf-title h2").html(chartControl.donors.titleTop);
				$("#cf-donors").append("<p class=\"chart-footer\">" + chartControl.donors.footerTop + "</p>");
				$("#cf-donors .cf-title").append("<p>(Area below may be scrollable)</p>");
				$("#cf-donors .cf-title").append("<p><span>Top Contributors</span><span>Top Employers</span></p>");
				$("#cf-donors .donor-row:eq("+ i +") a").attr("href", data[i][6]); //link to candidate page
				
				//remove unused cells
				if ($("#cf-donors .donor-row .donor-cell p span").html() === "$NaN"){
					$("#cf-donors .donor-row:eq("+ i +") .donor-cell p").remove();
				}
			},
			drawCashRaisedSummary:function(){
				var data = [], dataWidth = [], total = [], commas = [], colors = [], links = [];
				//unhide stacked option
				$("#contribute_options_chosen").css("visibility","visible").insertAfter("#overall_options_chosen");
				$("#contribute_options_chosen .chosen-single span").text(chartControl.defaultSubTopics[1]);
				$("#cf-choose-text h4:eq(2)").css("display","block");	
				
					//size up data
				var ii = raceColumns[race];
				for (i=0 ; i < raceTotal[race] ;  i++){
					data[i] = new Array();
					commas[i] = new Array();
					data[i][0] = (parseInt(summaryDB[52][ii]) + parseInt(summaryDB[53][ii]) + parseInt(summaryDB[12][ii])); //candidate financed
					data[i][1] = (parseInt(summaryDB[5][ii]) - parseInt(summaryDB[52][ii])); //cash contributions
					data[i][2] = (parseInt(summaryDB[10][ii]) - parseInt(summaryDB[53][ii])); //non-mon
					commas[i][0] = utilityFunctions.commaSeparateNumber(data[i][0]);
					commas[i][1] = utilityFunctions.commaSeparateNumber(data[i][1]);
					commas[i][2] = utilityFunctions.commaSeparateNumber(data[i][2]);
					ii = ii + 1;
				}
				//calculate the total for each candidate
				for (i=0 ; i < raceTotal[race] ; i++){
					total[i] = (data[i][0] + data[i][1] + data[i][2]);
					console.log(total[i])
				}
				//sorting by first legend item
				for (i=0 ; i < raceTotal[race] ; i++){
					$("#cf-stacked .stacked-bar-row:eq(" + i + ")").attr("value",((data[i][0] / total[i]) * 100));
				}
				//populate data
				colors = chartControl.cashRaised.summaryLegendColors;
				for (i=0 ; i < raceTotal[race] ; i++){
					for (x = 0 ; x < 3 ; x++){
						$("#cf-stacked .stacked-bar-row:eq(" + i + ") .bar-seg:eq(" + x + ")").css("background",colors[x] ).animate({
							width:((data[i][x] / total[i]) * 100) + "%"
						}).attr("value", data[i][x]);
						$("#cf-stacked .stacked-bar-row:eq(" + i + ") .bar-seg:eq(" + x + ")").caltip({
							title:chartControl.cashRaised.summaryLegendLabels[x],
							content:"$" + commas[i][x] + " (" + Math.round(((data[i][x] / total[i]) * 100)) + "%" + ")"
						})
					}
				}
				//descriptives
				$("#cf-stacked").append("<p class=\"chart-footer\">" + chartControl.cashRaised.footerSummary + "</p>");
				$(".cf-title h2").html(chartControl.cashRaised.summaryTitle);
				$("#cf-stacked .cf-title").append("<p>(Hover over bars for details)</p>");
				$(".stacked-bar-row[value='0']").add(".stacked-bar-row[value='NaN']").css("display","none");
				chartFunctions.sortGeo();
			},
			drawContributions:function(){
				var data = [], commas = [], dataWidth = [], links = [];
				var all = 0;
				$("#contribute_options_chosen").css("visibility","visible").insertAfter("#overall_options_chosen");
				$("#contribute_options_chosen .chosen-single span").text(chartControl.defaultSubTopics[1]);
				$("#cf-choose-text h4:eq(2)").css("display","block");
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
					$("#cf-summary .bar-row:eq("+ i +") a").attr("href", links[i]);
					$("#cf-summary .bar-data:eq(" + i + ") p").text("$" + commas[i]);
					$("#cf-summary .bar-data:eq(" + i + ")").animate({
						width:dataWidth[i]
					})
				}

				//meta
				$(".bar-data").css("background","#91cf60");
				$("#cf-summary .cf-title h2").html(chartControl.cashRaised.cashRaisedTitle);
				$("#cf-summary").append("<h4 class=\"chart-h4\">$" + utilityFunctions.commaSeparateNumber(all) + " contributed total</h4>");
				$("#cf-summary").append("<p class=\"chart-footer\">" + chartControl.cashRaised.footerCashRaised + "</p>");
				chartFunctions.sortBars();
				$(".bar-row[value='0']").css("display","none");
			},
			drawNonMon:function(){
				var data = [], commas = [], dataWidth = [], links = [];
				var all = 0;
				//$("#expenses_options_chosen").css("visibility","visible").insertAfter("#overall_options_chosen");
				//$("#expenses_options_chosen .chosen-single span").text(chartControl.defaultSubTopics[2]);
				//$("#cf-choose-text h4:eq(2)").css("display","block");
				//size up data
				var ii = raceColumns[race];
				for (i=0 ; i < raceTotal[race] ;  i++){
					data[i] = parseInt(summaryDB[7][ii]) + parseInt(summaryDB[8][ii]);
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
					$("#cf-summary .bar-row:eq("+ i +") a").attr("href", links[i]);
					$("#cf-summary .bar-data:eq(" + i + ") p").text("$" + commas[i]);
					$("#cf-summary .bar-data:eq(" + i + ")").animate({
						width:dataWidth[i]
					})
				}

				$("#cf-summary .bar-data").css("background","#CE5F75");
				$("#cf-summary .cf-title h2").html(chartControl.nonmon.nonmonTitle);
				$("#cf-summary").append("<h4 class=\"chart-h4\" style=\"color:#CE5F75;\">$" + utilityFunctions.commaSeparateNumber(all) + " worth given total</h4>");
				$("#cf-summary").append("<p class=\"chart-footer\">"+ chartControl.nonmon.footerNonmon +"</p>");
				chartFunctions.sortBars();
				$(".bar-row[value='0']").css("display","none");
			},
			drawLoans:function(){
				var data = [], commas = [], dataWidth = [], links = [];
				var all = 0;
				$("#contribute_options_chosen").css("visibility","visible").insertAfter("#overall_options_chosen");
				$("#cf-choose-text h4:eq(2)").css("display","block");

				//size up data
				var ii = raceColumns[race];
				for (i=0 ; i < raceTotal[race]; i++){
					data[i] = parseInt(summaryDB[12][ii]);
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
					$("#cf-summary .bar-row:eq("+ i +") a").attr("href", links[i]);
					$("#cf-summary .bar-data:eq(" + i + ") p").text("$" + commas[i]);
					$("#cf-summary .bar-data:eq(" + i + ")").animate({
						width:dataWidth[i]
					})
				}


				//meta
				$(".bar-data").css("background","#5FADCE");
				$("#cf-summary .cf-title h2").html(chartControl.cashRaised.loansTitle);
				$("#cf-summary").append("<h4 class=\"chart-h4\" style=\"color:#5FADCE;\">$" + utilityFunctions.commaSeparateNumber(all) + " loans total</h4>");
				$("#cf-summary").append("<p class=\"chart-footer\">" + chartControl.cashRaised.footerLoans + "</p>");				
				chartFunctions.sortBars();
				$(".bar-row[value='0']").css("display","none");
			},
			drawExpenseType:function(){
				var all = 0, data = [], commas = [], ii = 23, dataWidth = [], $thisBar, workaround = [], workaroundCommas = [];
				
				$("#candidates_options_" + race + "_chosen").css("visibility","visible").insertAfter("#cf-expense-type .cf-title");
				$("#expenses_options_chosen").css("visibility","visible").insertAfter("#overall_options_chosen");
				$("#cf-choose-text h4:eq(2)").css("display","block");				
				//get data
				for (i=0 ; i < 28;  i++){
					data[i] = parseInt(summaryDB[ii][thisCandidate]);
					commas[i] = utilityFunctions.commaSeparateNumber(data[i]);
					all = all + data[i];
					ii = ii + 1;
				}
				console.log(data)
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
				$("#cf-expense-type").append("<p class=\"chart-footer\">"+ chartControl.cashSpent.footerExpenseType + "</p>");
			},
			drawRetired:function(){
				var data = [], commas = [], dataWidth = [], links = [];
				var all = 0;
				$("#contribute_options_chosen").css("visibility","visible").insertAfter("#overall_options_chosen");
				$("#cf-choose-text h4:eq(2)").css("display","block");
				//size up data
				var ii = raceColumns[race];
				for (i=0 ; i < raceTotal[race]; i++){
					data[i] = parseInt(mainDB[25][ii]);
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
					$("#cf-summary .bar-row:eq("+ i +") a").attr("href", links[i]);
					$("#cf-summary .bar-data:eq(" + i + ") p").text("$" + commas[i]);
					$("#cf-summary .bar-data:eq(" + i + ")").animate({
						width:dataWidth[i]
					})
				}

				//meta
				$(".bar-data").css("background","#91cf60");
				$("#cf-summary .cf-title h2").html(chartControl.cashRaised.retireeTitle);
				$("#cf-summary").append("<h4 class=\"chart-h4\">$" + utilityFunctions.commaSeparateNumber(all) + " contributed total</h4>");
				$("#cf-summary").append("<p class=\"chart-footer\">"+ chartControl.cashRaised.footerRetiree +"</p>");
				
				chartFunctions.sortBars();
				$(".bar-row[value='0']").css("display","none");
			},
			drawSpent:function(){
				var data = [], commas = [], dataWidth = [], links = [];
				var all = 0;
				$("#expenses_options_chosen").css("visibility","visible").insertAfter("#overall_options_chosen");
				$("#expenses_options_chosen .chosen-single span").text(chartControl.defaultSubTopics[2]);
				$("#cf-choose-text h4:eq(2)").css("display","block");
				//size up data
				var ii = raceColumns[race];
				for (i=0 ; i < raceTotal[race] ;  i++){
					data[i] = parseInt(summaryDB[18][ii]);
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
					$("#cf-summary .bar-row:eq("+ i +") a").attr("href", links[i]);
					$("#cf-summary .bar-data:eq(" + i + ") p").text("$" + commas[i]);
					$("#cf-summary .bar-data:eq(" + i + ")").animate({
						width:dataWidth[i]
					})
				}

				$("#cf-summary .bar-data").css("background","#CE5F75");
				$("#cf-summary .cf-title h2").html(chartControl.cashSpent.cashSpentTitle);
				$("#cf-summary").append("<h4 class=\"chart-h4\" style=\"color:#CE5F75;\">$" + utilityFunctions.commaSeparateNumber(all) + " spent total</h4>");
				$("#cf-summary").append("<p class=\"chart-footer\">"+ chartControl.cashSpent.footerCashSpent +"</p>");
				chartFunctions.sortBars();
				$(".bar-row[value='0']").css("display","none");
			},
			drawCashPerDays:function(){
				var data = [], dataWidth = [], commas = [], all = 0, links = [];
				$("#contribute_options_chosen").css("visibility","visible").insertAfter("#overall_options_chosen");
				$("#cf-choose-text h4:eq(2)").css("display","block");
				//size up data
				var ii = raceColumns[race];
				for (i=0 ; i < raceTotal[race]; i++){
					data[i] = parseInt(mainDB[7][ii]);
					commas[i] = utilityFunctions.commaSeparateNumber(data[i]);
					links[i] = mainDB[3][ii];
					ii = ii + 1;
				}

				//find total
				all = parseInt(mainDB[7][1]);


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

				//meta
				$(".bar-data").css("background","#91cf60");
				$("#cf-summary .cf-title h2").html(chartControl.cashRaised.cashPerDayTitle);
				$("#cf-summary").append("<h4 class=\"chart-h4\">Average Overall $" + utilityFunctions.commaSeparateNumber(all) + "</h4>");
				$("#cf-summary").append("<p class=\"chart-footer\">"+chartControl.cashRaised.footerCashPerDay  +"</p>");
				chartFunctions.sortBars();
				$(".bar-row[value='0']").css("display","none");
			},
			drawGeography:function(){
				var data = [], dataWidth = [], total = [], commas = [], colors = [], links = [];
				//unhide stacked option
				$("#stacked_options_chosen").css("visibility","visible").insertAfter("#overall_options_chosen");
				$("#cf-choose-text h4:eq(2)").css("display","block");	
					
				if (stacked === 0){
					//size up data
					var ii = raceColumns[race];
					for (i=0 ; i < raceTotal[race] ;  i++){
						data[i] = new Array();
						commas[i] = new Array();
						data[i][0] = parseInt(summaryDB[19][ii]);
						data[i][1] = parseInt(summaryDB[20][ii]) - data[i][0];
						data[i][2] = parseInt(summaryDB[21][ii]) - (data[i][0] + data[i][1]);
						data[i][3] = parseInt(summaryDB[22][ii]);
						data[i][4] = mainDB[3][ii];
						commas[i][0] = utilityFunctions.commaSeparateNumber(data[i][0]);
						commas[i][1] = utilityFunctions.commaSeparateNumber(data[i][1]);
						commas[i][2] = utilityFunctions.commaSeparateNumber(data[i][2]);
						commas[i][3] = utilityFunctions.commaSeparateNumber(data[i][3]);
						ii = ii + 1;
					}
					//calculate the total for each candidate
					for (i=0 ; i < raceTotal[race] ; i++){
						total[i] = (data[i][0] + data[i][1] + data[i][2] + data[i][3]);
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
					$("#cf-stacked").append("<p class=\"chart-footer\">" + chartControl.geography.footer + "</p>");
					$(".cf-title h2").html(chartControl.geography.geographyTitle);
					$("#cf-stacked .cf-title").append("<p>(Hover over bars for details)</p>");
					$(".stacked-bar-row[value='0']").add(".stacked-bar-row[value='NaN']").css("display","none");
					
				}		
				else if (stacked === 1){
					//size up data
					var ii = raceColumns[race];
					for (i=0 ; i < raceTotal[race] ;  i++){
						data[i] = new Array();
						commas[i] = new Array();
						data[i][0] = parseInt(summaryDB[19][ii]);
						data[i][1] = parseInt(summaryDB[20][ii]) - data[i][0];
						data[i][2] = parseInt(summaryDB[21][ii]) - (data[i][0] + data[i][1]);
						data[i][3] = parseInt(summaryDB[22][ii]);
						data[i][4] = mainDB[3][ii];
						commas[i][0] = utilityFunctions.commaSeparateNumber(data[i][0]);
						commas[i][1] = utilityFunctions.commaSeparateNumber(data[i][1]);
						commas[i][2] = utilityFunctions.commaSeparateNumber(data[i][2]);
						commas[i][3] = utilityFunctions.commaSeparateNumber(data[i][3]);
						ii = ii + 1;
					}
					//calculate the total for each candidate
					for (i=0 ; i < raceTotal[race] ; i++){
						total[i] = (data[i][0] + data[i][1] + data[i][2] + data[i][3]);
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
					$("#cf-stacked").append("<p class=\"chart-footer\">" + chartControl.geography.footer + "</p>");
					$(".cf-title h2").html(chartControl.geography.geographyTitle);
					$("#cf-stacked .cf-title").append("<p>(Hover over bars for details)</p>");
					$(".stacked-bar-row[value='0']").add(".stacked-bar-row[value='NaN']").css("display","none");
					
				}		
				chartFunctions.sortGeo();
			},
			drawAllDonors:function(){
				$("#candidates_options_" + race + "_chosen").css("visibility","visible").insertAfter("#cf-iframe .cf-title");
				$(".cf-iframe-hold").append(mainDB[29][thisCandidate]);	
				
				//descriptives
				$("#cf-iframe .cf-title h2").html(chartControl.donors.titleAll);
				$("#cf-iframe .cf-title").append("<p>(Area below may be scrollable)</p>");
			},
			drawIEoverview:function(){
				var data = [], split, ieUpdated, dataWidth = [], commas = [], colors = [], total = [], all = 0;
				$("#ie_options_chosen").css("visibility","visible").insertAfter("#overall_options_chosen");
				$("#ie_options_chosen .chosen-single span").text(chartControl.defaultSubTopics[3]);
				$("#cf-choose-text h4:eq(2)").css("display","block");
								
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
				
				//get total overall
				for (i=0; i < total.length; i++){
					all = all + total[i];
				}

				//find highest value in array
				var maxValue = Math.max.apply(null, total);

				//figure out the width for each bar
				for (i = 0 ; i < total.length ; i++){
					dataWidth[i] = (total[i] / maxValue) * dimensions.maxBarWidth;
				}
				
				//sorting by first legend item
				for (i=0 ; i < raceTotal[race] ; i++){
					$("#cf-ie .ie-bar-row:eq(" + i + ")").attr("value",((data[i][0] / total[i]) * 100));
				}
								
				//populate data
				colors = chartControl.ie.legendColor;
				for (i=0 ; i < raceTotal[race] ; i++){
					for (x = 0 ; x < chartControl.ie.legendItems ; x++){
						$("#cf-ie .ie-bar-row:eq(" + i + ") .bar-seg:eq(" + x + ")").css("background",colors[x] ).animate({
							width:((data[i][x] / total[i]) * 100) + "%"
						}).attr("value", data[i][x]);
						$("#cf-ie .bar-data:eq(" + i + ") p").text("$" + utilityFunctions.commaSeparateNumber(total[i]));
						$("#cf-ie .ie-bar-row:eq(" + i + ") .bar-seg:eq(" + x + ")").caltip({
							title:chartControl.ie.legendLabels[x],
							content:"$" + commas[i][x] + " (" + Math.round(((data[i][x] / total[i]) * 100)) + "%" + ")"
						})
					}
				}								
				for (i=0 ; i < total.length ; i++){
					$("#cf-ie .ie-bar-row:eq(" + i + ")").attr("value",total[i]);
					$("#cf-ie .bar-data:eq(" + i + ")").animate({
						width:dataWidth[i] + "px"
					})
				}
				

				//Descriptives
				$("#cf-ie .cf-title h2").html(chartControl.ie.titleOverview);
				$("#cf-ie").append("<h4 class=\"chart-h4\" style=\"color:#486730\">$" + utilityFunctions.commaSeparateNumber(all) + " spent total</h4>");
				$("#cf-ie").append("<p class=\"chart-footer\">" + chartControl.ie.footerOverview + "</p>");
				$("#cf-ie .cf-title").append("<p>(Hover over bars for details)</p>");
				
				//sort
				chartFunctions.sortIE();
				//chartFunctions.sortGeo();
				$(".ie-bar-row[value='NaN']").css("display","none");
				$(".ie-bar-row[value='0']").css("display","none");
				
			},
			drawIEcommittees:function(){
				$("#ie_options_chosen").css("visibility","visible").insertAfter("#overall_options_chosen");
				$("#cf-choose-text h4:eq(2)").css("display","block");
				var parseData = [], data = [], dataWidth = [], commas = [], colors = [], total = [], all = 0;
				
				var ii = raceColumns[race] + 2;
				//Grab IE totals for relavant race
				for (x=0 ; x < ieLength ; x++){
					parseData[x] = 0;
					for (i=0 ; i < raceTotal[race] ; i++){
						parseData[x] = parseData[x] + parseInt(ieDB[x][ii]);
						ii = ii + 1;
					}
					ii = raceColumns[race] + 2;
				}
				
				//size up data
				ii = 0;
				for (i=0 ; i < ieNames.length ;  i++){
					data[i] = new Array();
					commas[i] = new Array();
					data[i][0] = parseData[ii];
					data[i][1] = parseData[ii+1];
					commas[i][0] = utilityFunctions.commaSeparateNumber(data[i][0]);
					commas[i][1] = utilityFunctions.commaSeparateNumber(data[i][1]);
					ii = ii + 2;
				}
								
				//calculate the total for each candidate
				for (i=0 ; i < ieNames.length ; i++){
					total[i] = (data[i][0] + data[i][1]);
				}

				//get total overall
				for (i=0; i < total.length; i++){
					all = all + total[i];
				}
				
				//sorting by first legend item
				for (i=0 ; i < ieNames.length ; i++){
					$("#cf-ie .ie-bar-row:eq(" + i + ")").attr("value",((data[i][0] / total[i]) * 100));
				}
				//find highest value in array
				var maxValue = Math.max.apply(null, total);
				
				//figure out the width for each bar
				for (i = 0 ; i < total.length ; i++){
					dataWidth[i] = (total[i] / maxValue) * dimensions.maxBarWidth;
				}
				
				//populate data
				colors = chartControl.ie.legendColor;
				for (i=0 ; i < ieNames.length ; i++){
					for (x = 0 ; x < chartControl.ie.legendItems ; x++){
						$("#cf-ie .ie-bar-row:eq(" + i + ") .bar-seg:eq(" + x + ")").css("background",colors[x] ).animate({
							width:((data[i][x] / total[i]) * 100) + "%"
						}).attr("value", data[i][x]);
						$("#cf-ie .bar-data:eq(" + i + ") p").text("$" + utilityFunctions.commaSeparateNumber(total[i]));
						$("#cf-ie .ie-bar-row:eq(" + i + ") .bar-seg:eq(" + x + ")").caltip({
							title:chartControl.ie.legendLabels[x],
							content:"$" + commas[i][x] + " (" + Math.round(((data[i][x] / total[i]) * 100)) + "%" + ")"
						})
					}
				}				
				for (i=0 ; i < total.length ; i++){
					$("#cf-ie .ie-bar-row:eq(" + i + ")").attr("value",total[i]);
					$("#cf-ie .bar-data:eq(" + i + ")").animate({
						width:dataWidth[i] + "px"
					})
				}
				//Descriptives
				$("#cf-ie .cf-title h2").html(chartControl.ie.titleCommittees);
				$("#cf-ie").append("<h4 class=\"chart-h4\" style=\"color:#486730\">$" + utilityFunctions.commaSeparateNumber(all) + " spent total</h4>");
				$("#cf-ie").append("<p class=\"chart-footer\">" + chartControl.ie.footerCommittees + "</p>");
				$("#cf-ie .cf-title").append("<p>(Hover over bars for details)</p>");
				
				//sort
				chartFunctions.sortIE();
				
				//kill zero rows
				$(".ie-bar-row[value='NaN']").add(".ie-bar-row[value='0']").css("display","none");
			},
			drawIEcandidates:function(){
				$("#ie_options_chosen").css("visibility","visible").insertAfter("#overall_options_chosen");
				$("#cf-choose-text h4:eq(2)").css("display","block");
				$("#candidates_options_" + race + "_chosen").css("visibility","visible").insertAfter("#cf-ie-legend");
				
				$("#ie_options_chosen").css("visibility","visible").insertAfter("#overall_options_chosen");
				$("#cf-choose-text h4:eq(2)").css("display","block");
				var parseData = [], data = [], dataWidth = [], commas = [], colors = [], total = [], all = 0;
								
				//size up data
				ii = 0;
				for (i=0 ; i < ieNames.length ;  i++){
					data[i] = new Array();
					commas[i] = new Array();
					data[i][0] = parseInt(ieDB[ii][thisCandidate + 2]);
					data[i][1] = parseInt(ieDB[ii+1][thisCandidate + 2]);
					commas[i][0] = utilityFunctions.commaSeparateNumber(data[i][0]);
					commas[i][1] = utilityFunctions.commaSeparateNumber(data[i][1]);
					ii = ii + 2;
					
				}
								
				//calculate the total for each candidate
				for (i=0 ; i < ieNames.length ; i++){
					total[i] = (data[i][0] + data[i][1]);
				}

				//get total overall
				for (i=0; i < total.length; i++){
					all = all + total[i];
				}
				
				//sorting by first legend item
				for (i=0 ; i < ieNames.length ; i++){
					$("#cf-ie .ie-bar-row:eq(" + i + ")").attr("value",((data[i][0] / total[i]) * 100));
				}
				//find highest value in array
				var maxValue = Math.max.apply(null, total);
				
				//figure out the width for each bar
				for (i = 0 ; i < total.length ; i++){
					dataWidth[i] = (total[i] / maxValue) * dimensions.maxBarWidth;
				}
				
				//populate data
				colors = chartControl.ie.legendColor;
				for (i=0 ; i < ieNames.length ; i++){
					for (x = 0 ; x < chartControl.ie.legendItems ; x++){
						$("#cf-ie .ie-bar-row:eq(" + i + ") .bar-seg:eq(" + x + ")").css("background",colors[x] ).animate({
							width:((data[i][x] / total[i]) * 100) + "%"
						}).attr("value", data[i][x]);
						$("#cf-ie .bar-data:eq(" + i + ") p").text("$" + utilityFunctions.commaSeparateNumber(total[i]));
						$("#cf-ie .ie-bar-row:eq(" + i + ") .bar-seg:eq(" + x + ")").caltip({
							title:chartControl.ie.legendLabels[x],
							content:"$" + commas[i][x] + " (" + Math.round(((data[i][x] / total[i]) * 100)) + "%" + ")"
						})
					}
				}				
				for (i=0 ; i < total.length ; i++){
					$("#cf-ie .ie-bar-row:eq(" + i + ")").attr("value",total[i]);
					$("#cf-ie .bar-data:eq(" + i + ")").animate({
						width:dataWidth[i] + "px"
					})
				}
				//Descriptives
				$("#cf-ie .cf-title h2").html(chartControl.ie.titleCandidates);
				$("#cf-ie").append("<h4 class=\"chart-h4\" style=\"color:#486730\">$" + utilityFunctions.commaSeparateNumber(all) + " spent total</h4>");
				$("#cf-ie").append("<p class=\"chart-footer\">" + chartControl.ie.footerCandidates + "</p>");
				$("#cf-ie .cf-title").append("<p>(Hover over bars for details)</p>");
				
				
				//sort
				chartFunctions.sortIE();
				//kill zero rows
				$(".ie-bar-row[value='NaN']").add(".ie-bar-row[value='0']").css("display","none");
			},
			// ------- REFRESHING CANVAS ------- //
			redrawCanvas:function(){
				//magically hide and show chart divs
				//$("#cf-summary .bar-chart").css("display","block");
				//$("#cf-summary").css("display","block");
				//Change view
				if (chartControl.view === "Cash Raised" || chartControl.view === "Raised Summary"){
					chartFunctions.resetCanvas(chartControl.view);
					chartFunctions.renameCanvas(chartControl.view);
					$(".cf-canvas").css("display","none");
					$("#cf-stacked").css("display","block");
					chartFunctions.drawCashRaisedSummary();
				}
				else if (chartControl.view === "Cash Contributions"){
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
					$("#cf-ie").css("display","block");
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
				else if (chartControl.view === "Stats"){
					chartFunctions.resetCanvas(chartControl.view);
					chartFunctions.renameCanvas(chartControl.view);
					$(".cf-canvas").css("display","none");
					$("#cf-overview").css("display","block");
					chartFunctions.drawStatistics();
				}
				else if (chartControl.view === "CPD"){			
					chartFunctions.resetCanvas(chartControl.view);
					chartFunctions.renameCanvas(chartControl.view);
					$(".cf-canvas").css("display","none");
					$("#cf-summary").css("display","block");
					chartFunctions.drawCashPerDays();
				}
				else if (chartControl.view === "Top Donors"){
					chartFunctions.resetCanvas(chartControl.view);
					chartFunctions.renameCanvas(chartControl.view);
					$(".cf-canvas").css("display","none");
					$("#cf-donors").css("display","block");
					chartFunctions.drawTopDonors();
				}
				else if (chartControl.view === "Loans"){
					chartFunctions.resetCanvas(chartControl.view);
					chartFunctions.renameCanvas(chartControl.view);
					$(".cf-canvas").css("display","none");
					$("#cf-summary").css("display","block");
					chartFunctions.drawLoans();
				}
				else if (chartControl.view === "Retirees"){
					chartFunctions.resetCanvas(chartControl.view);
					chartFunctions.renameCanvas(chartControl.view);
					$(".cf-canvas").css("display","none");
					$("#cf-summary").css("display","block");
					chartFunctions.drawRetired();
				}
				else if (chartControl.view === "Geography"){
					$(".cf-canvas").css("display","none");
					$("#cf-stacked").css("display","block");
					chartFunctions.resetCanvas(chartControl.view);
					chartFunctions.renameCanvas(chartControl.view);
					chartFunctions.drawGeography();
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
				else if (chartControl.view === "Achievements"){
					$(".cf-canvas").css("display","none");
					$("#cf-achieve").css("display","block").animate({
						height:300
					});
				}
			},
			resetCanvas:function(view){
				//visibility stacked and summary options
				$("#stacked_options_chosen").css("visibility","hidden");
				$("#summary_options_chosen").css("visibility","hidden");
				$("#contribute_options_chosen").css("visibility","hidden");
				$("#expenses_options_chosen").css("visibility","hidden");
				$("#ie_options_chosen").css("visibility","hidden");
				$("#cf-choose-text h4:eq(2)").css("display","none");
				$("#cf-chart").css("overflow-y","auto");
				for (i = 0 ; i < raceTotal.length ; i++){
					$("#candidates_options_"+i+"_chosen").css("visibility","hidden");
				}
				//reset title
				$(".cf-title p").remove();
				//reset text and colors for chart
				$(".chart-h4").add(".chart-footer").add(".bar-row").add(".stacked-bar-row").add(".ie-bar-row").add(".cf-legend-opt").add(".cf-ie-legend-opt").add(".summary-row").add(".donor-row").remove();

				if (chartControl.view === "Cash Contributions" || chartControl.view === "Non-Cash Givings" || chartControl.view === "Retirees" || chartControl.view === "CPD" || chartControl.view === "Loans" || chartControl.view === "Cash Spent" || chartControl.view === "Expenses Summary"){			
					for (i = 1 ; i < raceTotal[race] + 1; i++){
						$("#cf-summary .bar-chart").append("<div class=\"bar-row\" id=\"" + i + "\"><div class=\"bar-label\"><a href=\"\" target=\"_blank\"><p class=\"the-label\"></p></a></div><div class=\"bar-data\"><p></p></div></div>");
					}
				}		
				else if (chartControl.view === "IE Overview" || chartControl.view === "Outside Money"){
					$(".cf-ie-head").css("height","170px");
					//populate bars based on number of candidates
					for (i = 1 ; i < raceTotal[race] + 1; i++){
						$(".ie-bar-chart").append(chartControl.ie.legendBars);
					}				
					//tag each row with unique ID
					for (i = 1 ; i < raceTotal[race] + 1; i++){
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
				else if (chartControl.view === "IE Committees"){
					$(".cf-ie-head").css("height","170px");
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
					$(".cf-ie-head").css("height","260px");
					//populate IE committees
					for (i=1 ; i < ieNames.length + 1 ; i++){
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
				else if (chartControl.view === "Expense Type"){
					for (i = 1 ; i < 29; i++){
						$("#cf-expense-type .bar-chart").append("<div class=\"bar-row\" id=\"" + i + "\"><div class=\"bar-label\"><a href=\"\" target=\"_blank\"><p class=\"the-label\"></p></a></div><div class=\"bar-data\"><p></p></div></div>");
					}
				}
				else if (chartControl.view === "All Donors"){
					$("#cf-chart").css("overflow-y","hidden");
					$("#cf-iframe iframe").remove();
				}
				else if (chartControl.view === "Geography"){				
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
				else if (chartControl.view === "Cash Raised" || chartControl.view === "Raised Summary"){
						//populate bars based on number of candidates
						for (i = 1 ; i < raceTotal[race] + 1; i++){
							$(".stacked-bar-chart").append(chartControl.geography.legendBars.three);
						}				
						//tag each row with unique ID
						for (i = 1 ; i < raceTotal[race] + 1; i++){
							$("#cf-stacked .stacked-bar-row:eq(" + i + ")").attr("id", i);
						}
						//Give Max Width to Bars
						$(".stacked-bar-row").css("width", dimensions.overall);
						$(".stacked-bar-row .bar-data").css("width", dimensions.maxBarWidth);
						//populate legend
						for (i = 0 ; i < 3 ; i++){
							$("#cf-legend").append("<div class=\"cf-legend-opt\"><p>" + chartControl.cashRaised.summaryLegendLabels[i] + "</p></div>");
							$(".cf-legend-opt:eq(" + i + ")").css("background", chartControl.cashRaised.summaryLegendColors[i]);
						}		
				}
				else if (chartControl.view === "Summary" || chartControl.view === "Ranking"){
					for (i = 1 ; i < raceTotal[race] + 1; i++){
						$("#cf-overview").append("<div class=\"summary-row\" id=\""+i+"\"><a href=\"\" target=\"_blank\"><div class=\"summary-cell\"><img src=\"\"><p></p><p></p></div><div class=\"summary-cell\"><p></p><p></p></div><div class=\"summary-cell\"><p></p><p></p></div><div class=\"summary-cell\"><p></p><p></p></div></a></div>");
					}
					$("#cf-head-label-0").html("<p style=\"left:31%\">War Chest</p>");
					$("#cf-head-label-1").html("<p style=\"left:54%\">Cash Raised</p>");
					$("#cf-head-label-2").html("<p style=\"left:80%\">Cash Spent</p>");
				}
				else if (chartControl.view === "Stats"){
					for (i = 1 ; i < raceTotal[race] + 1; i++){
						$("#cf-overview").append("<div class=\"summary-row\" id=\""+i+"\"><a href=\"\" target=\"_blank\"><div class=\"summary-cell\"><img src=\"\"><p></p><p></p></div><div class=\"summary-cell\"><p></p><p></p></div><div class=\"summary-cell\"><p></p><p></p></div><div class=\"summary-cell\"><p></p><p></p></div></a></div>");
					}		
					$("#cf-head-label-0").html("<p style=\"left:29%\">Contributions</p>");
					$("#cf-head-label-1").html("<p style=\"left:52%\">Median *</p>");
					$("#cf-head-label-2").html("<p style=\"left:78%\">Days Fundraising</p>");				
					$("#cf-donors").append("<p class=\"chart-footer\">Average Amount is the total amount of reported cash contributions divided by the number of reported cash contributions. Days Fundraising starts with the first disclosed reported contribution listed on campaigin finance disclosure form.</p>");			
				}
				else if (chartControl.view === "Top Donors"){
					for (i = 1 ; i < raceTotal[race] + 1; i++){
						$("#cf-donors").append("<div class=\"donor-row\" id=\""+i+"\"><a href=\"\" target=\"_blank\"><div class=\"donor-cell\"><img src=\"\"><p></p><p></p></div><div class=\"donor-cell\"><p><span></span><br><span></span></p><p><span></span><br><span></span></p><p><span></span><br><span></span></p></div><div class=\"donor-cell\"><p><span></span><br><span></span></p><p><span></span><br><span></span></p><p><span></span><br><span></span></p></div></a></div>");
					}
				}	
				//resize labels
				$(".bar-label").css("width",dimensions.label);
			},
			renameCanvas:function(view){
					var ii = raceColumns[race];
					if (chartControl.view === "Cash Contributions" || chartControl.view === "Non-Cash Givings" || chartControl.view === "Cash Spent" || chartControl.view === "CPD" || chartControl.view === "Retirees" || chartControl.view === "Loans" || chartControl.view === "Expenses Summary"){
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
						for (i = 0; i < raceTotal[race]; i++){
							$("#cf-ie .ie-bar-row:eq("+ i +") .bar-label p").html(summaryDB[0][ii]);
							ii = ii + 1;
						}
					}
					else if (chartControl.view === "IE Committees"){
						for (i=0 ; i < ieNames.length ; i++){
							$("#cf-ie .ie-bar-row:eq("+ i +") .bar-label p").html(ieNames[i]);
						}
						
					}
					else if (chartControl.view === "IE Candidates"){
						for (i=0 ; i < ieNames.length ; i++){
							$("#cf-ie .ie-bar-row:eq("+ i +") .bar-label p").html(ieNames[i]);
						}
						
					}
					else if (chartControl.view === "Geography" || chartControl.view === "Cash Raised" || chartControl.view === "Raised Summary"){
						for (i = 0; i < raceTotal[race]; i++){
							$("#cf-stacked .stacked-bar-row:eq("+ i +") .bar-label p").html(summaryDB[0][ii]);
							ii = ii + 1;
						}
					}
					else if (chartControl.view === "Summary" || chartControl.view === "Ranking" || chartControl.view === "Stats"){
						for (i = 0; i < raceTotal[race]; i++){
							$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(0) img").attr("src", mainDB[2][ii]);
							$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(0) p:eq(0)").html(summaryDB[0][ii]);
							$("#cf-overview .summary-row:eq("+ i +") .summary-cell:eq(0) p:eq(1)").html(summaryDB[1][ii]);
							ii = ii + 1;
						}			
					}
					else if (chartControl.view === "Top Donors"){
						for (i = 0; i < raceTotal[race]; i++){
							$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(0) img").attr("src", mainDB[2][ii]);
							$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(0) p:eq(0)").html(summaryDB[0][ii]);
							$("#cf-donors .donor-row:eq("+ i +") .donor-cell:eq(0) p:eq(1)").html(summaryDB[1][ii]);
							ii = ii + 1;
						}
					}
			},
			// ------- SORTING ------- //
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
			$("#loading h1:eq(0)").html("Connecting to DAC Server...");
		}
		else if (random === 3){
			$("#loading h1:eq(0)").html("Circumventing NSA Snooping...");
		}
		else if (random === 4){
			$("#loading h1:eq(0)").html("Consulting Consultants...");
		}
		else if (random === 5){
			$("#loading h1:eq(0)").html("Populating Politicans...");
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
			$("#loading h1:eq(0)").html("Dishing Out Dough...");
		}
	});
// ------- TABLETOP ------- //
	$(document).ready(function(){
			Tabletop.init( { key: gsheet,
		                     callback: chartFunctions.setTheScene,
		                     wanted: ["Control","Summary","Main","IE_Overview"],
		                     debug: true } );
	});
