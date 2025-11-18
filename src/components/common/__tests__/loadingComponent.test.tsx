import { render, screen } from '@testing-library/react';

import { LoadingComponent } from '../loadingComponent';

describe('LoadingComponent', () => {
  it('should render with default message', () => {
    const { container } = render(<LoadingComponent />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(container.querySelector('.MuiCircularProgress-root')).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    const customMessage = 'Please wait...';
    render(<LoadingComponent message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('should match snapshot with default props', () => {
    const { container } = render(<LoadingComponent />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with custom message', () => {
    const { container } = render(<LoadingComponent message="Loading data..." />);
    expect(container).toMatchSnapshot();
  });
});
