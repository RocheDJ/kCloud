//---------------------------------------------------------------------
// Accepts "2024-08-06 11:00:00" <-- This is UTC timestamp
function ConvertDT(utcDate) {
	let date = new Date(utcDate);
	if (date.toString() === 'Invalid Date') {
		const formattedUtc = utcDate.split(' ').join('T') + 'Z';
		date = new Date(formattedUtc);
	}
	if (date.toString() === 'Invalid Date') return 'N/A';

	let dateString = date.toLocaleDateString('en-GB', {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
	let timeString = date.toLocaleTimeString('en-GB', {
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		hour12: false
	});
	let formattedDate = dateString + ' - ' + timeString;
	return formattedDate;
}

//---------------------------------------------------------------------
// Accepts "2024-08-06 11:00:00" <-- This is UTC timestamp
function GetMonth(iMonth) {
	switch (iMonth) {
		case 1:
			return 'Jan';
			break;
		case 2:
			return 'Feb';
			break;
		case 3:
			return 'Mar';
			break;
		case 4:
			return 'Apr';
			break;
		case 5:
			return 'May';
			break;
		case 6:
			return 'Jun';
			break;
		case 7:
			return 'Jul';
			break;
		case 8:
			return 'Aug';
			break;
		case 9:
			return 'Sep';
			break;
		case 10:
			return 'Oct';
			break;
		case 11:
			return 'Nov';
			break;
		case 12:
			return 'Dec';
			break;
		default:
			return 'Err';
			break;
	}
}

//https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
function roundToX(num, X) {    
    return +(Math.round(num + "e+"+X)  + "e-"+X);
}


//https://www.freecodecamp.org/news/format-dates-with-ordinal-number-suffixes-javascript/
const Number_to_Ordinal = (number) => {
	if (number > 3 && number < 21) return number +  "th";
	switch (number % 10) {
	  case 1:
		return number +"st";
	  case 2:
		return number +"nd";
	  case 3:
		return number +"rd";
	  default:
		return number +"th";
	}
  };


export { ConvertDT,GetMonth,roundToX,Number_to_Ordinal };