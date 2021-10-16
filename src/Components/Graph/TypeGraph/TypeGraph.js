import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import { Pie, Doughnut } from "react-chartjs-2";
import { graphConfig } from "../../../utils/config.ts"

function TypeGraph(props) {
  return (
    <>
      {props.type === "Bar" ? (
        <Bar options={() => graphConfig(props.type)} data={props.data} />
      ) : null}
      {props.type === "Line" ? (
        <Line options={() => graphConfig(props.type)} data={props.data} />
      ) : null}
      {props.type === "Pie" ? (
        <Pie options={() => graphConfig(props.type)} data={props.data} />
      ) : null}
    </>
  );
}

export default TypeGraph;
