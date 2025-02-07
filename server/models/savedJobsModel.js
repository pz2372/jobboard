const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

module.exports = (sequelize) => {
const SavedJobs = sequelize.define(
  "SavedJobs",
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
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      index: true,
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Jobs",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      index: true,
    },
  },
  {
    tableName: "saved_jobs",
    timestamps: true,
    paranoid: true,
  }
);

SavedJobs.associate = (models) => {
  if (models.Job) {
    SavedJobs.belongsTo(models.Job, {
      foreignKey: "jobId",
      as: "job",
    });
  } else {
    console.warn("models.Job is not defined.");
  }

  if (models.UserAccount) {
    SavedJobs.belongsTo(models.UserAccount, {
      foreignKey: "userId",
      as: "user",
    });
  } else {
    console.warn("models.UserAccount is not defined.");
  }
};

return SavedJobs;
}