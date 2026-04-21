import { BriefStatus, Prisma } from "@/generated/prisma";
import { briefRepository } from "@/repositories/brief.repository";
import type { UpdateBriefInput } from "@/types/brief";

export const briefService = {
  getAll() {
    return briefRepository.findAll();
  },

  getById(id: string) {
    return briefRepository.findById(id);
  },

  create(rawData: Record<string, unknown>) {
    return briefRepository.create(rawData as Prisma.InputJsonValue);
  },

  async update(id: string, input: UpdateBriefInput) {
    const existing = await briefRepository.findById(id);
    if (!existing) return null;

    return briefRepository.update(id, {
      ...(input.status && { status: input.status as BriefStatus }),
      ...(input.rawData && { rawData: input.rawData as Prisma.InputJsonValue }),
    });
  },

  async remove(id: string) {
    const existing = await briefRepository.findById(id);
    if (!existing) return false;
    await briefRepository.remove(id);
    return true;
  },
};
