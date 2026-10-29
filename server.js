const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- CONNECT TO KKRISTU JAYANTI DATABASE ---
const DB_URI = 'mongodb://localhost:27017/kristuJayantiDB';

mongoose.connect(DB_URI)
    .then(() => console.log('Connected to kristuJayantiDB successfully!'))
    .catch(err => console.error('Connection error:', err));

// Student Schema matching the registration form fields
const studentSchema = new mongoose.Schema({
    studentName: String,
    studentPhone: String,
    email: { type: String, unique: true },
    password: String,
    parentName: String,
    parentPhone: String,
    course: String
});

const Student = mongoose.model('Student', studentSchema);

// Registration Route
app.post('/api/register', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.json({ success: true, message: "Registration Successful & Saved to kristuJayantiDB!" });
    } catch (err) {
        res.status(400).json({ success: false, message: "Error: Email might already exist." });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Student.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ success: false, message: "Email not found!" });
        }

        if (user.password !== password) {
            return res.status(401).json({ success: false, message: "Incorrect password!" });
        }

        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error." });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});