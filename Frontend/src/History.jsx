import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function History() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem("email") || "demo@gmail.com";

    fetch(`http://127.0.0.1:5000/history/${email}`)
      .then((res) => res.json())
      .then((resData) => {
        console.log("RAW DATA:", resData);

        // 🔥 IMPORTANT FIX: ensure numbers
        const formatted = resData.map((item) => ({
          ...item,
          price: Number(item.price),
          marketing: Number(item.marketing),
          prediction: Number(item.prediction),
        }));

        console.log("FORMATTED:", formatted);

        setData(formatted);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        background: "#020617",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <h2>History Dashboard</h2>

      {/* 📊 GRAPH */}
      {data.length > 0 ? (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid stroke="#444" />
              <XAxis dataKey="price" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="prediction"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <h3>No data for graph</h3>
      )}

      {/* 📦 CARDS */}
      {data.map((item, i) => (
        <div
          key={i}
          style={{
            margin: "10px",
            padding: "10px",
            background: "#1e293b",
            borderRadius: "8px",
          }}
        >
          <p>Price: {item.price}</p>
          <p>Marketing: {item.marketing}</p>
          <p>Season: {item.season}</p>
          <p>Prediction: {item.prediction}</p>
        </div>
      ))}
    </div>
  );
}

export default History;