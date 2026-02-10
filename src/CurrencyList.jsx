import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function CurrencyList() {
  const [rates, setRates] = useState({});
  const [base, setBase] = useState("USD");

  useEffect(() => {
    axios
      .get(`https://api.frankfurter.app/latest?from=${base}`)
      .then(res => setRates(res.data.rates))
      .catch(err => console.error(err));
  }, [base]);

  return (
    <div className="card">
      <h2>Taxas atuais em relação a {base}</h2>
      <select value={base} onChange={(e) => setBase(e.target.value)}>
        <option>USD</option>
        <option>EUR</option>
        <option>BRL</option>
        <option>GBP</option>
      </select>

      <div className="currency-table">
        {Object.entries(rates).map(([currency, value]) => (
          <div key={currency} className="currency-row">
            <span className={`fi fi-${currency.toLowerCase()} flag`}></span>
            <strong>{currency}</strong>
            <span>{value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CurrencyList;
