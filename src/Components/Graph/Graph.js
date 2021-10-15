import {useState,useEffect, useRef} from 'react'
import axios from 'axios'
import TypeGraph from './TypeGraph/TypeGraph';
import {getGraphOptions} from "./config"

function Graph(props){
    const [lon,setLon] = useState(null);
    const [lat,setLat] = useState(null);
    //Dummy Data
    const barData = {
        labels: ['January', 'February', 'March',
                 'April', 'May'],
        datasets: [
          {
            label: 'Rainfall',
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: [65, 59, 80, 81, 56]
          }
        ]
      }
      const pieData = {
        labels: ['January', 'February', 'March',
                 'April', 'May'],
        datasets: [
          {
            label: 'Rainfall',
            backgroundColor: [
              '#B21F00',
              '#C9DE00',
              '#2FDE00',
              '#00A6B4',
              '#6800B4'
            ],
            hoverBackgroundColor: [
            '#501800',
            '#4B5000',
            '#175000',
            '#003350',
            '#35014F'
            ],
            data: [65, 59, 80, 81, 56]
          }
        ]
      }

      const lineData = {
        labels: ['January', 'February', 'March',
                 'April', 'May'],
        datasets: [
          {
            label: 'Rainfall',
            fill: false,
            lineTension: 0.5,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: [65, 59, 80, 81, 56]
          }
        ]
      }
  
  
    const fetchForecast = async(lan,log)=>{
      try{
        // const data = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${process.env.REACT_APP_APIKEY}`);
      }catch(e){
        console.log(e);
      }
    }

    useEffect(()=>{
        fetchForecast(lat,lon)
    },[])
    const types = ['Bar','Pie', 'Line']
    const data = [barData,pieData,lineData]

    return(
        <>
        <div>
            Graph
        </div>
        <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap'}}>
          {types.map((type,id)=>{
            return <div style={{width:'30%'}} key={id}><TypeGraph data={data[id]} type={type}/></div>
          })}
        </div>
         
        </>
    )
}

export default Graph;
