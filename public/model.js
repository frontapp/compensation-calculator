function round(number, decimals) {
	return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

function formatNumbers(x, tag){
	var numberType = tag.data('numbertype');
	var decimals = tag.data('decimals');

	function numberWithCommas(y) {
		var parts = y.toString().split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return parts.join(".");
	};

	function padZeros(z, dec) {
		var parts = z.split(".")
		
		if (parts.length === 1)
			parts.push("");

		var dec_length = parts[1].length;
		
		if (dec_length === dec)
			return z;

		for (var i = 0; i < (dec - dec_length); i++)
			parts[1] += "0";

		return parts.join(".");
	}

	switch(numberType) {
		case "dollar":
			if (!x) return '$0';
			else {
				var val = String(numberWithCommas(round(x, decimals)));

				return "$" + padZeros(val, decimals)
			}
			break;
		case "bigdollar":
			if (!x) return '$0';
			else {
				if(x>=1000000&x<1000000000){
					return "$" + String(numberWithCommas(round(x/1000000, 0))) + "m"
				}
				else if (x>=1000000000){
					return "$" + String(numberWithCommas(round(x/1000000000, 1))) + "bn"
				}
				else return "$" + String(numberWithCommas(round(x, decimals)))
			}
			break;				
		case "percent":
			if (!x) return '0%';
			else {
				return String(numberWithCommas(round(x, decimals))) + "%";
			}
			break;
		case "regular":
			if (!x) return '0';
			else {
				return numberWithCommas(round(x, decimals))
			}
			break;
		default:
			return x;

	}
};


function logSlider(slider){
	var mini = parseFloat(slider.data('min'));
	var maxi = parseFloat(slider.data('max'));
	var pos = slider.val();
	if (slider.data('type')==='log'){
		switch(pos){
			case "0":
				return 10000000;
				break;
			case "1":
				return 25000000;
				break;
			case "2":
				return 50000000;
				break;
			case "3":
				return 100000000;
				break;
			case "4":
				return 250000000;
				break;
			case "5":
				return 500000000;
				break;
			case "6":
				return 1000000000;
				break;
			case "7":
				return 2000000000;
				break;
			case "8":
				return 5000000000;
				break
			case "9":
				return 7500000000;
				break;
			case "10":
				return 10000000000;
				break;
			case "11":
				return 15000000000;
				break;
			case "12":
				return 20000000000;
				break;
			case "13":
				return 30000000000;
				break;
			case "14":
				return 40000000000;
				break;
			case "15":
				return 50000000000;
				break;
		}
	}
	else {
		return slider.val();
	}
}

function updateModel() {
	var options = parseFloat($('#options').val().replace(/,/g, ''));
	var valuation = logSlider($('#valuation'));
	var dilution = logSlider($('#dilution'));
	var salary = parseFloat($('#salary').val().replace(/,/g, ''));
	var strikePrice = parseFloat($('#strike-price').val().replace(/,/g, ''));
	strikePrice = isFinite(strikePrice) ? strikePrice : 0.0;
	var nbOfShares = parseFloat($('#nb-of-shares').val().replace(/,/g, ''));


	var finalShareValue = (1-(dilution/100))*valuation/nbOfShares;
	finalShareValue = isFinite(finalShareValue) ? finalShareValue : 0.0;
	var spread = finalShareValue-strikePrice

	$('#final-share-value').text(formatNumbers(finalShareValue, $('#final-share-value')));
	$('#spread').text(formatNumbers(spread, $('#spread')));

	var outputYearlyStock = options*Math.max(finalShareValue-strikePrice,0)/4;
	var outputYearlySalary = salary;
	var outputYearlyBoth = outputYearlyStock+outputYearlySalary;

	var outputOverallStock = options*Math.max(finalShareValue-strikePrice,0);
	var outputOverallSalary = salary*4;
	var outputOverallBoth = outputOverallStock+outputOverallSalary;


	$('#output-yearly-stock').text( formatNumbers( outputYearlyStock, $('#output-yearly-stock') ) );
	$('#output-yearly-salary').text( formatNumbers( outputYearlySalary, $('#output-yearly-salary') ) );
	$('#output-yearly-both').text( formatNumbers( outputYearlyBoth, $('#output-yearly-both') ) );
	$('#output-overall-stock').text( formatNumbers( outputOverallStock, $('#output-overall-stock') ) );
	$('#output-overall-salary').text( formatNumbers( outputOverallSalary, $('#output-overall-salary') ) );
	$('#output-overall-both').text( formatNumbers( outputOverallBoth, $('#output-overall-both') ) );


};

function reverse(s){
	return s.split("").reverse().join("");
}

function formatInt(str) {
	if (!str)
		return ("").toLocaleString("en-US");
	var leadingZeros = 0;
	while (leadingZeros < str.replace(/\D/g,'').length & parseInt(str.replace(/\D/g,''),10) === parseInt(str.replace(/\D/g,'').substr(1,1+leadingZeros),10)) {
		leadingZeros+= 1;
	};
	if ( leadingZeros > 0){
		return(reverse(reverse(str).replace(/\D/g,'')).match(/.{1,3}/g).join(","))
	}
	else return (parseInt(str.replace(/\D/g,''),10) ||  0).toLocaleString("en-US");
};

function init() {
	$('#salary').val(("").toLocaleString("en-US"));
	$('#options').val(("").toLocaleString("en-US"));
	$('#strike-price').val(("").toLocaleString("en-US"));
	$('#nb-of-shares').val(("").toLocaleString("en-US"));

};

init();
updateModel();

$('input').on('input', updateModel);
$('input[type="text"]').on('input', function() {
	if ($(this).attr('id') === 'strike-price'){
		if (!$(this).val()) {
			return updateModel();
		} else return;
	};
	var start = this.selectionStart,
		end = this.selectionEnd,
		original_length = $(this).val().length;
    var n = formatInt($(this).val());
    var pad = n.length === original_length ? 0 : 1;
    $(this).val(n);
    return this.setSelectionRange(start + pad, end + pad);
});
$('input[type="range"]').on('input', function () {
	var disp = $(this).attr('id');
	$('#'+disp+'-display').text( formatNumbers( logSlider($(this)), $(this) ) );
});