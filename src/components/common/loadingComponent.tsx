import { Box, CircularProgress, Typography } from '@mui/material';

export interface LoadingComponentProps {
  message?: string;
}

export function LoadingComponent({ message = 'Loading...' }: LoadingComponentProps) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        mt: 4,
        px: 2,
      }}
    >
      <Typography variant="h2" gutterBottom>
        {message}
      </Typography>
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress />
      </Box>
    </Box>
  );
}
