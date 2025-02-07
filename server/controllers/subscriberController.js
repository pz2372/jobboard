const { Subscriber } = require("../models");

const addSubscriber = async (req, res) => {
  const { email } = req.body;

  try {
    const existingSubscriber = await Subscriber.findOne({ where: { email } });
    if (existingSubscriber) {
      return res.status(409).json({ message: "Email is already subscribed" });
    }

    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    const subscribedAt = `${month}-${day}-${year}`;

    const newSubscriber = await Subscriber.create({ email, subscribedAt });
    res
      .status(201)
      .json({ message: "Subscription successful", subscriber: newSubscriber });
  } catch (error) {
    console.error("Error adding subscriber:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addSubscriber
};
