import { Box, CircularProgress, Typography } from '@mui/material';

export interface LoadingComponentProps {
  message?: string;
}

export function LoadingComponent({ message = 'Loading...' }: LoadingComponentProps) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
      <CircularProgress />
      <Typography variant="h3" sx={{ ml: 2 }}>
        {message}
      </Typography>
    </Box>
  );
}
