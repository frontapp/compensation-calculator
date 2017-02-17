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
	if (slider.data('type')=='log'){
		return Math.pow( mini, (100-pos)/(100) )*Math.pow( maxi, (pos)/(100) );
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

	var finalShareValue = (1-(dilution/100))*valuation/nbOfShares;
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

	$('#strike-price').text( formatNumbers( strikePrice, $('#strike-price') ) );
	$('#nb-of-shares').text( formatNumbers( nbOfShares, $('#nb-of-shares') ) );
}

function formatInt(str) {
	if (!str)
		return (0).toLocaleString();
	
	return (parseInt(str.replace(/\D/g,''),10) ||  0).toLocaleString();
}

function init() {
	var urlstring = window.location.search.substring(1);
	var parameters = urlstring.split("&");

	var values = {};
	for (i=0;i<parameters.length;i++) {
		var pair = parameters[i].split("=");
		values[pair[0]] = pair[1];
	}
	$('#salary').val(formatInt(values["salary"]));
	$('#options').val(formatInt(values["options"]));
};

init();
updateModel();

$('input').on('input', updateModel);
$('input[type="text"]').on('input', function() {
    var n = formatInt($(this).val());
    return $(this).val(n);
});
$('input[type="range"]').on('input', function () {
	var disp = $(this).attr('id');
	$('#'+disp+'-display').text( formatNumbers( logSlider($(this)), $(this) ) );
});