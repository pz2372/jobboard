const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Job = sequelize.define(
    "Job",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
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
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      industry: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      requirements: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      skills: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      jobImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      benefits: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      schedule: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      applyWebsite: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      employerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "EmployerAccounts", 
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      payRate: {
        type: DataTypes.NUMERIC(10, 2), // PostgreSQL NUMERIC for exact decimal precision
        allowNull: false,
      },
      payFrequency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      search_vector: {
        type: DataTypes.VIRTUAL,
        get() {
          return null; // Virtual fields do not have a value in Sequelize
        },
      },
    },
    {
      tableName: "jobs",
      timestamps: true,
    }
  );

  Job.associate = (models) => {
    if (models.SavedJobs) {
      Job.hasMany(models.SavedJobs, {
        foreignKey: "jobId",
        as: "savedJobs",
      });
    } else {
      console.warn("models.SavedJobs is not defined.");
    }

    if (models.EmployerAccount) {
      Job.belongsTo(models.EmployerAccount, {
        foreignKey: "employerId",
        as: "employer",
      });
    } else {
      console.warn("models.EmployerAccount is not defined.");
    }

    if (models.Application) {
      Job.hasMany(models.Application, {
        foreignKey: "jobId",
        as: "applications",
      });
    }

    Job.hasMany(models.UserApplication, {
      foreignKey: "jobId",
      as: "userApplication",
    });
  };

  return Job;
};
