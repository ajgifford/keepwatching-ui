import { render, screen } from '@testing-library/react';

import { ContentSummaryCard } from '../contentSummaryCard';

describe('ContentSummaryCard', () => {
  it('should render with title and children', () => {
    render(
      <ContentSummaryCard title="Test Title">
        <div>Test Content</div>
      </ContentSummaryCard>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render with complex children', () => {
    render(
      <ContentSummaryCard title="Statistics">
        <div>
          <p>Line 1</p>
          <p>Line 2</p>
          <p>Line 3</p>
        </div>
      </ContentSummaryCard>
    );

    expect(screen.getByText('Statistics')).toBeInTheDocument();
    expect(screen.getByText('Line 1')).toBeInTheDocument();
    expect(screen.getByText('Line 2')).toBeInTheDocument();
    expect(screen.getByText('Line 3')).toBeInTheDocument();
  });

  it('should render with empty children', () => {
    render(
      <ContentSummaryCard title="Empty Card">
        <></>
      </ContentSummaryCard>
    );

    expect(screen.getByText('Empty Card')).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(
      <ContentSummaryCard title="Snapshot Test">
        <div>Snapshot content</div>
      </ContentSummaryCard>
    );

    expect(container).toMatchSnapshot();
  });
});
