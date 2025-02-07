const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Application = sequelize.define(
    "Application",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "jobs",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      employerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "employers",
          key: "id",
        },
      },
      questions: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      basicFields: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      documents: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
    },
    {
      tableName: "applications",
      timestamps: true,
    }
  );

  Application.associate = (models) => {
    Application.belongsTo(models.Job, {
      foreignKey: "jobId",
      as: "job",
    });

    Application.belongsTo(models.EmployerAccount, {
      foreignKey: "employerId",
      as: "employer",
    });

  };

  return Application;
};
