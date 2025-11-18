import { render, screen } from '@testing-library/react';

import { ShowProgress, WatchStatus } from '@ajgifford/keepwatching-types';

import { ShowProgressCard } from '../showProgressCard';

describe('ShowProgressCard', () => {
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

  it('should render with title', () => {
    render(<ShowProgressCard title="Currently Watching" shows={mockShows} />);

    expect(screen.getByText('Currently Watching')).toBeInTheDocument();
  });

  it('should filter by WATCHING status', () => {
    render(<ShowProgressCard title="Watching" shows={mockShows} filters={WatchStatus.WATCHING} />);

    expect(screen.getByText('Breaking Bad')).toBeInTheDocument();
    expect(screen.getByText('The Office')).toBeInTheDocument();
    expect(screen.queryByText('Game of Thrones')).not.toBeInTheDocument();
  });

  it('should filter by multiple statuses', () => {
    render(
      <ShowProgressCard
        title="Active Shows"
        shows={mockShows}
        filters={[WatchStatus.WATCHING, WatchStatus.WATCHED]}
      />
    );

    expect(screen.getByText('Breaking Bad')).toBeInTheDocument();
    expect(screen.getByText('Game of Thrones')).toBeInTheDocument();
    expect(screen.queryByText('Stranger Things')).not.toBeInTheDocument();
  });

  it('should show all shows when filters is null', () => {
    render(<ShowProgressCard title="All Shows" shows={mockShows} filters={null} />);

    expect(screen.getByText('Breaking Bad')).toBeInTheDocument();
    expect(screen.getByText('Game of Thrones')).toBeInTheDocument();
    expect(screen.getByText('The Office')).toBeInTheDocument();
    expect(screen.getByText('Stranger Things')).toBeInTheDocument();
  });

  it('should display episode counts', () => {
    render(<ShowProgressCard title="Shows" shows={mockShows} filters={null} />);

    expect(screen.getByText('30/62')).toBeInTheDocument();
    expect(screen.getByText('73/73')).toBeInTheDocument();
    expect(screen.getByText('100/201')).toBeInTheDocument();
    expect(screen.getByText('0/42')).toBeInTheDocument();
  });

  it('should display watch status for each show', () => {
    render(<ShowProgressCard title="Shows" shows={mockShows} filters={null} />);

    expect(screen.getAllByText('Watching')).toHaveLength(2);
    expect(screen.getByText('Watched')).toBeInTheDocument();
    expect(screen.getByText('Not Watched')).toBeInTheDocument();
  });

  it('should display percentage complete', () => {
    render(<ShowProgressCard title="Shows" shows={mockShows} filters={null} />);

    expect(screen.getByText('48%')).toBeInTheDocument(); // Breaking Bad
    expect(screen.getByText('100%')).toBeInTheDocument(); // Game of Thrones
    expect(screen.getByText('50%')).toBeInTheDocument(); // The Office (49.75 rounds to 50)
    expect(screen.getByText('0%')).toBeInTheDocument(); // Stranger Things
  });

  it('should sort by completion descending by default', () => {
    render(<ShowProgressCard title="Shows" shows={mockShows} filters={null} />);

    const showTitles = screen.getAllByText(/Breaking Bad|Game of Thrones|The Office|Stranger Things/);
    // Game of Thrones (100%) should be first
    expect(showTitles[0]).toHaveTextContent('Game of Thrones');
  });

  it('should sort by completion ascending', () => {
    render(<ShowProgressCard title="Shows" shows={mockShows} filters={null} sortBy="completion" sortOrder="asc" />);

    const showTitles = screen.getAllByText(/Breaking Bad|Game of Thrones|The Office|Stranger Things/);
    // Stranger Things (0%) should be first
    expect(showTitles[0]).toHaveTextContent('Stranger Things');
  });

  it('should sort by title ascending', () => {
    render(<ShowProgressCard title="Shows" shows={mockShows} filters={null} sortBy="title" sortOrder="asc" />);

    const showTitles = screen.getAllByText(/Breaking Bad|Game of Thrones|The Office|Stranger Things/);
    // Breaking Bad should be first alphabetically
    expect(showTitles[0]).toHaveTextContent('Breaking Bad');
  });

  it('should sort by episodes descending', () => {
    render(<ShowProgressCard title="Shows" shows={mockShows} filters={null} sortBy="episodes" sortOrder="desc" />);

    const showTitles = screen.getAllByText(/Breaking Bad|Game of Thrones|The Office|Stranger Things/);
    // The Office (201 episodes) should be first
    expect(showTitles[0]).toHaveTextContent('The Office');
  });

  it('should limit to maxItems', () => {
    render(<ShowProgressCard title="Top Shows" shows={mockShows} filters={null} maxItems={2} />);

    expect(screen.getByText('Showing 2 shows of 4 total')).toBeInTheDocument();
  });

  it('should display count of shows', () => {
    render(<ShowProgressCard title="Shows" shows={mockShows} filters={WatchStatus.WATCHING} />);

    expect(screen.getByText('Showing 2 shows')).toBeInTheDocument();
  });

  it('should display singular "show" when count is 1', () => {
    render(<ShowProgressCard title="Shows" shows={mockShows} filters={WatchStatus.WATCHED} />);

    expect(screen.getByText('Showing 1 show')).toBeInTheDocument();
  });

  it('should display empty message for WATCHING when no shows', () => {
    render(<ShowProgressCard title="Shows" shows={[]} filters={WatchStatus.WATCHING} />);

    expect(screen.getByText('No shows currently being watched')).toBeInTheDocument();
  });

  it('should display custom empty message', () => {
    render(<ShowProgressCard title="Shows" shows={[]} emptyMessage="Custom empty message" />);

    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });

  it('should render footer when provided', () => {
    const footer = <div>Custom Footer</div>;
    render(<ShowProgressCard title="Shows" shows={mockShows} footer={footer} />);

    expect(screen.getByText('Custom Footer')).toBeInTheDocument();
  });

  it('should render with custom maxHeight', () => {
    const { container } = render(<ShowProgressCard title="Shows" shows={mockShows} maxHeight={500} />);

    expect(container).toBeInTheDocument();
  });

  it('should render dividers between shows except after the last one', () => {
    render(<ShowProgressCard title="Shows" shows={mockShows} filters={WatchStatus.WATCHING} />);

    const dividers = screen.getAllByRole('separator');
    // Should have 1 divider (between 2 WATCHING shows)
    expect(dividers).toHaveLength(1);
  });

  it('should match snapshot with filtered shows', () => {
    const { container } = render(<ShowProgressCard title="Watching" shows={mockShows} filters={WatchStatus.WATCHING} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with empty state', () => {
    const { container } = render(<ShowProgressCard title="Shows" shows={[]} filters={WatchStatus.WATCHING} />);

    expect(container).toMatchSnapshot();
  });
});
