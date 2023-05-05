SC.event.addGlobalHandler(SC.event.PreRender, function (eventArgs) {
	if (SC.context.pageType == "AdministrationPage" && (SC.context.tabKeys.indexOf('HomeControlPanel') == SC.context.tabIndex))
		SC.util.includeStyleSheet(extensionContext.baseUrl + "HomeControlPanel.css");
});

SC.event.addGlobalHandler(SC.event.QueryCommandButtonState, function (eventArgs) {
	switch (eventArgs.commandName) {
		case 'ToggleLight':
			eventArgs.commandArgument.connected === false ? eventArgs.isEnabled = false : eventArgs.isEnabled = true;
		break;
	}
});

SC.event.addGlobalHandler(SC.event.QueryCommandButtons, function (eventArgs) {
	switch (eventArgs.area) {
		case 'LightListPanel':
			eventArgs.buttonDefinitions.push({ commandName: 'ToggleLight', text: 'ToggleLightPower' });
		break;
	}
});

SC.event.addGlobalHandler(SC.event.ExecuteCommand, function (eventArgs) {
	switch (eventArgs.commandName) {
		case 'ToggleLight':
			SC.service.ToggleLifxLightPower(eventArgs.commandArgument, function(response) {});
		break;
	}
});

SC.event.addGlobalHandler(SC.event.QueryPanels, function (eventArgs) {
	switch (eventArgs.area) {
		case 'MainColumn':
			const weatherPanelDefinitions = [
				['Temperature', {
					formattingFunc: HCP.util.processTemperature,
					fields: [ "min_temperatures", "max_temperatures" ],
					fieldFriendlyNames: ["Min", "Max"],
					dates: eventArgs.tileContext.weatherInfo.daily.time,
					min_temperatures: eventArgs.tileContext.weatherInfo.daily.temperature_2m_min,
					max_temperatures: eventArgs.tileContext.weatherInfo.daily.temperature_2m_max,
				}],
				['Precipitation', {
					formattingFunc: HCP.util.processPrecipitation,
					fields: [ "precipitation_probability_max", "precipitation_sum" ],
					fieldFriendlyNames: ["Probability", "Total"],
					dates: eventArgs.tileContext.weatherInfo.daily.time,
					precipitation_probability_max: eventArgs.tileContext.weatherInfo.daily.precipitation_probability_max,
					precipitation_sum: eventArgs.tileContext.weatherInfo.daily.precipitation_sum,
				}]
			];
			
			eventArgs.tileDefinitions.push({
				significance: 2,
				title: SC.util.formatString(SC.res['AdministrationPanel.ForecastTabTitleFormat'], eventArgs.tileContext.weatherInfo.current_weather.temperature),
				fullSize: true,
				titlePanelExtra: $a({ target: '_blank', href: 'https://www.wunderground.com/forecast/us/or/beaverton/KORBEAVE473', text: 'Open External ' }),
				content: 
					SC.ui.createTabs(
						'ForecastTab', 
						weatherPanelDefinitions.map(definition => ({
							name: definition[0],
							link: $div({ className: 'Header', _dataItem: definition[0] }, [
								$span({ innerHTML: definition[0] }),
							]),
							content: 
								[
									$table({ className: 'DailyForecastTable'}, [
										$thead({}, [
											$tr({}, [
												$th({ style: 'width:33%', innerHTML: 'Date' }),
												definition[1].fieldFriendlyNames.map(field => {
													return $th({ style: 'width:33%', innerHTML: field })
												})
											]),
										]),
										forecastTableBuilderProc(definition[1])
									]),
								],
							})
						)
					),/*
				initializeProc: function (statusTab) {
					const updateStatusTileProc = function (statusCheckName, result, data, errorMessage) {
						const statusTestPanel = SC.ui.findDescendent(statusTab, it => it.className && it.className.includes('StatusTestPanel') && it._dataItem === statusCheckName);
						const headerPanel = SC.ui.findDescendent(statusTab, it => it.className && it.className.includes('Header') && it._dataItem === statusCheckName);
		
						SC.ui.findDescendent(statusTestPanel, it => {
							if (it._dataItem && data)
								SC.ui.setContents(it, it._dataItem(data));
						});
					};
		
					weatherPanelDefinitions.forEach(function (definition) {
						updateStatusTileProc(definition[0], SC.types.TestResult.Incomplete);
						
					});
				},*/
			});
			break;
		case 'SecondaryColumn':
			const lightPanelDefinitions = [{
				tileName: 'Lights',
				lightList: eventArgs.tileContext.lightInfo,
			}];
			
			lightPanelDefinitions.map(definition => {
				eventArgs.tileDefinitions.push({
					significance: 2,
					title: 'Lights ',
					content: [
						definition.lightList.map(light => {
							return lightTableBuilderProc(light);
						})
					],
				});
			});
			break;
	}
});

function lightTableBuilderProc (light)
{
	var container = $div({});
	
	SC.ui.addContent(container, [
		$span({ innerHTML: light.label }), 
		$input({ type: 'button', value: 'Toggle Power', _commandName: 'ToggleLight',  _commandArgument: light.id })
	]);
	
	SC.command.updateCommandButtonsState(container);
	
	return container;
}

function forecastTableBuilderProc (tileDefinition)
{
	var tbody = $tbody({}, []);
	for (var i = 0; i < 7; i++) {
		var trow = $tr({});
		SC.ui.addContent(trow, $td({ style: 'background-color:#E6E6E6', innerHTML: HCP.util.formatDate(tileDefinition.dates[i]) }));
		
		tileDefinition.fields.map(field => {
			SC.ui.addContent(trow, tileDefinition.formattingFunc(tileDefinition[field][i]));
		});
		
		SC.ui.addContent(tbody, trow);
	}
	
	return tbody;
}

