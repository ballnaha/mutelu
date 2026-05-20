"use client";

import { Button } from "@mui/material";
import { ExportSquare } from "iconsax-react";
import { openFacebookShare } from "@/lib/facebook-share";

type FacebookShareButtonProps = {
  path: string;
};

export function FacebookShareButton({ path }: FacebookShareButtonProps) {
  return (
    <Button
      onClick={() => openFacebookShare(path)}
      startIcon={<ExportSquare size={20} color="currentColor" variant="Bold" />}
      sx={{
        bgcolor: "#1877F2",
        color: "#fff",
        border: "2px solid #2D2520",
        borderRadius: "14px",
        boxShadow: "4px 4px 0 #2D2520",
        fontFamily: "var(--font-prompt), sans-serif",
        fontWeight: 900,
        px: 3,
        py: 1.15,
        "&:hover": {
          bgcolor: "#166FE5",
          transform: "translate(2px, 2px)",
          boxShadow: "2px 2px 0 #2D2520",
        },
      }}
    >
      แชร์ไป Facebook
    </Button>
  );
}
