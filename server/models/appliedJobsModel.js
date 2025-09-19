const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const AppliedJobs = sequelize.define(
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
      tableName: "user_applications", // Specify the correct table name
      timestamps: true,
      paranoid: true,
    }
  );

  AppliedJobs.associate = (models) => {
    if (models.Job) {
      AppliedJobs.belongsTo(models.Job, {
        foreignKey: "jobId",
        as: "job",
      });
    }

    if (models.UserAccount) {
      AppliedJobs.belongsTo(models.UserAccount, {
        foreignKey: "userId",
        as: "user",
      });
    }
  };

  return AppliedJobs;
};