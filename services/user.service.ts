import { prisma } from '../lib/db';
import { userSchema } from '../lib/validations';

export class UserService {
  static async getAllUsers() {
    return await prisma.user.findMany({
      where: { deletedAt: null }
    });
  }

  static async createUser(data: any) {
    const parsedData = userSchema.parse(data);
    return await prisma.user.create({ data: parsedData });
  }

  static async updateUser(id: string, data: any) {
    const parsedData = userSchema.partial().parse(data);
    return await prisma.user.update({
      where: { id },
      data: parsedData,
    });
  }
}
