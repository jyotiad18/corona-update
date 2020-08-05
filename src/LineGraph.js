import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from "./axios";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRation: false,
  tooltip: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "Line",
        time: {
          formate: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

function LineGraph() {
	const [data, setData] = useState({});	

	const buildChartData = (data, casesType = "cases") => {
    const chartData = [];
    let lastDataPoint;
    for(let date in data.cases) {
		if (lastDataPoint) {
			const newDataPoint = {
			x: date,
			y: data[casesType][date] - lastDataPoint,
			};
			chartData.push(newDataPoint);
		}
		lastDataPoint = data[casesType][date];
	  }
	  return chartData;
  	};
	
	useEffect(() => {
		async function fetchData() {
			const request = await axios.get("/historical/all?lastdays=120");			
			setData(buildChartData(request.data, "cases"));						
			return request;
		}
		fetchData();
	}, []);

	
	return (
    <div>
      { /* data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
		></Line>
		)*/}
    </div>
  );
}

export default LineGraph;
