<?php
/*
	Template Name: CF Overview Page
*/	
	
 


get_header(); ?>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="http://oaktowndata.com/wp-content/js/tabletop.js"></script>
<script src="http://oaktowndata.com/wp-content/js/chosen.jquery.js"></script>
<script src="http://oaktowndata.com/wp-content/js/caltip.min.js"></script>
<script src="http://oaktowndata.com/wp-content/js/cfoverview.js"></script>


<div id="primary" class="site-content" style="width:100%">
	<div id="content" role="main">
		<div id="cf-container">
			<h2>Oakland Mayoral Race 2014 - Candidates</h2>
			<p style="margin:-10px 0 0 0"><strong>To explore the finances of a candidate, click on one of the below photos.</strong></p>
			<div id="cf-options">
				<div>
					<a href="http://oaktowndata.com/oakland-mayoral/jason-kane-anderson/"><img title="Jason Kane Anderson" src="http://oaktowndata.com/wp-content/uploads/anderson-100.jpg"></a>
					<h4>Jason Kane Anderson</h4>
				</div>
				<!--<div>
					<a href="http://oaktowndata.com/oakland-mayoral/peter-yuan-liu/"><img title="Peter Liu" src="http://oaktowndata.com/wp-content/uploads/liu-100.jpg"></a>
					<h4>Peter Liu</h4>
				</div>-->
				<div>
					<a href="http://oaktowndata.com/oakland-mayoral/patrick-mccullough/"><img title="Patrick McCullough"  src="http://oaktowndata.com/wp-content/uploads/mccullough-100.jpg"></a>
					<h4>Patrick McCullough</h4>
				</div>
				<div>
					<a href="http://oaktowndata.com/oakland-mayoral/bryan-parker/"><img title="Bryan Parker" src="http://oaktowndata.com/wp-content/uploads/bryanparker-100.jpg"></a>
					<h4>Bryan Parker</h4>
				</div>
				<div>
					<a href="http://oaktowndata.com/oakland-mayoral/jean-quan/"><img title="Jean Quan" src="http://oaktowndata.com/wp-content/uploads/jeanquan-100.jpg"></a>
					<h4>Jean Quan</h4>
				</div>
				<div>
					<a href="http://oaktowndata.com/oakland-mayoral/courtney-ruby/"><img title="Courtney Ruby" src="http://oaktowndata.com/wp-content/uploads/ruby-100.jpg"></a>
					<h4>Courtney Ruby</h4>
				</div>
				<div>
					<a href="http://oaktowndata.com/oakland-mayoral/libby-schaaf/"><img title="Libby Schaff" src="http://oaktowndata.com/wp-content/uploads/libbyschaff-100.jpg"></a>
					<h4>Libby Schaaf</h4>
				</div>
				<!--<div>
					<a href="http://oaktowndata.com/oakland-mayoral/nancy-sidebotham/"><img title="Nancy Sidebotham" src="http://oaktowndata.com/wp-content/uploads/sidebotham-100.jpg"></a>
					<h4>Nancy Sidebotham</h4>
				</div>-->
				<div>
					<a href="http://oaktowndata.com/oakland-mayoral/dan-siegel/"><img title="Dan Siegel" src="http://oaktowndata.com/wp-content/uploads/dansiegel-100.jpg"></a>
					<h4>Dan Siegel</h4>
				</div>
				<div>
					<a href="http://oaktowndata.com/oakland-mayoral/joe-tuman/"><img title="Joe Tuman" src="http://oaktowndata.com/wp-content/uploads/joetuman-100.jpg"></a>
					<h4>Joe Tuman</h4>
				</div>

				
			</div>
			<div id="cf-text">
				<p>The 2014 mayoral race in Oakland will be an interesting one. Incumbent Mayor Jean Quan faces challenges from 16 candidates from the left and center. Since this website is only tracking the election money, candidates who have not filed committees will not be listed above (<a href="http://www2.oaklandnet.com/oakca1/groups/cityclerk/documents/webcontent/oak046147.pdf">Click here for a list of all mayoral candidates</a>). The rank choice voting system in Oakland allows for alliances of sorts to be made between candidates, as voters can vote on their first, second and third candidates of choice. With the next four years of Oakland in play, this resource is available to allow people to follow who is lining the pockets of each candidate, what their main positions are, and what alliances, if any, have been formed. </p>
			</div>
			<div id="loading">
				<h1><strong></strong></h1>
				<p>this should only take a moment</p>
			</div>
			<div id="cf-chart">		
				<div id="cf-choose">
					<select id="overall-options" class="chosen-select" style="width:200px;float:left;" tabindex="2">
						<option value="Cash Raised">Cash Raised</option>
						<option value="Cash Spent">Cash Spent</option>
						<option value="Sectors">Sectors/Industries</option>
						<option value="Contributors">Top Contributors</option>
						<option value="Sectors">Geography</option>
					</select>
				</div>
				<div id="cf-contribute" class="cf-canvas">
					<div class="cf-title" style="float:none;">
						<h2>Top Contributors 2013-2014</h2>
						<h4>Last Report 1/30/2014</h4>
					</div>
					<div id="top-employer" class="cf-infobox">
						<h4>Top 5 Employers</h4>
						<ul>
							<li><span>Homemaker</span>: $<span>18,450</span></li>
							<li><span>A B & I Foundary</span>: $<span>7,000</span></li>
							<li><span>Not Employed</span>: $<span>5,970</span></li>
							<li><span>DaVita HealthCare Partners, Inc.</span>: $<span>5,650</span></li>
							<li><span>San Francisco Regional Center</span>: $<span>5,100</span></li>
						</ul>
					</div>
					<div class="highlights" id="cf-average">
						<h4>$309</h4>
						<p>average reported contribution</p>
					</div>
					<div class="highlights" id="cf-no">
						<h4>1,541</h4>
						<p>number of contributions</p>
					</div>	
					<p class="chart-footer">Top employers include the total number of contributions from both individuals who work for the employer and contributions made by the employer itself. Contributions where a person who identified themself as Retired have been excluded from this list as it is an entire category in and of itself. Average amount per contribution based off of all reported contributions; contributions under $100 typically don't have to be reported.</p>
					
				</div>
				<div id="cf-stacked" class="cf-canvas">
					<div class="stacked-bar-chart">
						<div class="cf-head">
							<div class="cf-title">
								<h2>Where Contributions Came From (hover over bars for details)</h2>
								<h4></h4>
							</div>
							<div id="cf-legend">
								<div class="cf-legend-opt"><p>LEGEND:</p></div>
								<div class="cf-legend-opt"><p>Oakland</p></div>
								<div class="cf-legend-opt"><p>Bay Area</p></div>
								<div class="cf-legend-opt"><p>California</p></div>
								<div class="cf-legend-opt"><p>Outside California</p></div>								
							</div>
							<div class="stacked-bar-row" id="1">
								<div class="bar-label">
									<p class="the-label">Patrick McCullough</p>
								</div>
								<div class="bar-data">
									<div id="oakland" class="bar-seg"></div>
									<div id="bayarea" class="bar-seg"></div>
									<div id="cali" class="bar-seg"></div>
									<div id="notcali" class="bar-seg"></div>
								</div>
							</div>
							<div class="stacked-bar-row" id="2">
								<div class="bar-label">
									<p class="the-label">Bryan Parker</p>
								</div>
								<div class="bar-data">
									<div id="oakland" class="bar-seg"></div>
									<div id="bayarea" class="bar-seg"></div>
									<div id="cali" class="bar-seg"></div>
									<div id="notcali" class="bar-seg"></div>
								</div>
							</div>
							<div class="stacked-bar-row" id="3">
								<div class="bar-label">
									<p class="the-label">Jean Quan</p>
								</div>
								<div class="bar-data">
									<div id="oakland" class="bar-seg"></div>
									<div id="bayarea" class="bar-seg"></div>
									<div id="cali" class="bar-seg"></div>
									<div id="notcali" class="bar-seg"></div>
								</div>
							</div>
							<div class="stacked-bar-row" id="4">
								<div class="bar-label">
									<p class="the-label">Libby Schaaf</p>
								</div>
								<div class="bar-data">
									<div id="oakland" class="bar-seg"></div>
									<div id="bayarea" class="bar-seg"></div>
									<div id="cali" class="bar-seg"></div>
									<div id="notcali" class="bar-seg"></div>
								</div>
							</div>
							<div class="stacked-bar-row" id="5">
								<div class="bar-label">
									<p class="the-label">Dan Siegel</p>
								</div>
								<div class="bar-data">
									<div id="oakland" class="bar-seg"></div>
									<div id="bayarea" class="bar-seg"></div>
									<div id="cali" class="bar-seg"></div>
									<div id="notcali" class="bar-seg"></div>
								</div>
							</div>
							<div class="stacked-bar-row" id="6">
								<div class="bar-label">
									<p class="the-label">Joe Tuman</p>
								</div>
								<div class="bar-data">
									<div id="oakland" class="bar-seg"></div>
									<div id="bayarea" class="bar-seg"></div>
									<div id="cali" class="bar-seg"></div>
									<div id="notcali" class="bar-seg"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="cf-industry" class="cf-canvas">
						<div class="drill-bar-chart">
							<div class="cf-head">
								<div class="cf-title">
									<h2>Total Cash Raised 2013-2014</h2>
									<h4>Last Report 1/30/2014</h4>
								</div>
								<div class="cf-detail">
									<p><strong>Click to Go Back</strong></p>
								</div>	
							</div>
						</div>
				</div>
				<div id="cf-summary" class="cf-canvas">
					<div class="bar-chart">
						<div class="cf-head">
							<div class="cf-title">
								<h2>Total Cash Raised 2013-2014</h2>
								<h4>Last Report 1/30/2014</h4>
							</div>
						</div>	
						<div class="bar-row" id="1">
							<div class="bar-label">
								<p class="the-label">Patrick McCullough</p>
							</div>
							<div class="bar-data">
								<p></p>
							</div>
						</div>
						<div class="bar-row" id="2">
							<div class="bar-label">
								<p class="the-label">Bryan Parker</p>
							</div>
							<div class="bar-data">
								<p></p>
							</div>
						</div>
						<div class="bar-row" id="3">
							<div class="bar-label">
								<p class="the-label">Jean Quan</p>
							</div>
							<div class="bar-data">
								<p></p>
							</div>
						</div>
						<div class="bar-row" id="4">
							<div class="bar-label">
								<p class="the-label">Libby Schaaf</p>
							</div>
							<div class="bar-data">
								<p></p>
							</div>
						</div>
						<div class="bar-row" id="5">
							<div class="bar-label">
								<p class="the-label">Dan Siegel</p>
							</div>
							<div class="bar-data">
								<p></p>
							</div>
						</div>
						<div class="bar-row" id="6">
							<div class="bar-label">
								<p class="the-label">Joe Tuman</p>
							</div>
							<div class="bar-data">
								<p></p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>	


<?php get_footer(); ?>