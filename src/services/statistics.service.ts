import { TransactionRepository } from "@/repositories/transaction.repository";
import { DashboardStats, SalesReport, ProductPerformance } from "@/types";

export class StatisticsService {
  private transactionRepository: TransactionRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const now = new Date();

    // Today
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const todayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
    );

    // This week (Monday to Sunday)
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + mondayOffset,
    );
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59);

    // This month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const [todayStats, weekStats, monthStats] = await Promise.all([
      this.transactionRepository.getSalesStats(todayStart, todayEnd),
      this.transactionRepository.getSalesStats(weekStart, weekEnd),
      this.transactionRepository.getSalesStats(monthStart, monthEnd),
    ]);

    // For profit calculation, we'd need to query transaction items with product costs
    // For now, returning 0 for profit (can be enhanced)
    return {
      today: {
        sales: todayStats.totalSales,
        transactions: todayStats.totalTransactions,
        profit: 0, // TODO: Calculate actual profit
      },
      thisWeek: {
        sales: weekStats.totalSales,
        transactions: weekStats.totalTransactions,
        profit: 0,
      },
      thisMonth: {
        sales: monthStats.totalSales,
        transactions: monthStats.totalTransactions,
        profit: 0,
      },
    };
  }

  async getSalesReport(
    startDate: string,
    endDate: string,
  ): Promise<SalesReport[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const stats = await this.transactionRepository.getSalesStats(start, end);

    return [
      {
        date: `${startDate} to ${endDate}`,
        totalSales: stats.totalSales,
        totalTransactions: stats.totalTransactions,
        totalProfit: 0, // TODO: Calculate actual profit
      },
    ];
  }

  async getProductPerformance(
    startDate: string,
    endDate: string,
    limit: number = 10,
  ): Promise<ProductPerformance[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.transactionRepository.getProductPerformance(start, end, limit);
  }

  async getRevenueAnalysis(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const stats = await this.transactionRepository.getSalesStats(start, end);

    return {
      totalRevenue: stats.totalSales,
      totalTransactions: stats.totalTransactions,
      averageTransaction:
        stats.totalTransactions > 0
          ? stats.totalSales / stats.totalTransactions
          : 0,
      period: {
        start: startDate,
        end: endDate,
      },
    };
  }
}
