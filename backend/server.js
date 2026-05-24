const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb://admin:admin123@ac-asjugoe-shard-00-00.zcqxafs.mongodb.net:27017,ac-asjugoe-shard-00-01.zcqxafs.mongodb.net:27017,ac-asjugoe-shard-00-02.zcqxafs.mongodb.net:27017/?ssl=true&replicaSet=atlas-puiz4q-shard-0&authSource=admin&appName=Cluster0"
  )
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.log("❌ Mongo Error:", err));

const employeeSchema = new mongoose.Schema({
  name: String,
  role: String,
  productivity: Number,
  status: String,
});

const Employee = mongoose.model("Employee", employeeSchema);

// GET
app.get("/api/employees", async (req, res) => {
  const data = await Employee.find();
  res.json(data);
});

// POST
app.post("/api/employees", async (req, res) => {
  const { name, role, productivity } = req.body;

  const status =
    productivity >= 80
      ? "Excellent"
      : productivity >= 50
      ? "Good"
      : "Low";

  const emp = new Employee({
    name,
    role,
    productivity,
    status,
  });

  await emp.save();
  res.json(emp);
});

// PUT
app.put("/api/employees/:id", async (req, res) => {
  const { name, role, productivity } = req.body;

  const status =
    productivity >= 80
      ? "Excellent"
      : productivity >= 50
      ? "Good"
      : "Low";

  const updated = await Employee.findByIdAndUpdate(
    req.params.id,
    { name, role, productivity, status },
    { new: true }
  );

  res.json(updated);
});

// DELETE
app.delete("/api/employees/:id", async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("🚀 Server running on port 5000");
});