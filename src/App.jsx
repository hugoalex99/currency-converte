import { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import "./App.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("BRL");
  const [result, setResult] = useState(null);
  const [rates, setRates] = useState({});
  const [history, setHistory] = useState({});

  useEffect(() => {
    axios
      .get(`https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`)
      .then(res => setResult(res.data.rates[toCurrency]))
      .catch(err => console.error(err));
  }, [amount, fromCurrency, toCurrency]);

  useEffect(() => {
    axios
      .get(`https://api.frankfurter.app/latest?from=${fromCurrency}`)
      .then(res => setRates(res.data.rates))
      .catch(err => console.error(err));
  }, [fromCurrency]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const past = new Date();
    past.setDate(past.getDate() - 30);
    const pastDate = past.toISOString().split("T")[0];

    axios
      .get(`https://api.frankfurter.app/${pastDate}..${today}?from=${fromCurrency}&to=${toCurrency}`)
      .then(res => setHistory(res.data.rates))
      .catch(err => console.error(err));
  }, [fromCurrency, toCurrency]);

  const flags = {
    USD: "us",
    EUR: "eu",
    BRL: "br",
    GBP: "gb"
  };

  const handleInvert = () => {
    const oldFrom = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(oldFrom);
  };

  const chartData = {
    labels: Object.keys(history),
    datasets: [
      {
        label: `${fromCurrency} → ${toCurrency}`,
        data: Object.values(history).map(rate => rate[toCurrency]),
        borderColor: "#00bcd4",
        backgroundColor: "rgba(0,188,212,0.2)",
        tension: 0.3,
        fill: true
      }
    ]
  };

  return (
    <div className="container">
      <h1>Conversor de Moedas</h1>

      <div className="layout">
        {/* Conversor */}
        <div className="card converter">
          <div className="field">
            <span className={`fi fi-${flags[fromCurrency]} flag`}></span>
            <label>Moeda de origem</label>
            <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
              <option>USD</option>
              <option>EUR</option>
              <option>BRL</option>
              <option>GBP</option>
            </select>
          </div>

          <div className="field">
            <label>Valor a converter</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="highlight-input"
            />
          </div>

          <button className="invert-btn" onClick={handleInvert}>⇄ Inverter moedas</button>

          <div className="field">
            <span className={`fi fi-${flags[toCurrency]} flag`}></span>
            <label>Moeda de destino</label>
            <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
              <option>USD</option>
              <option>EUR</option>
              <option>BRL</option>
              <option>GBP</option>
            </select>
          </div>

          <div className="field result">
            <label>Resultado</label>
            <h2>{result ? result.toFixed(2) : "Carregando..."}</h2>
          </div>
        </div>

        {/* Lista de moedas */}
        <div className="card rates">
          <h2>Taxas atuais em relação a {fromCurrency}</h2>
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

        {/* Gráfico histórico */}
        <div className="card chart">
          <h2>Histórico (30 dias)</h2>
          <Line data={chartData} />
        </div>
      </div>
    </div>
  );
}

export default App;
