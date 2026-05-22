import { PrismaClient, type Prisma } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prismaLogs: Prisma.LogLevel[] =
  process.env.PRISMA_LOG_QUERIES === "true" ? ["query", "warn", "error"] : ["warn", "error"];

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: prismaLogs,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
