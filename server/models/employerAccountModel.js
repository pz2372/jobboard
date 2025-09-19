const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

module.exports = (sequelize) => {
  const EmployerAccount = sequelize.define(
    "EmployerAccount",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      EIN: {
        type: DataTypes.BIGINT,
        unique: true,
        allowNull: true,
        validate: {
          isInt: true,
        },
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "employers",
      timestamps: true,
      paranoid: true,
    }
  );

  EmployerAccount.associate = (models) => {
    EmployerAccount.hasMany(models.Job, {
      foreignKey: "employerId",
      as: "jobs",
    });
    
    EmployerAccount.hasOne(models.EmployerSubscription, {
      foreignKey: "employerId",
      as: "subscription",
    });
  };

  return EmployerAccount;
};
