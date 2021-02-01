import React, { useEffect, useState } from "react";
import { Chart } from "react-charts";
import { calcSharpeRatio } from "./Rates";

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
  console.log(vars);
  console.log(results);
  // console.log(createData(results));
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
  const tooltip = React.useMemo(
    () => ({
      render: ({ datum, primaryAxis, getStyle }) => {
        return (
          <CustomTooltip {...{ getStyle, primaryAxis, datum, vars, results }} />
        );
      },
    }),
    [vars, results]
  );
  // const series = React.useMemo(
  //   () => ({
  //     // showPoints: false,
  //   }),
  //   []
  // );
  // console.log("data is", data);
  const lineChart = (
    <div
      style={{
        width: "400px",
        height: "300px",
      }}
    >
      <Chart
        data={data}
        axes={axes}
        // series={series}
        tooltip={tooltip}
      />
    </div>
  );

  return lineChart;
}

export default MyChart;

function CustomTooltip({ getStyle, primaryAxis, datum, vars, results }) {
  let { rfr } = vars;
  rfr = parseFloat(rfr);
  rfr = rfr / 100;
  const [info, setInfo] = useState({
    investmentsPerFund: null,
    standardDeviation: null,
    shapreRatio: null,
  });
  useEffect(() => {
    if (datum) {
      console.log("yes!");
      let { originalDatum } = datum;
      let investmentsPerFund = originalDatum[0];
      let index = investmentsPerFund - vars.minInvestments;
      const result = results[index];
      let { mean, stdDev, investments } = result;
      const sd = calcSharpeRatio(mean, rfr, stdDev);
      // console.log(sh);
      // console.log("result", result);
      setInfo({
        ...info,
        investmentsPerFund: investments,
        standardDeviation: stdDev,
        sharpeRatio: sd,
      });
    }
  }, [datum]);
  return datum ? (
    <div
      style={{
        color: "white",
        pointerEvents: "none",
      }}
    >
      <div>Investments Per Fund: {info.investmentsPerFund}</div>
      <div>
        Standard Deviation: {(info.standardDeviation * 100).toFixed(1)}
        {`%`}
      </div>
      <div>
        Sharpe Ratio: {info.sharpeRatio && info.sharpeRatio.toFixed(2)}
        {/* {`%`} */}
      </div>
      {/* <h3
        style={{
          display: "block",
          textAlign: "center",
        }}
      >
        {primaryAxis.format(datum.primary)}
      </h3>
      <div
        style={{
          width: "300px",
          height: "200px",
          display: "flex",
        }}
      >
        <Chart
          data={data}
          dark
          series={{ type: "bar" }}
          axes={[
            {
              primary: true,
              position: "bottom",
              type: "ordinal",
            },
            {
              position: "left",
              type: "linear",
            },
          ]}
          getDatumStyle={(datum) => ({
            color: datum.originalDatum.color,
          })}
          primaryCursor={{
            value: datum.seriesLabel,
          }}
        />
      </div> */}
    </div>
  ) : null;
}
