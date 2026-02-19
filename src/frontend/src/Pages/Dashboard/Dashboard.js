import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios.js";
import { formatCurrency, formatDate, formatUsers } from "../../utils/formatters.js";
import "./Dashboard.css";

export default function Dashboard() {
    const [brands, setBrands] = useState([]);
    const [error, setError] = useState("");
    const [sort, setSort] = useState({ key: null, direction: "asc" });
    const [appInfo, setAppInfo] = useState(null);
    const { loading, isAuthenticated } = useAuth();

    useEffect(() => {
        if (loading || !isAuthenticated) return;

        api.get("/Brands/GetAllBrands")
            .then(res => setBrands(res.data || []))
            .catch(() => setError("Unable to reach server"));

    }, [loading, isAuthenticated]);

    const sortedBrands = useMemo(() => {

        // 1️⃣ remove hidden brands
        const visibleBrands = brands.filter(b => (b.sortOrder ?? 1) !== 0);

        // 2️⃣ if no sorting requested
        if (!sort.key) return visibleBrands;

        // 3️⃣ sort
        return [...visibleBrands].sort((a, b) => {
            let valA = a[sort.key];
            let valB = b[sort.key];

            if (valA == null) return 1;
            if (valB == null) return -1;

            const numA = Number(valA);
            const numB = Number(valB);
            const bothNumeric = !isNaN(numA) && !isNaN(numB);

            if (bothNumeric)
                return sort.direction === "asc" ? numA - numB : numB - numA;

            return sort.direction === "asc"
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
        });

    }, [brands, sort]);


    useEffect(() => {
        if (brands.length > 0) {
            setAppInfo({
                owner: brands[0].ownedBy,
                developer: brands[0].developedBy
            });
        } else {
            setAppInfo(null);
        }
    }, [brands]);

    const requestSort = (key) => {
        setSort(prev => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
        }));
    };

    const getArrow = (column) => {
        if (sort.key !== column) return "↕";
        return sort.direction === "asc" ? "▲" : "▼";
    };

    if (error) return <div className="center-state error">{error}</div>;
    if (!brands.length) return <div className="center-state">No brands available</div>;

    return (
        <div className="layout full-height">
            <div className="page">
                <div className="header">
                    <div>
                        <h1>Brands</h1>
                        <p className="subtitle">Overview of all registered business units</p>
                    </div>
                    <div className="count-badge">{sortedBrands.length} Total</div>
                </div>

                <div className="card">
                    <div className="table-scroll">
                        <table className="brands-table">
                            <thead>
                                <tr>
                                    <th>Brand</th>

                                    <th onClick={() => requestSort("userbase")} className="sortable nowrap">
                                        Users {getArrow("userbase")}
                                    </th>

                                    <th onClick={() => requestSort("revenue")} className="sortable nowrap">
                                        Revenue {getArrow("revenue")}
                                    </th>

                                    <th>Incorporated</th>
                                    <th>Owned By</th>
                                    <th>Developed By</th>
                                    <th>Website</th>
                                </tr>
                            </thead>

                            <tbody className="text-center">
                                {sortedBrands.map(b => (
                                    <tr key={b.id}>
                                        <td className="name">{b.name || "Unknown Brand"}</td>
                                        <td className="nowrap">{formatUsers(b.userbase)}</td>
                                        <td className="revenue nowrap">{formatCurrency(b.revenue)}</td>
                                        <td className="nowrap">{formatDate(b.createdAt)}</td>
                                        <td className="nowrap">{b.ownedBy || "Unknown Developer"}</td>
                                        <td className="nowrap">{b.developedBy || "Unknown Owner"}</td>
                                        <td>
                                            {b.websiteUrl
                                                ? <a className="visit-btn" href={b.websiteUrl} target="_blank" rel="noreferrer">{b.websiteUrl}</a>
                                                : <span className="muted">No website</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {appInfo && (
                <div className="app-footer">
                    Owned by <strong>{appInfo.owner}</strong> and developed by <strong>{appInfo.developer}</strong>
                </div>
            )}
        </div>
    );
}
