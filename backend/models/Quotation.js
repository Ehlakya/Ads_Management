const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Quotation = sequelize.define('Quotation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ad_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'quotations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Quotation;
