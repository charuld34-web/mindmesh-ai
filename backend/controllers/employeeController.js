const Employee = require(
  "../models/Employee"
);

// GET ALL EMPLOYEES
const getEmployees = async (
  req,
  res
) => {
  try {
    const employees =
      await Employee.find();

    res.json(employees);
  } catch (error) {
    res.status(500).json({
      message:
        "Error fetching employees"
    });
  }
};

// ADD EMPLOYEE
const addEmployee = async (
  req,
  res
) => {
  try {
    const {
      name,
      role,
      productivity
    } = req.body;

    const newEmployee =
      new Employee({
        name,
        role,
        productivity
      });

    await newEmployee.save();

    res.status(201).json(
      newEmployee
    );
  } catch (error) {
    res.status(500).json({
      message:
        "Error adding employee"
    });
  }
};

module.exports = {
  getEmployees,
  addEmployee
};