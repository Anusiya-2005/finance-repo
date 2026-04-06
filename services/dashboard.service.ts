import { prisma } from '../lib/db';

export class DashboardService {
  static async getSummary(userId: string) {
    // Ensuring we only calculate active records (not soft-deleted)
    const records = await prisma.record.findMany({
      where: { deletedAt: null, userId }
    });

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals: Record<string, number> = {};

    records.forEach(record => {
      if (record.type === 'INCOME') totalIncome += record.amount;
      else if (record.type === 'EXPENSE') totalExpense += record.amount;

      if (!categoryTotals[record.category]) categoryTotals[record.category] = 0;
      categoryTotals[record.category] += record.amount;
    });

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      categoryTotals
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
