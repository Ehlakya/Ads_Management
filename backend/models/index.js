const User = require('./User');
const Ad = require('./Ad');
const Quotation = require('./Quotation');
const Sale = require('./Sale');

// Define associations
User.hasMany(Ad, { foreignKey: 'created_by' });
Ad.belongsTo(User, { foreignKey: 'created_by' });

Ad.hasMany(Quotation, { foreignKey: 'ad_id', onDelete: 'CASCADE' });
Quotation.belongsTo(Ad, { foreignKey: 'ad_id' });

Ad.hasMany(Sale, { foreignKey: 'ad_id', onDelete: 'CASCADE' });
Sale.belongsTo(Ad, { foreignKey: 'ad_id' });

User.hasMany(Sale, { foreignKey: 'agent_id' });
Sale.belongsTo(User, { foreignKey: 'agent_id' });

module.exports = {
  User,
  Ad,
  Quotation,
  Sale,
};
