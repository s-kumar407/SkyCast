"use client";
import { useState, useEffect, useRef } from "react";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import Link from "next/link";
import {
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Autocomplete from "@/components/ui/autocomplete";
import { cityTableDataApiUrl} from "@/constant/constants";
export default function Component() {
  const [citiesData, setCitiesData] = useState([]);
  const [citiesWholeData, setCitiesWholeData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  let [dropDownValue, setDropDownValue] = useState("");
  let [isDropDownValueSelected, setIsDropDownValueSelected] = useState(false);
  useEffect(() => {
    fetchCitiesData();
    // Set up the intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { rootMargin: "0px", threshold: 1.0 }
    );
    observerRef.current = observer;
    return () => {
      observer.disconnect();
    };
  }, [page]);

  useEffect(() => {
    // Attach the observer to the last table row
    if (citiesData.length > 0 && page > 1) {
      observerRef.current.observe(
        document.querySelector(`#table-row-${citiesData.length - 1}`)
      );
    }
  }, [citiesData, page]);

  useEffect(() => {
    sortedArray(dropDownValue);
  }, [isDropDownValueSelected, dropDownValue]);

  const fetchCitiesData = async () => {
    setLoading(true);
    const response = await fetch(
      `${cityTableDataApiUrl}/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&offset=${
        (page - 1) * 20
      }`,
      {
        cache: "no-cache",
      }
    );
    const data = await response.json();

    setCitiesData((prevData) => [...prevData, ...data.results]);
    setCitiesWholeData((prevData) => [...prevData, ...data.results]);
    setLoading(false);
  };

  const goToCity = (coordinates, countryName) => {
    const cord = {
      latitude: coordinates.lat,
      longitude: coordinates.lon,
      countryName: countryName,
    };
    localStorage.setItem("coordinates", JSON.stringify(cord));
  };

  const handleSuggestionSelected = (suggestion) => {
    console.log("Selected suggestion:", suggestion);
  };

  async function searchCity(cityName) {
    let city = await fetch(
      `${cityTableDataApiUrl}/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?select=*&where=name%20like%20%22${cityName}%22%20`,
      {
        cache: "no-cache",
      }
    );
    city = await city.json();
    city = city.results;
    if (city.length === 0) {
      alert("nothing found!!");

      setCitiesData(citiesWholeData);
    } else {
      setCitiesData(city);
      setPage(1);
    }
  }
  function selectDropDownValue(value) {
    setDropDownValue(value);
    setIsDropDownValueSelected(true);
  }

  function sortedArray(value) {
    if (value === "Population") {
      let sortedCitiesData = [...citiesData].sort(
        (a, b) => a.population - b.population
      );
      setCitiesData(sortedCitiesData);
    }
    if (value === "CityName") {
      let sortedCitiesData = [...citiesData].sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      setCitiesData(sortedCitiesData);
    }
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center border-b px-4 md:px-6 bg-slate-900 text-white">
        <Link className="flex items-center" href="#">
          <SunIcon className="h-6 w-6" />
          <span className="ml-2 font-bold">Weather</span>
        </Link>
        <nav className="ml-auto flex items-center space-x-4">
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
      <Card className="m-5 ">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl md:text-xl">Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <Label className="shrink-0" htmlFor="search">
                Search City:
              </Label>
              <Autocomplete
                cities={citiesData}
                onSuggestionSelected={handleSuggestionSelected}
                searchCity={searchCity}
              />
              </div>
              <div className="flex items-center space-x-4">
                <Label className="shrink-0" htmlFor="search">
                  Sort By
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-[150px]" variant="outline">
                      {isDropDownValueSelected ? dropDownValue : "Sort By"}
                      <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup value="featured">
                      <DropdownMenuRadioItem
                        onClick={() => selectDropDownValue("Population")}
                      >
                        Population
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem
                        onClick={() => selectDropDownValue("CityName")}
                      >
                        CityName
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          
        </CardContent>
      </Card>
      <Card className=" m-5 ">
        <CardHeader className="flex flex-col gap-1.5">
          <CardTitle>City Data</CardTitle>
          <CardDescription>Table of city data</CardDescription>
          <CardDescription className="text-red-400">Please click on city name if you want to see weather forecast of that specific city!!!</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">City Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Population</TableHead>
                <TableHead>Country ID</TableHead>
                <TableHead>Timezone</TableHead>
                <TableHead>Coordinates</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {citiesData.map((row, index) => (
                <TableRow key={row.geoname_id} id={`table-row-${index}`}>
                  <TableCell className="font-medium underline">
                    <Link
                      href="/city"
                      rel="noopener noreferrer"
                      target="_blank"
                      onClick={() => goToCity(row.coordinates, row.cou_name_en)}
                    >
                      {row.name}
                    </Link>
                  </TableCell>
                  <TableCell>{row.cou_name_en}</TableCell>
                  <TableCell>{row.population}</TableCell>
                  <TableCell>{row.country_code}</TableCell>
                  <TableCell>{row.timezone}</TableCell>
                  <TableCell>
                  {" "+row.coordinates.lat+" lat"},   {row.coordinates.lon+" lon "}
                  </TableCell>
                </TableRow>
              ))}
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
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
function ChevronDownIcon(props) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
