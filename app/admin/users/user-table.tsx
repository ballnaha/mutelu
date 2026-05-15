"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { More, Edit2, Trash } from "iconsax-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { updateUserRole, deleteUser } from "./actions";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  createdAt: Date;
};

export function UserTable({ users }: { users: User[] }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [editRoleOpen, setEditRoleOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openEditDialog = () => {
    if (selectedUser) {
      setSelectedRole(selectedUser.role);
      setEditRoleOpen(true);
    }
    handleMenuClose();
  };

  const openDeleteConfirm = () => {
    setDeleteConfirmOpen(true);
    handleMenuClose();
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    await updateUserRole(selectedUser.id, selectedRole);
    setIsSubmitting(false);
    setEditRoleOpen(false);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    await deleteUser(selectedUser.id);
    setIsSubmitting(false);
    setDeleteConfirmOpen(false);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.05)" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "#f9fafb" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: "#374151" }}>ผู้ใช้งาน</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#374151" }}>อีเมล</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#374151" }}>สิทธิ์</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#374151" }}>วันที่เข้าร่วม</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#374151", width: 80, textAlign: "center" }}>จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: "#6b7280" }}>
                  ยังไม่มีผู้ใช้งานในระบบ
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 }, "&:hover": { bgcolor: "#f9fafb" } }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar src={user.image || ""} sx={{ width: 40, height: 40 }}>
                        {user.name?.[0] || "U"}
                      </Avatar>
                      <Typography sx={{ fontWeight: 600, color: "#111827" }}>
                        {user.name || "ไม่มีชื่อ"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: "#4b5563" }}>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role === "admin" ? "ผู้ดูแลระบบ" : "สมาชิก"}
                      color={user.role === "admin" ? "primary" : "default"}
                      size="small"
                      sx={{ fontWeight: 600, borderRadius: "8px" }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "#4b5563" }}>
                    {format(new Date(user.createdAt), "dd MMM yyyy, HH:mm", { locale: th })}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                      <More size={20} color="currentColor" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        disableScrollLock
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{ "& .MuiPaper-root": { borderRadius: "12px", minWidth: 150, boxShadow: "0 10px 40px rgba(0,0,0,0.08)" } }}
      >
        <MenuItem onClick={openEditDialog} sx={{ gap: 1.5 }}>
          <Edit2 size={18} variant="Linear" color="currentColor" />
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>แก้ไขสิทธิ์</Typography>
        </MenuItem>
        <MenuItem onClick={openDeleteConfirm} sx={{ gap: 1.5, color: "error.main" }}>
          <Trash size={18} variant="Linear" color="currentColor" />
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>ลบผู้ใช้งาน</Typography>
        </MenuItem>
      </Menu>

      {/* Edit Role Dialog */}
      <Dialog open={editRoleOpen} onClose={() => !isSubmitting && setEditRoleOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>แก้ไขสิทธิ์ผู้ใช้งาน</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 1 }}>
            <Typography sx={{ mb: 2, color: "#4b5563" }}>
              ผู้ใช้งาน: <strong>{selectedUser?.name || selectedUser?.email}</strong>
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>ระดับสิทธิ์</InputLabel>
              <Select
                label="ระดับสิทธิ์"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <MenuItem value="user">สมาชิกทั่วไป (User)</MenuItem>
                <MenuItem value="admin">ผู้ดูแลระบบ (Admin)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setEditRoleOpen(false)} disabled={isSubmitting} color="inherit">
            ยกเลิก
          </Button>
          <Button onClick={handleUpdateRole} disabled={isSubmitting} variant="contained" disableElevation>
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteConfirmOpen} onClose={() => !isSubmitting && setDeleteConfirmOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700, color: "error.main" }}>ยืนยันการลบผู้ใช้งาน</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#4b5563" }}>
            คุณต้องการลบผู้ใช้งาน <strong>{selectedUser?.name || selectedUser?.email}</strong> ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} disabled={isSubmitting} color="inherit">
            ยกเลิก
          </Button>
          <Button onClick={handleDeleteUser} disabled={isSubmitting} variant="contained" color="error" disableElevation>
            ลบข้อมูล
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
