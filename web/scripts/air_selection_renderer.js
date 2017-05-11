
registerSelectedEntityRenderer('Air', new AirSelectedEntityRenderer());


function AirSelectedEntityRenderer(){
    
    this.renderEntity = function(section){
    	
    	var sectionDiv = "<div class='air'>";
    	
    	var trip_type = section['trip_type'];
    	var trip_code = section['trip_code'];
    	
    	if(trip_type == "roundtrip"){
    		
    		var directions = section['direction'];
    		
    		if(trip_code == "I"){

    			var onwardDiv = this.renderSegment(section);
        		sectionDiv += this.renderTotal(section);
        		return onwardDiv;
    			
    		}else{
    			
    			for (var i = 0; i < directions.length; i++) {
    				var segment = directions[i];		
    				var onwardDiv = this.renderRoundTripSegment(segment,section);				
    				sectionDiv += onwardDiv;
    			}
    			sectionDiv += this.renderTotal(section);
    			return onwardDiv;
    		}

    	}else {
    		
    		var onwardDiv = this.renderSegment(section);
    		sectionDiv += this.renderTotal(section);
    		return onwardDiv;
    		
    	}
    	
    	sectionDiv += "</div>";
    	return sectionDiv;
    	
    };
    
    this.renderSegment = function(onward){
    	
    	var directions = onward['direction'];
    	var legsDep = directions[0];
    	var legs = legsDep['leg'];
    	var firstLeg = legs[0];
    	var source_city = onward['depart_city_code'];
    	//var source_city = firstLeg['source_city_code']; 
    	var lastLeg = legs[legs.length - 1];
    	var target_city = onward['arrive_city_code'];
    	
    	var onwardDiv = "<div style=''>";
    	
    	onwardDiv += "<div class='small_label col-xs-3 p10 border-rgt'>";
    	
    	onwardDiv += "<div class='col-xs-12 p-l-0 p-r-0'>";
    	
    	onwardDiv += "<div class='col-xs-5 p-l-0 p-r-0'>";
    	
    	onwardDiv += "<img class='airline_img margin-r-4' src='"+firstLeg['flight_image']+"'>";
    	onwardDiv += "<p class='margin-b-0 p-r-4'>"+ firstLeg['flight_name'] + "<br><span> "+firstLeg['flight_code']+ "-" + firstLeg['flight_number'] +"</span>"; +"</p>";
    	
    	onwardDiv += "</div>";
    	
    	
    	onwardDiv += "<div class='col-xs-7 p-l-0 p-r-0'>";

    	onwardDiv += "<p class='margin-0 color-drakgray'>"+ source_city +" &rarr; " + target_city + "</p>";
    	onwardDiv += "<div class='col-xs-6 p-l-0 p-r-0'>";
    	onwardDiv += "<h4 class=''>"+ firstLeg['departure_time'] + "</h4>";
    	onwardDiv += "</div>";
					
    	onwardDiv += "<div class='col-xs-6 p-l-0 p-r-0'>";
    	onwardDiv += "<h4 class=''>" + lastLeg['arrival_time'] + "</h4>";
    	onwardDiv += "</div>";

    	onwardDiv += "<div class='col-xs-12 p-l-0 p-r-0'>";
    	//render time
    	var price = "";
    	if(onward['price']){
    		price = onward['price'];
    	}
    	onwardDiv += "<h3 class='m-0 font12 fontBold text-success'>" + price + "</h3>";
    	
    	onwardDiv += "</div>";
    	
    	onwardDiv += "</div>";
    	
    	onwardDiv += "</div>";
    	onwardDiv += "</div>";
    	
    	onwardDiv += "</div>";
    	
    	return onwardDiv;
    	
    };
    
 this.renderRoundTripSegment = function(onward,section){
    	
	
		var legs = onward['leg'];
	 	var firstLeg = legs[0];
	 	var source_city = section['depart_city_code'];
	 	var lastLeg = legs[legs.length - 1];
	 	var target_city = section['arrive_city_code'];
	 	
	 	
	 	var onwardDiv = "<div style=''>";
	 	
	 	onwardDiv += "<div class='small_label col-xs-3 p10 border-rgt'>";
	 	
	 	onwardDiv += "<div class='col-xs-12 p-l-0 p-r-0'>";
	 	
	 	onwardDiv += "<div class='col-xs-5 p-l-0 p-r-0'>";
	 	
	 	onwardDiv += "<img class='airline_img margin-r-4' src='"+firstLeg['flight_image']+"'>";
	 	onwardDiv += "<p class='margin-b-0 p-r-4'>"+ firstLeg['flight_name'] + "<br><span> "+firstLeg['flight_code']+ "-" + firstLeg['flight_number'] +"</span>"; +"</p>";
	 	
	 	onwardDiv += "</div>";
	 	
	 	
	 	onwardDiv += "<div class='col-xs-7 p-l-0 p-r-0'>";
	
	 	onwardDiv += "<p class='margin-0 color-drakgray'>"+ source_city +" &rarr; " + target_city + "</p>";
	 	onwardDiv += "<div class='col-xs-6 p-l-0 p-r-0'>";
	 	onwardDiv += "<h4 class=''>"+ firstLeg['departure_time'] + "</h4>";
	 	onwardDiv += "</div>";
						
	 	onwardDiv += "<div class='col-xs-6 p-l-0 p-r-0'>";
	 	onwardDiv += "<h4 class=''>" + lastLeg['arrival_time'] + "</h4>";
	 	onwardDiv += "</div>";
	
	 	onwardDiv += "<div class='col-xs-12 p-l-0 p-r-0'>";
	 	//render time
	 	var price = "";
	 	if(section['price']){
	 		price = section['price'];
	 	}
	 	onwardDiv += "<h3 class='m-0 font12 fontBold text-success'>" + price + "</h3>";
	 	
	 	onwardDiv += "</div>";
	 	
	 	onwardDiv += "</div>";
	 	
	 	onwardDiv += "</div>";
	 	onwardDiv += "</div>";
	 	
	 	onwardDiv += "</div>";
 	
 	/*
    	var onwardDiv = "<div style=''>";
    	onwardDiv += "<div width='100%' class='small_label col-xs-3 p10 border-rgt'>";
    	onwardDiv += "<div class='col-xs-12 p-l-0 p-r-0'>";
    	
    	var legs = onward['leg'];
    	var firstLeg = legs[0];
    	var source_city = section['depart_city_code'];
    	var lastLeg = legs[legs.length - 1];
    	var target_city = section['arrive_city_code'];
    	
    	onwardDiv += "<p class='margin-0'>"+ source_city +" &rarr; " + target_city + "</p>";
     	onwardDiv += "<div class='col-xs-6 p-l-0 p-r-0'>";
     	onwardDiv += "<h4 class='panel-title margin-t-0'>"+ firstLeg['departure_time'] + "</h4>";
     	onwardDiv += "</div>";
     	
     	onwardDiv += "<div class='col-xs-6 p-l-0 p-r-0'>";
     	onwardDiv += "<h4 class='panel-title margin-t-0'>" + lastLeg['arrival_time'] + "</h4>";
     	onwardDiv += "</div>"

     	onwardDiv += "</div>";
     	onwardDiv += "<div class='col-xs-12 p-l-0 p-r-0'>";
    		
    	//render time
    	
    	var price = "";
    	if(section['price']){
    		price = section['price'];
    	}
    	//onwardDiv += "<p class='margin-0'>&nbsp;</p>";
    	onwardDiv += "<h3 class='m-2 font12 fontBold text-success p-t-5'>" + price + "</h3>";
     	onwardDiv += "</div>";
    	onwardDiv += "</div>";
    	onwardDiv += "</div>";*/
    	
    	return onwardDiv;
    	
    };
    
    
    
    this.renderTotal = function(section){
    	
    	var trip_type = section['trip_type'];
    	
    	var price = "";
    		
    	price = section['price'];
    		
    	var div= "";
		
		div = "<div class='col-xs-3 p10 '>";
    	
    	div += "<div class='col-xs-12 p-l-0 p-r-0'>";
    	div += "<h3 class='panel-title p0 text-right'>Total</h3>";
    	div += "</div>";
    	
    	div += "<div class='col-xs-12 p-l-0 p-r-0'>";
    	div += "<h3 class='panel-title p0 text-right'>" + price + "</h3>";
    	div += "</div>";

    	div += "</div>";
    	
    	div += "<div class='col-xs-3 p10'>"; 
    	
    	div += "<div class='text-right margin-b-2'>"; 
    	div += "<input type='button' text='Select' value='Select' class='btn btn-success btn-xs' onclick='onSelect()'>"; 
    	div += "</div>";
    	
    	div += "</div>";
    	
    	
    	
    	return div;
    	
    };
    
}
