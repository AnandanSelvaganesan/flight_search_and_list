
var months = {
    'January' : '01',
    'Feburary' : '02',
    'March' : '03',
    'April' : '04',
    'May' : '05',
    'June' : '06',
    'July' : '07',
    'August' : '08',
    'September' : '09',
    'October' : '10',
    'November' : '11',
    'December' : '12',
}

/**
 * 
 */

function getOnwardsTime(section){
	
	var trip_type = section['trip_type'];
	
	var onwardLeg;
	
	if("roundtrip" == trip_type){
		
		var directions = section['direction'];
		
		onwardLeg = directions[0];
		
	}else if("onward" == trip_type){
		
		onwardLeg = section;
		
	} else {
		return null;
	}
	
	if(onwardLeg){
		
		var leg = onwardLeg['leg'][0];
		
		var departure_time = leg['departure_time'];
		
		var time = getTime(departure_time);
		
		return time;
		
	}
}

function getReturnTime(section){
	
	var trip_type = section['trip_type'];
	
	var onwardLeg;
	
	if("roundtrip" == trip_type){
		
		var directions = section['direction'];
		
		onwardLeg = directions[1];
		
	}else if("return" == trip_type){
		
		onwardLeg = section;
		
	} else {
		return null;
	}
	
	if(onwardLeg){
		
		var leg = onwardLeg['leg'][0];
		
		var departure_time = leg['departure_time'];
		
		var time = getTime(departure_time);
		
		return time;
		
	}
}

function compare(entity,configs){
	
	var directions = [];
	var config = "";
	var trip_type = entity['trip_type'];
	
	if("roundtrip" == trip_type){
		directions = entity['direction'];
	}else {
		directions = entity['direction'];
	}
	
	for (var int = 0; int < directions.length; int++) {
		
		var direction = directions[int];
		
		var segment = direction['segment'];
		
		/*var segment = entity['segment'];
		
		if("roundtrip" == trip_type && int > 0){
			
			segment = segment.substring(4,7) + "_" + segment.substring(0,3);
			
		}*/
		
		if(null == segment)
			continue;
		
		
		config = configs[segment];
		
		var departureTime = _segmentDeptTimes[segment];
		
		if(null == departureTime || departureTime == ""){
			continue;
			
		}
		
		var requiredDeptTime = parseInt(getTime(departureTime));
		
		var beforeTime = -1;
		var afterTime = -1;
		
		var blockedAirlines = new Array();
		
		if(config){
			
			beforeTime = parseInt(config['before_time']);
			afterTime = parseInt(config['after_time']);
			blockedAirlines = config['blocked_airline'];
			
			if(null != blockedAirlines && blockedAirlines != ""){
				
				blockedAirlines = blockedAirlines.split(",");
				
			}
			
		}else {
			continue;
		}
		
		var requiredFromTime = requiredDeptTime - beforeTime;
		
		var requiredToTime = requiredDeptTime + afterTime;
		
		var firstLeg = direction['leg'][0];
		
		var actualDeptTime = parseInt(getTime(firstLeg['departure_time']));
		
		var airlineCode = firstLeg['flight_code'];
		
		if(actualDeptTime >= requiredFromTime && actualDeptTime <= requiredToTime && ($.inArray(airlineCode, blockedAirlines) == -1)){
			continue;
		}else {
			return false;
		}
	}
	
	return true;
	
}

function isVisible(){
	
	
}

function compare_old(section,requiredTimeString,direction){
	
	var time = 0;
	
	if(direction == "onward"){
		time = getOnwardsTime(section);
	}else if(direction == "return"){
		time = getReturnTime(section);
	}
	
	var requiredTime = parseInt(getTime(requiredTimeString));
	
	var requiredFromTime = parseInt(requiredTime) - 60;
	
	var requiredToTime = parseInt(requiredTime) + 60;
	
	if(direction == "onward"){
		
		if(time >= requiredFromTime && time <= requiredToTime){
			return true;
		}else {
			return false;
		}
		
	}else if(direction == "return"){
		
		if(time >= requiredFromTime){
			return true;
		}else {
			return false;
		}
		
	}
	
}

/**
 * Takes the time in hh:mm format and returns time in minutes
 * @param timeString
 */
function getTime(timeString){
	
	var words = timeString.split(":");
	
	var word2 = words[1];
	
	var words2 = word2.split(" ");
	
	var factor = 0;
	
	if(words2[1] == "PM")
		factor = 12;
	
	var time = parseInt((parseInt(words[0])+factor) * 60) + parseInt(words2[0]);
	
	return time;
	
}

/**
 * Takes the date in 25 March, 2014 format and returns in mm/dd/yyyy
 * @param timeString
 */
function getDateFromFormat(formattedDate){
	
	if(formattedDate){
		formattedDate = formattedDate.trim();
		
		var words = formattedDate.split(" ");
		
		var day = words[0];
	
		var year = words[2];
		
		words = words[1].split(",");
		
		var month = months[words[0]];
		
		var dateString = month + "/" + day + "/" + year; 
			
		return dateString;
	}
	
}

function loadCorpRule(){

	var reqURL = "rule.json";
	//var reqURL = "Rule.do?method=getSBTRule&type=AIR";
	var requestType = "POST";
	$.ajax({
		url : reqURL,
		dataType : "json",
		contentType: 'application/json',
		type: requestType, 
		success : function(result) {
			console.log(result);
			//alert(result);
		}
	});
	
}
