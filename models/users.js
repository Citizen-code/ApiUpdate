const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    ram: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    processor: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    manufacturer: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    video_card: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    video_processor: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    video_ram: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    driver_version: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hard_drive: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    size: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "users_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
