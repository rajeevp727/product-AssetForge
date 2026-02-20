import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import "./Dashboard.css";


export default function Dashboard() {

  const [brands, setBrands] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("api/Brands/GetAllBrands");

        if (!mounted) return;

        if (Array.isArray(res.data))
          setBrands(res.data);
        else
          setBrands([]);

      } catch (err) {

        if (!mounted) return;

        if (err.response?.status === 401)
          setError("Session expired. Please login again.");
        else
          setError("Failed to load brands");

      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();

    return () => { mounted = false };

  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/auth";
  }

  const requestSort = key => {
    setSort(prev => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc"
          ? "desc"
          : "asc"
    }));
  };

  const arrow = column =>
    sort.key !== column ? "↕" : sort.direction === "asc" ? "▲" : "▼";

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="table-card">

        {brands.length === 0 ? (
          <div className="empty-state">
            No brands found
          </div>
        ) : (

          <table className="brands-table">
            <thead>
              <tr className="mono">
                <th>Id</th>
                <th>Name</th>

                <th className="sortable"
                  onClick={() => requestSort("userbase")}>
                  User Base {arrow("userbase")}
                </th>

                <th className="sortable"
                  onClick={() => requestSort("revenue")}>
                  Revenue {arrow("revenue")}
                </th>

                <th>Incorporated</th>
                <th>Website</th>
              </tr>
            </thead>

            <tbody>
              {brands.map(b => (
                <tr key={b.id}>
                  <td className="mono">{b.id}</td>
                  <td>{b.name ?? "-"}</td>
                  <td>{b.userbase ?? 0}</td>
                  <td>{b.revenue ?? 0}</td>
                  <td>
                    {b.createdAt
                      ? new Date(b.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {b.websiteUrl
                      ? <a href={b.websiteUrl} target="_blank" rel="noreferrer">
                        Visit
                      </a>
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        )}

      </div>

    </div>
  );
}
