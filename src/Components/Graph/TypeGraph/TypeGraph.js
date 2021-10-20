import { Bar,Scatter,Line,Pie } from "react-chartjs-2";
import { graphConfig } from "../../../utils/config.js"

function TypeGraph(props) {
  return (
    <>
      {props.type === "Bar" ? (
        <Bar options={() => graphConfig(props.type)} data={props.data} />
      ) : null}
      {props.type === "Line" ? (
        <Line options={() => graphConfig(props.type)} data={props.data} />
      ) : null}
      {props.type === "Scatter" ? (
        <Scatter options={() => graphConfig(props.type)} data={props.data} />
      ) : null}
    </>
  );
}

export default TypeGraph;
