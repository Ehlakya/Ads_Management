const bcrypt = require('bcryptjs');
const { query } = require('../config/db');

// @desc    Create a new Admin (Super Admin only)
// @route   POST /api/users/create-admin
// @access  Private/SuperAdmin
exports.createAdmin = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const userExists = await query('SELECT * FROM users WHERE username = $1', [username]);

    if (userExists.rows.length > 0) {
      res.status(400);
      throw new Error('Username already taken');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await query(
      'INSERT INTO users (name, username, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, username, role',
      [name, username, hashedPassword, 'admin']
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Admin account created successfully',
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new Agent (Super Admin & Admin only)
// @route   POST /api/users/create-agent
// @access  Private/SuperAdmin, Admin
exports.createAgent = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const userExists = await query('SELECT * FROM users WHERE username = $1', [username]);

    if (userExists.rows.length > 0) {
      res.status(400);
      throw new Error('Username already taken');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await query(
      'INSERT INTO users (name, username, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, username, role',
      [name, username, hashedPassword, 'agent']
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Agent account created successfully',
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({ success: false, message: error.message });
  }
};

// @desc    Get users (Super Admin sees all, Admin sees only agents)
// @route   GET /api/users
// @access  Private/SuperAdmin, Admin
exports.getUsers = async (req, res) => {
  try {
    let result;
    if (req.user.role === 'superadmin') {
      result = await query('SELECT id, name, username, role, created_at FROM users ORDER BY created_at DESC');
    } else if (req.user.role === 'admin') {
      result = await query('SELECT id, name, username, role, created_at FROM users WHERE role = $1 ORDER BY created_at DESC', ['agent']);
    } else {
      res.status(403);
      throw new Error('Not authorized to view users');
    }

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({ success: false, message: error.message });
  }
};
