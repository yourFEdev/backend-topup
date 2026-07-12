import dotenv from "dotenv";
dotenv.config();

import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import app from "./app";

const PORT = process.env.PORT || 5000;

const start = async () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
