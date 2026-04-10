import { ReactNode } from 'react';

import { Card, CardContent, Typography } from '@mui/material';

/**
 * Props for the {@link ContentSummaryCard}.
 */
interface ContentSummaryCardProps {
  /** Card heading. */
  title: string;
  /** Arbitrary content rendered inside the card body. */
  children: ReactNode;
}

/**
 * Generic wrapper card with a title and arbitrary content.
 *
 * Provides a consistent card shell (MUI `Card` + `CardContent`) for
 * free-form summary or narrative sections inside the statistics dashboards.
 */
export function ContentSummaryCard({ title, children }: ContentSummaryCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}
