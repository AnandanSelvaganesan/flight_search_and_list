function renderCurrencyList(currencyList, baseCurrency){
	
	var table = document.createElement('table');
	table.setAttribute('width','100%');
	if(currencyList != null){
		
	
		for(var i=0;i< currencyList.length;i=i+2){
			
			var tr = renderCurrencyColLeft(currencyList[i], baseCurrency);
			
			if(i+1 < currencyList.length){
				tr = renderCurrencyColRight(currencyList[i+1],tr,baseCurrency);
			}
			
			table.appendChild(tr);
		}
		
	}
	return table;
}

function renderCurrencyColLeft(currency , baseCurrency){

	var tr = document.createElement('tr');
	var td1 = document.createElement('td');
	td1.setAttribute('class','currency_td_left');
	
	if(baseCurrency.toUpperCase() === currency['code'].toUpperCase()){
		$(td1).addClass('selected_currency');
		var selected_currency = document.getElementById("selected_currency_lbl");
		selected_currency.setAttribute('data-current-currency-code', currency['code']);
		selected_currency.setAttribute('data-current-currency-symbol',currency['symbol']);
		selected_currency.setAttribute('data-current-currency-rate',currency['conv_rate']);
		selected_currency.textContent="";
		selected_currency.appendChild(document.createTextNode(currency['code']));
	}
	var span1 = document.createElement('span');
	span1.setAttribute('class','cur_span_left');
	span1.appendChild(document.createTextNode(currency['currency']));
	var span2 = document.createElement('span');
	span2.setAttribute('class','cur_span_right');
	span2.appendChild(document.createTextNode(currency['code']));
	td1.appendChild(span1);
	td1.appendChild(span2);
	
	if(td1.addEventListener)
		td1.addEventListener('click',function() { return showConvRate(td1,currency);});
	else 
		td1.attachEvent('click',function() { return showConvRate(td1,currency);});
	
	tr.appendChild(td1);
	
	return tr;
	
}

function renderCurrencyColRight(currency,tr,baseCurrency){
	
	var td = document.createElement('td');
	td.setAttribute('class','currency_td_right');
	if(baseCurrency.toUpperCase() === currency['code'].toUpperCase()){
		$(td).addClass('selected_currency');
		var selected_currency = document.getElementById("selected_currency_lbl");
		selected_currency.setAttribute('data-current-currency-code', currency['code']);
		selected_currency.setAttribute('data-current-currency-symbol',currency['symbol']);
		selected_currency.setAttribute('data-current-currency-rate',currency['conv_rate']);
		selected_currency.textContent="";
		selected_currency.appendChild(document.createTextNode(currency['code']));
		
	}
	var span1 = document.createElement('span');
	span1.setAttribute('class','cur_span_left');
	span1.appendChild(document.createTextNode(currency['currency']));
	var span2 = document.createElement('span');
	span2.setAttribute('class','cur_span_right');
	span2.appendChild(document.createTextNode(currency['code']));
	td.appendChild(span1);
	td.appendChild(span2);
	
	if(td.addEventListener)
		td.addEventListener('click',function() { return showConvRate(td,currency);});
	else 
		td.attachEvent('click',function() { return showConvRate(td,currency);});
	if(currency['code'] == 'INR'){
		$(td).addClass("inrcurclass")
	}
	tr.appendChild(td);
	
	return tr;
}


/**
 * Converts the price based on convertion rate and returns converted 
 * price with currency symbol
 * @param price,convertionrate, currencycode
 */
function formatCurrency(price,convRate,toCurrencyCode){
	
	var convertedCurrency = price;
	if(convRate)
		convertedCurrency = price/convRate;
	
	convertedCurrency = parseFloat(convertedCurrency).toFixed(2);
	//var currencyNum = new Number(convertedCurrency);
	//currencyNum = currencyNum.toLocaleString("en-IN", {style: "currency", currency: currentCurrencyCode});
	var currencyNum = "INR " + convertedCurrency;
	if(toCurrencyCode)
		currencyNum = toCurrencyCode+" "+convertedCurrency;
	return currencyNum;
}

var _selected_currency_rate = "";
function formatCurrencySbt(price,convRate,toCurrencyCode){
	
	if(_selected_currency_rate){
	 var convertedPriceInUsd = (price*_selected_currency_rate);
	var convertedCurrency = convertedPriceInUsd/convRate;
	convertedCurrency = convertedCurrency.toFixed(2);
	}
	else{
		var convertedCurrency = price/convRate;
	convertedCurrency = convertedCurrency.toFixed(2);
	}
	//var currencyNum = new Number(convertedCurrency);
	//currencyNum = currencyNum.toLocaleString("en-IN", {style: "currency", currency: currentCurrencyCode});
	var currencyNum = toCurrencyCode+" "+convertedCurrency;
	return currencyNum;
}

/**
 * compare two strings and returns true or false
 * @param str1,str2
 */
function compareStrings(str1,str2){
	if(str1 == str2){
		return true;
	}
	else{
		return false;
	}
	
}

/**
 * Takes the price in currencyCode+price format and returns only price
 * @param price
 */
function getPriceData(price){
	var priceArray = price.split(" ");
	var priceData = priceArray[1];
	priceData = priceData.replace(/,/g, "");
	return priceData;
}

/**
 * Takes the price in currencyCode+price format and returns only currencyCode
 * @param price
 */
function getCurrencyCode(price){
	var priceArray = price.split(" ");
	var currencyCode = priceArray[0];
	return currencyCode;
}


