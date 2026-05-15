import { Box, Container, Stack } from "@mui/material";

function SkeletonBox({ height }: { height: number | string }) {
  return (
    <Box
      sx={{
        height,
        borderRadius: "8px",
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
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", pt: { xs: 10, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 0.9fr" }, gap: 5, alignItems: "center", mb: 6 }}>
          <Stack spacing={2}>
            <SkeletonBox height={32} />
            <SkeletonBox height={84} />
            <SkeletonBox height={24} />
            <SkeletonBox height={24} />
          </Stack>
          <SkeletonBox height={420} />
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 300px" }, gap: 5 }}>
          <Stack spacing={2}>
            <SkeletonBox height={120} />
            <SkeletonBox height={280} />
            <SkeletonBox height={320} />
          </Stack>
          <Stack spacing={2}>
            <SkeletonBox height={220} />
            <SkeletonBox height={180} />
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
