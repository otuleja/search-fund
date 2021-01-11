import React from "react";
import { Chart } from "react-charts";
// import { calcSharpeRatio } from "./Rates";

const createData = (results) => {
  let a = [];
  for (let i = 0; i < results.length; i++) {
    let el = results[i];
    let b = [el.investments, el.stdDev];
    a.push(b);
  }
  return a;
};
function MyChart({ results, vars }) {
  console.log(results);
  console.log(createData(results));
  const data = [
    {
      label: "Series 1",
      data: createData(results),
    },
  ];
  const axes = React.useMemo(
    () => [
      { primary: true, type: "linear", position: "bottom" },
      { type: "linear", position: "left" },
    ],
    []
  );
  console.log("data is", data);
  const lineChart = (
    <div
      style={{
        width: "400px",
        height: "300px",
      }}
    >
      <Chart data={data} axes={axes} />
    </div>
  );

  return lineChart;
}

export default MyChart;
