import React, { useState, useEffect} from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent
} from "@material-ui/core";
import './App.css';
import axios from "./axios";
import requests from './requests';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from "./util";
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide"); 
  const [countryInfo, setCountryInfo] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746, lng: -40.4796
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [caseType, setCaseType] = useState("cases");

  const onChangeHandle = (e) => {  
    setCountry(e.target.value);       
  }    
  
  useEffect(() => {
    async function getCases() {
      const url = country === "worldwide" ? "/all" : `/countries/${country}`;       
      const request = await axios.get(url);
      setCountryInfo(request.data);        
    }
    getCases();

  },[country])

  useEffect(() => {
    async function fetchCountries() {
      const request = await axios.get(requests.fetchCountries);      
      /*const countires = request.data.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso2
      }))
      */
      setCountries(request.data);
      setMapCountries(request.data);
      return request;
    }
    fetchCountries();
  }, []);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID - 19</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onChangeHandle}
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {countries?.map((country) => (
                <MenuItem value={country.countryInfo.iso2}>
                  {country.country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            isRed
            active={caseType === "cases"}
            onClick={(e) => setCaseType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo?.todayCases)}
            total={prettyPrintStat(countryInfo?.cases)}
          ></InfoBox>
          <InfoBox
            active={caseType === "cases"}
            onClick={(e) => setCaseType("recovered")}
            title="recovered"
            cases={prettyPrintStat(countryInfo?.todayRecovered)}
            total={prettyPrintStat(countryInfo?.recovered)}
          ></InfoBox>
          <InfoBox
            isRed
            active={caseType === "cases"}
            onClick={(e) => setCaseType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo?.todayDeaths)}
            total={prettyPrintStat(countryInfo?.deaths)}
          ></InfoBox>
        </div>
        {mapCountries?.length > 0 && (
          <Map
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
            caseType={caseType}
          ></Map>
        )}
      </div>
      <Card className="app__right">
        <CardContent>
          <h3> Live cases by Country</h3>
          <Table countries={sortData(countries)}></Table>
          {
            /*
            <h3>Worldwide new cases</h3>
          <LineGraph />
          */
          }
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
