import { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import "./Dashboard.css";


export default function Dashboard() {

  const [brands, setBrands] = useState([]);
  const [, setError] = useState("");
  const [, setLoading] = useState(true);
  const [sort, setSort] = useState({ key: null, direction: "asc" });
  const [columns, setColumns] = useState([]);
  const sortableColumns = useMemo(() => ["userbase", "revenue"], []);
  const allowedColumns = useMemo(() => ["name", "userbase", "revenue", "createdAt"], []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("api/Brands/GetAllBrands");

        if (!mounted) return;
        if (Array.isArray(res.data) && res.data.length > 0) {
          setBrands(res.data);
          const cols = Object.keys(res.data[0]).filter(key => allowedColumns.includes(key));
          setColumns(cols);
        } else {
          setBrands([]);
          setColumns([]);
        }
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
  }, [allowedColumns]);

  const prettify = key =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, s => s.toUpperCase());

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

  const arrow = (column) => {
    if (!sortableColumns.includes(column)) return "";   // no arrow

    return sort.key !== column
      ? "↕"
      : sort.direction === "asc"
        ? "▲"
        : "▼";
  };

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
                {columns.map(col => (
                  <th key={col} onClick={() => requestSort(col)}>
                    {prettify(col)} {arrow(col)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {brands.map(b => (
                <tr key={b.id}>
                  <td>
                    {b.websiteUrl
                      ? <a href={b.websiteUrl} target="_blank" rel="noreferrer">
                        <span className="brand-name">{b.name ?? "-"}</span>
                      </a>
                      : b.name ?? "-"}</td>
                  <td>{b.userbase ?? 0}</td>
                  <td>{b.revenue ?? 0}</td>
                  <td>
                    {b.createdAt
                      ? new Date(b.createdAt).toLocaleDateString()
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
