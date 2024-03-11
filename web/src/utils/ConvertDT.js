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

export { ConvertDT };
