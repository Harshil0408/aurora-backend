const Sequelize = require('sequelize');

module.exports = (database) => {
  const UserProfile = database.define(
    'user_profile',
    {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,

        references: {
          model: 'users',
          key: 'u_id',
        },

        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      first_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: null,
      },
      last_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: null,
      },
      phone: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      date_of_birth: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
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
      tableName: 'user_profile',
      timestamps: false,
    }
  );

  return UserProfile;
};
