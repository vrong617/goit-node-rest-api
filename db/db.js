import {Sequelize} from "sequelize";
import { config } from 'dotenv';
config();
const { DB_NAME, DB_HOST, DB_USER, DB_PORT, DB_PASSWORD } = process.env;

class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }

        this.sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
            host: DB_HOST,
            port: DB_PORT,
            dialect: "postgres",
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: true
                }
            },
            logging: false,
        });

        this._connect();
        Database.instance = this;
        Object.freeze(this);
    }

    async _connect() {
        try {
            await this.sequelize.authenticate();
            await this.sequelize.sync({ alter: true });
            console.log("Database connection successful");
        } catch (error) {
            console.error("Database connection error:", error.message);
            process.exit(1);
        }
    }
}

const dbInstance = new Database();
export default dbInstance;
export const sequelize = dbInstance.sequelize;
