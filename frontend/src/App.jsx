import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Login from "./Login";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { motion, AnimatePresence } from "framer-motion";

const API =
  process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}`/api/employees
    : "http://localhost:5000/api/employees";
function App() {

  const [employees, setEmployees] = useState([]);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [productivity, setProductivity] = useState("");

  const [search, setSearch] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [notification, setNotification] = useState(null);

  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState(
    "Hello! I am MindMesh AI Assistant."
  );

  const [logs, setLogs] = useState([
    "System initialized.",
    "Database connected."
  ]);

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  const showToast = (msg) => {
    setNotification(msg);

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString();

    setLogs((prev) => [
      `[${time}] ${msg}`,
      ...prev.slice(0, 4),
    ]);
  };

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

  const handleSubmit = async () => {

    if (!name || !role || productivity === "") {
      return alert("All fields required");
    }

    const data = {
      name,
      role,
      productivity: Number(productivity),
    };

    try {
      if (isEditing) {
        await axios.put(`${API}/${editId}`, data);
        showToast(`✅ ${name} updated`);
        addLog(`Updated: ${name}`);
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post(API, data);
        showToast(`🚀 ${name} added`);
        addLog(`Added: ${name}`);
      }

      setName("");
      setRole("");
      setProductivity("");
      fetchEmployees();

    } catch (err) {
      console.log(err);
    }
  };

  const deleteEmployee = async (id, empName) => {
    if (!window.confirm("Delete employee?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      showToast(`🗑️ ${empName} deleted`);
      addLog(`Deleted: ${empName}`);
      fetchEmployees();
    } catch (err) {
      console.log(err);
    }
  };

  const editEmployee = (emp) => {
    setName(emp.name);
    setRole(emp.role);
    setProductivity(emp.productivity);
    setEditId(emp._id);
    setIsEditing(true);
    addLog(`Editing: ${emp.name}`);
  };

  const filtered = employees.filter((e) => {
    return e.name?.toLowerCase().includes(search.toLowerCase());
  });

  const total = employees.length;

  const avg =
    employees.length > 0
      ? (
          employees.reduce(
            (a, b) => a + Number(b.productivity || 0),
            0
          ) / employees.length
        ).toFixed(1)
      : 0;

  const futureTrend =
    employees.length > 0
      ? (Number(avg) * 1.05).toFixed(1)
      : 0;

  const best =
    employees.length > 0
      ? employees.reduce((a, b) =>
          Number(a.productivity) > Number(b.productivity) ? a : b
        ).name
      : "N/A";

  // ✅ NEW DYNAMIC GEMINI AI CHATBOT INTEGRATION
   const askAI = async () => {
    if (!query.trim()) {
      return;
    }

    const originalQuery = query; // User ka asli sawaal yahan safe hai
    console.log("Sending to backend:", originalQuery);
    
    setQuery(""); // Input box ab khali kar sakte hain safely
    setAnswer("🤖 Thinking..."); 

    try {
      const res = await fetch("https://onrender.com",{
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt: originalQuery,
  }),
});

      const data = await res.json();

      if (data && data.answer) {
        setAnswer(data.answer); // AI ka response screen par set ho jayega
      } else if (data && data.error) {
        setAnswer(`❌ Backend Error: ${data.error}`);
      } else {
        setAnswer("🤖 AI is processing, please try again in a moment.");
      }
      
      addLog(`AI Query: ${originalQuery}`);

    } catch (err) {
      console.log("Frontend Connection Error:", err);
      setAnswer("❌ Sorry, could not connect to AI node right now.");
    }
  };
  const getStatusLabel = (score) => {
    const num = Number(score);
    if (num >= 80) return "Excellent";
    if (num >= 50) return "Good";
    return "Low";
  };

  const chartData = [
    {
      name: "Excellent",
      value: employees.filter((e) => Number(e.productivity) >= 80).length,
    },
    {
      name: "Good",
      value: employees.filter((e) => Number(e.productivity) >= 50 && Number(e.productivity) < 80).length,
    },
    {
      name: "Low",
      value: employees.filter((e) => Number(e.productivity) < 50).length,
    },
  ];

  const COLORS = ["#00C49F", "#FFBB28", "#FF4444"];

  const exportPDF = () => {
    const input = document.getElementById("dashboard");

    html2canvas(input, {
      scale: 2,
    }).then((canvas) => {
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

  const cardStyle = {
    background: darkMode ? "#1e1e1e" : "#fff",
    padding: "20px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    transition: "0.3s",
  };

  return (
    <div
      id="dashboard"
      style={{
        padding: "40px",
        background: darkMode ? "#0f0f0f" : "#f0f2f5",
        color: darkMode ? "#fff" : "#111",
        minHeight: "100vh",
      }}
    >
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
              background: "#333",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "10px",
              zIndex: 999,
            }}
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      <h1>🧠 MindMesh AI Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div style={{ ...cardStyle, borderTop: "4px solid #2196f3" }}>
          Staff <br />
          <b style={{ fontSize: "24px" }}>{total}</b>
        </div>

        <div style={{ ...cardStyle, borderTop: "4px solid #00C49F" }}>
          Average <br />
          <b style={{ fontSize: "24px" }}>{avg}%</b>
        </div>

        <div style={{ ...cardStyle, borderTop: "4px solid #FFBB28" }}>
          MVP <br />
          <b style={{ fontSize: "24px" }}>{best}</b>
        </div>

        <div style={{ ...cardStyle, borderTop: "4px solid #9c27b0" }}>
          Forecast <br />
          <b style={{ fontSize: "24px" }}>{futureTrend}%</b>
        </div>
      </div>

      <div
        style={{
          ...cardStyle,
          marginTop: "30px",
          background: "#2196f3",
          color: "#fff",
        }}
      >
        <h3>AI Insights Node</h3>
        <input
          type="text"
          placeholder="Ask AI..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              askAI();
            }
          }}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            marginTop: "10px",
            color: "#000"
          }}
        />
        <button
          onClick={askAI}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Ask AI
        </button>
        <div
          style={{
            marginTop: "15px",
            background: "rgba(255,255,255,0.15)",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          {answer}
        </div>
      </div>

      <div
        style={{
          ...cardStyle,
          marginTop: "30px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <input
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: "12px", borderRadius: "10px" }}
        />
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 1, padding: "12px", borderRadius: "10px" }}
        />
        <input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ flex: 1, padding: "12px", borderRadius: "10px" }}
        />
        <input
          type="number"
          placeholder="%"
          value={productivity}
          onChange={(e) => setProductivity(e.target.value)}
          style={{ width: "100px", padding: "12px", borderRadius: "10px" }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: "12px 20px",
            borderRadius: "10px",
            cursor: "pointer",
            background: isEditing ? "#ffbb28" : "#2196f3",
            color: isEditing ? "#000" : "#fff",
            border: "none"
          }}
        >
          {isEditing ? "Update" : "Add"}
        </button>
        <button
          onClick={exportPDF}
          style={{
            padding: "12px 20px",
            borderRadius: "10px",
            cursor: "pointer",
            background: "#4caf50",
            color: "#fff",
            border: "none"
          }}
        >
          PDF
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(400px,1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div style={cardStyle}>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={chartData} dataKey="value" outerRadius={80}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={cardStyle}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={filtered}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="productivity" fill="#2196f3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginTop: "30px", overflowX: "auto" }}>
        <table
          width="100%"
          cellPadding="15"
          style={{
            borderCollapse: "collapse",
            background: darkMode ? "#1e1e1e" : "#fff",
          }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Name</th>
              <th style={{ textAlign: "left" }}>Role</th>
              <th style={{ textAlign: "left" }}>Productivity</th>
              <th style={{ textAlign: "left" }}>Status</th>
              <th style={{ textAlign: "left" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e._id} style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                <td>{e.name}</td>
                <td>{e.role}</td>
                <td>{e.productivity}%</td>
                <td>{getStatusLabel(e.productivity)}</td>
                <td>
                  <button
                    onClick={() => editEmployee(e)}
                    style={{
                      background: "#2196f3",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEmployee(e._id, e.name)}
                    style={{
                      background: "#ff4444",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "8px",
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

      <div style={{ ...cardStyle, marginTop: "30px" }}>
        <h3>Audit Logs</h3>
        {logs.map((log, i) => (
          <div key={i} style={{ fontFamily: "monospace", margin: "5px 0" }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}

// ✅ EXPORT DEFAULT APP LINE AT THE VERY END
export default App;