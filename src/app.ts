import express from "express";
import cors from "cors";
import storeRoutes from "./modules/store/store.routes";
import categoryRoutes from "./modules/category/category.routes";
import productRoutes from "./modules/product/product.routes";
import transactionRoutes from "./modules/transaction/transaction.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(cors());
app.use(express.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/stores", storeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionRoutes);

// Error handler
app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});


export default app;
