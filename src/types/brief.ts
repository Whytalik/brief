import type { createBriefSchema, updateBriefSchema } from "@/schemas/brief";
import type { BriefStatus } from "../generated/prisma";
import type { z } from "zod";

export type { BriefStatus };

export interface Brief {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: BriefStatus;
  rawData: Record<string, unknown>;
}

export type BriefSummary = Pick<Brief, "id" | "createdAt" | "status">;

export type CreateBriefInput = z.infer<typeof createBriefSchema>;
export type UpdateBriefInput = z.infer<typeof updateBriefSchema>;
