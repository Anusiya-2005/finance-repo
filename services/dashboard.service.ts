import { prisma } from '../lib/db';

export class DashboardService {
  static async getSummary(userId: string) {
    // Ensuring we only calculate active records (not soft-deleted)
    const records = await prisma.record.findMany({
      where: { deletedAt: null, userId },
      orderBy: { date: 'asc' }
    });

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals: Record<string, number> = {};
    const trendsMap: Record<string, { income: number; expense: number; netBalance: number }> = {};

    records.forEach(record => {
      if (record.type === 'INCOME') totalIncome += record.amount;
      else if (record.type === 'EXPENSE') totalExpense += record.amount;

      if (!categoryTotals[record.category]) categoryTotals[record.category] = 0;
      categoryTotals[record.category] += record.amount;
      
      const monthKey = record.date.toISOString().substring(0, 7); // YYYY-MM
      if (!trendsMap[monthKey]) {
        trendsMap[monthKey] = { income: 0, expense: 0, netBalance: 0 };
      }
      
      if (record.type === 'INCOME') trendsMap[monthKey].income += record.amount;
      else if (record.type === 'EXPENSE') trendsMap[monthKey].expense += record.amount;
      
      trendsMap[monthKey].netBalance = trendsMap[monthKey].income - trendsMap[monthKey].expense;
    });
    
    // Convert trendsMap to a sorted array
    const monthlyTrends = Object.entries(trendsMap).map(([month, data]) => ({
      month,
      ...data
    }));

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      categoryTotals,
      monthlyTrends
    };
  }

  static async getRecent(userId: string) {
    return await prisma.record.findMany({
      where: { deletedAt: null, userId },
      orderBy: { date: 'desc' },
      take: 10
    });
  }
}
