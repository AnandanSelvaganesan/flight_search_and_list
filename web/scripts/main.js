/** 
 * Main JS -------- Anandan Selvaganesan
 */

/* ========================================================================
 * Trigger a POST form with target  using javascript ,it will Open a window 
 * with target( _blank,_self , _parent ,_top ),create hidden form with request parameter
 * value and submit the form to given request URL.
 *                                 							 --------Basu D.
 * ======================================================================== */

window_open = function(verb, url, data, target) {
	var form = document.createElement("form");
	form.action = url;
	form.method = verb;
	form.target = target || "_self";
	
	if(data) {
		for(var key in data) {
			var input = document.createElement("input");
			input.name = key;
			input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
			form.appendChild(input);
		}
	}
	form.style.display = 'none';
	document.body.appendChild(form);
	form.submit();	
};

/* ========================================================================
	 * Trigger a form POST using javascript ,it will create hidden  feilds to the form
	 * with request paramater value and submit the form to given request URL. 
	 * parameter :
	 * form : submiting form
	 * data : a JSON Object with any kind of data ie.request parameters.
	 *                     							             --------Basu D.
	 * ======================================================================== */
	
set_hidden_parameter = function (form, data) {
	if(data && form) {
		for(var key in data) {
			var input = document.createElement("input");
			input.name = key;
			input.style.display = "none";
			input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
			form.appendChild(input);
		}
	}
};

/* ========================================================================
 * Use this function to check the Internet explorer version.
 * IE version msg div created in mainLayout.jsp 
 *                     							             --------Gaurav.
 * ======================================================================== */

function getInternetExplorerVersion() {
	var rv = 50; // Return value assumes failure.
	
	if(navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        
		if(re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}
	return rv;
}

function getScreenFieldIntro(screen_id, screen_type, corpGroupId) {
	if($(document).find('*[data-intro]').length == 0) {
		var reqURL = "rest/screenConfig/getScreenFieldsIntro";
		$.getJSON(reqURL,{"screen_id":screen_id, "screen_type":screen_type, "corp_group_id":corpGroupId, "timeStamp" : new Date().getTime()},
			function(result) {
				if(result != null) {
					var screenData = result.resData;
					_createScreenIntroData(screenData);
				}
		});
	}else {
		introJs().start();
	}
}

function _createScreenIntroData(screenData){
	for(var i = 0 ; i< screenData.length ; i++){
		if($("#" + screenData[i]['element_id']).length > 0){
			$("#" + screenData[i]['element_id']).attr("data-intro", screenData[i]['intro_text']);
			$("#" + screenData[i]['element_id']).attr("data-position", 'top');
		}
	}

	introJs().start();
}

function alertandRedirect(baseElement, titleMes, message, url) {
	if(titleMes == "")
		titleMes = "Message";
	
	var div = document.createElement("div");
	$(div).attr('style','font-size: 14px;text-align: justify;');
	$(div).attr('id','message-Element');
	$(baseElement).append(div);					
	
	if(messageFlag == 0)
		$(div).html(message);
	$(baseElement).dialog({ 
		modal: true,
		width: 600,
		title: titleMes,					
		closeOnEscape: false,
		position: [($(window).width() / 2) - (600 / 2), 150],
		open: function(event, ui) { $(".ui-dialog-titlebar-close").show(); },
		buttons: {
			Ok: function() {
				messageFlag=0;
				$( this ).dialog( "close" );
				$(baseElement).empty();
				
				if(url)
					window_open('POST', url);
			}
		},
		close: function(event,ui){
			$( this ).dialog( "close" );
			$(baseElement).empty();
			messageFlag=0;
			
			if(url)
				window_open('POST', url);
		}
	});
}

function genericConfirmDailog(baseElement, titleMes, message, jsonString, stepId, statusFlag, threeApprovals){
	if(titleMes == "")
		titleMes = "Message";
	
	var div = document.createElement("div");
	$(div).attr('style','font-size: 14px;text-align: justify;');
	$(div).attr('id','message-Element');
	$(baseElement).append(div);					
	$(div).html(message);
	
	$(baseElement).dialog({ 
		modal: true,
		width: 600,
		title: titleMes,					
		closeOnEscape: false,
		position: [($(window).width() / 2) - (600 / 2), 150],
		open: function(event, ui) { $(".ui-dialog-titlebar-close").show(); },
		buttons: {
			Yes: function() {
				validateRule(jsonString,stepId , statusFlag,threeApprovals);
				$( this ).dialog( "close" );
				$(baseElement).empty();
			},
			No: function(){
				$( this ).dialog( "close" );
				$(baseElement).empty();
				return false;
			}
		},
		close: function(event,ui){
			$( this ).dialog( "close" );
			$(baseElement).empty();
			return false;
		}
	});

	return false;
}

function changePassword(elementId) {
	$('#'+elementId).dialog({
		width: 600,
		modal: true,
		position: [($(window).width() / 2) - (600 / 2), 150],
		closeOnEscape: false,
	    open: function(event, ui) { $(".ui-dialog-titlebar-close test", ui.dialog | ui).show(); },
	    buttons: [{
	            	  text: "Reset",
	                  "class": 'btn btn-default btn-sm',
	                  click: function() {
	                	  document.forms.namedItem('changePassForm').reset();
	                  }
	              },
	              {
	                  text: "Submit",
	                  "class": 'btn btn-success btn-sm',
	                  click: function() {
	                	  if(validateChangePassword() == true){
	                		  /*document.forms.namedItem('changePassForm').action="AdminLogin.do?method=login";
	      						document.forms.namedItem('changePassForm').method="post";
	      						document.forms.namedItem('changePassForm').submit();*/
	                		  var password = document.getElementById('connewpassword').value;
	                		  var reqURL = "UserChangePassword.do?method=changePassword";
	                		  $(this).dialog( "close");
	                		  $.post(reqURL, {"password": password, "timeStamp" : new Date().getTime()}, function (result) {
	                			  if(result != null){   
	                				  //showOptionStatus(result, 0);
	                				  
	                				  var baseElement = document.getElementById("div-message-dialog");
	                				  var titleMes = "Change password";
	                				  var message = result['Message'];
	                				  customAlert(baseElement,titleMes,message);
	                			  }
	                		  }, 'json');
	                		  //window_open('POST', reqURL, {"password": password});
	                	  } 
	                  }
	              }]
	    	
				/*buttons: {
					Rest: function() {
						document.forms.namedItem('changePassForm').reset();
					},
					Submit: function() {
						if(validate()==true){
						    document.forms.namedItem('changePassForm').action="AdminLogin.do?method=login";
							document.forms.namedItem('changePassForm').method="post";
							document.forms.namedItem('changePassForm').submit();
							$(this).dialog( "close");
						} 
					}
				}*/
	});	

}

/*function submitForm(){
	if(validate() == true) {
    	document.forms.namedItem('changePassForm').action="AdminLogin.do?method=login";
		document.forms.namedItem('changePassForm').method="post";
		document.forms.namedItem('changePassForm').submit();
	} 
}

function showRegistration(){
	document.forms['loginForm'].method="post";
	document.forms['loginForm'].action="Register.do"
	document.forms['loginForm'].submit();
}*/

function resetForm() {
	document.forms.namedItem('changePassForm').reset();
}

function validateChangePassword() {
	var frm = document.forms.namedItem('changePassForm');
	/*if(emptyCheck(frm.userId.value)){
		jAlert("Please provide valid Login ID!","Notification");
		frm.userId.focus();
		return false;
	}
	
	if(emptyCheck(frm.oldPassword.value)) {
    	jAlert("Please provide old password!","Notification");
    	frm.password.focus();
    	return false;
    }*/
	
	if(emptyCheck(frm.newPassword.value)) {
		jAlert("Please provide new password!","Notification");
		frm.newPassword.focus();
		return false;
	}
	
	var newPass = frm.newPassword.value.length;
	if(newPass < 8 ){
		jAlert("Error: Password must contain at least eight characters!","Notification");
		frm.newPassword.focus();
		return false;
	}
	
	var newPass = frm.newPassword.value;
    var oldPswd= "csr";//frm.oldPassword.value;
    var curPswd= "csr";//frm.currentPwd.value;
   
    if(oldPswd == curPswd){
    	
    }else{
    	jAlert("Old password is not correct","Notification");
	    frm.oldPassword.value="";
	    frm.oldPassword.focus();
	    return false;
    }
    
    var newpswd=frm.newPassword.value;
    if(oldPswd != newpswd){
   	 
    }else{
   	 	jAlert("New password can't be same as Old password","Notification");
   	 	frm.newPassword.value="";
   	 	frm.connewpassword.value="";
   	 	frm.newPassword.focus();
   	 	return false;
    }
//  code for Passwords cannot contain all or part of user name
    
    var userStr="0";//frm.userId.value;
    //jAlert(userStr);
    var passStr=frm.newPassword.value;
    /*jAlert(passStr);
    var contained = passStr.contains(userStr);*/
    var contained = (passStr.indexOf(userStr)>-1);
    if(contained == true) {
    	jAlert("Password cannot contain username ","Notification");
    	frm.newPassword.value="";
    	frm.connewpassword.value="";
    	frm.newPassword.focus();
    	return false;
    }
   //end 
   
    var invalid = " "; // Invalid character is a space
    if(frm.newPassword.value.indexOf(invalid) > -1) {
    	jAlert("Spaces are not allowed.","Notification");
    	frm.newPassword.value="";
    	frm.connewpassword.value="";
    	frm.newPassword.focus();
    	return false;
    }
    
    var repeats = /(.)\1.*\1.*\1.*\1/;
    // (?!.(.).\1.*\1)
    
    if(repeats.test(frm.newPassword.value)) {
    	jAlert("Repeated characters should not be more then 4 times","Notification");
    	frm.newPassword.value="";
    	frm.connewpassword.value="";
    	frm.newPassword.focus();
    	return false;
    }
    
    var num = /[0-9]/;
    if(!num.test(frm.newPassword.value)) {
    	jAlert("Error: password must contain at least one number (0-9)!","Notification");
    	frm.newPassword.value="";
    	frm.connewpassword.value="";
    	frm.newPassword.focus();
    	return false;
    }
    
    var low = /[a-z]/;
    if(!low.test(frm.newPassword.value)) {
    	jAlert("Error: password must contain at least one lowercase letter (a-z)!","Notification");
    	frm.newPassword.value="";
    	frm.connewpassword.value="";
    	frm.newPassword.focus();
    	return false;
    }
    
    var re= /[A-Z]/;
    if(!re.test(frm.newPassword.value)) {
    	jAlert("Error: password must contain at least one uppercase letter (A-Z)!","Notification");
    	frm.newPassword.value="";
    	frm.connewpassword.value="";
    	frm.newPassword.focus();
    	return false;
    }
    
    if(frm.newPassword.value.match(/['~!@#$%&*_+=]/) == null) {
    	jAlert('Your new password must have a special character i.e.(!@#$%&*)',"Notification");
    	frm.newPassword.value="";
    	frm.connewpassword.value="";
    	frm.newPassword.focus();
    	return false;
    }
    
    var confPass = frm.connewpassword.value;
    if(emptyCheck(frm.connewpassword.value)) {
    	jAlert("Please provide confirm password!","Notification");
    	frm.connewpassword.focus();
    	return false;
    }
    
    if(newPass == confPass) {
    }else {
    	jAlert("Password is not matching . Please provide the correct password!","Notification");
    	return false;
    }
	
    return true;
}

function isEnterKey(e) {
	var key=0;
	if(!e) {
		var e = window.event;
	}
	if(!e.which)
		key = e.keyCode; // This is used store the keycode(IE Only) 
	else
		key = e.which; // This is used store the keycode(Netscape Only)
	// check for Enter Key Press
	if(key == 13) {
		submitForm();
	}
}

var messageFlag = 0;
/**---------Coded by venu---------**/
function customAlert(baseElement, titleMes, message, elementId) {
	if(titleMes == "")
		titleMes = "Message";
	
	var div = document.createElement("div");
	$(div).attr('style','font-size: 14px;text-align: justify;');
	$(div).attr('id','message-Element');
	$(baseElement).append(div);					
	
	if(messageFlag == 0)
		$(div).html(message);
	$(baseElement).dialog({ 
		modal: true,
		width: 600,
		title: titleMes,					
		closeOnEscape: false,
		position: [($(window).width() / 2) - (600 / 2), 150],
		open: function(event, ui) { $(".ui-dialog-titlebar-close").show(); },
		buttons: [{
			text: "Ok",
			"class": 'btn btn-success btn-sm',
			click: function() {
				$(this).dialog("close");
				$(baseElement).empty();
				if(elementId)
					$('#'+elementId).focus();
			}
		}],
		close: function(event, ui){
			$( this ).dialog( "close" );
			$(baseElement).empty();
			messageFlag = 0;
			if(elementId)
				$('#'+elementId).focus();
		}
	});
}

/**---------Coded by Anandan Selvaganesan---------**/
function customInputValidation(baseElement, titleMes, message, elementId) {
	$('.tooltip').tooltip("destroy");
	$('#'+elementId).attr('data-title', message);
	
	var $element = $('#'+elementId);
    $element.tooltip("destroy") // Destroy any pre-existing tooltip so we can repopulate with new tooltip content
    .data("title",message)
    .addClass("error")
    .tooltip(); // Create a new tooltip based on the error messsage we just set in the title  
	$('#'+elementId).focus();
	
	if($element.hasClass("picker__input") || $element.hasClass("ui-timepicker-input") ||  $element.hasClass("ui-autocomplete-input") ){
		$element.tooltip().on("click", function () {
			$(this)
			.data("title", "")// Clear the title - there is no error associated anymore
			.removeClass("error")
			.tooltip("destroy")
	    }); 
	}else if($element.prop("tagName") == "SELECT"){
		$element.tooltip().on("change", function () {
			$(this)
			.data("title", "")// Clear the title - there is no error associated anymore
			.removeClass("error")
			.tooltip("destroy")
	    });
	}else {
		$element.tooltip().on("keydown", function () {
			$(this)
			.data("title", "")// Clear the title - there is no error associated anymore
			.removeClass("error")
			.tooltip("destroy")
		}); 
	}
}

function bindPusherData() {
	channel.bind('' + pusherDefaultKey,   pusherGlobalCallback);
	channel.bind('' + pusherRoleKey,   pusherUserCallback); 
	moveLeft("pusher-message-div");
}

function unbindPusherData() {
	channel.unbind('' + pusherDefaultKey, pusherGlobalCallback); 
	channel.unbind('' + pusherRoleKey, pusherUserCallback); 
}

var pusherGlobalCallback = function (data) { 
	if(data != null && data['message']) { 
		var pusherElement = document.getElementById('pusher-message');
		
		if(pusherElement ){
			document.getElementById('pusher-message-div').style.display = "";
			$(pusherElement).html(data['message']);
		}
	}
};

var pusherUserCallback = function (data) { 
	if(data != null && data['message']){ 
		var pusherElement = document.getElementById('pusher-message');
		if(pusherElement ){
			document.getElementById('pusher-message-div').style.display = "";
			$(pusherElement).html(data['message']);
		}
	}
};

function clearPusherNotificationDiv(){
	var divElement = document.getElementById('div-notification-list');
	if(divElement){
		var children = divElement.children;
		if(children && children.length > 0)
			divElement.innerHTML = "";
	}
}

function moveRight(elementId) {
	$("#" + elementId).animate({right: "500"}, 7000, function(){
		moveLeft(elementId);
	});
}

function moveLeft(elementId){
	$("#" + elementId).animate({right: "900"}, 7000, function(){
		moveRight(elementId);
	});
}

//bindPusherData();

//$("body").find(".container").css('opacity','0.9');

function b3FormValidate(formId, formSubmit) {
	$("#"+formId).validate({
		showErrors: function(errorMap, errorList) {
			// Clean up any tooltips for valid elements
			$.each(this.validElements(), function (index, element) {
				var $element = $(element);
				$element.data("title", "") // Clear the title - there is no error associated anymore
				.removeClass("error")
				.tooltip("destroy");
			});
			
			// Create new tooltips for invalid elements
			$.each(errorList, function (index, error) {
				$(".tooltip").tooltip("destroy");
				var $element = $(error.element);
				$element.tooltip("destroy") // Destroy any pre-existing tooltip so we can repopulate with new tooltip content
				.data("title", error.message)
				.addClass("error")
				.tooltip(); // Create a new tooltip based on the error messsage we just set in the title
			});
		},
		submitHandler: function(form) {
			//alert("This is a valid form!");
			if(formSubmit)
				formSubmit+"()";
		}
	});
	$("#"+formId).submit();
}

function getDateFormat(formattedDate){
	formattedDate = $.trim(formattedDate);		
	var words = formattedDate.split("-");		
	var day = words[2];
	var month = words[1];		
	var year = words[0];			
	var dateString = month + "/" + day + "/" + year; 		
	
	if(day == undefined && month == undefined)
		return formattedDate;
	else
		return dateString;
	
}