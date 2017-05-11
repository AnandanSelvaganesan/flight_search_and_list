
registerEntityRenderer('Air', new AirEntityRenderer());

function AirEntityRenderer(){
    
    this.renderEntity = function(section){
        
    	var trip_type = section['trip_type'];	
    	var tripCode = section['trip_code'];
       	var sectionDiv = "<div class='panel panel-accordion-default margin-b-2 border-r' id='section_"+section.id+"' onclick='toggleSelection("+section.id+")'>";
    	sectionDiv += "<div>";

	    	if("roundtrip" == trip_type){
	    		
	    		var directions = section['direction'];
	    		
	    		if(tripCode == "I" || (tripCode == "D" && section['direction_type'] == "OR")){
	    			
	    			sectionDiv += this.interNationalRenderSection(directions,section);
	    			
				}else{
					for(var i = 0; i < directions.length; i++){		
			    		sectionDiv += this.renderSection(directions[i],section,i);
		    		}
				}
	    		
	    	}else {
	            var directions = section['direction'];
	      		for(var i = 0; i < directions.length; i++){
	      		sectionDiv += this.renderSection(directions[i],section,i);
	      	}
      	} 
    	
    	if("roundtrip" == trip_type){
            
    	}else if("onway" == trip_type){

    	}else{
    		
    	}
    	sectionDiv += "</div>";
    	sectionDiv += "</div>";
        return sectionDiv;
        
    };
    
    this.renderSection = function(directions,section,count){
    	
    	var legs = directions['leg'];
    	var trip_type = section['trip_type'];
    	
    	var isMultiFlights = "";
        var flightName = "";
        var tempFlightCode = "";
        var departureTime = "";
        var arrivalTime = "";
        var flightRoute = "";
        var totalDuration = "";
        var totalStops = "";
        
       
        
    	var sectionDiv = "";
    	if("roundtrip" == trip_type){
			sectionDiv += "<div class='border-bottom'>";
		}
    	

    	for(var i = 0; i < legs.length; i++){

    		var leg = legs[i];
    		var stops = directions['stops'];
    		var flightCode = leg['flight_code'];
    			        
	        if(!stops){
	        	stops = "0";
	        }
	        
	        if(stops){
	        	if("0" == stops){
	        		stops = "Non-Stop";
	        	}else if("1" == stops){
	        		stops = "1 Stop";
	        	}else{
	        		stops = stops + " Stop";
	        	}
	        }
	        if(i==0){

		        flightName = leg['flight_name'] + "<br><span> "+leg['flight_code']+ "-" + leg['flight_number'] +"</span>";
		        
		        departureTime = leg['departure_time'];
		        flightRoute = leg['source_city_code'];   
		        totalDuration = directions['duration'];//leg['duration'];
		        totalStops = stops;
	        
	        }
	        if(flightCode != tempFlightCode){
	        	isMultiFlights += "<img class='airline_img margin-r-4' src='"+leg['flight_image']+"'>";

	        	if(i>0){
	        		flightName = "Multiple flights";
	        	}
	        }
	        flightRoute += " &rarr; "+ leg['destination_city_code'];
	        if(i == legs.length-1){ 	
	        	arrivalTime = leg['arrival_time'];
	        }

	        tempFlightCode = flightCode;
	        
	        

    	}
    	
    	
    	sectionDiv +="<div class='panel-heading padding-0'>";//panel-heading tag open

		 sectionDiv +="<span class='tick_mark_holder'>";
		 sectionDiv +="<span class='tick_mark'></span>";
		 sectionDiv +="<span class='tick_mark_icon glyphicon glyphicon-ok white-color'></span>";
		 sectionDiv +="</span>";
		
		 sectionDiv += "<div class='row margin-r-l-0'>";//row tag open
		
		 sectionDiv += "<div class='hover col-xs-9 p10 p-b-0 border-rgt'>";//hover tag open
    	sectionDiv += "<div class='col-xs-3 p-l-0 p-r-0 margin-t-15'>";
    	
    	sectionDiv += isMultiFlights //"<img class='airline_img' src='"+leg['flight_image']+"'>";
		sectionDiv += "<p class='margin-b-0 p-r-4'>"+ flightName +"</p>";
		
		sectionDiv += "</div>";
		
		sectionDiv += "<div class='col-xs-6 p-l-0 p-r-0 margin-t-15'>";
		
		sectionDiv += "<div class='col-xs-6 p-l-0 p-r-0'>";
		sectionDiv += "<h5 class='margin-t-0 margin-b-5'>"+ departureTime +"</h5>";
		sectionDiv += "</div>";
		
		sectionDiv += "<div class='col-xs-6 p-l-0 p-r-0'>";
		sectionDiv += "<h5 class='margin-t-0 margin-b-5'>"+ arrivalTime +"</h5>";
		sectionDiv += "</div>";
		
		sectionDiv += "<div class='col-xs-12 p-l-0 p-r-0'>";
		sectionDiv += "<p class='font10 color-drakgray'>" + flightRoute +"</p>";
		sectionDiv += "</div>";

		sectionDiv += "</div>";

		sectionDiv += "<div class='col-xs-3 p-l-0 p-r-0 margin-t-15'>";
		sectionDiv += "<h5 class='margin-t-0 margin-b-5'>" + totalDuration + "</h5>";
		sectionDiv += "<p class='font10 color-drakgray'>" + totalStops + "</p>";
		sectionDiv += "</div>";
		
    	sectionDiv += "<div class='col-xs-12 p-l-0 p-r-0 text-center m-t-15'>";
		sectionDiv += "<a class='btn-default-itinerary btn btn-default btn-xxs collapsed' id='tab-flight-iti-"+section.id+"-"+count+"' data-id='flight-iti-"+section.id+"-"+count+"' onclick='toggleTabs(this,"+section.id+","+count+")' href='javascript:void(0);'>Flight itinerary details</a>";
		//sectionDiv += "<a class='btn-default-itinerary btn btn-default btn-xxs collapsed' id='tab-compare-provider-"+section.id+"-"+count+"' data-id='compare-provider-"+section.id+"-"+count+"' onclick='toggleTabs(this,"+section.id+","+count+")' href='javascript:void(0);'>Compare price</a>";
		sectionDiv += "</div>";
	
		sectionDiv += "</div>";//hover tag close

		if(count !=1){
		sectionDiv += "<div class='col-xs-3 p-t-10 p-r-10 p-b-0 text-right'>";//price tag open
	
		var data_price = getPriceData(section['price']);
    	var currencyCode = getCurrencyCode(section['price']);
    	var currencyLbl = document.getElementById("selected_currency_lbl");
    	var currentCurrencyCode = currencyLbl.getAttribute('data-current-currency-code');
    	var convRate = currencyLbl.getAttribute('data-current-currency-rate');
    	var result = compareStrings(currencyCode,currentCurrencyCode);
    	
    	var price = "";
    	if(!result){
    		price = formatCurrency(data_price,convRate,currentCurrencyCode);
    	} else {
    		price = section['price'];
    	}
		
    	sectionDiv += "<img class='h14' src='images/"+section['provider'].toLowerCase()+".png'  id='provider_"+section.id+"' alt='"+ section['provider'] +"' data-provider='"+ section['provider'] +"'/>";
    	
    	/*if(isHigherTicketPrice(data_price)){
    		sectionDiv += "<h3 class='panel-title p-t-b-5' id='price_"+section.id+"' data-price='"+ data_price +"'><a href='#' title='Deviation'><span class='glyphicon glyphicon-alert red'></span></a>&nbsp;&nbsp;" + price + "</h3>";
    	}else{*/
    		sectionDiv += "<h3 class='panel-title p-t-b-5' id='price_"+section.id+"' data-price='"+ data_price +"'>" + price + "</h3>";
    	//}
    	var mode = "Assist";
    	
    	if(_mode){
    		mode = _mode;
    	}
    	
		if("roundtrip" == trip_type){
    		if(_mode == "SBT"){
    			sectionDiv += "<button class='btn btn-primary btn-xs' onclick=onBook("+ section.id +") >Book</button>";
    		}else {
    			if(!section['is_selected']){
    				
    				if(isHigherTicketPrice(data_price)){
    					sectionDiv += "<button class='btn btn-warning btn-xs' title = 'Deviation Price: INR " + _searchedAvgTicketPrice + "' onclick=onAirBook("+ section.id +")><span class='glyphicon glyphicon-alert'></span>&nbsp;&nbsp;Select</button>";
    				}else{
    					sectionDiv += "<button class='btn btn-primary btn-xs' onclick=onAirBook("+ section.id +")>Select</button>";

    				}
    			}else {
	    			sectionDiv += "<button class='btn btn-primary btn-xs' onclick=onAirConfirm("+ section.id +") >Confirm</button>";
	    			sectionDiv += "<button class='btn btn-primary btn-xs' onclick=onAirCancel("+ section.id +") >Cancel</button>";
	    		}
    		}
    	}else{
    		if(_mode == "SBT"){
    			
    			sectionDiv += "<button class='btn btn-primary btn-xs' onclick=onBook("+ section.id +") >Book</button>";
    		}else {
	    		
    			if(!section['is_selected']){
    				if(isHigherTicketPrice(data_price)){
    					sectionDiv += "<button class='btn btn-warning btn-xs' title = 'Deviation Price: INR " + _searchedAvgTicketPrice + "' onclick=onAirBook("+ section.id +")><span class='glyphicon glyphicon-alert'></span>&nbsp;&nbsp;Select</button>";
    				}else{
    					sectionDiv += "<button class='btn btn-primary btn-xs' onclick=onAirBook("+ section.id +")>Select</button>";

    				}
	    		}else {
	    			sectionDiv += "<button class='btn btn-primary btn-xs' onclick=onAirConfirm("+ section.id +") >Confirm</button>";
	    			sectionDiv += "<button class='btn btn-primary btn-xs' onclick=onAirCancel("+ section.id +") >Cancel</button>";
	    		}
    		}
    	}
	
		sectionDiv += "<div class='m-t-b-10'>";
		sectionDiv += "<a href='javascript:void(0);' id='a_"+ section.id +"' class='btn btn-link btn-xxs p-r-0 p-l-0 border-bottom-dotted' title=''>Fare Details</a>";
		sectionDiv += this.renderFareDetails(section);
		sectionDiv += "</div>";
		
		sectionDiv += "</div>";//price tag close
		}
		sectionDiv += "</div>";//row tag close
    	
    	
    	
    	sectionDiv += "<div class='panel-collapse collapse' id='flight-iti-"+section.id+"-"+count +"' role='tabpanel'>";
		sectionDiv += "<div class='panel-body p10'>";
		
		for(var j = 0; j < legs.length; j++){
		    	
			var leg = legs[j];
    		var stops = directions['no_of_stops'];
	        
	        if(!stops){
	        	stops = "0";
	        }
	        
	        if(stops){
	        	if("0" == stops){
	        		stops = "Non Stop";
	        	}else if("1" == stops){
	        		stops = "1 Stop";
	        	}else{
	        		stops = stops + " Stop";
	        	}
	        }
	        
	        sectionDiv += "<div class='row margin-r-l-0'>";
			
			if(j == (legs.length-1))
				sectionDiv += "<div class='col-xs-9'>";
			else
				sectionDiv += "<div class='col-xs-9 border-bottom'>";
			
			if(j != 0)
				sectionDiv += "<h5 class='m-b-10 m-t-5 font12'>Change flights at " + leg['source_city_code'] + "</h5>";
			
				
				sectionDiv += "<div class='col-xs-3 p-l-0 p-r-0 margin-t-0'>";
					sectionDiv += "<img class='airline_img' src='"+leg['flight_image']+"'>";
					//sectionDiv += "<p class='margin-b-0'>"+leg['flight_name']+"</p>";
					sectionDiv += "<p>"+leg['flight_code']+ "-" + leg['flight_number'] +"</p>";
				sectionDiv += "</div>";
				
				sectionDiv += "<div class='col-xs-3 p-l-0 p-r-0 margin-t-0'>";
					sectionDiv += "<h5 class='margin-t-0 margin-b-5'>" + leg['departure_time'] + "</h5>";
					sectionDiv += "<p class='font10 color-drakgray'>" + leg['source_city_code'] + " &rarr; "+ leg['destination_city_code'] +"</p>";
				sectionDiv += "</div>";
				
				
				sectionDiv += "<div class='col-xs-3 p-l-0 p-r-0 margin-t-0'>";
					sectionDiv += "<h5 class='margin-t-0 margin-b-5'>"+ leg['arrival_time'] +"</h5>";
					sectionDiv += "<p class='font10 color-drakgray'>" + leg['arrival_date'] + "</p>";
				sectionDiv += "</div>";
				
				sectionDiv += "<div class='col-xs-3 p-l-0 p-r-0 margin-t-0'>";
					sectionDiv += "<h5 class='margin-t-0 margin-b-5'>" + leg['duration'] + "</h5>";
					sectionDiv += "<p class='font10 color-drakgray'>" + stops + "</p>";
				sectionDiv += "</div>";				
			
			sectionDiv += "</div>";
			sectionDiv += "</div>";
	        
		    		
		}
		
		sectionDiv += "</div>";//panel-body tag close
    	sectionDiv += "</div>";//panel-collapse tag close
    	sectionDiv += "</div>";//panel-heading tag close
    	
    	
    	sectionDiv += "<div class='panel-collapse collapse' id='compare-provider-"+section.id+"-"+count +"' role='tabpanel'>";
    	sectionDiv += "<div class='panel-body p10'>Content";
    	sectionDiv += "</div>";//panel-body tag close
    	sectionDiv += "</div>";//panel-collapse tag close
    	
    	if("roundtrip" == trip_type){
			sectionDiv += "</div>";
		}
    	
    	return sectionDiv;
    	
};

function isHigherTicketPrice(price){
	
	var retVal = false;
	
	if(price && _searchedAvgTicketPrice){
		
		var ticketPrice = parseFloat(price);
		
		var averageTicketPrice =  parseFloat(_searchedAvgTicketPrice);
		
		if(price > averageTicketPrice){
			
			retVal = true;
			
		}
		
	}
	
	return retVal;
	
}
    
this.interNationalRenderSection = function (directions,section){
	
	var sectionDiv = "";
	
	sectionDiv +="<div class='panel-heading padding-0'>";//panel-heading tag open
	
	sectionDiv +="<span class='tick_mark_holder'>";
	sectionDiv +="<span class='tick_mark'></span>";
	sectionDiv +="<span class='tick_mark_icon glyphicon glyphicon-ok white-color'></span>";
	sectionDiv +="</span>";
	
	sectionDiv += "<div class='row margin-r-l-0'>";//row tag open
	sectionDiv += "<div class='hover col-xs-9 p10 p-b-0 border-rgt'>";//hover tag open
	
	for(var int = 0; int < directions.length; int++){		
	
		var direction = directions[int];
		var legs = direction['leg'];
		var trip_type = section['trip_type'];
		
		var isMultiFlights = "";
	    var flightName = "";
	    var tempFlightCode = "";
	    var departureTime = "";
	    var arrivalTime = "";
	    var flightRoute = "";
	    var totalDuration = "";
	    var totalStops = "";

		for(var i = 0; i < legs.length; i++){
	
			var leg = legs[i];
			var stops = direction['stops'];
			var flightCode = leg['flight_code'];
				        
	        if(!stops){
	        	stops = "0";
	        }
	        
	        if(stops){
	        	if("0" == stops){
	        		stops = "Non-Stop";
	        	}else if("1" == stops){
	        		stops = "1 Stop";
	        	}else{
	        		stops = stops + " Stop";
	        	}
	        }
	        
	        if(i==0){
	
		        flightName = leg['flight_name'] + "<br><span> "+leg['flight_code']+ "-" + leg['flight_number'] +"</span>";
		        departureTime = leg['departure_time'];
		        flightRoute = leg['source_city_code'];   
		        totalDuration = direction['duration'];//leg['duration'];
		        totalStops = stops;
	        
	        }
	        if(flightCode != tempFlightCode){
	        	isMultiFlights += "<img class='airline_img margin-r-4' src='"+leg['flight_image']+"'>";
	        	
	        	if(i>0){
	        		flightName = "Multiple flights";
	        	}
	        }
	        flightRoute += " &rarr; "+ leg['destination_city_code'];
	        if(i == legs.length-1){ 	
	        	arrivalTime = leg['arrival_time'];
	        }
	
	        tempFlightCode = flightCode;

		}
		
		if(int==1)
			var marigntop = "margin-t-0";
		else
			var marigntop = "margin-t-15";
		
		sectionDiv += "<div class='col-xs-12 p-l-0 p-r-0'>";//section tag open
		
		sectionDiv += "<div class='col-xs-3 p-l-0 p-r-0 "+ marigntop +"'>";
		
			if(int!=1){
				sectionDiv += isMultiFlights //"<img class='airline_img' src='"+leg['flight_image']+"'>";
				sectionDiv += "<p class='margin-b-0 p-r-4'>"+ flightName +"</p>";
			}
			
		sectionDiv += "</div>";
		
		sectionDiv += "<div class='col-xs-6 p-l-0 p-r-0 "+ marigntop +"'>";
		
		sectionDiv += "<div class='col-xs-6 p-l-0 p-r-0'>";
		sectionDiv += "<h5 class='margin-t-0 margin-b-5'>"+ departureTime +"</h5>";
		sectionDiv += "</div>";
		
		sectionDiv += "<div class='col-xs-6 p-l-0 p-r-0'>";
		sectionDiv += "<h5 class='margin-t-0 margin-b-5'>"+ arrivalTime +"</h5>";
		sectionDiv += "</div>";
		
		sectionDiv += "<div class='col-xs-12 p-l-0 p-r-0'>";
		sectionDiv += "<p class='font10 color-drakgray'>" + flightRoute +"</p>";
		sectionDiv += "</div>";
	
		sectionDiv += "</div>";
	
		sectionDiv += "<div class='col-xs-3 p-l-0 p-r-0 "+ marigntop +"'>";
		sectionDiv += "<h5 class='margin-t-0 margin-b-5'>" + totalDuration + "</h5>";
		sectionDiv += "<p class='font10 color-drakgray'>" + totalStops + "</p>";
		sectionDiv += "</div>";
		
		sectionDiv += "</div>";//section tag close
		
			
		if(int==1){
				
			sectionDiv += "<div class='col-xs-12 p-l-0 p-r-0 text-center m-t-15'>";
			sectionDiv += "<a class='btn-default-itinerary btn btn-default btn-xxs collapsed' id='tab-flight-iti-"+section.id+"-"+count+"' data-id='flight-iti-"+section.id+"-"+count+"' onclick='toggleTabs(this,"+section.id+","+count+")' href='javascript:void(0);'>Flight itinerary details</a>";
			//sectionDiv += "<a class='btn-default-itinerary btn btn-default btn-xxs collapsed' id='tab-compare-provider-"+section.id+"-"+count+"' data-id='compare-provider-"+section.id+"-"+count+"' onclick='toggleTabs(this,"+section.id+","+count+")' href='javascript:void(0);'>Compare price</a>";
			sectionDiv += "</div>";
			
			sectionDiv += "</div>";//hover tag close
			
			if(count !=1){
				
				sectionDiv += "<div class='col-xs-3 p-t-10 p-r-10 p-b-0 text-right'>";//price tag open
			
				var data_price = getPriceData(section['price']);
				var currencyCode = getCurrencyCode(section['price']);
				var currencyLbl = document.getElementById("selected_currency_lbl");
				var currentCurrencyCode = currencyLbl.getAttribute('data-current-currency-code');
				var convRate = currencyLbl.getAttribute('data-current-currency-rate');
				var result = compareStrings(currencyCode,currentCurrencyCode);
				
				var price = "";
				if(!result){
					price = formatCurrency(data_price,convRate,currentCurrencyCode);
				} else {
					price = section['price'];
				}
				
				sectionDiv += "<img class='h14' src='images/"+section['provider'].toLowerCase()+".png'  id='provider_"+section.id+"' alt='"+ section['provider'] +"' data-provider='"+ section['provider'] +"'/>";
				
				sectionDiv += "<h3 class='panel-title p-t-b-5' id='price_"+section.id+"' data-price='"+ data_price +"'><a href='#'><span class='glyphicon glyphicon-alert red'></span></a>&nbsp;&nbsp;" + price + "</h3>";
				
				var mode = "Assist";
				
				if(_mode){
					mode = _mode;
				}
				
				if("roundtrip" == trip_type){
					if(_mode == "SBT"){
						sectionDiv += "<button class='btn btn-primary btn-xs' onclick=onBook("+ section.id +") >Book</button>";
					}else {
						if(!section['is_selected']){
			    			sectionDiv += "<button class='btn btn-primary btn-xs' onclick=onAirBook("+ section.id +") >Select</button>";
			    		}else {
			    			sectionDiv += "<button class='btn btn-primary btn-xs' onclick=onAirConfirm("+ section.id +") >Confirm</button>";
			    			sectionDiv += "<button class='btn btn-primary btn-xs' onclick=onAirCancel("+ section.id +") >Cancel</button>";
			    		}
					}
				}else{
					if(_mode == "SBT"){
						
						sectionDiv += "<button class='btn btn-primary btn-xs' onclick=onBook("+ section.id +") >Book</button>";
					}else {
			    		
						if(!section['is_selected']){
							sectionDiv += "<button class='btn btn-primary btn-xs' onclick=onAirBook("+ section.id +") >Select</button>";
			    		}else {
			    			sectionDiv += "<button class='btn btn-primary btn-xs' onclick=onAirConfirm("+ section.id +") >Confirm</button>";
			    			sectionDiv += "<button class='btn btn-primary btn-xs' onclick=onAirCancel("+ section.id +") >Cancel</button>";
			    		}
					}
				}
			
				sectionDiv += "<div class='m-t-b-10'>";
				sectionDiv += "<a href='javascript:void(0);' id='a_"+ section.id +"' class='btn btn-link btn-xxs p-r-0 p-l-0 border-bottom-dotted' title=''>Fare Details</a>";
				sectionDiv += this.renderFareDetails(section);
				sectionDiv += "</div>";
				
				sectionDiv += "</div>";//price tag close
				
				}
			
			sectionDiv += "</div>";//row tag close
			
				
			sectionDiv += "<div class='panel-collapse collapse' id='flight-iti-"+section.id+"-"+count +"' role='tabpanel'>";
			sectionDiv += "<div class='panel-body p10'>";
		}
		
	}

	for(int = 0; int < directions.length; int++){
		
	 direction = directions[int];
	 legs = direction['leg'];
		
		for(var j = 0; j < legs.length; j++){
		    	
			var leg = legs[j];
			var stops = direction['no_of_stops'];
	        
	        if(!stops){
	        	stops = "0";
	        }
	        
	        if(stops){
	        	if("0" == stops){
	        		stops = "Non Stop";
	        	}else if("1" == stops){
	        		stops = "1 Stop";
	        	}else{
	        		stops = stops + " Stop";
	        	}
	        }
	        
	        sectionDiv += "<div class='row margin-r-l-0'>";
			
			if(j == (legs.length-1))
				sectionDiv += "<div class='col-xs-9'>";
			else
				sectionDiv += "<div class='col-xs-9 border-bottom'>";
			
			if(j != 0)
				sectionDiv += "<h5 class='m-b-10 m-t-5 font12'>Change flights at " + leg['source_city_code'] + "</h5>";
			else
				sectionDiv += "<h5 class='m-b-10 m-t-5 font12'>" + leg['source_city_code'] + " &rarr; "+ leg['destination_city_code'] +" <span class='font10 color-drakgray'>" + leg['departure_date'] + "</span></h5>";
			
				
				sectionDiv += "<div class='col-xs-3 p-l-0 p-r-0 margin-t-0'>";
					sectionDiv += "<img class='airline_img' src='"+leg['flight_image']+"'>";
					//sectionDiv += "<p class='margin-b-0'>"+leg['flight_name']+"</p>";
					sectionDiv += "<p>"+leg['flight_code']+ "-" + leg['flight_number'] +"</p>";
				sectionDiv += "</div>";
				
				sectionDiv += "<div class='col-xs-3 p-l-0 p-r-0 margin-t-0'>";
					sectionDiv += "<h5 class='margin-t-0 margin-b-5'>" + leg['departure_time'] + "</h5>";
					sectionDiv += "<p class='font10 color-drakgray'>" + leg['source_city_code'] + " &rarr; "+ leg['destination_city_code'] +"</p>";
				sectionDiv += "</div>";
				
				
				sectionDiv += "<div class='col-xs-3 p-l-0 p-r-0 margin-t-0'>";
					sectionDiv += "<h5 class='margin-t-0 margin-b-5'>"+ leg['arrival_time'] +"</h5>";
					sectionDiv += "<p class='font10 color-drakgray'>" + leg['arrival_date'] + "</p>";
				sectionDiv += "</div>";
				
				sectionDiv += "<div class='col-xs-3 p-l-0 p-r-0 margin-t-0'>";
					sectionDiv += "<h5 class='margin-t-0 margin-b-5'>" + leg['duration'] + "</h5>";
					sectionDiv += "<p class='font10 color-drakgray'>" + stops + "</p>";
				sectionDiv += "</div>";				
			
			sectionDiv += "</div>";
			sectionDiv += "</div>";
		
		}
	}

	sectionDiv += "</div>";//panel-body tag close
	sectionDiv += "</div>";//panel-collapse tag close
	sectionDiv += "</div>";//panel-heading tag close
	
	return sectionDiv;

};

this.renderFareDetails = function(section){
	
		var currencyLbl = document.getElementById("selected_currency_lbl");
		var currentCurrencyCode = currencyLbl.getAttribute('data-current-currency-code');
		var convRate = currencyLbl.getAttribute('data-current-currency-rate');
	
		fareDetailsIds = "";
		
		var fareDetails = section['fareDetails'];
		
		if(typeof fareDetails === 'undefined'){
			return "";
		}
		
		var fare = fareDetails[0];
		
		var totalFare = fare['total'];
    	
    	var fareDetailsDiv = "<div id='div_"+section.id+"' style='display:none;'>";
    	
    	fareDetailsDiv += "<table width='100%'>";
    	
    	fareDetailsDiv += "<tbody><tr><td class='baseFare-heading' colspan='2'><b>Base Fare</b></td></tr>";
    	
    	var baseFareDetails = fare['BaseFare'];
		
		var baseFare = baseFareDetails[0];
		
	
   		var baseFarekeys = [];
		for (var key in baseFare) {
  			if (baseFare.hasOwnProperty(key)) {
    		baseFarekeys.push(key);
  			}
		}
		
		var baseFareTr="";
		var baseFareTotalTr="";
		 
		for (var i = 0; i< baseFarekeys.length; i++){
			var key = baseFarekeys[i];
			if(key=="total" || key=="type"){
				if(key=="total"){
				var dataPrice = getPriceData(baseFare[key]);
				var currencyCode = getCurrencyCode(baseFare[key]);
			     
				var result = compareStrings(currencyCode,currentCurrencyCode);
		    	
		    	var price = "";
		    	if(!result){
		    		price = formatCurrency(dataPrice,convRate,currentCurrencyCode);
		    	} else {
		    		price = baseFare[key];
		    	}
				baseFareTotalTr = "<tr class='total-fare-border'><td>Total(Base Fare)</td><td id='div_"+section.id+"_td_fd_"+i+"' style='text-align:right; padding-right:20px;' data-price='"+ dataPrice +"'>"+price+"</td></tr>";
				}
			} else {
				var dataPrice = getPriceData(baseFare[key]);
				var currencyCode = getCurrencyCode(baseFare[key]);
			     
				var result = compareStrings(currencyCode,currentCurrencyCode);
		    	
		    	var price = "";
		    	if(!result){
		    		price = formatCurrency(dataPrice,convRate,currentCurrencyCode);
		    	} else {
		    		price = baseFare[key];
		    	}
				baseFareTr += "<tr class='fare11'><td >"+key+"</td><td id='div_"+section.id+"_td_fd_"+i+"' style='text-align:right; padding-right:20px;' data-price='"+ dataPrice +"'>"+price+"</td></tr>";
			}
			
		}
		
		fareDetailsDiv += baseFareTr;
		
		fareDetailsDiv += baseFareTotalTr;
    	
    	fareDetailsDiv += "</tr><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr><tr><td colspan='2'></td></tr>";
    	
    	var surchargesDetails = fare['surcharges'];
    	
    	if(typeof surchargesDetails != 'undefined'){
    		
    		fareDetailsDiv += "<tr><td class='baseFare-heading' colspan='2'><b>Fees	and Surcharges</b></td></tr>";
    	
    		var surcharges = surchargesDetails[0];
    		
    		var surchargeskeys = [];
    		for (var key in surcharges) {
      			if (surcharges.hasOwnProperty(key)) {
        		surchargeskeys.push(key);
      			}
    		}
    		
    		var surchargeTr="";
    		var surchargeTotalTr="";
    		
    		for(var j=0; j<surchargeskeys.length; j++ ){
    			var surchargeKey = surchargeskeys[j];
    			
    			if(surchargeKey=="total"|| surchargeKey=="type"){
    				if(surchargeKey=="total"){
    					var dataPrice = getPriceData(surcharges[surchargeKey]);
    					var currencyCode = getCurrencyCode(surcharges[surchargeKey]);
    				     
    					var result = compareStrings(currencyCode,currentCurrencyCode);
    			    	
    			    	var price = "";
    			    	if(!result){
    			    		price = formatCurrency(dataPrice,convRate,currentCurrencyCode);
    			    	} else {
    			    		price = surcharges[surchargeKey];
    			    	}
    					surchargeTotalTr = "<tr class='total-fare-border'><td>Total(F & S)</td><td id='div_"+section.id+"_td_fd_"+i+"' style='text-align:right; padding-right:20px;' data-price='"+ dataPrice +"'>"+price+"</td></tr>";
    				}
    			} else {
    				var dataPrice = getPriceData(surcharges[surchargeKey]);
    				var currencyCode = getCurrencyCode(surcharges[surchargeKey]);
				     
    				var result = compareStrings(currencyCode,currentCurrencyCode);
    		    	
    		    	var price = "";
    		    	if(!result){
    		    		price = formatCurrency(dataPrice,convRate,currentCurrencyCode);
			    	} else {
			    		price = surcharges[surchargeKey];
			    	}
    				surchargeTr += "<tr class='fare11'><td >"+surchargekey+"</td><td id='div_"+section.id+"_td_fd_"+i+"' style='text-align:right; padding-right:20px;' data-price='"+ dataPrice +"'>"+price+"</td></tr>";
    			}
    			
    		}
    		
    		fareDetailsDiv += surchargeTr;
    		
    		fareDetailsDiv += surchargeTotalTr;
        	
    	}
		
    	var totalPriceData = getPriceData(totalFare); 	
    	var currencyCode = getCurrencyCode(totalFare);
	     
    	var result = compareStrings(currencyCode,currentCurrencyCode);
    	
    	var price = "";
    	if(!result){
    		price = formatCurrency(totalPriceData,convRate,currentCurrencyCode);
    	} else {
    		price = totalFare;
    	}
		fareDetailsDiv += "<tr class='grand-total'><td>Grand Total</td><td id='div_"+section.id+"_td_fd_total' style='text-align:right; padding-right:20px;' data-price='"+ totalPriceData +"'>"+price+"</td></tr>";
				
		fareDetailsDiv += "</tbody>";
    	
    	fareDetailsDiv += "</table>";
    	
    	fareDetailsDiv += "</div>";
		
    	return fareDetailsDiv;
    	
    };    
    
     
}

function toggleTabs(e,id,count)
{
	 $("#flight-iti-"+id.id+"-"+count).collapse('hide');
	 $("#compare-provider-"+id.id+"-"+count).collapse('hide');
	 
	 //$("#tab-flight-iti-"+id.id+"-"+count).removeClass('active');
	 //$("#tab-compare-provider-"+id.id+"-"+count).removeClass('active');
	 
	//if($(e).attr('data-id')){
		 $("#"+$(e).attr('data-id')).collapse('toggle');
		 $(e).toggleClass('active');
	//}
		 
		 
			
	
}



