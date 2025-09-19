const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserSocialMedia = sequelize.define('UserSocialMedia', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userProfileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'UserProfiles',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    platform: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['instagram', 'tiktok']]
      }
    },
    handle: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'The @username for the platform'
    },
    profileUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Direct link to profile page'
    },
    followers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Follower count to show businesses'
    },
    lastUpdated: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When the follower count was last pulled'
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Token needed for API calls'
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Refresh token for renewing access'
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When the current access token expires'
    }
  }, {
    tableName: 'user_social_media',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [
      {
        fields: ['userProfileId']
      },
      {
        fields: ['platform']
      },
      {
        unique: true,
        fields: ['userProfileId', 'platform'],
        name: 'unique_user_platform'
      }
    ]
  });

  // Define associations
  UserSocialMedia.associate = (models) => {
    UserSocialMedia.belongsTo(models.UserProfile, {
      foreignKey: 'userProfileId',
      as: 'userProfile',
      onDelete: 'CASCADE'
    });
  };

  return UserSocialMedia;
};
