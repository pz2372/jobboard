const UserAccount = require('../models/userAccountModel');

// Update user settings
exports.updateUserSettings = async (req, res) => {
  const { userId } = req.params;
  const { location, personalInfo, profileVisibility, notifications } = req.body;

  try {
    const user = await UserAccount.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({
      location,
      personalInfo,
      profileVisibility,
      notifications
    });

    res.status(200).json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
