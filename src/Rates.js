import { useLazyQuery, gql } from "@apollo/client";
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

const GET = gql`
  query get(
    $investments: Int
    $rfr: Float
    $irr: Float
    $minInvestments: Float
    $maxInvestments: Float
  ) {
    gett(
      investments: $investments
      rfr: $rfr
      irr: $irr
      minInvestments: $minInvestments
      maxInvestments: $maxInvestments
    ) {
      mean
      stdDev
    }
  }
`;
export function ExchangeRates() {
  const [vars, setVars] = useState({
    rfr: "",
    irr: 30,
    minInvestments: 5,
    maxInvestments: 30,
  });
  const [investments, setInvestments] = useState(null);
  const [results, setResults] = useState([]);
  const [ex, getStatus] = useLazyQuery(GET, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      const { mean, stdDev } = data.gett;
      let a = [...results];
      a.push({ mean, stdDev, investments });
      setResults(a);
      if (investments <= vars.maxInvestments) {
        setInvestments(investments + 1);
        setShouldFetch(true);
      }
    },
    onError: (e) => {
      console.log("error", e);
    },
  });
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    if (shouldFetch) {
      let copyOfVars = { ...vars };
      copyOfVars.rfr = parseFloat(copyOfVars.rfr);
      copyOfVars.irr = parseInt(copyOfVars.irr);
      copyOfVars.minInvestments = parseInt(copyOfVars.minInvestments);
      copyOfVars.maxInvestments = parseInt(copyOfVars.maxInvestments);

      ex({ variables: { investments, ...copyOfVars } });
      setShouldFetch(false);
    }
    // eslint-disable-next-line
  }, [shouldFetch]);
  const handleChange = (e) => {
    setVars({ ...vars, [e.target.name]: e.target.value });
  };
  console.log(getStatus);
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
