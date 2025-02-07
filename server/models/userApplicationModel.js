const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UserApplication = sequelize.define(
    "UserApplication",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      applicationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "applications", 
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", 
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      employerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", 
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      basicFieldAnswers: {
        type: DataTypes.JSONB, 
        allowNull: false,
      },
      questionAnswers: {
        type: DataTypes.JSONB, 
        allowNull: false,
      },
    },
    {
      tableName: "user_applications",
      timestamps: true,
    }
  );

  UserApplication.associate = (models) => {
    UserApplication.belongsTo(models.Application, {
      foreignKey: "applicationId",
      as: "application",
    });

    UserApplication.belongsTo(models.UserAccount, {
      foreignKey: "userId",
      as: "user",
    });

    UserApplication.belongsTo(models.Job, {
      foreignKey: "jobId",
      as: "job",
    });
  };

  return UserApplication;
};
