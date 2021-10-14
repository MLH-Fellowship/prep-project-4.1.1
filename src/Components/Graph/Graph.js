import {useState,useEffect, useRef} from 'react'
import axios from 'axios'
import {Bar} from 'react-chartjs-2';

function Graph(props){
    const [lon,setLon] = useState(null);
    const [lat,setLat] = useState(null);
    //Dummy Data
    const data = {
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


    return(
        <>
        <div>
            Graph
        </div>
        <div style={{background:'white',width:'50%',margin:'auto'}}>
            <Bar
            data={data}
            options={{
                title:{
                display:true,
                text:'Average Rainfall per month',
                fontSize:20
                },
                legend:{
                display:true,
                position:'right'
                }
            }}
            />
        </div>
        </>
    )
}

export default Graph;
