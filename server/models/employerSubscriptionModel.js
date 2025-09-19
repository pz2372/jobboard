const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EmployerSubscription = sequelize.define('EmployerSubscription', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    employerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'EmployerAccounts',
        key: 'id'
      }
    },
    planType: {
      type: DataTypes.ENUM('basic', 'impact', 'accelerate', 'corporate'),
      allowNull: false,
      defaultValue: 'basic'
    },
    billingCycle: {
      type: DataTypes.ENUM('monthly', 'annual'),
      allowNull: false,
      defaultValue: 'monthly'
    },
    status: {
      type: DataTypes.ENUM('active', 'cancelled', 'past_due', 'trialing', 'incomplete'),
      allowNull: false,
      defaultValue: 'active'
    },
    currentPeriodStart: {
      type: DataTypes.DATE,
      allowNull: false
    },
    currentPeriodEnd: {
      type: DataTypes.DATE,
      allowNull: false
    },
    cancelAtPeriodEnd: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    stripeSubscriptionId: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true
    },
    stripeCustomerId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    stripePriceId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD'
    },
    trialEnd: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // Job posting counters
    jobPostsThisMonth: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    lastJobPostResetDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'employer_subscriptions',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [
      {
        fields: ['employerId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['stripeSubscriptionId']
      }
    ]
  });

  // Define associations
  EmployerSubscription.associate = (models) => {
    EmployerSubscription.belongsTo(models.EmployerAccount, {
      foreignKey: 'employerId',
      as: 'employer'
    });
  };

  return EmployerSubscription;
};
