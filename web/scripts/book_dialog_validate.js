
var _VALIDATE_MESSAGE_MST = new Object();

_VALIDATE_MESSAGE_MST['card_type'] = "Please select credit card type. ";
_VALIDATE_MESSAGE_MST['cc_number'] = "Please input valiad card number .";
_VALIDATE_MESSAGE_MST['name_on_card'] = "Please enter name on card. ";
_VALIDATE_MESSAGE_MST['valid_fm_year'] = "Please select card Validity";
_VALIDATE_MESSAGE_MST['exp_month'] = "Please select valid month.";
_VALIDATE_MESSAGE_MST['valid_fr_month'] = "Please select valid month.";
_VALIDATE_MESSAGE_MST['cvv_number'] = "Please enter 3 digit number.";
_VALIDATE_MESSAGE_MST['issueBank_Code'] = "Please enter Bank Code.";
_VALIDATE_MESSAGE_MST['issueBank_CountryCode'] = "Please enter 2 letter Bank Country Code.";
_VALIDATE_MESSAGE_MST['first_name'] = "Please enter First Name .";
_VALIDATE_MESSAGE_MST['last_name'] = "Please enter Last Name .";
_VALIDATE_MESSAGE_MST['email_id'] = "Please enter valid email Id .";
_VALIDATE_MESSAGE_MST['cancellation_tc_accept'] = "Please agree for cancallation policy to book.";



function next(currentElement , nextElement){
	
	if(_validateTabForm(currentElement , nextElement)){
		
		//remove summary content if, once click on previous button 
		if(nextElement && nextElement == "generic-summary"){
			var mainContainer = document.getElementById("generic-main-container");
			if(document.getElementById("generic-summary")!== null){
				$("#generic-summary").html("");
			}
			
			var bookingSummary = _bookingSummary();
			mainContainer.appendChild(bookingSummary);
		}

		_onTabAClick(nextElement);
		//call book function to book selected hotel
		if(nextElement && nextElement == 'generic-status')
			bookHotel(nextElement);
		
	}else {
		
		return false;
	}
	
}

function previous(currentElement , nextElement ){
	
	_onTabAClick(currentElement);
	
}


function _onTabAClick(id){
	
	var currentElement = $("#"+id.split("-")[1]+"-a");
	
	var parent = $(currentElement).parent().parent();
	
	var children = $(parent).children();
	
	for (var i = 0; i < children.length; i++) {
		
		if(children[i].lastChild != null && children[i].lastChild == currentElement[0]){
			$(children[i]).addClass("active current-step");
			//$(children[i].firstChild).css('background' , '#428bca');
			if(children[i].previousSibling)
			$(children[i]).prevAll().addClass('active');
		}else {
			children[i].className = "";
		}
	}
	
	var children = document.getElementById('generic-main-container');
	var children = $(children).children();
	
	for (var i = 0; i < children.length; i++) {
		
		if(children[i].nodeName == "DIV"){
			
			if(children[i].id != id){
				children[i].style.display = "none";
			} else {
				children[i].style.display = "block";
			}
			
		}
	}
}
function _validateTabForm(currentElement , nextElement){
	
	
	
	if(!currentElement)
		return false;
	
	if(currentElement.id == "generic-cancellationPolicy" && $("cancellation_tc_accept")){
		
		var isChekced = $("#cancellation_tc_accept").is(':checked');
		if(isChekced)
			return true;
		else 
			return _showErrorMessage(document.getElementById("cancellation_tc_accept"));
	}
	
	var tableElemenet = currentElement.childNodes[0];
	
	if(tableElemenet && tableElemenet.nodeName == "TABLE"){
		
		var rows = tableElemenet.rows;
		
		for(var rowCnt = 0;rowCnt<rows.length ; rowCnt++){
			
			var tr = rows[rowCnt];
			var cells = tr.cells;
			
			for(var celCnt = 0;celCnt<cells.length ; celCnt++){
				
				var cell = cells[celCnt];
				if(cell.nodeName == "TD"){
					
					var childNodes = cell.childNodes ; 
					
					for(var childCnt = 0 ;childCnt < childNodes.length ; childCnt++ ){
						
						var childCell = childNodes[childCnt];
						if(!childCell.id == ""){ 
							if(!_validate(childCell))
								return false;
						}
						
					}
				}
				
			}
		}
		
		
	}
	return true;
}
var _ccType;
var _validFromYear;
var _expYear;

function _validate(childCell){
	
	var elenemtVal = $(childCell).val();
	
	if(childCell.name == "mandatory" ){
		
		if(childCell.id == "card_type")
			_ccType = elenemtVal;
		
		if( childCell.id == "email_id"){
			
			var emailStatus =   _validateEmailId(elenemtVal);
			if(!emailStatus)
				return _showErrorMessage(childCell);
			else 
				return true;
			
		}else if( childCell.id == "ccNumber"){
			
			var cardNum = $(childCell).val();
			var cardStatus =   checkCreditCard(cardNum , _ccType);
			if(!cardStatus)
				return _showErrorMessage(childCell);
			else 
				return true;
			
		}else if( childCell.id == "valid_fm_year"){
			_validFromYear = elenemtVal;
			
			
		
		}else if( childCell.id == "valid_fr_month"){
			var validMnthStatus = _checkCardValidity(elenemtVal ,_validFromYear, "FROM");
			if(!validMnthStatus)
				return _showErrorMessage(childCell);
			else 
				return true;
			
		}else if( childCell.id == "exp_year"){
			_expYear = elenemtVal;
		
		}else if( childCell.id == "exp_month"){
			var validMnthStatus = _checkCardValidity(elenemtVal ,_expYear, "TO");
			if(!validMnthStatus)
				return _showErrorMessage(childCell);
			else 
				return true;
		
		}else if( childCell.id == "cvvNumber"){
			
			if((elenemtVal == "" || elenemtVal!= "") && (elenemtVal.length >3 || elenemtVal.length <3) )
				return _showErrorMessage(childCell);
			else
				return true;
		}else if( childCell.id == "issueBank_Code"){
			
			if(elenemtVal == "" )
				return _showErrorMessage(childCell);
			else
				return true;
		}else if( childCell.id == "issueBank_CountryCode"){
			
			if((elenemtVal == "" || elenemtVal!= "") && (elenemtVal.length >2 || elenemtVal.length <2) )
				return _showErrorMessage(childCell);
			else
				return true;
		}else {
			if(elenemtVal == "")
				return _showErrorMessage(childCell);
			else 
				return true;
		}
		
	}
	
	return true;
	
}

	function _showErrorMessage(childCell){
	
	$('#generic-message-container').slideDown(500);
	$('#generic-message-container').html(_VALIDATE_MESSAGE_MST[childCell.id]);
	$('#generic-message-container').delay(2000).slideUp(1000);
	$(childCell).focus();
	childCell.className = "error";
	return false;
	
	}

function checkCreditCard (cardnumber, cardname) {
     
	
	
  // Array to hold the permitted card characteristics
  var cards = new Array();

  // Define the cards we support. You may add addtional card types as follows.
  
  //  Name:         As in the selection box of the form - must be same as user's
  //  Length:       List of possible valid lengths of the card number for the card
  //  prefixes:     List of possible prefixes for the card
  //  checkdigit:   Boolean to say whether there is a check digit
  
  cards [0] = {name: "VI", 
               length: "13,16", 
               prefixes: "4",
               checkdigit: true};
  cards [1] = {name: "CA", 
               length: "16", 
               prefixes: "51,52,53,54,55",
               checkdigit: true};
  cards [2] = {name: "DCI", 
               length: "14,16", 
               prefixes: "36,38,54,55",
               checkdigit: true};
  cards [3] = {name: "T", 
               length: "14", 
               prefixes: "300,301,302,303,304,305",
               checkdigit: true};
  cards [4] = {name: "AX", 
               length: "15", 
               prefixes: "34,37",
               checkdigit: true};
  cards [5] = {name: "Discover", 
               length: "16", 
               prefixes: "6011,622,64,65",
               checkdigit: true};
  cards [6] = {name: "JCB", 
               length: "16", 
               prefixes: "35",
               checkdigit: true};
  cards [7] = {name: "enRoute", 
               length: "15", 
               prefixes: "2014,2149",
               checkdigit: true};
  cards [8] = {name: "Solo", 
               length: "16,18,19", 
               prefixes: "6334,6767",
               checkdigit: true};
  cards [9] = {name: "Switch", 
               length: "16,18,19", 
               prefixes: "4903,4905,4911,4936,564182,633110,6333,6759",
               checkdigit: true};
  cards [10] = {name: "M", 
               length: "12,13,14,15,16,18,19", 
               prefixes: "5018,5020,5038,6304,6759,6761,6762,6763",
               checkdigit: true};
  cards [11] = {name: "VE", 
               length: "16", 
               prefixes: "4026,417500,4508,4844,4913,4917",
               checkdigit: true};
  cards [12] = {name: "LaserCard", 
               length: "16,17,18,19", 
               prefixes: "6304,6706,6771,6709",
               checkdigit: true};
               
  // Establish card type
  var cardType = -1;
  for (var i=0; i<cards.length; i++) {

    // See if it is this card (ignoring the case of the string)
    if (cardname.toLowerCase () == cards[i].name.toLowerCase()) {
      cardType = i;
      break;
    }
  }
  
  // If card type not found, report an error
  if (cardType == -1) {
     ccErrorNo = 0;
     return false; 
  }
   
  // Ensure that the user has provided a credit card number
  if (cardnumber.length == 0)  {
     ccErrorNo = 1;
     return false; 
  }
    
  // Now remove any spaces from the credit card number
  cardnumber = cardnumber.replace (/\s/g, "");
  
  // Check that the number is numeric
  var cardNo = cardnumber;
  var cardexp = /^[0-9]{13,19}$/;
  if (!cardexp.exec(cardNo))  {
     ccErrorNo = 2;
     return false; 
  }
       
  // Now check the modulus 10 check digit - if required
  if (cards[cardType].checkdigit) {
    var checksum = 0;                                  // running checksum total
    //var mychar = "";                                   // next char to process
    var j = 1;                                         // takes value of 1 or 2
  
    // Process each digit one by one starting at the right
    var calc;
    for (i = cardNo.length - 1; i >= 0; i--) {
    
      // Extract the next digit and multiply by 1 or 2 on alternative digits.
      calc = Number(cardNo.charAt(i)) * j;
    
      // If the result is in two digits add 1 to the checksum total
      if (calc > 9) {
        checksum = checksum + 1;
        calc = calc - 10;
      }
    
      // Add the units element to the checksum total
      checksum = checksum + calc;
    
      // Switch the value of j
      if (j ==1) {j = 2;} else {j = 1;}
    } 
  
    // All done - if checksum is divisible by 10, it is a valid modulus 10.
    // If not, report an error.
    if (checksum % 10 != 0)  {
     ccErrorNo = 3;
     return false; 
    }
  }  
  
  // Check it's not a spam number
  if (cardNo == '5490997771092064') { 
    ccErrorNo = 5;
    return false; 
  }

  // The following are the card-specific checks we undertake.
  var LengthValid = false;
  var PrefixValid = false; 
  //var undefined; 

  // We use these for holding the valid lengths and prefixes of a card type
  var prefix = new Array ();
  var lengths = new Array ();
    
  // Load an array with the valid prefixes for this card
  prefix = cards[cardType].prefixes.split(",");
      
  // Now see if any of them match what we have in the card number
  for (i=0; i<prefix.length; i++) {
    var exp = new RegExp ("^" + prefix[i]);
    if (exp.test (cardNo)) PrefixValid = true;
  }
      
  // If it isn't a valid prefix there's no point at looking at the length
  if (!PrefixValid) {
     ccErrorNo = 3;
     return false; 
  }
    
  // See if the length is valid for this card
  lengths = cards[cardType].length.split(",");
  for (j=0; j<lengths.length; j++) {
    if (cardNo.length == lengths[j]) LengthValid = true;
  }
  
  // See if all is OK by seeing if the length was valid. We only check the length if all else was 
  // hunky dory.
  if (!LengthValid) {
     ccErrorNo = 4;
     return false; 
  };   
  
  // The credit card is in the required format.
  return true;
}

function _checkCardValidity(value , selectedYear , flag ){
	
	var date = new Date();
	var year = date.getFullYear();
	
	var currentMonth = date.getMonth()+1;
	
	if(flag == "FROM"){
		if(year==selectedYear &&(value >currentMonth ))
			return false;
		else if (year>selectedYear || year==selectedYear)
			return true;
		else return false;
	}else {
		if(selectedYear > year)
			return true;
		else if(year == selectedYear && value >=currentMonth)
			return true;
		else 
		 return false;
	}
	
	
}


function _validateEmailId(email_id){
	
	 var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		 
	 if (reg.test(email_id)){
		 return true; 
	 } else{
		 return false;
	
	 }
	
}