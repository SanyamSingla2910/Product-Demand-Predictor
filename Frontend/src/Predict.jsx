import { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Predict() {
  const [price, setPrice] = useState("");
  const [marketing, setMarketing] = useState("");
  const [season, setSeason] = useState("winter");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [chartData, setChartData] = useState([]);

  const handlePredict = async () => {
    setError("");
    setPrediction(null);

    const email = localStorage.getItem("email");

    if (!price || !marketing) {
      setError("Fill all fields");
      return;
    }

    if (!email) {
      setError("Login first");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: Number(price),
          marketing: Number(marketing),
          season,
          email,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setPrediction(data.prediction);

        setChartData((prev) => [
          ...prev,
          { price: Number(price), prediction: data.prediction },
        ]);
      }
    } catch {
      setError("Server error");
    }
  };

  const sendFeedback = async (type) => {
    await fetch("http://127.0.0.1:5000/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price: Number(price),
        marketing: Number(marketing),
        season,
        feedback: type,
      }),
    });

    alert("Feedback saved");
  };

  const retrainModel = async () => {
    await fetch("http://127.0.0.1:5000/retrain", {
      method: "POST",
    });

    alert("Model retrained!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        textAlign: "center",
        marginTop: "40px",
        color: "white",
        background: "#020617",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h2>Predict Demand</h2>

      <input
        placeholder="Price"
        onChange={(e) => setPrice(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Marketing"
        onChange={(e) => setMarketing(e.target.value)}
      />
      <br /><br />

      <select onChange={(e) => setSeason(e.target.value)}>
        <option>winter</option>
        <option>summer</option>
        <option>monsoon</option>
      </select>

      <br /><br />

      <button
        onClick={handlePredict}
        style={{
          padding: "10px",
          background: "#22c55e",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
      >
        Predict
      </button>

      {prediction && <h3>Prediction: {prediction}</h3>}
      {error && <h3 style={{ color: "red" }}>{error}</h3>}

      {/* 🔥 Feedback Buttons */}
      {prediction && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={() => sendFeedback("high")}>
            Prediction too high
          </button>

          <button onClick={() => sendFeedback("low")}>
            Prediction too low
          </button>

          <br /><br />

          <button onClick={retrainModel}>
            Improve Model
          </button>
        </div>
      )}

      {/* 📊 Graph */}
      {chartData.length > 0 && (
        <div style={{ width: "100%", height: 300, marginTop: "20px" }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <XAxis dataKey="price" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="prediction"
                stroke="#22c55e"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}

export default Predict;