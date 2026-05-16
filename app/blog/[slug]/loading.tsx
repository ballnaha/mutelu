import { Box, Container, Stack } from "@mui/material";

function SkeletonBox({ height, width = "100%", borderRadius = "16px" }: { height: number | string, width?: number | string, borderRadius?: string }) {
  return (
    <Box
      sx={{
        height,
        width,
        borderRadius,
        bgcolor: "#e2e8f0",
        animation: "pulse 1.4s ease-in-out infinite",
        "@keyframes pulse": {
          "0%, 100%": { opacity: 0.45 },
          "50%": { opacity: 1 },
        },
      }}
    />
  );
}

export default function Loading() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", pt: { xs: 12, md: 16 } }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: "center", mb: 2 }}>
            <SkeletonBox height={24} width={100} />
            <SkeletonBox height={24} width={120} />
          </Stack>
          <SkeletonBox height={160} width="90%" borderRadius="16px" />
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <SkeletonBox height={60} width="70%" />
          </Box>
        </Box>

        <SkeletonBox height={400} borderRadius="32px" />

        <Box sx={{ maxWidth: 720, mx: "auto", mt: 8 }}>
          <Stack spacing={6}>
            <SkeletonBox height={100} borderRadius="20px" />
            <Stack spacing={3}>
              <SkeletonBox height={40} width="60%" />
              <SkeletonBox height={24} />
              <SkeletonBox height={24} />
              <SkeletonBox height={24} width="80%" />
            </Stack>
            <SkeletonBox height={300} borderRadius="24px" />
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
