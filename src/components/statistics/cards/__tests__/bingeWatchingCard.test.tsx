import { render, screen } from '@testing-library/react';

import { BingeWatchingStats } from '@ajgifford/keepwatching-types';

import { BingeWatchingCard } from '../bingeWatchingCard';

describe('BingeWatchingCard', () => {
  const mockBingeData: BingeWatchingStats = {
    bingeSessionCount: 15,
    averageEpisodesPerBinge: 5.5,
    longestBingeSession: {
      showId: 1,
      showTitle: 'Breaking Bad',
      episodeCount: 12,
      date: '2024-01-15',
    },
    topBingedShows: [
      {
        showId: 1,
        showTitle: 'Breaking Bad',
        bingeSessionCount: 5,
      },
      {
        showId: 2,
        showTitle: 'The Office',
        bingeSessionCount: 3,
      },
      {
        showId: 3,
        showTitle: 'Game of Thrones',
        bingeSessionCount: 2,
      },
    ],
  } as BingeWatchingStats;

  it('should render with title', () => {
    render(<BingeWatchingCard bingeData={mockBingeData} />);

    expect(screen.getByText('Binge-Watching Stats')).toBeInTheDocument();
  });

  it('should display binge session count chip', () => {
    render(<BingeWatchingCard bingeData={mockBingeData} />);

    expect(screen.getByText('15 Sessions')).toBeInTheDocument();
  });

  it('should display average episodes per binge', () => {
    render(<BingeWatchingCard bingeData={mockBingeData} />);

    expect(screen.getByText('5.5')).toBeInTheDocument();
    expect(screen.getByText('Avg Episodes / Binge')).toBeInTheDocument();
  });

  it('should display longest binge session count', () => {
    render(<BingeWatchingCard bingeData={mockBingeData} />);

    expect(screen.getByText('12')).toBeInTheDocument();
    const longestBingeElements = screen.getAllByText('Longest Binge Session');
    expect(longestBingeElements.length).toBeGreaterThan(0);
  });

  it('should display longest binge session details', () => {
    render(<BingeWatchingCard bingeData={mockBingeData} />);

    const breakingBadElements = screen.getAllByText('Breaking Bad');
    expect(breakingBadElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/12 episodes on/)).toBeInTheDocument();
    expect(screen.getByText(/1\/15\/2024/)).toBeInTheDocument();
  });

  it('should display top binged shows section', () => {
    render(<BingeWatchingCard bingeData={mockBingeData} />);

    expect(screen.getByText('Most Binged Shows')).toBeInTheDocument();
  });

  it('should display all top binged shows', () => {
    render(<BingeWatchingCard bingeData={mockBingeData} />);

    // Breaking Bad appears twice (longest binge and top binged)
    const breakingBadElements = screen.getAllByText('Breaking Bad');
    expect(breakingBadElements.length).toBeGreaterThan(0);
    expect(screen.getByText('The Office')).toBeInTheDocument();
    expect(screen.getByText('Game of Thrones')).toBeInTheDocument();
  });

  it('should display binge session counts for each show with plural', () => {
    render(<BingeWatchingCard bingeData={mockBingeData} />);

    expect(screen.getByText('5 sessions')).toBeInTheDocument();
    expect(screen.getByText('3 sessions')).toBeInTheDocument();
    expect(screen.getByText('2 sessions')).toBeInTheDocument();
  });

  it('should display singular "session" when count is 1', () => {
    const singleSessionData = {
      ...mockBingeData,
      topBingedShows: [
        {
          showId: 2,
          showTitle: 'Stranger Things',
          bingeSessionCount: 1,
        },
      ],
    };

    render(<BingeWatchingCard bingeData={singleSessionData as BingeWatchingStats} />);

    expect(screen.getByText('1 session')).toBeInTheDocument();
  });

  it('should round average episodes to one decimal place', () => {
    const decimalData = {
      ...mockBingeData,
      averageEpisodesPerBinge: 5.678,
    };

    render(<BingeWatchingCard bingeData={decimalData as BingeWatchingStats} />);

    expect(screen.getByText('5.7')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<BingeWatchingCard isLoading={true} />);

    expect(screen.getByText('Binge-Watching Stats')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show empty state when bingeData is null', () => {
    render(<BingeWatchingCard bingeData={null} />);

    expect(screen.getByText('Binge-Watching Stats')).toBeInTheDocument();
    expect(
      screen.getByText('No binge sessions detected yet. Watch 3+ episodes of a show within 24 hours to start tracking!')
    ).toBeInTheDocument();
  });

  it('should show empty state when bingeData is undefined', () => {
    render(<BingeWatchingCard />);

    expect(
      screen.getByText('No binge sessions detected yet. Watch 3+ episodes of a show within 24 hours to start tracking!')
    ).toBeInTheDocument();
  });

  it('should show empty state when bingeSessionCount is 0', () => {
    const noBingeData = {
      ...mockBingeData,
      bingeSessionCount: 0,
    };

    render(<BingeWatchingCard bingeData={noBingeData as BingeWatchingStats} />);

    expect(
      screen.getByText('No binge sessions detected yet. Watch 3+ episodes of a show within 24 hours to start tracking!')
    ).toBeInTheDocument();
  });

  it('should render fire icon', () => {
    const { container } = render(<BingeWatchingCard bingeData={mockBingeData} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should not show longest binge details when episode count is 0', () => {
    const noBingeData = {
      ...mockBingeData,
      longestBingeSession: {
        showId: 0,
        showTitle: '',
        episodeCount: 0,
        date: '',
      },
    };

    render(<BingeWatchingCard bingeData={noBingeData as BingeWatchingStats} />);

    expect(screen.queryByText(/episodes on/)).not.toBeInTheDocument();
  });

  it('should not show top binged shows when list is empty', () => {
    const noTopShowsData = {
      ...mockBingeData,
      topBingedShows: [],
    };

    render(<BingeWatchingCard bingeData={noTopShowsData as BingeWatchingStats} />);

    expect(screen.queryByText('Most Binged Shows')).not.toBeInTheDocument();
  });

  it('should display dividers between sections', () => {
    const { container } = render(<BingeWatchingCard bingeData={mockBingeData} />);

    const dividers = container.querySelectorAll('.MuiDivider-root');
    expect(dividers.length).toBeGreaterThan(0);
  });

  it('should match snapshot with full data', () => {
    const { container } = render(<BingeWatchingCard bingeData={mockBingeData} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in loading state', () => {
    const { container } = render(<BingeWatchingCard isLoading={true} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot in empty state', () => {
    const { container } = render(<BingeWatchingCard bingeData={null} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with no longest binge', () => {
    const noBingeData = {
      ...mockBingeData,
      longestBingeSession: {
        showId: 0,
        showTitle: '',
        episodeCount: 0,
        date: '',
      },
      topBingedShows: [],
    };

    const { container } = render(<BingeWatchingCard bingeData={noBingeData as BingeWatchingStats} />);

    expect(container).toMatchSnapshot();
  });
});
