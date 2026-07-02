import express from "express";
import cors from "cors";
import authRoutes from './routes/authRoute'
import voucherRoute from './routes/voucherRoute'
import transactionRoute from './routes/transactionRoute'
import midtransRoute from './routes/midtransRoute'
import reportRoute from './routes/reportRoute'

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/voucher", voucherRoute);
app.use("/api/transaction",transactionRoute);
app.use("/api/midtrans",midtransRoute);
app.use("/api/report",reportRoute);

export default app;