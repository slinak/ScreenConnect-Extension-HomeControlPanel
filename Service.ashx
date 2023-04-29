<%@ WebHandler Language="C#" Class="WebService" %>

using System;
using System.Web;
using System.Net;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Net.Http;
using ScreenConnect;

[ActivityTrace]
[DemandPermission(PermissionInfo.AdministerPermission)]
public class WebService : WebServiceBase
{
	string lifxAppToken = ExtensionContext.Current.GetSettingValue("LifxAppToken");
	const string lifxBaseUrl = "https://api.lifx.com/v1/lights/";
	const string forecastEndpointBaseUrl = "https://api.open-meteo.com/v1/forecast?";
	const string beavertonWeatherEndpoint = "latitude=45.49&longitude=-122.80&current_weather=true&hourly=temperature_2m,precipitation_probability,precipitation,rain,showers,snowfall,visibility&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,showers_sum,precipitation_probability_max&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FLos_Angeles";
	
	[DemandPermission(PermissionInfo.AdministerPermission)]
	public async Task<object> GetWeatherInfo()
	{
		using (var httpClient = new ScreenConnect.HttpClient())
		{
			var response = await httpClient.GetAndHandleResponseAsync<IDictionary<string, object>>(forecastEndpointBaseUrl + beavertonWeatherEndpoint);
			
			return response;
		}
	}
	
	[DemandPermission(PermissionInfo.AdministerPermission)]
	public async Task<object> GetLifxLights()
	{
		using (var httpClient = new ScreenConnect.HttpClient())
		{
			httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + lifxAppToken);
			var response = await httpClient.GetAndHandleResponseAsync<object>(lifxBaseUrl + "all");
			
			return response;
		}
	}
	
	public async Task<object> ToggleLifxLightPower(string LightID)
	{
		//https://api.lifx.com/v1/lights/{selector}/toggle
		using (var httpClient = new ScreenConnect.HttpClient())
		{
			httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + lifxAppToken);
			var response = await httpClient.PostAsJsonAndHandleResponseAsync<object>(lifxBaseUrl + "id:" + LightID + "/toggle");
			
			return response;
		}
		
	}
	
	//public async Task<object> MakeLifxRequest(string urlPostfix)
}