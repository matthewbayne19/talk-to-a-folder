import { Button, Typography, Box } from "@mui/material";

export default function SessionExpired() {
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" gutterBottom>
        Your session has timed out
      </Typography>
      <Typography variant="body1" gutterBottom>
        Please log in again to continue.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => window.location.href = "/"}
      >
        Go to Login
      </Button>
    </Box>
  );
}
