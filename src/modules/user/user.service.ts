import { prisma } from "#/config/database";
import { ErrorHandler } from "#/middlewares/error.middleware";

export class UserService {
  async joinStoreByCode(userId: string, code: string) {
    const store = await prisma.store.findUnique({
      where: { joinCode: code },
    });

    if (!store) {
      throw new ErrorHandler("Invalid join code", 404);
    }

    return prisma.user.update({
      where: { id: userId },
      data: { storeId: store.id },
    });
  }

  async getMyStoreUsers(storeId: string) {
    return prisma.user.findMany({
      where: { storeId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}