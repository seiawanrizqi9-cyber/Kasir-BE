import { Router } from "express";
import { StatisticsController } from "#/controllers/statistics.controller";
import { authenticate } from "#/middlewares/auth.middleware";

const router = Router();
const statisticsController = new StatisticsController();

/**
 * @swagger
 * tags:
 *   name: Statistics
 *   description: Statistics and reporting endpoints
 */

// All routes require authentication
router.use(authenticate);

router.get("/dashboard", statisticsController.getDashboard);
router.get("/sales", statisticsController.getSalesReport);
router.get("/products", statisticsController.getProductPerformance);
router.get("/revenue", statisticsController.getRevenueAnalysis);

export default router;
