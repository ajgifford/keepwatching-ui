# @ajgifford/keepwatching-ui

A React component library providing common UI components and utilities for KeepWatching web applications. This package contains reusable statistics visualizations, common components, and utility functions built with Material-UI and Recharts.

## Installation

```bash
npm install @ajgifford/keepwatching-ui
# or
yarn add @ajgifford/keepwatching-ui
```

## Peer Dependencies

This package requires the following peer dependencies to be installed in your project:

```json
{
  "@ajgifford/keepwatching-types": "^0.6.1",
  "@emotion/react": "^11.14.0",
  "@emotion/styled": "^11.14.1",
  "@mui/icons-material": "^7.3.4",
  "@mui/material": "^7.3.4",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.9.4",
  "recharts": "^2.15.1"
}
```

## Features

- **Statistics Components**: Rich data visualization components for displaying watch statistics, progress tracking, and analytics
- **Common UI Components**: Reusable loading and error components
- **Utility Functions**: Helpers for formatting, image handling, and watch status management
- **TypeScript Support**: Full TypeScript definitions included
- **Material-UI Integration**: Built on top of Material-UI v7 with Emotion styling
- **Chart Visualizations**: Powered by Recharts for interactive data displays

## Project Structure

```
src/
├── components/
│   ├── common/              # Common reusable components
│   │   ├── errorComponent.tsx
│   │   └── loadingComponent.tsx
│   └── statistics/          # Statistics and analytics components
│       ├── cards/           # Individual statistic card components
│       └── elements/        # Chart and visualization elements
├── types/                   # TypeScript type definitions
│   ├── errors.ts
│   └── index.ts
└── utils/                   # Utility functions
    ├── formatters.ts
    ├── imageUtils.ts
    ├── watchStatusColors.tsx
    └── watchStatusUtility.tsx
```

## Statistics Components

### Cards
The library provides comprehensive statistic cards for various analytics:

- `AbandonmentRiskCard` - Tracks content at risk of being abandoned
- `AccountHealthCard` - Overall account health metrics
- `AccountRankingCard` - User ranking and leaderboard
- `ActivityTimelineChart` - Viewing activity over time
- `BacklogAgingCard` - Age analysis of unwatched content
- `BingeWatchingCard` - Binge-watching patterns and trends
- `ContentBreakdownCard` - Content type distribution
- `ContentDepthCard` - Content depth analysis
- `ContentDiscoveryCard` - Discovery patterns and new content
- `ContentEngagementCard` - Engagement metrics
- `ContentPopularityCard` - Popular content insights
- `ContentSummaryCard` - Overall content summary
- `MilestonesAndAnniversaryCard` - Achievements and milestones
- `PlatformOverviewCard` - Streaming platform overview
- `PlatformTrendsCard` - Platform usage trends
- `ProfileComparisonCard` - Compare multiple profiles
- `SeasonalViewingCard` - Seasonal viewing patterns
- `ShowProgressCard` - Show completion progress
- `StatisticsSummaryCard` - Overall statistics summary
- `TimeToWatchCard` - Time investment metrics
- `TrendingContentCard` - Currently trending content
- `UnairedContentCard` - Upcoming/unaired content tracking
- `WatchStreakCard` - Watch streak tracking
- `WatchVelocityCard` - Viewing velocity metrics

### Elements
Reusable chart and visualization components:

- `DistributionBarChart` - Bar chart for distribution data
- `DistributionPieChart` - Pie chart for distribution data
- `MilestoneBadge` - Achievement badge display
- `ShowProgressList` - List view of show progress
- `StatisticsProgressBar` - Progress bar component
- `WatchStatusChart` - Watch status visualization

## Usage

### Importing Components

```typescript
import {
  // Common components
  LoadingComponent,
  ErrorComponent,
  
  // Statistics cards
  ContentSummaryCard,
  WatchStreakCard,
  ActivityTimelineChart,
  
  // Statistics elements
  DistributionPieChart,
  MilestoneBadge,
  
  // Utilities
  formatters,
  imageUtils,
  watchStatusUtility,
} from '@ajgifford/keepwatching-ui';
```

### Example: Using Statistics Components

```typescript
import { ContentSummaryCard, LoadingComponent } from '@ajgifford/keepwatching-ui';

function MyDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  if (loading) {
    return <LoadingComponent message="Loading statistics..." />;
  }

  return (
    <div>
      <ContentSummaryCard data={stats} />
    </div>
  );
}
```

### Example: Using Utilities

```typescript
import { formatters, watchStatusUtility } from '@ajgifford/keepwatching-ui';

// Format duration
const duration = formatters.formatDuration(7200); // "2h 0m"

// Get watch status color
const color = watchStatusUtility.getWatchStatusColor('watching');
```

## Development

### Prerequisites

- Node.js 18 or higher
- Yarn 1.22.22 or higher

### Setup

```bash
# Install dependencies
yarn install

# Start development mode (watch mode)
yarn dev

# Build the library
yarn build

# Lint code
yarn lint

# Format code
yarn format

# Clean build artifacts
yarn clean
```

### Building

The library is built using `tsup` and outputs:
- **CommonJS**: `dist/index.js`
- **ES Modules**: `dist/index.mjs`
- **TypeScript Definitions**: `dist/index.d.ts`

## Code Quality

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Code style is enforced with ESLint and Prettier configurations. Run `yarn lint` and `yarn format` before committing.

## Integration with KeepWatching Ecosystem

This library is designed to work seamlessly with other KeepWatching packages:

- **@ajgifford/keepwatching-types**: Shared TypeScript type definitions
- **keepwatching-client**: Main user-facing web application
- **keepwatching-admin-dashboard**: Administrative dashboard

Components in this library consume types from `@ajgifford/keepwatching-types` and are used across multiple KeepWatching applications.

## License

MIT

## Author

Andrew Gifford

## Version

0.1.0

## Repository

https://github.com/ajgifford/keepwatching-ui
