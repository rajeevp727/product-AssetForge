import { useEffect, useState } from "react";
import api from "../api/axios.js";
import "./Dashboard.css";

export default function Dashboard() {
  const [brands, setBrands] = useState(null);
  const [error, setError] = useState("");

  debugger
  useEffect(() => {
      api.get("/Brands/GetAllBrands")
      .then(res => setBrands(res.data))
      .catch(err => {
        if (err.response?.status === 401)
          setError("Unauthorized — login again");
        else
          setError("API not reachable");
      });
  }, []);

  if (error) return <div className="state">{error}</div>;
  if (!brands) return <div className="state">Loading brands...</div>;
  if (brands.length === 0) return <div className="state">No brands found</div>;

  return (
    <div className="page">
      <h1>Brands</h1>

      <div className="table-container">
        <table className="brands-table">
          <thead>
            <tr>
              <th>Brand Name</th>
              <th>User Base</th>
              <th>Revenue</th>
              <th>Incorporation Date</th>
              <th>Website</th>
            </tr>
          </thead>

          <tbody>
            {brands.map(b => (
              <tr key={b.id}>
                <td className="brand-name">{b.name}</td>
                <td>{formatUsers(b.userBase)}</td>
                <td className="revenue">{formatCurrency(b.revenue)}</td>
                <td>{formatDate(b.createdAt)}</td>
                <td>
                  <a href={b.websiteUrl} target="_blank" rel="noreferrer">
                    {b.websiteUrl}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- formatters ---------- */

function formatCurrency(amount) {
  if (!amount) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function formatUsers(count) {
  if (!count) return "-";
  return count.toLocaleString("en-IN");
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB");
}
