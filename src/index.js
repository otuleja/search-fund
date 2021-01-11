import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  // gql,
  ApolloProvider,
} from "@apollo/client";
import { ExchangeRates } from "./Rates";
import ReactDOM from "react-dom";
import "./index.css";
// import App from "./App";

// import reportWebVitals from "./reportWebVitals";

const client = new ApolloClient({
  // uri: "https://search-fund-api.herokuapp.com/",
  uri: "https://2k3ng5u364.execute-api.us-east-1.amazonaws.com/dev/graphql",
  // uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <ExchangeRates />
      </div>
    </ApolloProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
