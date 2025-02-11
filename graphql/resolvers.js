const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");

const JWT_SECRET = "mysecretkey"; // Hardcoded secret key

const resolvers = {
  Query: {
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error("User not found");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
    },
    getAllEmployees: async () => await Employee.find(),
    searchEmployeeByEid: async (_, { eid }) => await Employee.findById(eid),
    searchEmployeeByDesignationOrDepartment: async (_, { designation, department }) => {
        const filter = {};
        if (designation) filter.designation = designation;
        if (department) filter.department = department;
        return await Employee.find(filter);
    },
  },
  Mutation: {
    signup: async (_, { username, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      return "User registered successfully";
    },
    addEmployee: async (_, { first_name, last_name, email, gender, designation, salary, date_of_joining, department, employee_photo }) => {
      const newEmployee = new Employee({ first_name, last_name, email, gender, designation, salary, date_of_joining, department, employee_photo });
      return await newEmployee.save();
    },
    updateEmployee: async (_, { eid, ...updates }) => {
      return await Employee.findByIdAndUpdate(eid, updates, { new: true });
    },
    deleteEmployee: async (_, { eid }) => {
      await Employee.findByIdAndDelete(eid);
      return "Employee deleted successfully";
    },
  },
};

module.exports = resolvers;
