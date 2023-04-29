<%@ control %>

<!-- 
-ToDo Panels
	-Weather
	-Notifications
	-Lights
	-Smart Devices
	-Calendar
 
 --> 
<dl class="ControlPanel"></dl>
<!--<iframe src="https://calendar.google.com/calendar/embed?src=scott%40linak.org&ctz=America%2FLos_Angeles" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>-->
<script>
	SC.event.addGlobalHandler(SC.event.PreRender, function () {
		SC.pagedata.notifyDirty();
	});

	SC.event.addGlobalHandler(SC.event.PageDataDirtied, function () {
		SC.service.GetWeatherInfo(weatherInfo => SC.service.GetLifxLights(lightInfo => {
			SC.pagedata.set({ weatherInfo, lightInfo });
		}));
	});
	
	SC.event.addGlobalHandler(SC.event.PageDataRefreshed, function () {
		var controlPanelInfo = SC.pagedata.get();
		console.log(controlPanelInfo);
		var today = new Date();
		const weekday = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
		const month = [ "January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
		
		
		SC.ui.setContents($('.ControlPanel'), [
			$h1({ className: 'CurrentDayBanner', innerHTML: 'Today is ' + weekday[today.getUTCDay()] + ", " + month[today.getMonth()] + " " + today.getDate() + " " + today.getFullYear() }),
			$div({ className: 'Dashboard' }, [
				$div({ className: 'MainColumn' }),
				$div({ className: 'SecondaryColumn' }),
			]),
		]);
		
		SC.dashboard.queryAndAddTiles($('.Dashboard .MainColumn'), 'MainColumn', controlPanelInfo);
		SC.dashboard.queryAndAddTiles($('.Dashboard .SecondaryColumn'), 'SecondaryColumn', controlPanelInfo);
	});
	

</script>