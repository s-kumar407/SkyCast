"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { firstApiKey,currentDataApiKey,currentCityDataApiUrl,firstApiURL } from "@/constant/constants";
export default function Component() {
  let [cityData, setCityData] = useState({});
  let [cityCoord, setCityCoord] = useState({});
  let [cityCountry, setCityCountry] = useState("");
  let [cityCurrentWeatherData, setCityCurrentWeatherData] = useState({});
  let [cityTimeZone, setCityTimeZone] = useState("");
  let [tempInCel, setTempInCel] = useState();
  let [weatherDescription, setWeatherDescription] = useState("");
  let [cityForecastData, setCityForecastData] = useState([]);
  let [currentDayDate, setCurrentDayDate] = useState("");
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    setTemperature();
  }, [cityCurrentWeatherData]);


  async function fetchData() {
    await fetchCityData();
  }

  async function fetchCityData() {
    let coordinates = localStorage.getItem("coordinates");
    coordinates = JSON.parse(coordinates);
    let cityInfo = await fetch(
      `${firstApiURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${firstApiKey}`,
      {
        cache: "no-cache",
      }
    );
    let cityCurrentWeather = await fetch(
      `${currentCityDataApiUrl}/rest/services/timeline/${coordinates.latitude},${coordinates.longitude}?key=${currentDataApiKey}`
    );
    cityCurrentWeather = await cityCurrentWeather.json();
    let cityCurrentWeatherCondition = cityCurrentWeather.currentConditions;
    cityInfo = await cityInfo.json();
    let fiveDayForecast = cityCurrentWeather.days;
    let city = cityInfo.city;
    let currentDayDate = fiveDayForecast[0];
    setCurrentDayDate(currentDayDate.datetime);
    setCityForecastData(fiveDayForecast);
    setCityData(city);
    setCityCoord(city.coord);
    setCityCountry(coordinates.countryName);
    setCityCurrentWeatherData(cityCurrentWeatherCondition);
    setCityTimeZone(cityCurrentWeather.timezone);
    setWeatherDescription(cityCurrentWeather.description);
  }

  function setTemperature() {
    let temp = cityCurrentWeatherData.temp;
    let newNumber = (temp - 32) * (5 / 9);
    let newNum = newNumber.toFixed(2);
    const startIndex = 1;
    const endIndex = 5;
    const slicedArray = cityForecastData.slice(startIndex, endIndex);
    setTempInCel(newNum);
    setCityForecastData(slicedArray);

   }



  return (
    <>
        <header className="flex h-16 shrink-0 items-center border-b px-4 md:px-6 bg-slate-900 text-white">
          <Link className="flex items-center" href="#">
            <SunIcon className="h-6 w-6" />
            <span className="ml-2 font-bold">Weather</span>
          </Link>
          <nav className="ml-auto flex items-center space-x-4">
            <Link className="font-medium rounded-md hover:underline " href="/">
              Home
            </Link>
            <Link className="font-medium rounded-md hover:underline" href="#">
              Forecast
            </Link>
            <Link className="font-medium rounded-md hover:underlin" href="#">
              About
            </Link>
            <Link className="font-medium rounded-md hover:underlin" href="#">
              Contact
            </Link>
          </nav>
        </header>
        <main className="flex-grow overflow-y-auto">
          <div>
            <div className="flex">
              <Card className="w-[75%] m-4">
                <CardHeader>
                  <CardTitle>{cityData.name}</CardTitle>
                  <CardDescription>
                    {cityData.name + "," + cityCountry}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <MapIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      defaultValue={"Country Code: " + cityData.country}
                      placeholder="Country"
                      type="text"
                      readOnly={true}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <GlobeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      defaultValue={"Country: "+cityCountry}
                      placeholder="Country code"
                      type="text"
                      readOnly={true}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <UsersIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      defaultValue={"Population: "+cityData.population}
                      placeholder="Population"
                      type="text"
                      readOnly={true}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <ClockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      defaultValue={"Timezone: "+cityTimeZone}
                      placeholder="Timezone"
                      type="text"
                      readOnly={true}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <MapIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      defaultValue={"Coordinates: "+
                        cityCoord.lat + " lat , " + cityCoord.lon+" lon"
                      }
                      placeholder="Coordinates"
                      type="text"
                      readOnly={true}
                    />
                  </div>
                </CardContent>
              </Card>
              <div className="w-[25%]  m-4 rounded-lg">
                <Image
                  alt="img"
                  priority={true}
                  height={600}
                  width={600}
                  src="https://i.pinimg.com/originals/53/32/38/533238dd9a8ebfeaf7a8f4d4c2cabab6.gif"
                />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 py-12 sm:py-16">
            <div className="grid gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
              <Card className="w-full">
                <CardHeader className="flex flex-row items-start">
                  <div className="grid gap-1.5">
                    <CardTitle>Current Weather Conditions</CardTitle>
                    <CardDescription>
                      {"Date :" +
                        currentDayDate +
                        " Time: " +
                        cityCurrentWeatherData.datetime}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 pt-4">
                  <div className="flex flex-row items-center">
                  {cityCurrentWeatherData.icon === "cloudy" ? (
                        <CloudIcon className="w-8 h-8" />
                      ) : cityCurrentWeatherData.icon === "partly-cloudy-day" ? (
                        <CloudSunIcon className="w-8 h-8" />
                      ) : cityCurrentWeatherData.icon === "rain" ? (
                        <CloudRainIcon className="w-8 h-8" />
                      ) : (
                        <SunIcon className="w-8 h-8" />
                      )}
                    <span className="text-lg font-semibold">
                      {cityCurrentWeatherData.conditions}
                    </span>
                  </div>
                  <div className="flex flex-row items-center">
                    <ThermometerIcon className="w-6 h-6 mr-2" />
                    <span className="text-lg font-semibold">
                      {tempInCel + " °C"}
                    </span>
                  </div>
                  <div className="flex flex-row items-center">
                    <UmbrellaIcon className="w-6 h-6 mr-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {weatherDescription}
                    </span>
                  </div>
                  <div className="flex flex-row items-center">
                    <WindIcon className="w-6 h-6 mr-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {cityCurrentWeatherData.windspeed + " mph"}
                    </span>
                  </div>
                  <div className="flex flex-row items-center">
                    <ThermometerIcon className="w-6 h-6 mr-2" />
                    <span className="text-lg font-semibold">
                    {"Humidity: "+cityCurrentWeatherData.humidity+" g/m³"}
                    </span>
                  </div>
                </CardContent>
              </Card>
              {cityForecastData.map((row) => (
                <div
                  className="grid gap-4 sm:grid-cols-2 sm:gap-6"
                  key={row.datetimeEpoch}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>{row.datetime}</CardTitle>
                      <CardDescription>{row.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-row items-center gap-4">
                      {row.icon === "cloudy" ? (
                        <CloudIcon className="w-8 h-8" />
                      ) : row.icon === "partly-cloudy-day" ? (
                        <CloudSunIcon className="w-8 h-8" />
                      ) : row.icon === "rain" ? (
                        <CloudRainIcon className="w-8 h-8" />
                      ) : (
                        <SunIcon className="w-8 h-8" />
                      )}
                      {" "+row.conditions}
                    </CardContent>
                    <CardContent className="flex flex-row items-center gap-4"><ThermometerIcon className="h-8 w-8"/>{"Humidity: "+row.humidity+" g/m³"}</CardContent>
                    <CardContent className="flex flex-row items-center ">
                    <ThermometerIcon className="h-8 w-8"/>
                    {"Temp-min / Temp-max : "}
                    {((row.tempmin-32)*5/9).toFixed(2) + "° / " + (+(row.tempmax-32)*5/9).toFixed(2) + "° C"}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </main>
        <footer className="flex h-16 shrink-0 items-center border-t px-4 md:px-6 bg-slate-900 text-white">
          <p className="mx-auto text-sm text-gray-500 dark:text-gray-400">
            © 2023 Weather Inc. All rights reserved.
          </p>
        </footer>
    </>
  );
}

function ClockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function GlobeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function MapIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" x2="9" y1="3" y2="18" />
      <line x1="15" x2="15" y1="6" y2="21" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function SunIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function ChevronRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CloudIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}

function CloudSunIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="M20 12h2" />
      <path d="m19.07 4.93-1.41 1.41" />
      <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" />
      <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />
    </svg>
  );
}

function ThermometerIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </svg>
  );
}

function UmbrellaIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12a10.06 10.06 1 0 0-20 0Z" />
      <path d="M12 12v8a2 2 0 0 0 4 0" />
      <path d="M12 2v1" />
    </svg>
  );
}

function WindIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </svg>
  );
}

function CloudLightningIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" />
      <path d="m13 12-3 5h4l-3 5" />
    </svg>
  );
}

function CloudRainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M16 14v6" />
      <path d="M8 14v6" />
      <path d="M12 16v6" />
    </svg>
  );
}

function CloudSnowIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M8 15h.01" />
      <path d="M8 19h.01" />
      <path d="M12 17h.01" />
      <path d="M12 21h.01" />
      <path d="M16 15h.01" />
      <path d="M16 19h.01" />
    </svg>
  );
}

function RainbowIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 17a10 10 0 0 0-20 0" />
      <path d="M6 17a6 6 0 0 1 12 0" />
      <path d="M10 17a2 2 0 0 1 4 0" />
    </svg>
  );
}

function TornadoIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 4H3" />
      <path d="M18 8H6" />
      <path d="M19 12H9" />
      <path d="M16 16h-6" />
      <path d="M11 20H9" />
    </svg>
  );
}
function CloudFogIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M16 17H7" />
      <path d="M17 21H9" />
    </svg>
  );
}
