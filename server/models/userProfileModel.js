const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

module.exports = (sequelize) => {
  const UserProfile = sequelize.define(
    "UserProfile",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      currentPosition: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^[0-9+()-\s]*$/,
        },
      },
      education: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      extracurriculars: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      clubs: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      hobbies: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      awards: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      work: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      volunteer: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      portfolioVideos: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
        comment: 'Array of video URLs. Max 4 videos.'
      },
    },
    {
      tableName: "user_profiles",
      timestamps: true,
    }
  );

  UserProfile.associate = (models) => {
    UserProfile.belongsTo(models.UserAccount, {
      foreignKey: "userId",
      as: "user",
    });
    
    UserProfile.hasMany(models.UserSocialMedia, {
      foreignKey: "userProfileId",
      as: "socialMedia",
      onDelete: 'CASCADE'
    });
  };

return UserProfile;
}
