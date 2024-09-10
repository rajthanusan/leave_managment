const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "leavetwo",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to the database.");
});

const encryptPassword = async (password) => {
  // Hash the password using bcrypt
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
  // Compare the password with the hashed password
  return await bcrypt.compare(password, hashedPassword);
};

app.post("/api/register", async (req, res) => {
  const { username, password, birthday, joindate, name } = req.body;

  if (!username || !password || !birthday || !joindate || !name) {
    return res.status(400).send("All fields are required");
  }

  try {
    // Hash the password
    const hashedPassword = await encryptPassword(password);

    // Insert user into the database
    db.query(
      "INSERT INTO user (username, password, birthday, joindate, name) VALUES (?, ?, ?, ?, ?)",
      [username, hashedPassword, birthday, joindate, name],
      (err, result) => {
        if (err) {
          console.error("Registration failed:", err);
          return res.status(500).send("Registration failed");
        }
        res.status(201).send({ message: "Registration successful" });
      }
    );
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).send("Server error");
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    db.query(
      "SELECT * FROM user WHERE username = ?",
      [username],
      async (err, result) => {
        if (err) {
          console.error("Login failed:", err);
          return res
            .status(500)
            .json({ message: "Login failed due to server error" });
        }

        if (result.length > 0) {
          const user = result[0];
          // Use bcrypt to compare the plaintext password with the hashed password
          const match = await comparePassword(password, user.password);

          if (match) {
            // Successful login
            res.json({
              message: "Login successful",
              userId: user.id,
              userData: {
                username: user.username,
                birthday: user.birthday,
                joindate: user.joindate,
                name: user.name,
              },
            });
          } else {
            // Invalid password
            res.status(401).json({ message: "Invalid username or password" });
          }
        } else {
          // No user found
          res.status(401).json({ message: "Invalid username or password" });
        }
      }
    );
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Login failed due to server error" });
  }
});

app.post("/api/Leaveapply", (req, res) => {
  const { leave, startdate, enddate, comments, username, status } = req.body;

  const query =
    "INSERT INTO leave_applications (leave_type, start_date, end_date, comments, username, status) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [leave, startdate, enddate, comments, username, status],
    (err, result) => {
      if (err) {
        return res.status(500).send("Error saving leave application");
      }
      res.status(201).send("Leave application saved successfully");
    }
  );
});
app.get('/api/LeaveView/', (req, res) => {
  db.query('SELECT * FROM leave_applications', (err, result) => {
      if (err) {
          console.error('Failed to load leave applications:', err);
          return res.status(500).json({ error: 'Failed to load leave applications' });
      }
      // Check if there are results
      if (result.length === 0) {
          return res.status(404).json({ message: 'No leave applications found' });
      }
      res.status(200).json({ data: result });
  });
});
// Route to get leave types


app.put('/api/LeaveView/:id', (req, res) => {
  console.log("Request received:", req.params, req.body); // Add this line for debugging
  const { id } = req.params;
  const { leave_type, start_date, end_date, comments, username, status } = req.body;

  const query = `
      UPDATE leave_applications 
      SET leave_type = ?, start_date = ?, end_date = ?, comments = ?, username = ?, status = ? 
      WHERE id = ?
  `;

  db.query(query, [leave_type, start_date, end_date, comments, username, status, id], (err, result) => {
      if (err) {
          //console.error('Failed to update leave application:', err);
          return res.status(500).send('Failed to update leave application');
      }
      if (result.affectedRows === 0) {
          return res.status(404).send('Leave application not found');
      }
      res.send({ message: 'Leave application updated successfully' });
  });
});


// Endpoint for deleting a student
app.delete('/api/LeaveView/delete/:id', (req, res) => {
  const { id } = req.params;

  db.query(
      'DELETE FROM leave_applications WHERE id = ?',
      [id],
      (err, result) => {
          if (err) {
              console.error('Failed to delete employee:', err);
              return res.status(500).send('Failed to delete employee');
          }
          res.send({ message: 'employee deleted successfully' });
      }
  );
});

app.get('/api/User', (req, res) => {
  const query = "SELECT * FROM user";
  db.query(query, (err, results) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.send(results);
  });
});

app.delete('/api/User/delete/:id', (req, res) => {
  const { id } = req.params;

  db.query(
      'DELETE FROM user WHERE id = ?',
      [id],
      (err, result) => {
          if (err) {
              console.error('Failed to delete employee:', err);
              return res.status(500).send('Failed to delete employee');
          }
          res.send({ message: 'employee deleted successfully' });
      }
  );
});


// Create a new leave type
app.post("/api/Leavetype", (req, res) => {
  const { leave, days } = req.body;
  const query = "INSERT INTO leave_types (leave_type_name, days) VALUES (?, ?)";
  db.query(query, [leave, days], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to add leave type" });
    }
    res.status(201).json({ message: "Leave type added successfully", data: result });
  });
});

// Get all leave types
app.get('/api/Leavetype', (req, res) => {
  db.query('SELECT * FROM leave_types', (err, result) => {
      if (err) {
          console.error('Failed to load leave types:', err);
          return res.status(500).json({ error: 'Failed to load leave types' });
      }
      // Check if there are results
      if (result.length === 0) {
          return res.status(404).json({ message: 'No leave types found' });
      }
      res.status(200).json(result); // Assuming result is an array of leave types
  });
});

// Get leave type by ID


// Update a leave type
app.put('/api/Leavetype/:id', (req, res) => {
  console.log("Request received:", req.params, req.body);  // Debug the request

  const { id } = req.params;
  const { leave_type_name, days } = req.body;  // Ensure these match the request body

  const query = `
      UPDATE leave_types 
      SET leave_type_name = ?, days = ?
      WHERE id = ?
  `;

  db.query(query, [leave_type_name, days, id], (err, result) => {
      if (err) {
          console.error('Failed to update leave application:', err);  // Log detailed error
          return res.status(500).send('Failed to update leave application');
      }
      if (result.affectedRows === 0) {
          return res.status(404).send('Leave application not found');
      }
      res.send({ message: 'Leave application updated successfully' });
  });
});


// Delete a leave type
app.delete('/api/Leavetype/:id', (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM leave_types WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete leave type" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Leave type not found" });
    }
    res.json({ message: "Leave type deleted successfully" });
  });
});

app.get('/api/LeaveApply/', (req, res) => {
  db.query('SELECT * FROM leave_applications', (err, result) => {
      if (err) {
          console.error('Failed to load leave applications:', err);
          return res.status(500).json({ error: 'Failed to load leave applications' });
      }
      // Check if there are results
      if (result.length === 0) {
          return res.status(404).json({ message: 'No leave applications found' });
      }
      res.status(200).json({ data: result });
  });
});

app.put('/api/LeaveApply/:id/:action', (req, res) => {
  const { id, action } = req.params;
  const validActions = ['approved', 'rejected'];

  console.log(`Received request to ${action} leave request with ID ${id}`);

  if (!validActions.includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
  }

  db.query(
      'UPDATE leave_applications SET status = ? WHERE id = ?',
      [action, id],
      (error, results) => {
          if (error) {
              console.error('Database update failed:', error); // Log error for debugging
              return res.status(500).json({ error: 'Database update failed' });
          }
          console.log('Query results:', results); // Log results for debugging
          if (results.affectedRows === 0) {
              return res.status(404).json({ error: 'Leave request not found' });
          }
          res.json({ message: 'Leave request updated successfully' });
      }
  );
});



const port = 8085;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
