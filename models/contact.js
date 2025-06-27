import {DataTypes} from "sequelize";
import dbInstance from "../db/db.js";

const {sequelize} = dbInstance;

const Contact = sequelize.define("Contact", {
    name: {
        type: DataTypes.STRING, allowNull: false,
    }, email: {
        type: DataTypes.STRING, allowNull: false,
    }, phone: {
        type: DataTypes.STRING, allowNull: false,
    }, favorite: {
        type: DataTypes.BOOLEAN, defaultValue: false,
    },
}, {
    tableName: "contacts", timestamps: false,
});

export default Contact;