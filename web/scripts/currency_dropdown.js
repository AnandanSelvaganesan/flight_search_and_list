$(document).ready(function(){

$("#div_currency").click(function(event){

	if($("#currency_container, .overlay").css('display') == 'none')
	{
		$(".overlay").fadeIn('slow');
		$("#currency_container").fadeIn('slow');
		$("#currency_container").css('display','block');
		event.stopPropagation();
	} else {
		$("#currency_container").fadeOut('slow');
		$(".overlay").fadeOut('slow');
		event.stopPropagation();
	}

}); 

$(document).not('#div_currency, #currency_container').click(function(event) {
	
	if ($("#currency_container").is(":visible"))
	{
		$("#currency_container").fadeOut('slow');
		
		$(".overlay").fadeOut('slow');
		
	}
});

});
