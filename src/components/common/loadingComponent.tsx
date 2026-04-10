import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Props for the {@link LoadingComponent}.
 */
export interface LoadingComponentProps {
  /** Message displayed beside the spinner. Defaults to `"Loading..."`. */
  message?: string;
}

/**
 * Centered loading spinner with an optional message.
 *
 * Renders a `CircularProgress` and a `h3` label inside a full-height flex
 * container. Intended as a page-level placeholder while async data is being
 * fetched.
 */
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
