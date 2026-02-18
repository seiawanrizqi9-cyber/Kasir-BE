import { Response, NextFunction } from "express";
import { StatisticsService } from "#/services/statistics.service";
import { ResponseUtil } from "#/utils/response";
import { AuthRequest } from "#/types";

export class StatisticsController {
  private statisticsService: StatisticsService;

  constructor() {
    this.statisticsService = new StatisticsService();
  }

  /**
   * @swagger
   * /api/statistics/dashboard:
   *   get:
   *     tags: [Statistics]
   *     summary: Get dashboard statistics (today, this week, this month)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Dashboard statistics
   */
  getDashboard = async (
    _req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const stats = await this.statisticsService.getDashboardStats();
      return ResponseUtil.success(res, "Dashboard statistics retrieved", stats);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/statistics/sales:
   *   get:
   *     tags: [Statistics]
   *     summary: Get sales report for date range
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: startDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: endDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *     responses:
   *       200:
   *         description: Sales report
   */
  getSalesReport = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return ResponseUtil.error(
          res,
          "startDate and endDate are required",
          null,
          400,
        );
      }
      const report = await this.statisticsService.getSalesReport(
        startDate as string,
        endDate as string,
      );
      return ResponseUtil.success(res, "Sales report retrieved", report);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/statistics/products:
   *   get:
   *     tags: [Statistics]
   *     summary: Get best selling products
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: startDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: endDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *     responses:
   *       200:
   *         description: Product performance data
   */
  getProductPerformance = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { startDate, endDate, limit } = req.query;
      if (!startDate || !endDate) {
        return ResponseUtil.error(
          res,
          "startDate and endDate are required",
          null,
          400,
        );
      }
      const performance = await this.statisticsService.getProductPerformance(
        startDate as string,
        endDate as string,
        limit ? parseInt(limit as string) : undefined,
      );
      return ResponseUtil.success(
        res,
        "Product performance retrieved",
        performance,
      );
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/statistics/revenue:
   *   get:
   *     tags: [Statistics]
   *     summary: Get revenue analysis
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: startDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: endDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *     responses:
   *       200:
   *         description: Revenue analysis data
   */
  getRevenueAnalysis = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return ResponseUtil.error(
          res,
          "startDate and endDate are required",
          null,
          400,
        );
      }
      const analysis = await this.statisticsService.getRevenueAnalysis(
        startDate as string,
        endDate as string,
      );
      return ResponseUtil.success(res, "Revenue analysis retrieved", analysis);
    } catch (error) {
      return next(error);
    }
  };
}
