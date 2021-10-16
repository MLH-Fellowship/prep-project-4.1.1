import { useState, useEffect, useRef } from "react";
import axios from "axios";
import TypeGraph from "./TypeGraph/TypeGraph";
import { Bar } from "react-chartjs-2";
import { BASE, ONECALL } from "../../utils/constants.ts";
import { GET } from "../../utils/endpoints.ts";
import { dataClean } from "../../utils/config.ts";
import Carousel from 'react-material-ui-carousel'
import './Graph.css'

const Graph = (props) => {
  const [longitude, setLongitude] = useState(props.latitude || 77.1025);
  const [latitude, setLatitude] = useState(props.longitude || 28.7041);

  const datasets = {};
  const frequency = ["daily", "hourly", "minutely"];
  const fields = ["Pressure", "Humidity", "Temp"];

  const fetchForecast = async (lan, log) => {
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
      console.log(datasets);
    } catch (err) {
      console.error(err);
    }
  };

  const rand = () => Math.round(Math.random() * 100);

  const barData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Rainfall",
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: [65, 59, 80, 81, 56],
      },
      {
        label: 'Dataset 2',
        backgroundColor: 'rgb(255, 99, 132)',
        data: [rand(), rand(), rand(), rand(), rand(), rand(), rand()],
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };
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


  useEffect(() => {
    // fetchForecast(latitude, longitude);
  }, [latitude, longitude]);
  const types = ["Bar", "Scatter", "Line"];
  const data = [barData, scatterData, lineData];

  return (
    <>
      <div className='vis-title'>Weather Visualisations</div>
      <div className='carousel-container'>
        <Carousel>
            {types.map((type, id) => {
              return (
                <div className='typegraph' key={id}>
                  <TypeGraph data={data[id]} type={type} />
                </div>
              );
            })}
        </Carousel>
      </div>
    </>
  );
}

export default Graph;
