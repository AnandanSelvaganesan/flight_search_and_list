
var _entityRenderers = {};
var _selectedEntityRenderers = {};
var _selections = {};
var _segmentsFlag = false;
var dealFlightSelected = false; 
var _existingTrips = {};
var _isExistingTripFlow = false;

function registerEntityRenderer(type, renderer){
	
	_entityRenderers[type] = renderer;
	
}

function getEntityRenderer(type){
	
	return _entityRenderers[type];
	
}

function registerSelectedEntityRenderer(type, renderer){
	
	_selectedEntityRenderers[type] = renderer;
	
}

function getSelectedEntityRenderer(type){
	
	return _selectedEntityRenderers[type];
	
}

function getItemById(anArray, id) {
    for (var i = 0; i < anArray.length; i += 1) {
        if (anArray[i].id === id) {
            return anArray[i];
        }
    }
}


function addSelection(id) {

	//var entity = entities[id];
	var entity = getItemById(entities,id);
	var type = entity['type'];
	var trip_type = entity['trip_type'];
	var trip_code = entity['trip_code'];
	if (trip_type == "roundtrip") {
		entity.roundtrip_specialFare = "true";
	}

	var segmentName = entity['segment_id'] + "_" + entity['direction_type'];
	var renderer = getSelectedEntityRenderer(type);

	if (renderer) {
	
		var div = renderer.renderEntity(entity);
		var selectionRoot = document.getElementById('seleted_entities_list');
		var tempDiv = document.createElement("div");
		tempDiv.innerHTML = div;
		
		if(entity['direction_type'] == "OR"){
			_selections ={};
		}
		if (_selections[segmentName]) {
			delete _selections[segmentName];
		}
		_selections[segmentName] = entity;
		
		
		var selectedDiv = document.createElement("div");
		selectedDiv.id = "multiselection";
		selectedDiv.setAttribute("class", "air");
		
		var priceDiv = document.createElement("div");
		priceDiv.id = "selected_price";

		var div = "";

		div = "<div class='col-xs-3 p10 pull-right'>";
		div += "<div class='col-xs-12 p-l-0 p-r-0'>";
		div += "<h3 class='panel-title p0 pull-right font14 l-h-30' id='selected_total_price'></h3>";
		div += "<h3 class='panel-title p0 pull-right font14 l-h-30'>Total: &nbsp;</h3>";
		div += "</div>";

	

		div += "<div class='col-xs-12 p-l-0 p-r-0'>";
		
		var sName = segmentName;
		
		div += "<a href='javascript:void(0)' class='btn btn-primary btn-xs pull-right' onclick='showSegmentsBookDailog(" + sName + ")'>&nbsp;Book&nbsp;</a>";

		div += "<input type='button' text='Select' value='Select' class='btn btn-success btn-xs pull-right m-r-4' onclick='onSelect()'>";
		
		div += "</div>";
		
		div += "</div>";

		priceDiv.innerHTML = div;
		
		
		if(trip_type == "onward") {
			
			if ($('#' + segmentName).find('.selected_air')) {
				$('#' + segmentName).find('.selected_air').addClass("air");
				$('#' + segmentName).find('.selected_air').removeClass("selected_air");
			}

			//var target = (event.currentTarget) ? event.currentTarget : event.srcElement;
			var target = document.getElementById('section_'+id);
			target.className = "panel panel-accordion-default margin-b-2 border-r selected_air";
			
			var multiselection = document.getElementById("multiselection");
			if (!multiselection) {
				
				
				if(entity['direction_type'] == "OR"){
					var segments = document.getElementById("segments_roundtrip");
				}else{
					segments = document.getElementById("segments");
				}
				
				var childNodeCount = segments.childNodes[0].childNodes.length
	
				for (var int = 0; int < childNodeCount; int++) {
	
					var child = segments.childNodes[0].childNodes[int];
					var segmentName = child.id;
					var onwardDiv = document.createElement("div");
					onwardDiv.id = "selected_onward_" + segmentName;
					selectedDiv.appendChild(onwardDiv);
					var seperatorDiv = document.createElement("div");
					selectedDiv.appendChild(seperatorDiv);
				}
				
				selectedDiv.appendChild(priceDiv);
				selectionRoot.appendChild(selectedDiv);
			}
			segmentName = entity['segment_id'].toUpperCase() + "_" + entity['direction_type'];
			
			if (trip_type == "onward") {

				var div = document.getElementById("selected_onward_" + segmentName);
				div.innerHTML = "";
				div.appendChild(tempDiv);

			} else if (trip_type == "return") {

				var div = document.getElementById("selected_onward_" + segmentName);
				div.innerHTML = "";
				div.appendChild(tempDiv);

			}

			// update price

			var onwardPriceString = "INR 0";
			var onwardPriceInt = 0;

			for (var int2 = 0; int2 < Object.keys(_selections).length; int2++) {

				var selectedEntity = _selections[Object.keys(_selections)[int2]];

				onwardPriceString = selectedEntity['price'];
				onwardPriceString = onwardPriceString.split(" ")[1];
				onwardPriceString = onwardPriceString.replace(",", "");
				onwardPriceInt += parseFloat(onwardPriceString);

			}

			var total = onwardPriceInt;

			var priceDiv = document.getElementById("selected_total_price");
			priceDiv.innerHTML = "INR " + total;
			
		}else if(trip_type == "roundtrip") {

			if ($('#' + segmentName).find('.selected_air')) {
				$('#' + segmentName).find('.selected_air').addClass("air");
				$('#' + segmentName).find('.selected_air').removeClass("selected_air");
			}
			//var target = (event.currentTarget) ? event.currentTarget : event.srcElement;
			var target = document.getElementById('section_'+id);
			target.className = "panel panel-accordion-default margin-b-2 border-r selected_air";

			var multiselection = document.getElementById("multiselection");
			
			
			if(entity['direction_type'] == "OR"){
				var segments = document.getElementById("segments_roundtrip");
				multiselection = null;

				 var selection = document.getElementById("seleted_entities_list");
				 if(selection){
					$(selection).empty();
				 } 
				 dealFlightSelected = true;
				 
			}else{
				segments = document.getElementById("segments");
				
				if(dealFlightSelected){
					
					multiselection = null;
					var selection = document.getElementById("seleted_entities_list");
					 if(selection){
						$(selection).empty();
					 } 
					 
					 dealFlightSelected = false;
				}
			}
			
			
			if (!multiselection) {

				var childNodeCount = segments.childNodes[0].childNodes.length;

				for (var int = 0; int < childNodeCount; int++) {
					var child = segments.childNodes[0].childNodes[int];
					var segmentName = child.id;
					var onwardDiv = document.createElement("div");
					onwardDiv.id = "selected_onward_" + segmentName;
					selectedDiv.appendChild(onwardDiv);
					var seperatorDiv = document.createElement("div");
					selectedDiv.appendChild(seperatorDiv);
				}
				
				selectedDiv.appendChild(priceDiv);
				selectionRoot.appendChild(selectedDiv);

				if(trip_code == "D" && entity['direction_type'] != "OR"){
					
					var childNodeCount = segments.childNodes[1].childNodes.length;
	
					for (var int = 0; int < childNodeCount; int++) {
						var child = segments.childNodes[1].childNodes[int];
						var segmentName = child.id;
						var onwardDiv = document.createElement("div");
						onwardDiv.id = "selected_onward_" + segmentName;
						selectedDiv.appendChild(onwardDiv);
						var seperatorDiv = document.createElement("div");
						selectedDiv.appendChild(seperatorDiv);
					}
					selectedDiv.appendChild(priceDiv);
					selectionRoot.appendChild(selectedDiv);
				}
				
				

				
			}
			
			if(entity['direction_type'] == "OR"){
				
				segmentName = entity['segment_id'].toUpperCase() + "_" + entity['direction_type'];
				var div = document.getElementById("selected_onward_" + segmentName);
				div.innerHTML = "";
				div.appendChild(tempDiv);
				
			}else{
				segmentName = entity['segment_id'].toUpperCase() + "_" + entity['direction_type'];
				var div = document.getElementById("selected_onward_" + segmentName);
				div.innerHTML = "";
				div.appendChild(tempDiv);
			}
			
			

			// update price

			var onwardPriceString = "INR 0";
			var onwardPriceInt = 0;

			for (var int2 = 0; int2 < Object.keys(_selections).length; int2++) {

				var selectedEntity = _selections[Object.keys(_selections)[int2]];

				onwardPriceString = selectedEntity['price'];
				onwardPriceString = onwardPriceString.split(" ")[1];
				onwardPriceString = onwardPriceString.replace(",", "");
				onwardPriceInt += parseFloat(onwardPriceString);

			}

			var total = onwardPriceInt;

			var priceDiv = document.getElementById("selected_total_price");
			priceDiv.innerHTML = "INR " + total;

		} else {

			if ($('#roundtrip').find('.selected_air')) {
				$('#roundtrip').find('.selected_air').addClass("air ");
				$('#roundtrip').find('.selected_air').removeClass("selected_air");
			}
			

			//var target = (event.currentTarget) ? event.currentTarget : event.srcElement;
			var target = document.getElementById('section_'+id);
			target.className = "panel panel-accordion-default margin-b-2 border-r selected_air";

			var roundtripSec = document.getElementById("roundtrip_selection");

			if (!roundtripSec) {
				roundtripSec = document.createElement("div");
				roundtripSec.id = "roundtrip_selection";
				selectionRoot.appendChild(roundtripSec);
			}

			$(roundtripSec).empty();
			roundtripSec.appendChild(tempDiv);

		}
		
		 if ( $("#selected_hotels_template").is( ":hidden" )) {
			 $("#selected_hotels_template").slideDown( "slow" );
		}
	}

}

function onAirConfirm(id){
	
	event.stopPropagation();
	
	entity = entities[id];
	
	showConfirmProgress();
	
	onAirBookByObject(entity,"confirmation");
	
	
}

function onAirCancel(id){
	
	entity = entities[id];
	
	onAirBookByObject(entity,"cancel");
	
}

function onAirBook(id){
	
	if(_segmentsFlag && _segmentsFlag == true){
		
		_isERPFlow = true;
		_mode = "SBT";
		
		event.stopPropagation();
		
		showConfirmProgress();
		
		jQuery("#dialog").dialog("close");
		
		onBookSelect();
		
	}else {
		event.stopPropagation();
		
		entity = entities[id];
		
		showConfirmProgress();
		
		jQuery("#dialog").dialog("close");
		
		onAirBookByObject(entity,"confirmation");
	}
	
}

function onAirBookByObject(entity,actionType){ 
		 
	entity.requestId = document.getElementById('request-id').value; 
	entity.selectedBookingId = document.getElementById('request-id').value; 
	entity.travellerid = document.getElementById('traveller-id').value; 
	entity['service_type'] = 'AIR';
	
	var jsonString = JSON.stringify(entity); 
	
	var href = window.location.href; 
	
	var reqURL = href.substring(0, href.indexOf('MiceUserListofBookings.do') - 1);
	
	var requestType = 'GET';
	
	if(_mode && _mode == "SBT"){
		reqURL += "/rest/flightBooking/";
		
		if(actionType == "options"){
			reqURL += "saveOption";
			requestType = 'post';
			
		}else if(actionType == "confirmation"){
			reqURL += "confirmFlight";
			
			requestType = 'post';
		}
		else{
			reqURL += "bookFlight";
			
			requestType = 'post';
		}
		
		$.ajax({
			url : reqURL,
			dataType : "json",
			contentType: 'application/json',
			type: requestType,
			data: jsonString,
			success : function(result) {
				
				if(actionType == "booking" && result && _isERPFlow){

					setBookingStatus("confirm"); 
					showBookingProgress("Confirming the flight. Please wait...", false); 
					 
					entity['book_response'] = result; 
					
					_mode = "SBT";
					
					onAirBookByObject(entity,"confirmation");  
					
					
				}else if(actionType == "confirmation" && result && _isERPFlow){

					setBookingStatus("success"); 
					_mode = "SBT";
					showBookingProgress(result['message'], true); 
					
				}
				
				if(actionType == "booking" && result){

					setBookingStatus("confirm"); 
					showBookingProgress("Confirming the flight. Please wait...", false); 
					 
					entity['book_response'] = result;  
					
					_mode = "ERP"
					
					onAirBookByObject(entity,"confirmation");  
					
					
				}else if(actionType == "confirmation" && result){

					setBookingStatus("success"); 
					showBookingProgress(result['message'], true); 
					
				}
				
				else {
				
					if(result != null){  
						
						if(_isERPFlow){
							
							showOptionStatus(result, 0);
							
						}else if(result.status == "SUCCESS"){ 
						
							searchCounter++;
							document.getElementById('mail-preview1').innerHTML = "<div><input type = \"button\" style='background:#105695;color:white;width:100px;" +
									"height:32px;border-radius:5px;' value = \"Send Options\" onclick = \"sendMail('"+ result.message_id +"')\">" +
											"<input type='button' value='Close' style='background:#105695;color:white;width:70px;height:32px;border-radius:5px;" +
											"float:right' onclick = 'closeTextBox1()'><br><br><p><span style='font-weight:bold;font-size:14px'>Comments:</span>" +
											"<br><textarea id='commentText'  style='width:100%;height:150px'></textarea></p></div><div id = 'mail-body1'>" + result.previewBody +
							"</div>";
							$('#mail-preview1').bPopup({
				                onClose: function() {  
				                	loadAirBookings('new-tab'); 
				                }
				    	 	}); 
						}
					}else{ 
			 		}
					
				}
				
			}
		});
		
		

		
		
	}else if(_mode && _mode == "ERP"){
		
		
		if(document.getElementById('opt_oneway').checked){
			
			entity['trip_type'] = "One Way";
			
			
		}else if(document.getElementById('opt_roundtrip').checked){
			
			entity['trip_type'] = "Round Trip";
			
		}else if(document.getElementById('opt_multicity').checked){
			
			entity['trip_type'] = "Multi City";
			
		}
		
		
		var optionArr = new Array();
		optionArr.push(entity);
		reqURL += "/rest/sbtaddoptionflow/";
		requestType = 'POST';
		if(actionType == "options"){
			reqURL += "tripCreate";
		}else{
			reqURL += "confirmOption";
		}
		
		var tripObj = buildTripObj(entity);
		
		var rootObject = {}; 
		rootObject['optionData'] = optionArr;
		rootObject['tripData'] = tripObj;
		jsonString = JSON.stringify(rootObject);	
		
		$.ajax({
			url: reqURL,
			type: requestType,
			data:jsonString,
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			success: function(result) {
				if (result['status']){ 
					
					if(actionType == "confirmation" && result){ 
						
						setBookingStatus("success"); 
						showBookingProgress(result['message'], true, result); 
						
					}else if(actionType == "options" && result['status'] == "SUCCESS"){
						
						var reqURL = "GenericServiceForm.do?method=editRequest";
						showOptionStatus(result, 0, reqURL);
					}
					
				}   
			}	
		});
	}
	
}


function buildTripObj(entity){
	 
	
	var fromDate = getDateFromFormat(document.getElementById("date_txt_0").value);
	var toDate = getDateFromFormat(document.getElementById("date_txt_0").value);
	if(document.getElementById("date_txt_01") &&
			$.trim(document.getElementById("date_txt_01").value).length > 0)
		toDate = getDateFromFormat(document.getElementById("date_txt_01").value);
	
	var cancellationPolicy = "";//document.getElementById("cancellationPolicy").innerHTML; 
	var fromCity = document.getElementById("city_from_txt_0").value;
	var toCity = document.getElementById("city_to_txt_0").value;
  
	
	var tripObj = {}; 

	
	tripObj.checkInDate = fromDate;
	tripObj.checkOutDate = toDate;
	tripObj.toCity = toCity;
	tripObj.fromCity = fromCity; 
	tripObj.travelType = 'Domestic'; 
	tripObj.serviceType = 'AIR';
	tripObj['journey_type'] = entity['trip_type'];
	
	if(document.getElementById('trip-request-id') && $.trim(document.getElementById('trip-request-id').value).length > 0)
		tripObj['trip_req_id'] = document.getElementById('trip-request-id').value;
	
	if(document.getElementById('service-id') && $.trim(document.getElementById('service-id').value).length > 0)
		tripObj['service_id'] = document.getElementById('service-id').value;
	
	if(document.getElementById('multicity-id') && $.trim(document.getElementById('multicity-id').value).length > 0)
		tripObj['multicity_id'] = document.getElementById('multicity-id').value;
	
	if(document.getElementById('traveller-id') && $.trim(document.getElementById('traveller-id').value).length > 0)
		tripObj['traveller_id'] = document.getElementById('traveller-id').value;
	
	
	
	return tripObj;
}


function showOptionStatus(result, count, reqURL){
	 
	//take some actions
	var status = "";
	var message = "";
	if(result && result['status']){
		status = result['status'];
		message = result['message'];
	}
	
	var statusDialog = document.getElementById("status-msg-" + count);
	$(statusDialog).prop("title" , "Message");
	var div = document.createElement("div");
	$(div).attr('style','font-size: 14px;text-align: justify;');
	$(div).html(message);
	$(statusDialog).append(div);
	$(statusDialog).dialog({ modal:true,closeOnEscape:false,width: 600,position: [($(window).width() / 2) - (600 / 2), 150],open: function(event, ui) { $(".ui-dialog-titlebar-close").show(); },buttons: {
						Ok: function() {
							if(count==0)
					redirectToRequest(result, reqURL);
				if(count==1)
						refreshScreen();	
						}
						}});
		
 }
 
 function redirectToRequest(result, reqURL){
	 
	 if(reqURL){
		
		    var tripReqId = result['tripReqId'];
			var screenId = result['screenId'];
			var tr_no = "";
			var sp_services = "";
			window_open('POST', reqURL, {"reqId": tripReqId ,"status": 1, "screen_type":"TRIP","screen_id":screenId,
				"process_id":5 , "is_read_only":"true","tr_no":tr_no,"sp_services":sp_services});			
		
		 
	 }else{
		 window.opener.location.reload();
		 window.close();
	 }
	 
 }
 


function showSelfBookingConfirmation(status,message,filePath){
	
	
	showSelfBookingCompleteDialog(status,message,filePath);
	
}

function showBookingConfirmation(message){
	
	showBookingCompleteDialog("Success",message);
	
}

function sendMail(messageId){ 

	var text = document.getElementById("commentText").value;

	document.getElementById("comments").innerHTML = text;
	var bodyData = document.getElementById('mail-body1').innerHTML;
	//bodyData += "<div style = 'padding-top: 10 px'>" + document.getElementById('mail-body').innerHTML + "</div>";
	var href = window.location.href; 
	//bodyData += text;
	var reqURL = href.substring(0, href.indexOf('MiceUserListofBookings.do') - 1);
	
	reqURL += "/MiceUserListofBookings.do?method=sendMail"; 
		
	$.post(reqURL,{"optionMailData": bodyData, "messageId": messageId}, function (result) {
//		 $("#mail-preview").bPopup().close();
	});
	
	$("#mail-preview1").bPopup().close();
	
}

function showBookingCompleteDialog(type,message){
	
	var title_div = document.getElementById("message");
	title_div.title = type;
	
	var message_text = document.getElementById("lbl_message");
	message_text.innerText = message;
	
	$( "#message" ).dialog();
	
}

function showSelfBookingCompleteDialog(type,message,filePath){
	
	var title_div = document.getElementById("self_booking_message");
	title_div.title = type;
	
	var message_text = document.getElementById("lbl_selfbooking_message");
	message_text.innerText = message;
	
	if(!filePath || filePath == ""){
		
		document.getElementById("lnk_eticket").style.display = "none";
		
	}else{
	
		var href = window.location.href; 
		
		var reqURL = href.substring(0, href.indexOf('MiceUserListofBookings.do') - 1);
		
		reqURL += "/rest/flightBooking/downloadTicket?filePath=" + filePath;
		
		$("#lnk_eticket").attr('href',reqURL);
		
		
	}
	
	$( "#self_booking_message" ).dialog();
}

function sendReplyMail()
{
	var bodyData = document.getElementById('replyText').value;
	bodyData += document.getElementById('mail-body').innerHTML;
	var messageId = document.getElementById('request_message_id').value ;
	var href = window.location.href; 
	
	var reqURL = href.substring(0, href.indexOf('MiceUserListofBookings.do') - 1);
	
	reqURL += "/MiceUserListofBookings.do?method=sendMail"; 
		
	$.post(reqURL,{"optionMailData": bodyData, "messageId": messageId}, function (result) {
//		 $("#mail-preview").bPopup().close();
	});
	
	$("#mail-preview").bPopup().close();
	
	}



function toggleSelection(id){
		
		addSelection(id.id);
	
}

function onSelect(){
	
	if(!isUserSelectionDone)
		checkUserTripSelection(_existingTrips, null, null, "option"); 
	
	if(isUserSelectionDone){
		
		
		
		var root = {};
		
		var segments = []; 
		
		var selectedObjects = [];
		
		var price = 0;
		var quotedPrice = 0;
		
		for (var int2 = 0; int2 < Object.keys(_selections).length; int2++) {
			var selectedEntity = _selections[Object.keys(_selections)[int2]];
			selectedObjects[int2] = selectedEntity;
			
			var priceString = selectedEntity['price'];
			priceString = priceString.split(" ")[1];
			priceString = priceString.replace(",", "");
			quotedPrice = parseFloat(priceString);
			price += quotedPrice;
			selectedEntity['quoted_price'] = quotedPrice;
			
		}
		
		root['trip_type'] = "roundtrip";
		root['type'] = "Air";
		root['is_selected'] = "true";
		root['price'] = "INR " + price;
		root['quoted_price'] = price;
		root['currency'] = "34"; 
		root['direction'] =  selectedObjects;
		
		onAirBookByObject(root,"options");
	}
	
}

function onPrevious(){
	
	if(!shouldMove())
		return;
	
	var segments = document.getElementById("segments");
	
	//var children = segments.childNodes;
	
	var children = $(segments).children();
	
	for (var int = 0; int < children.length;  int++) {
		
		var child = children[int];
		
		if(child.className == "active"){/*
			
			//check whether current-1 exist or not
			if(children[int - 1] == null){
				alert("first segment");
				return;
			}
			
			//hide the second visible child
			if(children[int + 1]){
				var secondVisibleChild = children[int + 1];
				secondVisibleChild.style.display = "none";
			}
			
			//show the current - 1
			
			if(children[int - 1]){
				var nextVisible = children[int - 1];
				nextVisible.style.display = "block";
			}
			
			return;
			*/
			

			
			//check whether next+1 exist or not
			if(children[int - 1] == null){
				alert("first segment");
				return;
			}
			var next = children[int + 1];
			var nextVisible = children[int - 1];
			//hide the fist visible child
			//child.style.display = "none";
			var index = $(child).index()-1;
				//index = index/2;
				//var width = $('#segments').width();
				var width = $(child).width();
				
				 $('#segments').animate({'margin-left':-(index*width)},500,function(){
					 
					 next.className = "";
					 if(nextVisible){
						 nextVisible.className = "active";
					 }
				 });
					 
				//$(current).animate({ "left": "+=50px" }, "slow" );
					
					
			
				
				//$(current).animate({ "left": "+=50px" }, "slow" );
				//$(current).hide('slide', {direction: 'left'}, 1000);	
				
			
					
					
					
					
			//show the next+1
			
			
			
			return;
			
			
			
			
		}
	}
}

function onNext(){
	
	if(!shouldMove())
		return;
	
	var segments = document.getElementById("segments");
	
	//var children = segments.childNodes;
	
	var children = $(segments).children();
	
	for (var int = 0; int < children.length; int++) {
		
		var child = children[int];
		
		if(child.className == "active"){
			
			//check whether next+1 exist or not
			if(children[int+2] == null){
				alert("last segment");
				return;
			}
			var current = children[int + 1];
			var nextVisible = children[int + 2];
			//hide the fist visible child
			//child.style.display = "none";
			$(function(){});
				
				var index = $(child).index()+1;
				//index = index/2;
				//var width = $('#mask').width();
				var width = $(child).width();
				/* $('#segments').animate({'margin-left':-(index*width)},500,function(){
					 
					 child.className = "";
					 if(nextVisible){
							nextVisible.className = "active";
					 }
				 });*/
				/*$(child).hide('slide', {direction: 'left'}, 1000,function(){
					child.style.display = "none";
				
					
				$(current).hide('slide', {direction: 'left'});
					
				$(current).show('slide', {direction: 'right'}, 1000);
					
					if(nextVisible){
						
						$(nextVisible).show('slide', {direction: 'right'}, 1000);
						
					}
				});
			
			
			nextVisible.style.display = "block";*/
				//$(current).animate({ "left": "+=50px" }, "slow" );
					
					
			
				
				//$(current).animate({ "left": "+=50px" }, "slow" );
				//$(current).hide('slide', {direction: 'left'}, 1000);	
				
					
			//show the next+1
			
			
			
			return;
			
		}
	}
}
function shouldMove(){
	
	var segments = document.getElementById("segments");
	
	if(segments.childNodes == null)
		return false;
	
	var childNodeCount = segments.childNodes.length;
	
	if(childNodeCount <= 2){
		return false;
	}else {
		return true;
	}
	
}

//Ng:Added to close modal pop up
function closeTextBox()
{
	$("#mail-preview").bPopup().close();
}

function closeTextBox1()
{
	$("#mail-preview1").bPopup().close();
}

//MJ: Added for SBT book flow for selected entities.
function onBookSelect(){
	
	var root = {};
	
	var segments = []; 
	
	var selectedObjects = [];
	
	var price = 0;
	
	
	var quotedPrice = 0;
	
	var provider = null;
	
	for (var int2 = 0; int2 < Object.keys(_selections).length; int2++) {
		var selectedEntity = _selections[Object.keys(_selections)[int2]];
		selectedObjects[int2] = selectedEntity;
		
		var provider = selectedEntity['id'].substring(0, selectedEntity['id'].indexOf("_"));
		
		var priceString = selectedEntity['price'];
		priceString = priceString.split(" ")[1];
		priceString = priceString.replace(",", "");
		quotedPrice = parseFloat(priceString);
		price += quotedPrice;
		selectedEntity['quoted_price'] = quotedPrice;
		
	}

	if(provider){
		root['provider'] = provider;
		root['trip_type'] = "roundtrip";
		root['type'] = "Air";
		root['is_selected'] = "true";
		root['price'] = "INR " + price;
		
		root['direction'] = selectedObjects;
		
		onAirBookByObject(root,"confirmation");
	}else{
		alert("Please select the valid option");
	}
	
	
	
}


function showSegmentsBookDailog(sName){
	
	if(_isERPFlow){
		
		_segmentsFlag = true;
		
		var optionData = _selections[sName.id]
		
		if(optionData)
			onBook(0, optionData);
		
	}else{
		_segmentsFlag = true;
		
		var optionData = _selections[sName.id]
		
		if(optionData)
			onBook(0, optionData);
	}
	
	 
};


function loadAllExistingTrips(segmentObjects, serviceCode){
	
	if(segmentObjects != null && _user_type != "T" && _user_type != "SP"){
		var queryObj = segmentObjects[0];
		queryObj['service_code'] = serviceCode;
		var query = JSON.stringify(queryObj);
		$.ajax({
			url:"rest/trip/existingTrips?query=" + encodeURIComponent(query) + "&timeStamp=" + new Date().getTime(),
			success:function(result){
			   		
				var resultData = JSON.parse(result); 
				if(resultData && resultData['status'] == "Success"){
					_existingTrips = resultData['trips'];
				} 
				
			}
		});
		
	}
	
}

function checkUserTripSelection(existingTrips, sectionId, optionData, type){
	
	var retVal = true;
	
	if(existingTrips && existingTrips.length > 0){
		retVal = false;
		var baseElement = document.getElementById("status-msg-0");
		var div = document.createElement("div");
		$(div).attr('style','font-size: 14px;text-align: justify;');
		$(div).attr('id','message-Element');
		$(baseElement).append(div);					
		var titleMes="Message";
		$(div).html("Do you want to associate this option with an existing trip?");
		
		$(baseElement).dialog({ 
			modal:true,
			width: 600,	
			title:titleMes,
			closeOnEscape:false,
			position: [($(window).width() / 2) - (600 / 2), 300],
			open: function(event, ui) { $(".ui-dialog-titlebar-close").show(); },
			buttons: {
				Yes: function() {
					$( this ).dialog( "close" );
					$(baseElement).empty();
					return showExistingTrips(existingTrips, sectionId, optionData, type);
				},
				No: function(){
					
					$( this ).dialog( "close" );
					$(baseElement).html("");
					isUserSelectionDone = true;
					if(type == "confirm")
						onBook(sectionId, optionData);
					else if(type == "option")
						onSelect();
				}
				},
				close: function(event,ui){
					$( this ).dialog( "close" );
					$(baseElement).empty();
					retVal = true;
				}

		});

		return retVal;
		
	}else{
		isUserSelectionDone = true;
	}
	
}

function showExistingTrips(existingTrips, sectionId, optionData, type){
	
	var tripDivELement = document.getElementById('existing-trips-div');
	
	if(tripDivELement){
	
		var tableElement = document.createElement("table");
		$(tableElement).attr('class','table dtable table-bordered table-primary-hover td-v-middle m-t-b-5')
		
		var thead = document.createElement("thead");
		var tbody = document.createElement("tbody");
		
		tableElement.appendChild(thead);
		tableElement.appendChild(tbody);
		
		for(var int = 0; int < existingTrips.length; int++){
			
			var existingTrip = existingTrips[int]; 
			var headerRowElement = null;
			if (int == 0){
				var headerRowElement = document.createElement("tr");
				thead.appendChild(headerRowElement);
			}
				
			var rowElement = document.createElement("tr");
			$(rowElement).attr('style', "cursor:pointer");
			
			var tripReqId;
			var serviceId;
			var multicityId;
			var travellerId;
			$.each( existingTrip, function( key, value ) {
				 
				 if( key == "trip_req_id" ){
					 tripReqId = value;
				 }else if( key == "Service Id" && value && $.trim(value).length > 0){
					 serviceId = value;
				 }else if( key == "Multicity Id" && value && $.trim(value).length > 0){
					 multicityId = value;
				 }else if(key == "Traveller Id" && value && $.trim(value).length > 0){
					 travellerId = value;
				 }
				 else{ 
					 if (headerRowElement){ 
						 var headerDataElement = document.createElement("th");
						 $(headerDataElement).html(key);
						 headerRowElement.appendChild(headerDataElement);
					 }
					 var rowDataElement = document.createElement("td");
					 $(rowDataElement).html(value);
					 rowElement.appendChild(rowDataElement);
				 }
				 
			});
			
			(function () {  
				 
				var uniqueReqid =  tripReqId;
				var uniqueServiceId = serviceId;
				var uniqueMulticityId = multicityId;
				var uniqueTravellerId =  travellerId;
			    if(rowElement.addEventListener) 
			    	rowElement.addEventListener("click",function() { isUserSelectionDone = true; $( tripDivELement ).dialog( "close" );
					$(tripDivELement).empty(); return callBackFunction(sectionId, optionData, uniqueReqid, uniqueServiceId, uniqueMulticityId, uniqueTravellerId, type);});
			    else 
			    	rowElement.attachEvent("click",function() { isUserSelectionDone = true;$( tripDivELement ).dialog( "close" );
					$(tripDivELement).empty(); return callBackFunction(sectionId, optionData, uniqueReqid, uniqueServiceId, uniqueMulticityId, uniqueTravellerId, type);});
			    
			}());
			 
			tbody.appendChild(rowElement);
	
		}
	}

		
	tripDivELement.appendChild(tableElement);
	
	$(tripDivELement).dialog({
		modal:true,
		width: 900,			
		title:"Existing Trips",
		closeOnEscape:false,
		position: [($(window).width() / 2) - (900 / 2), 150],
		 close: function(event,ui){
				$( this ).dialog( "close" );
				$(this).empty();
				return false;
		 }
	});
		
}  

function callBackFunction(sectionId, optionData, uniqueReqid, uniqueServiceId, uniqueMulticityId, uniqueTravellerId, type){
	
	if(document.getElementById('trip-request-id') && uniqueReqid)
		document.getElementById('trip-request-id').value = uniqueReqid;
	
	if(document.getElementById('service-id') && uniqueServiceId)
		document.getElementById('service-id').value = uniqueServiceId;
	
	if(document.getElementById('multicity-id') && uniqueMulticityId)
		document.getElementById('multicity-id').value = uniqueMulticityId;
	
	if(document.getElementById('traveller-id') && uniqueTravellerId)
		document.getElementById('traveller-id').value = uniqueTravellerId;
	
	if(type == "confirm")
		onBook(sectionId, optionData);
	else if(type == "option")
		onSelect();
	
}

