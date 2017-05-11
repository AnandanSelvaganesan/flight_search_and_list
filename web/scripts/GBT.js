
var gv_SearchDataArr = "";
var gv_FlightType = "one-way";

var _segmentDeptTimes = {};
var _segmentRows = [];

var minReturnDate = "";


//function to Generate 1st header row of Oneway and roundtrip  Search
function buildEmptySearchBox(){
	
	var tableElement = document.getElementById('search-table');  
	
	var headerRowElement = document.createElement("tr");
	headerRowElement.align = "left";
	 
	var headerData = document.createElement("th");
	headerData.innerHTML = "FROM";
	headerData.style["font-size"] = "10pt";
	
	var headerData1 = document.createElement("th");
	headerData1.innerHTML = "To";
	headerData1.style["font-size"] = "10pt";
	
	headerRowElement.appendChild(headerData);
	headerRowElement.appendChild(headerData1);
	
	//tableElement.appendChild(headerRowElement);
	addSearchSegmentRow();
	
}

//function to Generate 1st header row of Oneway and roundtrip Search
function attachCityAutoComplete(txtField, txHiddenField){
	
	var cityReqURL = "rest/cities/autoCompleteIATA?q=";
	
	jQuery(txtField).autocomplete({
        source: function (request, response) {
           jQuery.getJSON(
                //"http://gd.geobytes.com/AutoCompleteCity?callback=?&q="+request.term,
                	cityReqURL + request.term,
                    function (data) {
                    
                		var array = data.error ? [] : $.map(data, function(m) {
    						return {
    							label: m.city_formatted_address,
    							city_id:m.city_id
    						};
						});
						response(array);
                		
                }
            );
        },
        minLength: 3,
        autoFocus: true,
        select: function (event, ui) {
            var selectedObj = ui.item; 
            jQuery(txtField).val( ui.item.label);	
            jQuery(txHiddenField).val(ui.item.city_id);
           
            return false;
        },
        change: function(event,ui){
			event.preventDefault();
			
			if (ui.item == null && JSON.stringify(ui.item) != undefined ) {
				$(txtField).val('');
				$(txtField).focus();
			}  
			
		},
        open: function () {
            jQuery(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },
        close: function () {
            jQuery(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        }
    }).on('focus', function() { $(this).keydown(); });
    
    jQuery(txtField).autocomplete("option", "delay", 100);
    
}

function addSearchSegmentRow(){
	
	var length = _segmentRows.length;
	var dropdownformclicked = false;
	var index = length;
	
	_segmentRows.push(index);
	
	var tableElement = document.getElementById('search-table');
	var ChildtableElement = document.getElementById('search-table-2'); 
	
	var headerRowElement1 = document.createElement("div");
	//headerRowElement1.align = "left";
	
	var headerData2 = document.createElement("th");
	headerData2.innerHTML = "Departure";
	headerData2.style["font-size"] = "10pt";
	
	var headerData3 = document.createElement("th");
	headerData3.innerHTML = "Return";
	headerData3.setAttribute("class","roundtrip_enable_heading");
	headerData3.style["font-size"] = "10pt";
	
	var headerData4 = document.createElement("th");
	headerData4.innerHTML = "Time";
	headerData4.style["font-size"] = "10pt";
	
	var headerData5 = document.createElement("th");
	headerData5.innerHTML = "Return Time";
	headerData5.setAttribute("class","roundtrip_enable_heading");
	headerData5.style["font-size"] = "10pt";

	var headerData6 = document.createElement("th");
	headerData6.innerHTML = "Adult";
	headerData6.style["font-size"] = "10pt";
	
	var headerData7 = document.createElement("th");
	headerData7.innerHTML = "Children";
	headerData7.style["font-size"] = "10pt";
	
	var headerData8 = document.createElement("th");
	headerData8.innerHTML = "Class";
	headerData8.style["font-size"] = "10pt";
	
	var rowElement = document.createElement("div");
	rowElement.id = "segment_" + index;
	
	// From city input box
	var cityFromData = document.createElement("div");
	cityFromData.setAttribute("class","col-xs-2");
	
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
		
	var label = document.createElement("label");
	$(label).html("From");

	var inputFromCity = document.createElement("input");
	inputFromCity.setAttribute("class","form-control font12");	
	inputFromCity.setAttribute("placeholder","Select Origin");	
	inputFromCity.type = "text";
	inputFromCity.id = "city_from_txt_" + index;
	
	var inputHiddenFromCity = document.createElement("input");
	inputHiddenFromCity.setAttribute("class","form-control input-xs"); 	
	inputHiddenFromCity.type = "hidden"; 
	inputHiddenFromCity.id = "city_from_txt_hidden_" + index;
	
	attachCityAutoComplete(inputFromCity, inputHiddenFromCity);
	
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(inputFromCity);
	formGroupDiv.appendChild(inputHiddenFromCity);
	cityFromData.appendChild(formGroupDiv);
	
	
	// swap button
	var citySwapBtn = document.createElement("div");
	citySwapBtn.setAttribute("class","col-xs-1 add-xs-0_5 text-center");
	
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
		
	var label = document.createElement("label");
	label.setAttribute("class","m-b-1");
	$(label).html("&nbsp;");

	var swapBtn = document.createElement("a");
	swapBtn.setAttribute("class","btn btn-default");	
	swapBtn.setAttribute("tabindex","-1");	
	swapBtn.setAttribute("href","javascript:void(0);");	
	$(swapBtn).html('<i class="fa fa-exchange" aria-hidden="true"></i>');
	swapBtn.addEventListener("click",function() { swapCityValue();});

	
	formGroupDiv.appendChild(label);
	citySwapBtn.appendChild(formGroupDiv);
	citySwapBtn.appendChild(swapBtn);
	
	
	// To city input box
	var cityToData = document.createElement("div");
	cityToData.setAttribute("class","col-xs-2");
	
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
		
	var label = document.createElement("label");
	$(label).html("To");
	
	var inputToCity = document.createElement("input");
	inputToCity.setAttribute("class","form-control font12");	
	inputToCity.setAttribute("placeholder","Select Destination");	
	inputToCity.type = "text";
	inputToCity.id = "city_to_txt_" + index;
	
	var inputHiddenToCity = document.createElement("input");
	inputHiddenToCity.setAttribute("class","form-control input-xs"); 	
	inputHiddenToCity.type = "hidden"; 
	inputHiddenToCity.id = "city_to_txt_hidden_" + index;
	
	attachCityAutoComplete(inputToCity, inputHiddenToCity);
	
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(inputToCity);
	formGroupDiv.appendChild(inputHiddenToCity);
	cityToData.appendChild(formGroupDiv);
	
	
	var rowElement2 = document.createElement("div");
	rowElement2.id = "segment_" + index;
	
	var dateData = document.createElement("div");
	dateData.setAttribute("class","col-xs-2");
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group has-left-icon");
		
	var label = document.createElement("label");
	$(label).html("Depart On");
	
	var inputAddonIcon = document.createElement("span");
	inputAddonIcon.setAttribute("class","glyphicon glyphicon-calendar form-control-icon color-default");
	
	var inputDate = document.createElement("input");
	inputDate.setAttribute("class","form-control font12");
	inputDate.type = "text";
	inputDate.id = "date_txt_" + index;
	
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(inputDate);
	formGroupDiv.appendChild(inputAddonIcon);
	dateData.appendChild(formGroupDiv);
	
	var timeData = document.createElement("div");
	timeData.setAttribute("class","col-xs-2");
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
		
	var label = document.createElement("label");
	$(label).html("Time");
	
	var inputTime = document.createElement("input");
	inputTime.setAttribute("class","form-control input-xs");
	inputTime.type = "text";
	inputTime.id = "time_txt_" + index ;
	
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(inputTime);
	timeData.appendChild(formGroupDiv);	
	
	$(inputTime).focus(function() {
        $(inputTime).pickatime();
    });
	
	var dateReturn = document.createElement("div");
	dateReturn.setAttribute("class","col-xs-2");
	
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group has-left-icon");
		
	var inputAddonIcon = document.createElement("span");
	inputAddonIcon.setAttribute("class","glyphicon glyphicon-calendar form-control-icon color-default");
	
	var label = document.createElement("label");
	$(label).html("Return on");
	
	var inputReturn = document.createElement("input");
	inputReturn.setAttribute("class","form-control font12 roundtrip_enable");
	inputReturn.type = "text";
	inputReturn.disabled = "true";
	inputReturn.id = "return_date_txt_" + index;
	
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(inputReturn);
	formGroupDiv.appendChild(inputAddonIcon);
	dateReturn.appendChild(formGroupDiv);

    var returnDate =  $(inputReturn).pickadate({
    	min: true
    });
    var picker = returnDate.pickadate('picker');

			
    $(inputDate).pickadate({
    	min: true,
    	onStart: function() { 
           	this.set('select', new Date());
        },
    	onSet: function(context) {
    		picker.set('min',this.get('select'));
    		
    	
    	}/*,
    	onRender: function() {
    		if(document.getElementById('opt_roundtrip').checked)
    			picker.open();
    	},
    	onClose: function() {
    		if(document.getElementById('opt_roundtrip').checked)
    			picker.open();
    	}*/
    });



	var timeReturn = document.createElement("div");
	//timeReturn.width = "15%"; 
	timeReturn.setAttribute("class","col-xs-2");
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
		
	var label = document.createElement("label");
	$(label).html("Time");
	
	var inputTimeReturn = document.createElement("input");
	inputTimeReturn.setAttribute("class","form-control input-xs roundtrip_enable");
	inputTimeReturn.disabled = "true";
	inputTimeReturn.type = "text";
	inputTimeReturn.id = "time_txt_" + (parseInt(index) + 1) ;
	
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(inputTimeReturn);
	timeReturn.appendChild(formGroupDiv);
	
	$(inputTimeReturn).focus(function() {
        $(inputTimeReturn).pickatime();
    });
	
	
	var colBreak = document.createElement("div");
	colBreak.setAttribute("class","col-xs-12");
	
	var adult = document.createElement("div");
	adult.setAttribute("class","col-xs-6");
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
		
	var label = document.createElement("label");
	label.setAttribute("class","font-normal font12 color-default");
	$(label).html("Adult");
	
	var selectAdult = document.createElement("select");
	selectAdult.setAttribute("class","form-control input-xs");
	selectAdult.setAttribute("id", "txt_adult_count");
	selectAdult.addEventListener("change",function() { travellerDetails();});
	
	for (var i = 1; i<=14; i++)
	{
		var optionAdult = document.createElement("option");
		optionAdult.value = i;
		optionAdult.innerHTML = i;
		selectAdult.appendChild(optionAdult);
	}
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(selectAdult);
	adult.appendChild(formGroupDiv);
	
	var children = document.createElement("div");
	children.setAttribute("class","col-xs-6");
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
		
	var label = document.createElement("label");
	label.setAttribute("class","font-normal font12 color-default");
	$(label).html("Children"); 
	
	var selectChildren= document.createElement("select");
	selectChildren.setAttribute("class","form-control input-xs");
	selectChildren.setAttribute("id", "txt_children_count");
	selectChildren.addEventListener("change",function() { travellerDetails();});
	
	for (var i = 0; i<=14; i++)
	{
		var optionChildren= document.createElement("option");
		optionChildren.value = i;
		optionChildren.innerHTML = i;
		selectChildren.appendChild(optionChildren);
	}
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(selectChildren);
	children.appendChild(formGroupDiv);

	
	
	var classes = document.createElement("div");
	classes.setAttribute("class","col-xs-12");
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
		
	var label = document.createElement("label");
	label.setAttribute("class","font-normal font12 color-default");
	$(label).html("Travel type"); 
	var selectClasses = document.createElement("select");
	selectClasses.setAttribute("class","form-control input-xs");
	selectClasses.setAttribute("id", "txt_class");
	selectClasses.addEventListener("change",function() { travellerDetails();});
	
	var optionClasses = document.createElement("option");
		
	optionClasses.value = "Economy"; 
	optionClasses.innerHTML = "Economy"; 
	selectClasses.appendChild(optionClasses);
	var optionClasses = document.createElement("option");
	optionClasses.value = "Business"; 
	optionClasses.innerHTML = "Business"; 
	selectClasses.appendChild(optionClasses);
	
	
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(selectClasses);
	classes.appendChild(formGroupDiv);

	
	
	var travellerData = document.createElement("div");
	travellerData.setAttribute("class","col-xs-2");
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group has-right-icon drop-input");
	formGroupDiv.setAttribute("id",'formDropdown');
	
	var dropDownForm = document.createElement("div");
	dropDownForm.setAttribute("class","dropdown-menu input-dropdown");
	dropDownForm.setAttribute("id",'myDropdown');
	dropDownForm.setAttribute('role','menu');
	
	var travellerPopOverData = document.createElement("div");
	travellerPopOverData.setAttribute("class","row p10 margin-r-l-0");
	
	travellerPopOverData.appendChild(adult);
	travellerPopOverData.appendChild(children);
	travellerPopOverData.appendChild(classes);
	dropDownForm.appendChild(travellerPopOverData);
	
	var label = document.createElement("label");
	$(label).html("Traveller(s) / Class");
	
	var inputTravellers = document.createElement("input");
	inputTravellers.setAttribute("class","form-control font12 dropdown-toggle zindex1");
	inputTravellers.setAttribute('readonly','true');
	inputTravellers.setAttribute("data-toggle","dropdown");
	
	inputTravellers.type = "text";
	inputTravellers.id = "traveller_count_details";
	inputTravellers.value = "1 Traveller(s), Economy";
	
	
	var rightIconAddon = document.createElement('span');
	$(rightIconAddon).attr('class','glyphicon glyphicon-triangle-bottom form-control-icon font10 color-default');
	$(rightIconAddon).html('');
	
	
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(inputTravellers);
	formGroupDiv.appendChild(dropDownForm);
	formGroupDiv.appendChild(rightIconAddon);
	travellerData.appendChild(formGroupDiv);
	
	var searchBtn = document.createElement("div");
	searchBtn.setAttribute("class","col-xs-1 add-xs-1_5 text-center");

	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
	var label = document.createElement("label");
	label.setAttribute("class","m-b-1");	
	$(label).html("&nbsp;");
	
	var anchor = document.createElement("a");
	anchor.setAttribute("class","btn btn-primary btn-block white-color");
	anchor.setAttribute('href','javascript:void(0)');
	//anchor.setAttribute('style','width: 150px;');
	anchor.addEventListener("click",function() { init();});
	$(anchor).html("Search"); 
	formGroupDiv.appendChild(label);
	searchBtn.appendChild(formGroupDiv);
	searchBtn.appendChild(anchor);
	

	rowElement.appendChild(cityFromData);
	rowElement.appendChild(citySwapBtn);
	rowElement.appendChild(cityToData);
	rowElement.appendChild(dateData);
	
	
	//rowElement2.appendChild(dateData);
	//rowElement2.appendChild(timeData);
	rowElement.appendChild(dateReturn);
	rowElement.appendChild(travellerData);
	//rowElement2.appendChild(timeReturn);
	//rowElement2.appendChild(colBreak);
	
	//rowElement2.appendChild(adult);
	//rowElement2.appendChild(children);
	//rowElement2.appendChild(classes);
	rowElement.appendChild(searchBtn);
	
	/*headerRowElement1.appendChild(headerData2);
	headerRowElement1.appendChild(headerData4);
	headerRowElement1.appendChild(headerData3);
	headerRowElement1.appendChild(headerData5);
	headerRowElement1.appendChild(headerData6);
	headerRowElement1.appendChild(headerData7);
	headerRowElement1.appendChild(headerData8);*/
	
	tableElement.appendChild(rowElement);
	//ChildtableElement.appendChild(headerRowElement1);
	//ChildtableElement.appendChild(rowElement2);
	
	//$('.dropdown-toggle').dropdown();

	/*$('.input-dropdown').click(function(e) {
	    e.stopPropagation();
	});*/
	
	

}

function travellerDetails(val){
	
	if(!val)
		val='';
	var adultCount = $('#'+val+'txt_adult_count').val();
	var childCount = $('#'+val+'txt_children_count').val();
	var classType = $('#'+val+'txt_class').val();
	
	$("#"+val+"traveller_count_details").val((parseInt(adultCount) + parseInt(childCount)) + ' Traveller(s), ' + classType);
}
function swapCityValue(){
	 
	 var fromVal = $('#city_from_txt_0').val();
	 var toVal = $('#city_to_txt_0').val();
	 
	$('#city_to_txt_0').val(fromVal);
	$('#city_from_txt_0').val(toVal);

} 

//function to Generate 1st header row of MultiCity Search
function buildEmptySearchBox_multicity(){
	
	_segmentRows = [];
	
	var length = _segmentRows.length;
	
	var index = length + 3;
	var tableElement = document.getElementById('search-table-3');  
	
	var headerRowElement = document.createElement("tr");
	headerRowElement.align = "left";
	 
	var headerData = document.createElement("th");
	headerData.innerHTML = "FROM";
	headerData.style["font-size"] = "10pt";
	
	var headerData1 = document.createElement("th");
	headerData1.innerHTML = "To";
	headerData1.style["font-size"] = "10pt";
	
	var headerData2 = document.createElement("th");
	headerData2.innerHTML = "Departure";
	headerData2.style["font-size"] = "10pt";
	
	var headerData4 = document.createElement("th");
	headerData4.innerHTML = "Time";
	headerData4.style["font-size"] = "10pt";
	
	
	headerRowElement.appendChild(headerData);
	headerRowElement.appendChild(headerData1);
	headerRowElement.appendChild(headerData2);
	headerRowElement.appendChild(headerData4);
	
	//tableElement.appendChild(headerRowElement);
	
	for(var i=0;i < index;i++ ){
		addSearchSegmentRow_multicity(i,index);
	}
	//addSearchSegmentRow_multicity(index-1);
	//addSearchSegmentRow_2_multicity(index-4);
	//addSearchSegmentRow_2_multicity(index-3);
	addCitySegmentRow();
}

// function to Generate 1st input row of MultiCity Search
function addSearchSegmentRow_multicity(index,totRow){
	
	
	var index = _segmentRows.length + 1;
	
	_segmentRows.push(index);
	
	var tableElement = document.getElementById('search-table-3');
	
	var rowElement = document.createElement("div");
	rowElement.id = "segment_" + index;

	// From city input box
	var cityFromData = document.createElement("div");
	cityFromData.setAttribute("class","col-xs-4");
	
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
		
	var label = document.createElement("label");
	$(label).html("From");

	var inputFromCity = document.createElement("input");
	inputFromCity.setAttribute("class","form-control font12");	
	inputFromCity.setAttribute("placeholder","Select Origin");	
	inputFromCity.type = "text";
	inputFromCity.id = "city_from_txt_" + index;
	attachCityAutoComplete(inputFromCity);
	
	
	(function(){ 
		
		if(inputFromCity.addEventListener){
			inputFromCity.addEventListener("focus", function() { return getPrevRowToCity(index);});
		}else{
			inputFromCity.attachEvent("focusin", function() { return getPrevRowToCity(index);}); 
		} 

	}());
	
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(inputFromCity);
	cityFromData.appendChild(formGroupDiv);
	
	
	// To city input box
	var cityToData = document.createElement("div");
	cityToData.setAttribute("class","col-xs-4");
	
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
		
	
	var label = document.createElement("label");
	$(label).html("To");
	
	var inputToCity = document.createElement("input");
	inputToCity.setAttribute("class","form-control font12");	
	inputToCity.setAttribute("placeholder","Select Destination");
	inputToCity.type = "text";
	inputToCity.id = "city_to_txt_" + index;
	attachCityAutoComplete(inputToCity);
	

	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(inputToCity);
	cityToData.appendChild(formGroupDiv);
	
	var rowElement2 = document.createElement("div");
	rowElement2.id = "segment_" + index;
	
	var dateData = document.createElement("div");
	dateData.setAttribute("class","col-xs-3");
	
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group has-left-icon");
		
	var inputAddonIcon = document.createElement("span");
	inputAddonIcon.setAttribute("class","glyphicon glyphicon-calendar form-control-icon color-default");
	
	var label = document.createElement("label");
	$(label).html("Depart On");
	var inputDate = document.createElement("input");
	inputDate.setAttribute("class","form-control font12");
	inputDate.type = "text";
	inputDate.id = "date_txt_" + index;
	
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(inputDate);
	formGroupDiv.appendChild(inputAddonIcon);
	dateData.appendChild(formGroupDiv);
	
	var inputDatePick =  $(inputDate).pickadate({
	    min: true,
	    today: '',
	    clear: '',
	    onSet: function(context) {
	    	var prevSelectedDate = $("#date_txt_" + (index)).val();
	    	if(prevSelectedDate){
	    		var nextInput = $("#date_txt_" + (index+1)).pickadate('picker');
	    		if(nextInput)
	    			nextInput.set('min',  new Date(prevSelectedDate));
	    	}
	      }
	});
	
	var picker = inputDatePick.pickadate('picker');
	  
	if(index <= 1){

		picker.set('select', new Date());

	}else{
		
		var prevSelectedDate = $("#date_txt_" + (index-1)).val();
		if(prevSelectedDate)
			picker.set('min',  new Date(prevSelectedDate));

	}
	
	var timeData = document.createElement("div");
	timeData.setAttribute("class","col-xs-2");
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
		
	var label = document.createElement("label");
	$(label).html("Time");
	
	var inputTime = document.createElement("input");
	inputTime.setAttribute("class","form-control input-xs");
	inputTime.type = "text";
	inputTime.id = "time_txt_" + index ;
	
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(inputTime);
	timeData.appendChild(formGroupDiv);	
	
	$(inputTime).focus(function() {
        $(inputTime).pickatime();
    });
	
	
	var cancelData = document.createElement("div");
	cancelData.setAttribute("class","col-xs-1 text-right");
	
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
	
	var label = document.createElement("label");
	label.setAttribute("class","margin-b-1");
	$(label).html("&nbsp;");
	
	//var br = document.createElement("br");
		
	//cancelData.width = "10%";
	var cancelImg = document.createElement("button");
	cancelImg.setAttribute("class","form-control btn btn-danger btn-xs");
	$(cancelImg).html("<i class='glyphicon glyphicon-minus'></i>")
	//cancelImg.style["height"] = "24px";
	cancelImg.style["width"] = "48px";
	cancelImg.id = "remove_button_" + index;
	//cancelImg.src = "web/images/cancel.png";
	//cancelImg.style.cursor = "pointer";
	
	if(cancelImg.addEventListener){
		cancelImg.addEventListener("click",function() { removeSegment(index);});
	}
	
	var colBreak = document.createElement("div");
	colBreak.setAttribute("class","col-xs-12");
	
	formGroupDiv.appendChild(label);
	//formGroupDiv.appendChild(br);
	cancelData.appendChild(formGroupDiv);	
	cancelData.appendChild(cancelImg);
	$(cancelImg).hide();
	
	if(index >= 4){
		$("#remove_button_" + (index-1)).hide();
	}
	
	if(index == totRow){
		$(cancelImg).show();
	}

	rowElement.appendChild(cityFromData);
	rowElement.appendChild(cityToData);
	rowElement.appendChild(dateData);
	
	//rowElement.appendChild(searchBtn);
	//rowElement.appendChild(timeData);
	rowElement.appendChild(cancelData);
	rowElement.appendChild(colBreak);
	
	tableElement.appendChild(rowElement);
	
}

//function to Generate 2nd header and input row of MultiCity Search
function addSearchSegmentRow_2_multicity(index){
	
	//var tableElement = document.getElementById('search-table-3');
	var ChildtableElement = document.getElementById('search-table-4'); 

	var rowElement = document.createElement("div");
	rowElement.id = "segment_" + index;	
	
	// From city input box
	var cityFromData = document.createElement("div");
	cityFromData.setAttribute("class","col-xs-4");
	
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
		
	var label = document.createElement("label");
	$(label).html("From");

	var inputFromCity = document.createElement("input");
	inputFromCity.setAttribute("class","form-control font12");	
	inputFromCity.setAttribute("placeholder","Select Origin");	
	inputFromCity.type = "text";
	inputFromCity.id = "city_from_txt_" + index;
	attachCityAutoComplete(inputFromCity);
	
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(inputFromCity);
	cityFromData.appendChild(formGroupDiv);
	
	
	
	// To city input box
	var cityToData = document.createElement("div");
	cityToData.setAttribute("class","col-xs-4");
	
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
		
	
	var label = document.createElement("label");
	$(label).html("To");
	
	var inputToCity = document.createElement("input");
	inputToCity.setAttribute("class","form-control font12");	
	inputToCity.setAttribute("placeholder","Select Destination");	
	inputToCity.type = "text";
	inputToCity.id = "city_to_txt_" + index;
	attachCityAutoComplete(inputToCity);
	
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(inputToCity);
	cityToData.appendChild(formGroupDiv);
	
	
	
	var rowElement2 = document.createElement("div");
	rowElement2.id = "segment_" + index;
	
	var dateData = document.createElement("div");
	dateData.setAttribute("class","col-xs-3");
	
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group has-left-icon");
		
	var inputAddonIcon = document.createElement("span");
	inputAddonIcon.setAttribute("class","glyphicon glyphicon-calendar form-control-icon color-default");
	
	var label = document.createElement("label");
	$(label).html("Depart On");
	var inputDate = document.createElement("input");
	inputDate.setAttribute("class","form-control font12");
	inputDate.type = "text";
	inputDate.id = "date_txt_" + index;
	
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(inputDate);
	formGroupDiv.appendChild(inputAddonIcon);
	dateData.appendChild(formGroupDiv);
	
	$(inputDate).pickadate({
		 min: true,
       onStart: function() { 
      	this.set('select', new Date())
      	}
      });
	
	$(inputDate).focus(function() {
        $(inputDate).pickadate();
    });
	
	
	rowElement.appendChild(cityFromData);
	rowElement.appendChild(cityToData);
	
	rowElement.appendChild(dateData);

	
	ChildtableElement.appendChild(rowElement);


}

function removeSegment(index){
	
	_segmentRows.splice( _segmentRows.indexOf( index ), 1 );
	var tableElement = document.getElementById('search-table-3');
	var row = document.getElementById("segment_" + index);
	
	if(index >= 4)
		$("#remove_button_" + (index-1)).show();
	
	tableElement.removeChild(row);
}

function addCitySegmentRow(){
	
	var AddCitytableElement = document.getElementById('search-addcity-table');
	var rowElementAddCity = document.createElement("div");
	var addData = document.createElement("div");
	addData.setAttribute("class","col-xs-2");
	
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
	var label = document.createElement("label");
	label.setAttribute("class","m-b-1");	
	$(label).html("&nbsp;");
		
	var addLink = document.createElement("a");
	addLink.setAttribute("class","btn btn-success btn-block white-color");
	addLink.href = "#";
	//addLink.style["text-decoration"] = "none";
	addLink.innerHTML = "<i class='glyphicon glyphicon-plus'></i> Add City"; 
	
	var addSpan = document.createElement("div");
	//addSpan.style["background"] = "#428bca";
	addSpan.setAttribute("class","addcity_div");
	
	var addFont = document.createElement("font");
	var addBold = document.createElement("b");
	addBold.innerHTML = "Add City";
	addFont.style["color"] = "white";
	addFont.appendChild(addBold);
	
	var addFont1 = document.createElement("font");
	var addBold1 = document.createElement("b");
	addBold1.innerHTML = "+";
	addFont1.style["color"] = "white";
	addFont1.appendChild(addBold1);
	
	if(addData.addEventListener){
		addData.addEventListener("click",function() { addSearchSegmentRow_multicity(_segmentRows.length,_segmentRows.length+1);});
	}
	
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(addLink);
	addData.appendChild(formGroupDiv);	
	
	var cancelData = document.createElement("div");
	cancelData.setAttribute("class","col-xs-1");
	
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
	
	var label = document.createElement("label");
	label.setAttribute("class","margin-b-5");
	$(label).html("&nbsp;");
	
	var br = document.createElement("br");
	
	//cancelData.width = "10%";
	var cancelImg = document.createElement("button");
	cancelImg.setAttribute("class","form-control btn btn-danger btn-xs pull-right");
	$(cancelImg).html("<i class='glyphicon glyphicon-minus'></i>")
	cancelImg.style["height"] = "24px";
	cancelImg.style["width"] = "24px";
	//cancelImg.src = "web/images/cancel.png";
	//cancelImg.style.cursor = "pointer";
	
	if(cancelImg.addEventListener){
		cancelImg.addEventListener("click",function() { removeSegment(index);});
	}
	
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(br);
	formGroupDiv.appendChild(cancelImg);
	cancelData.appendChild(formGroupDiv);	
	
	var adult = document.createElement("div");
	adult.setAttribute("class","col-xs-6");
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
		
	var label = document.createElement("label");
	label.setAttribute("class","font-normal font12 color-default");
	$(label).html("Adult");
	
	var selectAdult = document.createElement("select");
	selectAdult.setAttribute("class","form-control input-xs");
	selectAdult.setAttribute("id", "multi_txt_adult_count");
	selectAdult.addEventListener("change",function() { travellerDetails('multi_');});
	
	for (var i = 1; i<=14; i++)
	{
		var optionAdult = document.createElement("option");
		optionAdult.value = i;
		optionAdult.innerHTML = i;
		selectAdult.appendChild(optionAdult);
	}
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(selectAdult);
	adult.appendChild(formGroupDiv);
	
	var children = document.createElement("div");
	children.setAttribute("class","col-xs-6");
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
		
	var label = document.createElement("label");
	label.setAttribute("class","font-normal font12 color-default");
	$(label).html("Children"); 
	
	var selectChildren= document.createElement("select");
	selectChildren.setAttribute("class","form-control input-xs");
	selectChildren.setAttribute("id", "multi_txt_children_count");
	selectChildren.addEventListener("change",function() { travellerDetails("multi_");});
	
	for (var i = 0; i<=14; i++)
	{
		var optionChildren= document.createElement("option");
		optionChildren.value = i;
		optionChildren.innerHTML = i;
		selectChildren.appendChild(optionChildren);
	}
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(selectChildren);
	children.appendChild(formGroupDiv);

	
	
	var classes = document.createElement("div");
	classes.setAttribute("class","col-xs-12");
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
		
	var label = document.createElement("label");
	label.setAttribute("class","font-normal font12 color-default");
	$(label).html("Travel type"); 
	var selectClasses = document.createElement("select");
	selectClasses.setAttribute("class","form-control input-xs");
	selectClasses.setAttribute("id", "multi_txt_class");
	selectClasses.addEventListener("change",function() { travellerDetails("multi_");});
	
	var optionClasses = document.createElement("option");
		
	optionClasses.value = "Economy"; 
	optionClasses.innerHTML = "Economy"; 
	selectClasses.appendChild(optionClasses);
	var optionClasses = document.createElement("option");
	optionClasses.value = "Business"; 
	optionClasses.innerHTML = "Business"; 
	selectClasses.appendChild(optionClasses);
	
	
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(selectClasses);
	classes.appendChild(formGroupDiv);

	
	var travellerData = document.createElement("div");
	travellerData.setAttribute("class","col-xs-2");
	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group has-right-icon");
	
	var dropDownForm = document.createElement("div");
	dropDownForm.setAttribute("class","dropdown-menu input-dropdown");
	
	var travellerPopOverData = document.createElement("div");
	travellerPopOverData.setAttribute("class","row p10 margin-r-l-0");
	
	travellerPopOverData.appendChild(adult);
	travellerPopOverData.appendChild(children);
	travellerPopOverData.appendChild(classes);
	dropDownForm.appendChild(travellerPopOverData);
	
	var label = document.createElement("label");
	$(label).html("Traveller(s) / Class");
	
	var inputTravellers = document.createElement("input");
	inputTravellers.setAttribute("class","form-control font12 dropdown-toggle zindex1");
	inputTravellers.setAttribute('readonly','true');	
	inputTravellers.setAttribute("data-toggle","dropdown");
	
	inputTravellers.type = "text";
	inputTravellers.id = "multi_traveller_count_details";
	inputTravellers.value = "1 Traveller(s), Economy";
	//inputTravellers.addEventListener("focus",function() {$(this).trigger( "click" );});
	
	
	var rightIconAddon = document.createElement('span');
	$(rightIconAddon).attr('class','glyphicon glyphicon-triangle-bottom form-control-icon font10 color-default');
	$(rightIconAddon).html('');
	
	
	formGroupDiv.appendChild(label);
	formGroupDiv.appendChild(inputTravellers);
	formGroupDiv.appendChild(dropDownForm);
	formGroupDiv.appendChild(rightIconAddon);
	travellerData.appendChild(formGroupDiv);
	
	var searchBtn = document.createElement("div");
	searchBtn.setAttribute("class","col-xs-offset-4 col-xs-3");

	var formGroupDiv = document.createElement("div");
	formGroupDiv.setAttribute("class","form-group");
	var label = document.createElement("label");
	label.setAttribute("class","m-b-1");	
	$(label).html("&nbsp;");
	
	var anchor = document.createElement("a");
	anchor.setAttribute("class","btn btn-primary btn-block white-color");
	anchor.setAttribute('href','javascript:void(0)');
	//anchor.setAttribute('style','width: 150px;');
	anchor.addEventListener("click",function() { init();});
	$(anchor).html("Search"); 
	formGroupDiv.appendChild(label);
	searchBtn.appendChild(formGroupDiv);
	searchBtn.appendChild(anchor);
	
	//rowElementAddCity.appendChild(cityFromData);
	//rowElementAddCity.appendChild(cityToData);
	
	//rowElementAddCity.appendChild(dateData);
	rowElementAddCity.appendChild(addData);
	rowElementAddCity.appendChild(travellerData);
	rowElementAddCity.appendChild(searchBtn);
	//rowElement.appendChild(timeData);
	//rowElement.appendChild(cancelData);
	
	//ChildtableElement.appendChild(rowElementAddCity);
	
	//$('.dropdown-toggle').dropdown();
	
	
	//addLink.appendChild(addFont1);
	//addLink.appendChild(addFont);
	//addSpan.appendChild(addLink);
	addData.appendChild(addLink);
	
	//rowElementAddCity.appendChild(blankData);
	
	
	
	AddCitytableElement.appendChild(rowElementAddCity);
	
	/*$('.input-dropdown').click(function(e) {
		    e.stopPropagation();
	});*/
	
}

function buildFlightSearchBox(data){
	var reqURL = "MiceUserListofBookings.do?method=getAirDetails&requestId=" + data.id;
	
	var tableElement = document.getElementById('search-table');  
	
	$.getJSON(reqURL, function(data1) { 
		if(data1 != null){ 
			
			setMessageId(document.getElementById('request_message_id').value, data.id, true); 
			
			document.getElementById("requestId").value = data.id; 
			
			gv_SearchDataArr = JSON.stringify(data1); 
			
			gv_FlightType = data.Flight_Type; 
			
			var headerRowElement = document.createElement("tr");
			headerRowElement.align = "left";
			 
			var headerData = document.createElement("th");
			headerData.innerHTML = "FROM";
			
			var headerData1 = document.createElement("th");
			headerData1.innerHTML = "To";
			
			var headerData2 = document.createElement("th");
			headerData2.innerHTML = "Date";
			
			var headerData3 = document.createElement("th");
			headerData3.innerHTML = "Time";  
			
			headerRowElement.appendChild(headerData);
			headerRowElement.appendChild(headerData1);
			headerRowElement.appendChild(headerData2);
			headerRowElement.appendChild(headerData3);
			
			tableElement.appendChild(headerRowElement);
			
			for(var i = 0; i < data1.length; i++){
				
				var airDetailsObj = data1[i]; 

				var rowElement = document.createElement("tr");
				rowElement.id = airDetailsObj.depart_city_code + "-" + airDetailsObj.arrive_city_code;
				
				var cityFromData = document.createElement("td");
				cityFromData.width = "0%";
				var inputFromCity = document.createElement("input");
				inputFromCity.type = "text";
				inputFromCity.value = airDetailsObj.depart_city + ", " + airDetailsObj.depart_city_code;
				inputFromCity.id = "txt_city_" + i; 
				cityFromData.appendChild(inputFromCity);
				
				var cityToData = document.createElement("td");
				cityToData.width = "0%"; 
				var inputToCity = document.createElement("input");
				inputToCity.type = "text";
				inputToCity.value = airDetailsObj.arrive_city + ", " + airDetailsObj.arrive_city_code;
				inputToCity.id = "txt_to_city_" + i; 
				cityToData.appendChild(inputToCity);
				
				var dateData = document.createElement("td");
				dateData.width = "25%"; 
				var inputDate = document.createElement("input");
				inputDate.type = "text";
				inputDate.value = airDetailsObj.depart_date.split(" ")[0];
				inputDate.id = "txt_indate_" + i;
				inputDate.readonly = "readonly";
				dateData.appendChild(inputDate);
				
				var timeData = document.createElement("td");
				timeData.width = "15%"; 
				var inputTime = document.createElement("input");
				inputTime.type = "text";
				inputTime.value = airDetailsObj.depart_date.split(" ")[1];
				inputTime.id = "txt_intime_" + i; 
				timeData.appendChild(inputTime);
				 
				_segmentDeptTimes[rowElement.id.replace('-','_')] = inputTime.value;
				
				rowElement.appendChild(cityFromData);
				rowElement.appendChild(cityToData);
				rowElement.appendChild(dateData);
				rowElement.appendChild(timeData);

				tableElement.appendChild(rowElement);
				
			}  

			
			if(data.Flight_Type == "multi-city"){
				document.getElementById('opt_multicity').checked = true;
				document.getElementById('opt_oneway').checked = false;
				document.getElementById('opt_roundtrip').checked = false; 
			}else if(data.Flight_Type == "round-trip"){
				document.getElementById('opt_multicity').checked = false;
				document.getElementById('opt_oneway').checked = false;
				document.getElementById('opt_roundtrip').checked = true; 
			}
			

			if(data.Option_Data != ""){
				var entity = JSON.parse(data.Option_Data);
				entity['is_selected'] = "true";
				renderEntity(entity,null);
			}else{
				init();
			} 
		} 
	}); 
}

function onClickReturn(){

	
}
function getPrevRowToCity(index){

	if(index != '1'){
		
		var toVal = $('#city_to_txt_'+ (index-1)).val().split(" (");
		$('#city_from_txt_'+ (index)).val(toVal[0]);
		
	}
	
	
}
function isDataChanged( uiElement , oldVal ,elementType){
	//Added for respective multi city data change on the basis of trip data
	

	var uiElementVal = $(uiElement).val();
	oldVal = (oldVal && $.trim(oldVal))? $.trim(oldVal) : undefined ;
	
	switch(elementType){
		case "String" : 
			if(uiElementVal && $.trim(uiElementVal) != oldVal ){
				//$(dataChangedInputElement).val("true");
				var changedFormatedCity = uiElementVal ;
				var changedCountry = (changedFormatedCity && $.trim(changedFormatedCity).split(",").length>0 ) ? $.trim(changedFormatedCity.split(",")[2]) : null;
				
				if( changedCountry && $.trim(changedCountry).toUpperCase() !="INDIA" ) 
					city_changed = true ;
				
				var dataChangedInputElement = document.createElement("input");
				uiElement.appendChild(dataChangedInputElement);
				dataChangedInputElement.type = "text";
				dataChangedInputElement.id ="old_"+uiElement.id ;
				$(dataChangedInputElement).attr("style","display:none");
				$(dataChangedInputElement).val($.trim(oldVal)) ;
			}
			break;
					
		case "Date" :
			uiElementVal = getSQLDateFormat(uiElementVal) ;
			if(uiElementVal && $.trim(uiElementVal) != oldVal )
				$(dataChangedInputElement).val("true");
			
			break;
		case "Time" : 
			if(uiElementVal && $.trim(uiElementVal) != oldVal )
				$(dataChangedInputElement).val("true");
				
			break;
	}
}







