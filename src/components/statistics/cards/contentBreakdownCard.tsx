import { Box, Card, CardContent, Grid, LinearProgress, Typography } from '@mui/material';

/**
 * A single content category row rendered inside a {@link ContentBreakdownCard}.
 */
interface ContentBreakdownItem {
  /** Display label for the content category (e.g., `"Shows"`, `"Movies"`, `"Episodes"`). */
  label: string;
  /** Total count of items in this category. */
  total: number;
  /** Watch progress percentage (0–100) used as the linear progress value. */
  progress: number;
  /** MUI color variant for the progress bar. */
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

/**
 * Props for the {@link ContentBreakdownCard}.
 */
interface ContentBreakdownCardProps {
  /** Card heading. */
  title: string;
  /** Ordered list of content categories to display. */
  items: ContentBreakdownItem[];
}

/**
 * Card that shows a labelled progress breakdown for multiple content categories.
 *
 * Renders each `item` as a row containing a label, the total count, and a colored
 * `LinearProgress` bar representing the watch progress percentage.
 */
export function ContentBreakdownCard({ title, items }: ContentBreakdownCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12 }}>
            {items.map((item, index) => (
              <Box key={index} sx={{ mb: index < items.length - 1 ? 2 : 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body1">{item.label}</Typography>
                  <Typography variant="body1">{item.total}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={item.progress}
                  color={item.color}
                  sx={{ height: 8, borderRadius: 4, mb: index < items.length - 1 ? 2 : 0 }}
                />
              </Box>
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
