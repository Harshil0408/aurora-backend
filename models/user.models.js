const Sequelize = require('sequelize');

module.exports = (database) => {
  const SellerUserModal = database.define(
    'users',
    {
      u_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      role: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '0 = user, 1 = seller, 2 = admin',
      },
      is_active: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '0 = inactive, 1 = active',
        defaultValue: 1,
      },
      is_verified: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '0 = not verified, 1 = verified',
        defaultValue: 0,
      },
      last_login_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updated_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
    },
    {
      tableName: 'users',
      timestamps: false,
    }
  );

  return SellerUserModal;
};
