import { prisma } from '../lib/db';
import { recordSchema } from '../lib/validations';

export class RecordService {
  static async getRecords(params: { type?: string; category?: string; search?: string; page?: number; limit?: number }) {
    const { type, category, search } = params;
    
    // Pagination defaults
    const page = params.page ? Math.max(1, params.page) : 1;
    const limit = params.limit ? Math.max(1, params.limit) : 10;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (type) where.type = type;
    if (category) where.category = category;
    
    // Basic search functionality for Search Enhancements requirement
    if (search) {
      where.OR = [
        { notes: { contains: search } },
        { category: { contains: search } }
      ];
    }

    const [total, records] = await Promise.all([
      prisma.record.count({ where }),
      prisma.record.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      })
    ]);

    return { total, page, limit, totalPages: Math.ceil(total / limit), records };
  }

  static async createRecord(data: any) {
    const parsedData = recordSchema.parse(data);
    return await prisma.record.create({ data: parsedData });
  }

  static async updateRecord(id: string, data: any) {
    const parsedData = recordSchema.partial().parse(data);
    return await prisma.record.update({
      where: { id },
      data: parsedData,
    });
  }

  static async deleteRecord(id: string) {
    // Soft Delete Implementation - records are not destroyed from disk
    return await prisma.record.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
