const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

module.exports = (sequelize) => {
  const UserAccount = sequelize.define(
    "UserAccount",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 50],
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 50],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 100],
        },
      },
    },
    {
      tableName: "users",
      timestamps: true,
      paranoid: true,
    }
  );

  UserAccount.associate = (models) => {
    if (models.UserProfile) {
      UserAccount.hasOne(models.UserProfile, {
        foreignKey: "userId",
        as: "profile",
        onDelete: "CASCADE",
      });
    } else {
      console.warn("models.UserProfile is not defined.");
    }

    if (models.SavedJobs) {
      UserAccount.hasMany(models.SavedJobs, {
        foreignKey: "userId",
        as: "savedJobs",
      });
    } else {
      console.warn("models.SavedJobs is not defined.");
    }

    if (models.AppliedJobs) {
      UserAccount.hasMany(models.AppliedJobs, {
        foreignKey: "jobId",
        as: "appliedJobs",
      });
    } else {
      console.warn("models.AppliedJobs is not defined.");
    }
    UserAccount.hasMany(models.UserApplication, {
      foreignKey: "applicationId",
      as: "userApplication",
    });
  };

  return UserAccount;
}
