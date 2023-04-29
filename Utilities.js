namespace('HCP.util');

const weekdays = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
const weekdayShort = [ "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT" ];
const months = [ "January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
const WMOCodes = [
	{ 0 : "Clear Sky"},
	{ 1 : "Mainly clear, partly cloudy, and overcast"},
	{ 2 : "Mainly clear, partly cloudy, and overcast"},
	{ 3 : "Mainly clear, partly cloudy, and overcast"},
	
	{ 45 : "Fog and depositing rime fog"},
	{ 48 : "Fog and depositing rime fog"},
	
	{ 51 : "Drizzle: Light, moderate, and dense intensity"},
	{ 53 : "Drizzle: Light, moderate, and dense intensity"},
	{ 55 : "Drizzle: Light, moderate, and dense intensity"},
	
	{ 56 : "Freezing Drizzle: Light and dense intensity"},
	{ 57 : "Freezing Drizzle: Light and dense intensity"},
	
	{ 61 : "Rain: Slight, moderate and heavy intensity"}, 
	{ 63 : "Rain: Slight, moderate and heavy intensity"}, 
	{ 65 : "Rain: Slight, moderate and heavy intensity"},
	
	{ 66 : "Freezing Rain: Light and heavy intensity"},
	{ 67 : "Freezing Rain: Light and heavy intensity"},
	
	{ 71 : "Snow fall: Slight, moderate, and heavy intensity"},
	{ 73 : "Snow fall: Slight, moderate, and heavy intensity"},
	{ 75 : "Snow fall: Slight, moderate, and heavy intensity"},
	
	{ 77 : "Snow grains"},
	
	{ 80 : "Rain showers: Slight, moderate, and violent" },
	{ 81 : "Rain showers: Slight, moderate, and violent" },
	{ 82 : "Rain showers: Slight, moderate, and violent" },
	
	{ 85 : "Snow showers slight and heavy" },
	{ 86 : "Snow showers slight and heavy" },
	
	{ 95 : "Thunderstorm: Slight or moderate" },
	
	{ 96 : "Thunderstorm with slight and heavy hail" },
	{ 99 : "Thunderstorm with slight and heavy hail" },
];

HCP.util.getCode = function (code) {
	return WMOCodes[2];
}

HCP.util.formatDate = function (date) {
	var d = new Date(date);

	return weekdays[d.getUTCDay()] + " " + d.getUTCDate();
}

HCP.util.getDayOfWeek = function (day) {
	return weekdays[day];
}

HCP.util.getDayOfWeekShort = function (day) {
	return weekdayShort[day];
}

HCP.util.processPrecipitation = function (p) {
	var color;
	
	if (p > 0)
		color = "#638deb";
	else
		color = "white";
		
	return $td({ style: 'background-color:' + color,  innerHTML: p });
}

HCP.util.processTemperature = function (temp) {
	var color;
	
	if (temp >= 90)
		color = "red";
	else if (temp < 90 && temp >= 78)
		color = "orange";
	else if (temp < 78 && temp >= 60)
		color = "#52d7d7";
	else if (temp < 60 && temp >= 40)
		color = "#00adff";
	else if (temp < 40)
		color = "gray";
	else
		color = "black";
		
	return $td({ style: 'background-color:' + color,  innerHTML: temp + "°" });
}