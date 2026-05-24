import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Login from "./Login";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API = "http://localhost:5000/api/employees";

function App() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [productivity, setProductivity] = useState("");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
  localStorage.getItem("loggedIn") === "true"
);

  // FETCH DATA
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API);
      setEmployees(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ADD / UPDATE
  const handleSubmit = async () => {
    if (!name || !role || !productivity) {
      return alert("All fields required");
    }

    const data = {
      name,
      role,
      productivity: Number(productivity),
    };

    try {
      if (isEditing) {
        'await axios.put(${API}/${editId}, data)';
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post(API, data);
      }

      setName("");
      setRole("");
      setProductivity("");
      fetchEmployees(); // IMPORTANT
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE
  const deleteEmployee = async (id) => {
    'await axios.delete(${API}/${id})';
    fetchEmployees();
  };

  // EDIT
  const editEmployee = (emp) => {
    setName(emp.name);
    setRole(emp.role);
    setProductivity(emp.productivity);
    setEditId(emp._id);
    setIsEditing(true);
  };

  // SEARCH
  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  // STATS
  const total = employees.length;

  const avg =
    employees.length > 0
      ? (
          employees.reduce((a, b) => a + b.productivity, 0) /
          employees.length
        ).toFixed(1)
      : 0;

  const best =
    employees.length > 0
      ? employees.reduce((a, b) =>
          a.productivity > b.productivity ? a : b
        ).name
      : "N/A";

  // CHART DATA
  const chartData = [
    {
      name: "Excellent",
      value: employees.filter((e) => e.status === "Excellent").length,
    },
    {
      name: "Good",
      value: employees.filter((e) => e.status === "Good").length,
    },
    {
      name: "Low",
      value: employees.filter((e) => e.status === "Low").length,
    },
  ];

  const COLORS = ["#00C49F", "#FFBB28", "#FF4444"];

  // 📄 PDF EXPORT (NEW FEATURE)
  const exportPDF = () => {
    const input = document.getElementById("dashboard");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("employees-report.pdf");
    });
  };
  if (!isLoggedIn) {
  return <Login setIsLoggedIn={setIsLoggedIn} />;
}

  return (
    <div
      id="dashboard"
      style={{
        padding: 20,
        background: darkMode ? "#111" : "#f5f5f5",
        color: darkMode ? "white" : "black",
        minHeight: "100vh",
      }}
    >
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <h2>Employee Dashboard</h2>

      {/* STATS */}
      <div style={{ display: "flex", gap: 20 }}>
        <div>Total: {total}</div>
        <div>Avg: {avg}%</div>
        <div>Best: {best}</div>
      </div>

      {/* CHARTS */}
      <PieChart width={400} height={300}>
        <Pie data={chartData} dataKey="value" outerRadius={100} label>
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      <BarChart width={500} height={300} data={employees}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="productivity" fill="#2196f3" />
      </BarChart>

      {/* FORM */}
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
      <input
        type="number"
        placeholder="Productivity"
        value={productivity}
        onChange={(e) => setProductivity(e.target.value)}
      />

      <button onClick={handleSubmit}>
        {isEditing ? "Update Employee" : "Add Employee"}
      </button>

      {/* PDF BUTTON */}
      <button
  onClick={exportPDF}
  style={{
    background: "#4caf50",
    color: "white",
    border: "none",
    padding: "8px 14px",
    marginLeft: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  Export PDF
</button>

      {/* SEARCH */}
      <input
        placeholder="Search Employee"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <table border="1" width="100%" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Productivity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((e) => (
            <tr key={e._id}>
              <td>{e.name}</td>
              <td>{e.role}</td>
              <td>{e.productivity}</td>
              <td>
  {e.status === "Excellent" && "🏆 "}
  {e.status}
</td>
              <td>
               <button
  onClick={() => editEmployee(e)}
  style={{
    background: "#2196f3",
    color: "white",
    border: "none",
    padding: "6px 12px",
    marginRight: "8px",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  Edit
</button>

<button
  onClick={() => deleteEmployee(e._id)}
  style={{
    background: "#f44336",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  Delete
</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;