import express from "express";
import cors from "cors";
import continentesRouter from "./routes/continentes";
import paisesRouter from "./routes/paises";
import cidadesRouter from "./routes/cidades";
import { errorHandler, notFound } from "./middlewares/errorHandler";

const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:5173" })); // URL do frontend Vite
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "GeoMundo API rodando 🌍" });
});

// Rotas
app.use("/api/continentes", continentesRouter);
app.use("/api/paises",      paisesRouter);
app.use("/api/cidades",     cidadesRouter);

// 404 e erro global
app.use(notFound);
app.use(errorHandler);

export default app;
