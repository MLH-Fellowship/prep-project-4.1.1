import { useState, useEffect, useRef } from "react";
import axios from "axios";
import TypeGraph from "./TypeGraph/TypeGraph";
import { Bar } from "react-chartjs-2";
import { BASE, ONECALL } from "../../utils/constants.ts";
import { GET } from "../../utils/endpoints.ts";
import { dataClean, getBarData, getLineData, getScatterData } from "../../utils/config.ts";
import Carousel from 'react-material-ui-carousel'
import './Graph.css'

const Graph = (props) => {
  const [longitude, setLongitude] = useState(props.latitude || 77.1025);
  const [latitude, setLatitude] = useState(props.longitude || 28.7041);
  const [isLoaded, setIsLoaded] = useState(false);
  const [graphData, setGraphData] = useState([]);

  const datasets = {};

  const fetchForecast = async (lan, log) => {
    const frequency = ["daily", "hourly", "minutely"];
    const fields = ["Pressure", "Humidity", "Temp"];
    try {
      const data = await GET(`${BASE}${ONECALL}`, {
        lat: lan,
        lon: log,
        appid: process.env.REACT_APP_APIKEY,
      });
      Object.keys(data).map((key) => {
        if (frequency.includes(key))
          datasets[key] = dataClean(fields, data[key]);
        return;
      });
      // console.log(data, datasets);
    } catch (err) {
      console.error(err);
    }
  };

  const rand = () => Math.round(Math.random() * 100);

  const barData = {};
  
  const scatterData = {
    datasets: [
      {
        label: 'A dataset',
        data: [
          { x: rand(), y: rand() },
          { x: rand(), y: rand() },
          { x: rand(), y: rand() },
          { x: rand(), y: rand() },
          { x: rand(), y: rand() },
          { x: rand(), y: rand() },
          { x: rand(), y: rand() },
          { x: rand(), y: rand() },
          { x: rand(), y: rand() },
          { x: rand(), y: rand() },
          { x: rand(), y: rand() },
          { x: rand(), y: rand() },
          { x: rand(), y: rand() },
          { x: rand(), y: rand() },
        ],
        backgroundColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  const lineData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Rainfall",
        fill: false,
        lineTension: 0.5,
        backgroundColor: "rgba(75,192,192,1)",  
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: [65, 59, 80, 81, 56],
      },
    ],
};

  const types = ["Line", "Line", "Bar", "Line", "Scatter"];
  const freq_fields = [
    {
      freq: 'daily',
      field: ['Temp', 'Temp', 'Temp'],
      displayLabel: ['Max Temperature', 'Avg Temperature', 'Min Temperature'],
      callback: [(val) => val.max, (val) => (val.max + val.min)/2, (val) => val.min],
    },
    {
      freq: 'daily',
      field: ['Pressure'],
      displayLabel: ['Pressure'],
      callback: [val => val],
    }, 
    {
      freq: 'daily',
      field: ['Humidity'],
      displayLabel: ['Humidity'],
      callback: [val=> val],
    },
    {
      freq: 'daily',
      field: ['Temp'],
      displayLabel: ['Avg Temperature'],
      callback: [val => (val.max + val.min)/2],
    },
    {
      freq: 'hourly',
      field: ['Temp'],
      displayLabel: ['Hourly Temperature'],
      callback: [val => val],
      options: {
        backgroundColor: 'rgba(255, 99, 132, 1)',
      }
    }
  ];
  const Weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  useEffect(async () => {
    setIsLoaded(false);
    await fetchForecast(latitude, longitude);
    setGraphData(
      types.map((val, id) => {
        let curr_labels = [];
        let curr_dataset = [];
        datasets[freq_fields[id].freq].map((value) => {
          freq_fields[id].field.forEach((element, index) => {
            if(value.label !== element) return;
            curr_labels = [...value.data.map((obj, cnt) => {
              const curr_date = new Date(obj.date);
              switch(freq_fields[id].freq){
                case 'daily':
                  return Weekdays[curr_date.getDay()];
                case 'hourly':
                  return cnt;
                case 'minutely':
                  return cnt;
              }
            })];
            curr_dataset.push({
              label: freq_fields[id].displayLabel[index],
              data: value.data.map(obj => freq_fields[id].callback[index](obj.value)),
              ...freq_fields[id].options
            });
          });
        });
        switch(val) {
          case 'Bar':
            return {...getBarData(curr_labels, curr_dataset)};
          case 'Line':
            return {...getLineData(curr_labels, curr_dataset)};
          case 'Scatter':
            return {...getScatterData(curr_labels, curr_dataset)}
        }
        
      })
    );
    setIsLoaded(true);
  }, [latitude, longitude]);

  const data = [barData, scatterData, lineData];

  return (
    <div className='analytics'>
      <div className='vis-title'>Weather Visualisations</div>
      <div className='carousel-container'>
        {isLoaded && 
          <Carousel
            autoPlay={false}
            navButtonsAlwaysVisible
          >
              {types.map((type, id) => {
                return (
                  <div className='typegraph' key={id}>
                    <TypeGraph data={graphData[id]} type={type} />
                  </div>
                );
              })}
          </Carousel>
        }
      </div>
    </div>
  );
}

export default Graph;
