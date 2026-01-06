import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// UI estática
app.use(express.static(path.join(__dirname, "public")));

// Mock: dados externos do lojista (desconto/datas/plano)
app.get("/api/merchant/:merchantId", (req, res) => {
  const { merchantId } = req.params;

  // Exemplos - troque por integração real depois
  const payload = {
    merchantId,
    activationDate: "2026-01-15",
    minimumMonthlyVolume: 25000,
    discountApplied: { type: "MDR_20pct", durationDays: 90, active: true },
    status: "ACTIVE"
  };

  res.json(payload);
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`App listening on ${port}`));
