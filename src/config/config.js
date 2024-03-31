import dotenv from "dotenv";

import { Command } from "commander";

const program = new Command();

program.option("--mode <mode>", "Modo de trabajo", "production");
program.parse();

const { mode } = program.opts();

dotenv.config({
    path: mode === "development" ? "./.env.development" : "./.env.production",
});

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
};
