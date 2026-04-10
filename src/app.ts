import express, { Application } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "#/config/swagger";
import { errorMiddleware } from "#/middlewares/error.middleware";

// Import routes
import categoryRoutes from "#/routes/category.routes";
import productRoutes from "#/routes/product.routes";

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "OK", message: "Kasir API is running" });
});

// API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Kasir API Documentation",
  }),
);

// API Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route tidak ditemukan",
  });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

export default app;
