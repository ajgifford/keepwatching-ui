import { render, screen } from '@testing-library/react';

import { ShowProgress, WatchStatus } from '@ajgifford/keepwatching-types';

import { ShowProgressList } from '../showProgressList';

describe('ShowProgressList', () => {
  const mockShows: ShowProgress[] = [
    {
      showId: 1,
      title: 'Breaking Bad',
      watchedEpisodes: 30,
      totalEpisodes: 62,
      percentComplete: 48.39,
      status: WatchStatus.WATCHING,
    } as ShowProgress,
    {
      showId: 2,
      title: 'Game of Thrones',
      watchedEpisodes: 73,
      totalEpisodes: 73,
      percentComplete: 100,
      status: WatchStatus.WATCHED,
    } as ShowProgress,
    {
      showId: 3,
      title: 'The Office',
      watchedEpisodes: 100,
      totalEpisodes: 201,
      percentComplete: 49.75,
      status: WatchStatus.WATCHING,
    } as ShowProgress,
    {
      showId: 4,
      title: 'Stranger Things',
      watchedEpisodes: 0,
      totalEpisodes: 42,
      percentComplete: 0,
      status: WatchStatus.NOT_WATCHED,
    } as ShowProgress,
  ];

  it('should render shows with WATCHING status by default', () => {
    render(<ShowProgressList shows={mockShows} />);

    expect(screen.getByText('Breaking Bad')).toBeInTheDocument();
    expect(screen.getByText('The Office')).toBeInTheDocument();
    expect(screen.queryByText('Game of Thrones')).not.toBeInTheDocument();
    expect(screen.queryByText('Stranger Things')).not.toBeInTheDocument();
  });

  it('should display episode counts', () => {
    render(<ShowProgressList shows={mockShows} />);

    expect(screen.getByText('30/62')).toBeInTheDocument();
    expect(screen.getByText('100/201')).toBeInTheDocument();
  });

  it('should filter shows by WATCHED status', () => {
    render(<ShowProgressList shows={mockShows} filter={WatchStatus.WATCHED} />);

    expect(screen.getByText('Game of Thrones')).toBeInTheDocument();
    expect(screen.getByText('73/73')).toBeInTheDocument();
    expect(screen.queryByText('Breaking Bad')).not.toBeInTheDocument();
  });

  it('should filter shows by NOT_WATCHED status', () => {
    render(<ShowProgressList shows={mockShows} filter={WatchStatus.NOT_WATCHED} />);

    expect(screen.getByText('Stranger Things')).toBeInTheDocument();
    expect(screen.getByText('0/42')).toBeInTheDocument();
    expect(screen.queryByText('Breaking Bad')).not.toBeInTheDocument();
  });

  it('should show all shows when filter is null', () => {
    render(<ShowProgressList shows={mockShows} filter={null} />);

    expect(screen.getByText('Breaking Bad')).toBeInTheDocument();
    expect(screen.getByText('Game of Thrones')).toBeInTheDocument();
    expect(screen.getByText('The Office')).toBeInTheDocument();
    expect(screen.getByText('Stranger Things')).toBeInTheDocument();
  });

  it('should sort shows by percentComplete in descending order', () => {
    render(<ShowProgressList shows={mockShows} filter={WatchStatus.WATCHING} />);

    const showTitles = screen.getAllByText(/Breaking Bad|The Office/);
    // The Office has 49.75% which is higher than Breaking Bad's 48.39%
    expect(showTitles[0]).toHaveTextContent('The Office');
  });

  it('should display empty message for WATCHING when no shows match', () => {
    const emptyShows: ShowProgress[] = [];
    render(<ShowProgressList shows={emptyShows} filter={WatchStatus.WATCHING} />);

    expect(screen.getByText('No shows currently being watched')).toBeInTheDocument();
  });

  it('should display empty message for NOT_WATCHED when no shows match', () => {
    const emptyShows: ShowProgress[] = [];
    render(<ShowProgressList shows={emptyShows} filter={WatchStatus.NOT_WATCHED} />);

    expect(screen.getByText('No unwatched shows')).toBeInTheDocument();
  });

  it('should display empty message for WATCHED when no shows match', () => {
    const emptyShows: ShowProgress[] = [];
    render(<ShowProgressList shows={emptyShows} filter={WatchStatus.WATCHED} />);

    expect(screen.getByText('No shows completed yet')).toBeInTheDocument();
  });

  it('should display empty message for UP_TO_DATE when no shows match', () => {
    const emptyShows: ShowProgress[] = [];
    render(<ShowProgressList shows={emptyShows} filter={WatchStatus.UP_TO_DATE} />);

    expect(screen.getByText('No shows are up to date')).toBeInTheDocument();
  });

  it('should display empty message for UNAIRED when no shows match', () => {
    const emptyShows: ShowProgress[] = [];
    render(<ShowProgressList shows={emptyShows} filter={WatchStatus.UNAIRED} />);

    expect(screen.getByText('No unaired shows')).toBeInTheDocument();
  });

  it('should display generic empty message when filter is null', () => {
    const emptyShows: ShowProgress[] = [];
    render(<ShowProgressList shows={emptyShows} filter={null} />);

    expect(screen.getByText('No shows available')).toBeInTheDocument();
  });

  it('should render with custom maxHeight', () => {
    const { container } = render(<ShowProgressList shows={mockShows} maxHeight={500} />);

    // Just verify the component renders successfully with custom maxHeight
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render dividers between shows except after the last one', () => {
    render(<ShowProgressList shows={mockShows} filter={WatchStatus.WATCHING} />);

    const dividers = screen.getAllByRole('separator');
    // Should have 1 divider (between 2 WATCHING shows)
    expect(dividers).toHaveLength(1);
  });

  it('should render progress bars for each show', () => {
    const { container } = render(<ShowProgressList shows={mockShows} filter={WatchStatus.WATCHING} />);

    const progressBars = container.querySelectorAll('.MuiLinearProgress-root');
    expect(progressBars).toHaveLength(2); // 2 WATCHING shows
  });

  it('should match snapshot with filtered shows', () => {
    const { container } = render(<ShowProgressList shows={mockShows} filter={WatchStatus.WATCHING} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with empty state', () => {
    const { container } = render(<ShowProgressList shows={[]} filter={WatchStatus.WATCHING} />);

    expect(container).toMatchSnapshot();
  });
});
