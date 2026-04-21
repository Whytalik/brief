import { BriefStatus, Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export const briefRepository = {
  findAll() {
    return prisma.brief.findMany({ orderBy: { createdAt: "desc" } });
  },

  findById(id: string) {
    return prisma.brief.findUnique({ where: { id } });
  },

  create(rawData: Prisma.InputJsonValue) {
    return prisma.brief.create({
      data: { rawData, status: BriefStatus.NEW },
    });
  },

  update(
    id: string,
    data: { status?: BriefStatus; rawData?: Prisma.InputJsonValue },
  ) {
    return prisma.brief.update({ where: { id }, data });
  },

  remove(id: string) {
    return prisma.brief.delete({ where: { id } });
  },
};
