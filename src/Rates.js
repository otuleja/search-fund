// import { gql } from "@apollo/client";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import React, { useState, useEffect } from "react";
import Graph from "./Graph.js";
// const EXCHANGE_RATES = gql`
//   query GetExchangeRates {
//     books {
//       title
//       author
//     }
//   }
// `;

// const GET = gql`
//   query get(
//     $investments: Int
//     $rfr: Float
//     $irr: Float
//     $minInvestments: Float
//     $maxInvestments: Float
//   ) {
//     gett(
//       investments: $investments
//       rfr: $rfr
//       irr: $irr
//       minInvestments: $minInvestments
//       maxInvestments: $maxInvestments
//     ) {
//       mean
//       stdDev
//     }
//   }
// `;
export function ExchangeRates() {
  const [vars, setVars] = useState({
    rfr: "2.0",
    irr: 30,
    minInvestments: 5,
    maxInvestments: 30,
  });
  const [investments, setInvestments] = useState(null);
  const [results, setResults] = useState([]);
  // const [ex, getStatus] = useLazyQuery(GET, {
  //   fetchPolicy: "network-only",
  //   onCompleted: (data) => {
  //     const { mean, stdDev } = data.gett;
  //     let a = [...results];
  //     a.push({ mean, stdDev, investments });
  //     setResults(a);
  //     if (investments <= vars.maxInvestments) {
  //       setInvestments(investments + 1);
  //       setShouldFetch(true);
  //     }
  //   },
  //   onError: (e) => {
  //     console.log("error", e);
  //   },
  // });
  const [shouldFetch, setShouldFetch] = useState(false);
  const setTrue = () => {
    console.log("setting true");
    setTimeout(() => {
      setShouldFetch(true);
    }, 100);
  };
  useEffect(() => {
    if (shouldFetch) {
      console.log("in here");
      let copyOfVars = { ...vars };
      copyOfVars.rfr = parseFloat(copyOfVars.rfr);
      copyOfVars.irr = parseInt(copyOfVars.irr);
      copyOfVars.minInvestments = parseInt(copyOfVars.minInvestments);
      copyOfVars.maxInvestments = parseInt(copyOfVars.maxInvestments);
      const data = bigCalc({ investments, ...copyOfVars });

      const { mean, stdDev } = data;
      let a = [...results];
      a.push({ mean, stdDev, investments });
      setResults(a);

      // ex({ variables: { investments, ...copyOfVars } });
      setShouldFetch(false);

      if (investments <= vars.maxInvestments) {
        setInvestments(investments + 1);
        setTrue();
        // setShouldFetch(true);
      }
    }
    // eslint-disable-next-line
  }, [shouldFetch]);
  const handleChange = (e) => {
    setVars({ ...vars, [e.target.name]: e.target.value });
  };
  // console.log(getStatus);
  const handleSubmit = () => {
    if (!investments) {
      setInvestments(vars.minInvestments);
    }
    setShouldFetch(true);
  };
  return (
    <div>
      <Grid container>
        <Grid item xs={4} container>
          <div style={{ marginTop: 15 }}>
            <TextField
              name="rfr"
              id="outlined-basic"
              label="Risk-free rate"
              variant="outlined"
              value={vars.rfr}
              onChange={handleChange}
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <TextField
              name="irr"
              id="outlined-basic"
              label="Target IRR"
              variant="outlined"
              value={vars.irr}
              onChange={handleChange}
            />
          </div>
          <div style={{ marginTop: 15 }}>Range of investments per fund</div>
          <div style={{ marginTop: 10 }}>
            <TextField
              name="minInvestments"
              id="outlined-basic"
              label="Min"
              variant="outlined"
              value={vars.minInvestments}
              onChange={handleChange}
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <TextField
              name="maxInvestments"
              id="outlined-basic"
              label="Max"
              variant="outlined"
              value={vars.maxInvestments}
              onChange={handleChange}
            />
          </div>
          <div>
            <button onClick={() => handleSubmit()}>Submit</button>
          </div>
          <div>
            <table>
              <tr>
                <th>Investments</th>
                <th>Return</th>
                <th>Std Dev</th>
                <th>Sharpe Ratio</th>
              </tr>
              {results.map((result) => {
                return (
                  <tr>
                    <td>{result.investments}</td>
                    <td>{result.mean.toFixed(3)}</td>
                    <td>{result.stdDev.toFixed(3)}</td>
                    <td>
                      {calcSharpeRatio(
                        result.mean,
                        parseFloat(vars.rfr) / 100,
                        result.stdDev
                      ).toFixed(3)}
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
        </Grid>
        <Grid item xs={8} container>
          <Graph results={results} vars={vars} />
        </Grid>
      </Grid>
    </div>
  );
}
export const calcSharpeRatio = (mean, rfr, stdDev) => {
  const sharpe = (mean - rfr) / stdDev;
  return sharpe;
};

const bigCalc = ({ investments, irr }) => {
  console.log(investments);
  const numInvestmentsPerFund = investments;

  // const randn_bm = () => {
  //   var u = 0,
  //     v = 0;
  //   while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  //   while (v === 0) v = Math.random();
  //   return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // };
  const determineResultOfOneTrial = (bustPercentage, median, range) => {
    const takeSample = (m, r) => {
      const rand = Math.random();
      return rand * (2 * r) + (m - r);
    };
    const rand = Math.random();
    let result = 0;
    if (rand > bustPercentage) {
      result = takeSample(median, range);
    }
    return result;
  };
  const calculateNeededMedian = (bustPercentage, finalTarget) => {
    return finalTarget / (1 - bustPercentage);
  };
  const years = 5;
  const investment = 150;
  const target_irr = irr;
  const finalTarget = investment * Math.pow(1 + target_irr / 100, years);
  const std_deviation = finalTarget / 2;
  const bustPercentage = 0.2;
  const neededMedian = calculateNeededMedian(bustPercentage, finalTarget);
  // const run_trial = (std_dev, mean) => {
  //   const a = randn_bm();
  //   return a * std_dev + mean;
  // };
  const numTrials = 5000;
  let a = [];
  for (let i = 0; i < numTrials; i++) {
    let b = [];
    for (let n = 0; n < numInvestmentsPerFund; n++) {
      const result = determineResultOfOneTrial(
        bustPercentage,
        neededMedian,
        std_deviation
      );

      b.push(result);
    }
    a.push(b);
  }
  let arrayOfMeans = [];

  const calcMean = (array) => {
    let sum = 0;
    for (let n = 0; n < array.length; n++) {
      sum = sum + array[n];
    }
    return sum / array.length;
  };

  for (let i = 0; i < a.length; i++) {
    const mean = calcMean(a[i]);
    arrayOfMeans.push(mean);
  }

  const calculateAnnualReturn = (startingInvestment, endValue, years) => {
    const annualReturn = Math.pow(endValue / startingInvestment, 1 / years) - 1;
    return annualReturn;
  };
  let returns = [];
  for (let i = 0; i < arrayOfMeans.length; i++) {
    const annualReturn = calculateAnnualReturn(
      investment,
      arrayOfMeans[i],
      years
    );
    returns.push(annualReturn);
  }
  const getStandardDeviation = (array) => {
    const n = array.length;
    const mean = array.reduce((a, b) => a + b) / n;
    return Math.sqrt(
      array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
    );
  };
  console.log(returns.length);
  const abc = calcMean(returns);
  const def = getStandardDeviation(returns);
  return { mean: abc, stdDev: def };
};
