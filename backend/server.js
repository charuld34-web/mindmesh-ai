require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());


// ================= DATABASE =================

mongoose
  .connect(
    "mongodb://admin:admin123@ac-asjugoe-shard-00-00.zcqxafs.mongodb.net:27017,ac-asjugoe-shard-00-01.zcqxafs.mongodb.net:27017,ac-asjugoe-shard-00-02.zcqxafs.mongodb.net:27017/?ssl=true&replicaSet=atlas-puiz4q-shard-0&authSource=admin&appName=Cluster0"
  )
  .then(() =>
    console.log("✅ MongoDB Atlas Connected")
  )
  .catch((err) =>
    console.log("❌ Mongo Error:", err)
  );


// ================= EMPLOYEE SCHEMA =================

const employeeSchema = new mongoose.Schema({
  name: String,
  role: String,
  productivity: Number,
  status: String,
});

const Employee = mongoose.model(
  "Employee",
  employeeSchema
);


// ================= USER SCHEMA =================

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});


// ================= AUTH ROUTES =================

// SIGNUP

app.post("/api/auth/signup", async (req, res) => {

  try {

    const { username, password } = req.body;

    const existingUser =
      await User.findOne({ username });

    if (existingUser) {

      return res.status(400).json({
        message: "Username already exists",
      });

    }

    const newUser = new User({
      username,
      password,
    });

    await newUser.save();

    res.json({
      success: true,
      message: "Signup successful",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Signup failed",
    });

  }

});


// LOGIN

app.post("/api/auth/login", async (req, res) => {

  try {

    const { username, password } = req.body;

    const user = await User.findOne({
      username,
      password,
    });

    if (user) {

      res.json({
        success: true,
        message: "Login successful",
      });

    } else {

      res.status(400).json({
        success: false,
        message: "Invalid username or password",
      });

    }

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Login failed",
    });

  }

});


// ================= EMPLOYEE CRUD =================

// GET ALL

app.get("/api/employees", async (req, res) => {

  try {

    const employees =
      await Employee.find();

    res.json(employees);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to fetch employees",
    });

  }

});


// ADD EMPLOYEE

app.post("/api/employees", async (req, res) => {

  try {

    const {
      name,
      role,
      productivity,
    } = req.body;

    const status =
      productivity >= 80
        ? "Excellent"
        : productivity >= 50
        ? "Good"
        : "Low";

    const employee = new Employee({
      name,
      role,
      productivity,
      status,
    });

    await employee.save();

    res.json(employee);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to add employee",
    });

  }

});


// UPDATE EMPLOYEE

app.put("/api/employees/:id", async (req, res) => {

  try {

    const {
      name,
      role,
      productivity,
    } = req.body;

    const status =
      productivity >= 80
        ? "Excellent"
        : productivity >= 50
        ? "Good"
        : "Low";

    const updatedEmployee =
      await Employee.findByIdAndUpdate(
        req.params.id,
        {
          name,
          role,
          productivity,
          status,
        },
        {
          new: true,
        }
      );

    res.json(updatedEmployee);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to update employee",
    });

  }

});


// DELETE EMPLOYEE

app.delete("/api/employees/:id", async (req, res) => {

  try {

    await Employee.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "Employee deleted",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Delete failed",
    });

  }

});


// ================= AI CHATBOT =================

app.post("/api/ask-ai", async (req, res) => {

  try {

    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {

      return res.status(400).json({
        answer: "Please type something.",
      });

    }

    const text =
      prompt.toLowerCase();

    let answer = "";



    // ===== BEST EMPLOYEE =====

    if (
      text.includes("best employee") ||
      text.includes("top employee") ||
      text.includes("mvp")
    ) {

      const bestEmployee =
        await Employee.findOne()
          .sort({
            productivity: -1,
          });

      if (bestEmployee) {

        answer =
          `Top performer is ${bestEmployee.name} with productivity ${bestEmployee.productivity}%.`;

      } else {

        answer =
          "No employee data found.";

      }

    }



    // ===== WEAK EMPLOYEE =====

    else if (
      text.includes("weak") ||
      text.includes("low")
    ) {

      const weakEmployee =
        await Employee.findOne()
          .sort({
            productivity: 1,
          });

      if (weakEmployee) {

        answer =
          `Weak employee is ${weakEmployee.name} with productivity ${weakEmployee.productivity}%.`;

      } else {

        answer =
          "No employee data found.";

      }

    }



    // ===== AVERAGE =====

    else if (
      text.includes("average") ||
      text.includes("performance")
    ) {

      const employees =
        await Employee.find();

      if (employees.length > 0) {

        const avg =
          employees.reduce(
            (sum, emp) =>
              sum + emp.productivity,
            0
          ) / employees.length;

        answer =
          `Average productivity is ${avg.toFixed(1)}%.`;

      } else {

        answer =
          "No employee data available.";

      }

    }



    // ===== FORECAST =====

    else if (
      text.includes("forecast") ||
      text.includes("future")
    ) {

      const employees =
        await Employee.find();

      if (employees.length > 0) {

        const avg =
          employees.reduce(
            (sum, emp) =>
              sum + emp.productivity,
            0
          ) / employees.length;

        const forecast =
          (avg * 1.05).toFixed(1);

        answer =
          `Forecast productivity is ${forecast}%.`;

      } else {

        answer =
          "No forecast data available.";

      }

    }



    // ===== TOTAL STAFF =====

    else if (
      text.includes("staff") ||
      text.includes("employees") ||
      text.includes("total")
    ) {

      const totalEmployees =
        await Employee.countDocuments();

      answer =
        `Total employees are ${totalEmployees}`;

    }



    // ===== DEFAULT =====

    else {

      answer =
        `MindMesh AI processed your query: ${prompt}`;

    }


    console.log(
      "AI Response:",
      answer
    );

    res.json({
      answer,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      answer: "AI server error.",
    });

  }

});


// ================= SERVER =================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `🚀 Server running on port ${PORT}`
  );

});