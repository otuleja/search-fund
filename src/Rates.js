import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import React, { useState, useEffect } from "react";
import Graph from "./Graph.js";

const returnsArray = [
  { roi: 0, num: 47 },
  { roi: 1.5, num: 44 },
  { roi: 3.75, num: 50 },
  { roi: 7.5, num: 32 },
  { roi: 15, num: 13 },
];

export function ExchangeRates() {
  const [vars, setVars] = useState({
    rfr: "2.0",
    irr: 30,
    minInvestments: 2,
    maxInvestments: 2,
    deteriorates: 0.93,
  });
  const [investments, setInvestments] = useState(null);
  const [results, setResults] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(false);
  const setTrue = () => {
    // console.log("setting true");
    setTimeout(() => {
      setShouldFetch(true);
    }, 100);
  };
  useEffect(() => {
    if (shouldFetch) {
      let copyOfVars = { ...vars };
      copyOfVars.rfr = parseFloat(copyOfVars.rfr);
      copyOfVars.irr = parseInt(copyOfVars.irr);
      copyOfVars.minInvestments = parseInt(copyOfVars.minInvestments);
      copyOfVars.maxInvestments = parseInt(copyOfVars.maxInvestments);
      const data = bigCalc({ investments, ...copyOfVars });
      const { mean, stdDev, actualReturn, modifiedStdDev } = data;
      const sharpeRatio = calcSharpeRatio(
        // result.mean,
        actualReturn,
        parseFloat(vars.rfr) / 100,
        stdDev
      ).toFixed(2);

      let a = [...results];
      a.push({
        mean,
        stdDev,
        investments,
        actualReturn,
        modifiedStdDev,
        sharpeRatio,
      });
      let maxSharpe = 0;
      a.forEach((obj) => {
        if (obj.sharpeRatio > maxSharpe) {
          maxSharpe = obj.sharpeRatio;
        }
      });
      a = a.map((obj) => {
        if (obj.sharpeRatio === maxSharpe) {
          obj.isBest = true;
        } else {
          obj.isBest = false;
        }
        return obj;
      });
      setResults(a);

      setShouldFetch(false);

      if (investments < vars.maxInvestments) {
        setInvestments(investments + 1);
        setTrue();
      }
    }
    // eslint-disable-next-line
  }, [shouldFetch]);
  const handleChange = (e) => {
    if (
      e.target.name === "minInvestments" ||
      e.target.name === "maxInvestments" ||
      e.target.name === "deteriorates"
    ) {
      setVars({ ...vars, [e.target.name]: parseInt(e.target.value) });
      return;
    }
    setVars({ ...vars, [e.target.name]: e.target.value });
  };
  // console.log(getStatus);
  const handleSubmit = () => {
    if (!investments) {
      setInvestments(vars.minInvestments);
    }
    setShouldFetch(true);
  };

  const handleReset = () => {
    setResults([]);
  };
  return (
    <div>
      <Grid container>
        <Grid item xs={12} container>
          <Grid item xs={12} container>
            <Grid item xs={12}>
              Distribution of ROIs (from Stanford study)
            </Grid>
            {returnsArray.map((returnObj) => {
              return (
                <>
                  <Grid item xs={6}>
                    Roi: {returnObj.roi}
                  </Grid>
                  <Grid item xs={6}>
                    Number: {returnObj.num}
                  </Grid>
                </>
              );
            })}
          </Grid>
          <Grid item xs={12} container>
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
            {/* <div style={{ marginTop: 10 }}>
            <TextField
              name="irr"
              id="outlined-basic"
              label="Target IRR"
              variant="outlined"
              value={vars.irr}
              onChange={handleChange}
            />
          </div> */}
            <div style={{ marginTop: 15 }}>Range of investments per fund</div>
            <div style={{ marginTop: 10 }}>
              <TextField
                name="minInvestments"
                id="outlined-basic"
                label="Min"
                variant="outlined"
                value={vars.minInvestments}
                onChange={handleChange}
                type="number"
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
                type="number"
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <TextField
                name="deteriorates"
                id="outlined-basic"
                label="Deteriorates"
                variant="outlined"
                value={vars.deteriorates}
                onChange={handleChange}
                type="number"
              />
            </div>

            <div>
              <button onClick={() => handleSubmit()}>Submit</button>
            </div>
            <div>
              <button onClick={() => handleReset()}>Reset</button>
            </div>
          </Grid>

          <div>
            <table>
              <tr>
                <th>Investments</th>
                <th>Return</th>
                <th>Modified Return</th>
                <th>Std Dev</th>
                {/* <th>Modified Std Dev</th> */}
                <th>Sharpe Ratio</th>
              </tr>
              {results.map((result, index) => {
                const { isBest } = result;
                // console.log(isBest);
                return (
                  <tr key={index}>
                    <td>{result.investments}</td>
                    <td style={{ paddingLeft: `5px`, paddingRight: `5px` }}>
                      {(result.mean * 100).toFixed(2)}
                      {`%`}
                    </td>
                    <td>
                      {(result.actualReturn * 100).toFixed(2)}
                      {`%`}
                    </td>
                    <td style={{ paddingLeft: `5px`, paddingRight: `5px` }}>
                      {(result.stdDev * 100).toFixed(2)}
                      {`%`}
                    </td>
                    {/* <td style={{ textAlign: "center" }}>
                      {result.modifiedStdDev}
                    </td> */}
                    <td
                      style={{
                        textAlign: "center",
                        border: isBest ? `2px solid blue` : `none`,
                      }}
                    >
                      {result.sharpeRatio}
                      {/* {calcSharpeRatio(
                        // result.mean,
                        result.actualReturn,
                        parseFloat(vars.rfr) / 100,
                        result.stdDev
                      ).toFixed(2)} */}
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
  console.log(mean, rfr, stdDev);
  const sharpe = (mean - rfr) / stdDev;
  return sharpe;
};

const bigCalc = ({ investments, irr, deteriorates }) => {
  let returnsObj = [...returnsArray];
  const sum = returnsObj.reduce((acc, current) => {
    acc = acc + current.num;
    return acc;
  }, 0);
  let cumulative = 0;
  returnsObj = returnsObj.map((a) => {
    cumulative = cumulative + a.num;
    let percentage = cumulative / sum;
    return { ...a, cumulative, percentage };
  });
  const numInvestmentsPerFund = investments;

  const determineResultOfOneTrial = (n) => {
    const rand = Math.random();
    let result = 0;
    for (let i = 0; i < returnsObj.length; i++) {
      if (rand < returnsObj[i].percentage) {
        result = returnsObj[i].roi;
        break;
      }
    }
    result = result * Math.pow(deteriorates, n) * 1.1;
    return result;
  };
  const years = 5;
  const investment = 150;
  const numTrials = 100000;
  // const numTrials = 3;

  let a = [];
  for (let i = 0; i < numTrials; i++) {
    let b = [];
    for (let n = 0; n < numInvestmentsPerFund; n++) {
      let result = determineResultOfOneTrial(n);
      result = result * investment;

      b.push(result);
    }
    a.push(b);
  }
  // console.log(a);
  let arrayOfMeans = [];
  const calcSum = (array) => {
    let sum = 0;
    for (let n = 0; n < array.length; n++) {
      sum = sum + array[n];
    }
    return sum;
  };

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
  // console.log(arrayOfMeans);
  const calculateAnnualReturn = (
    startingInvestment,
    endValue,
    years,
    addBack
  ) => {
    // console.log(startingInvestment, endValue);
    let annualReturn = Math.pow(endValue / startingInvestment, 1 / years) - 1;
    if (addBack) {
      annualReturn = annualReturn + 1;
    }
    return annualReturn;
  };

  // const calculateROI = (startingInvestment, endValue, years) => {

  // }
  let returns = [];
  for (let i = 0; i < arrayOfMeans.length; i++) {
    const annualReturn = calculateAnnualReturn(
      investment,
      arrayOfMeans[i],
      years
    );
    returns.push(annualReturn);
  }
  // console.log(returns);
  let grossPayoffs = a.reduce((acc, curr) => {
    let sum = curr.reduce((a, c) => {
      a = a + c;
      return a;
    }, 0);
    acc.push(sum);
    return acc;
  }, []);
  // console.log("gross", grossPayoffs);
  let r = [];
  grossPayoffs.forEach((payoff) => {
    let actualReturn = calculateAnnualReturn(
      investment * numInvestmentsPerFund,
      payoff,
      5,
      true
    );
    r.push(actualReturn);
  });
  // console.log("r", r);
  let s = calcSum(grossPayoffs);
  // console.log("sum", s);
  let actualReturn = calculateAnnualReturn(
    investment * numInvestmentsPerFund * numTrials,
    s,
    5
  );
  // console.log(b);
  // let adjustedReturns = grossPayoffs.map((payoff) => {
  //   let a = calculateAnnualReturn(
  //     investment * numInvestmentsPerFund,
  //     payoff,
  //     5
  //   );
  //   return a;
  // });
  // console.log("adjusted returns", adjustedReturns);
  const getStandardDeviation = (array) => {
    const n = array.length;
    const mean = array.reduce((a, b) => a + b) / n;
    return Math.sqrt(
      array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
    );
  };
  const abc = calcMean(returns);
  const def = getStandardDeviation(returns);
  const modifiedStdDev = 4;
  // console.log(getStandardDeviation(r));
  return { mean: abc, stdDev: def, actualReturn, modifiedStdDev };
};
