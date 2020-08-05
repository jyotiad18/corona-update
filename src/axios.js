import axios from "axios";

/* base url to make requests to the movie database */

const instance = axios.create({
  baseURL: "https://disease.sh/v3/covid-19",
});

export default instance;
