import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MilestoneBadge } from '../milestoneBadge';

describe('MilestoneBadge', () => {
  it('should render episodes milestone', () => {
    render(<MilestoneBadge type="episodes" threshold={100} achieved={false} />);

    expect(screen.getByText('100 Episodes')).toBeInTheDocument();
  });

  it('should render movies milestone', () => {
    render(<MilestoneBadge type="movies" threshold={50} achieved={false} />);

    expect(screen.getByText('50 Movies')).toBeInTheDocument();
  });

  it('should render hours milestone', () => {
    render(<MilestoneBadge type="hours" threshold={1000} achieved={false} />);

    expect(screen.getByText('1,000 Hours')).toBeInTheDocument();
  });

  it('should format large numbers with commas', () => {
    render(<MilestoneBadge type="episodes" threshold={5000} achieved={false} />);

    expect(screen.getByText('5,000 Episodes')).toBeInTheDocument();
  });

  it('should show achieved milestone with trophy', () => {
    const { container } = render(<MilestoneBadge type="episodes" threshold={100} achieved={true} />);

    expect(screen.getByText('100 Episodes')).toBeInTheDocument();
    // Trophy icon should be present for achieved milestones
    const trophyIcon = container.querySelector('[data-testid="EmojiEventsIcon"]');
    expect(trophyIcon).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<MilestoneBadge type="episodes" threshold={100} achieved={false} onClick={handleClick} />);

    const badge = screen.getByText('100 Episodes');
    await user.click(badge);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should show tooltip on hover for unachieved milestone', async () => {
    const user = userEvent.setup();
    render(<MilestoneBadge type="episodes" threshold={100} achieved={false} />);

    const badge = screen.getByText('100 Episodes');
    await user.hover(badge);

    // Tooltip should eventually appear
    const tooltip = await screen.findByText(/Next Goal: 100 Episodes/, {}, { timeout: 2000 });
    expect(tooltip).toBeInTheDocument();
  });

  it('should show progress in tooltip when currentProgress is provided', async () => {
    const user = userEvent.setup();
    render(<MilestoneBadge type="episodes" threshold={100} achieved={false} currentProgress={75} />);

    const badge = screen.getByText('100 Episodes');
    await user.hover(badge);

    // Tooltip should show progress
    const tooltip = await screen.findByText(/Progress: 75\/100/, {}, { timeout: 2000 });
    expect(tooltip).toBeInTheDocument();
  });

  it('should show achievement message in tooltip for achieved milestone', async () => {
    const user = userEvent.setup();
    render(<MilestoneBadge type="movies" threshold={50} achieved={true} />);

    const badge = screen.getByText('50 Movies');
    await user.hover(badge);

    // Tooltip should show achievement message
    const tooltip = await screen.findByText(/Milestone Unlocked: 50 Movies/, {}, { timeout: 2000 });
    expect(tooltip).toBeInTheDocument();
  });

  it('should render TV icon for episodes', () => {
    const { container } = render(<MilestoneBadge type="episodes" threshold={100} achieved={false} />);

    const tvIcon = container.querySelector('[data-testid="TvIcon"]');
    expect(tvIcon).toBeInTheDocument();
  });

  it('should render movie icon for movies', () => {
    const { container } = render(<MilestoneBadge type="movies" threshold={50} achieved={false} />);

    const movieIcon = container.querySelector('[data-testid="LocalMoviesIcon"]');
    expect(movieIcon).toBeInTheDocument();
  });

  it('should render time icon for hours', () => {
    const { container } = render(<MilestoneBadge type="hours" threshold={100} achieved={false} />);

    const timeIcon = container.querySelector('[data-testid="AccessTimeIcon"]');
    expect(timeIcon).toBeInTheDocument();
  });

  it('should match snapshot for unachieved milestone', () => {
    const { container } = render(<MilestoneBadge type="episodes" threshold={500} achieved={false} />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot for achieved milestone', () => {
    const { container } = render(
      <MilestoneBadge type="movies" threshold={100} achieved={true} currentProgress={150} />
    );

    expect(container).toMatchSnapshot();
  });
});
