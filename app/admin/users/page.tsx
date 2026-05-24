import React from "react";
import { Box, Typography } from "@mui/material";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserTable } from "./user-table";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await connection();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#111827", mb: 1 }}>
          จัดการสมาชิก
        </Typography>
        <Typography sx={{ color: "#6b7280" }}>
          รายชื่อผู้ใช้งานทั้งหมดที่เข้าสู่ระบบผ่าน Google
        </Typography>
      </Box>

      <UserTable users={users} />
    </Box>
  );
}
