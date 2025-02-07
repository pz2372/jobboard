const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

module.exports = (sequelize) => {
  AppliedJobs = sequelize.define(
    "AppliedJobs",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      applicationId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "AppliedJobs",
      tableName: "applied_jobs",
      timestamps: true,
    }
  );

  AppliedJobs.associate = (models) => {
    if (models.Job) {
      AppliedJobs.belongsTo(models.Job, {
        foreignKey: "jobId",
        as: "job",
      });
    } else {
      console.warn("models.Job is not defined.");
    }
  
    if (models.UserAccount) {
      AppliedJobs.belongsTo(models.UserAccount, {
        foreignKey: "userId",
        as: "user",
      });
    } else {
      console.warn("models.UserAccount is not defined.");
    }
  };

  return AppliedJobs;
};
