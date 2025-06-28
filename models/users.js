import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import dbInstance from "../db/db.js";

const { sequelize } = dbInstance;

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subscription: {
    type: DataTypes.ENUM("starter", "pro", "business"),
    defaultValue: "starter",
  },
  token: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  avatarURL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "users",
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }
});

User.prototype.isValidPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

export default User;
