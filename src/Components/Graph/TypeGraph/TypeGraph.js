import {Bar} from 'react-chartjs-2';
import {Line} from 'react-chartjs-2';
import {Pie, Doughnut} from 'react-chartjs-2';
import { getGraphOptions } from '../config';

function TypeGraph(props){
    return(
        <>
            {props.type=='Bar' ? <Bar options={()=>getGraphOptions(props.type)} data={props.data} /> : null}
            {props.type=='Line' ? <Line options={()=>getGraphOptions(props.type)}  data={props.data} /> : null}
            {props.type=='Pie' ? <Pie options={()=>getGraphOptions(props.type)}  data={props.data} /> : null}
        </>
    )
}



export default TypeGraph;