import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { ApiErrorResponse } from '../../../types/errors';
import { ErrorComponent } from '../errorComponent';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ErrorComponent', () => {
  it('should render with string error message', () => {
    renderWithRouter(<ErrorComponent error="Test error message" />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should render with ApiErrorResponse object', () => {
    const errorResponse: ApiErrorResponse = {
      error: { message: 'API Error', code: 'ERR_001' },
      status: 500,
      message: 'Internal Server Error',
      requestId: 'req-123',
    };

    renderWithRouter(<ErrorComponent error={errorResponse} />);
    expect(screen.getByText('API Error')).toBeInTheDocument();
    expect(screen.getByText(/Status: 500/)).toBeInTheDocument();
    expect(screen.getByText(/Code: ERR_001/)).toBeInTheDocument();
    expect(screen.getByText(/Request ID: req-123/)).toBeInTheDocument();
  });

  it('should render home button by default', () => {
    renderWithRouter(<ErrorComponent error="Test error" />);
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
  });

  it('should hide home button when hideHomeButton is true', () => {
    renderWithRouter(<ErrorComponent error="Test error" hideHomeButton={true} />);
    expect(screen.queryByRole('button', { name: /home/i })).not.toBeInTheDocument();
  });

  it('should render custom home button label', () => {
    renderWithRouter(<ErrorComponent error="Test error" homeButtonLabel="Go Back" />);
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
  });

  it('should handle error without message field', () => {
    const errorResponse: ApiErrorResponse = {
      error: { code: 'ERR_002', message: '' },
      status: 404,
    };

    renderWithRouter(<ErrorComponent error={errorResponse} />);
    expect(screen.getByText('An unknown error occurred')).toBeInTheDocument();
  });

  it('should match snapshot with string error', () => {
    const { container } = renderWithRouter(<ErrorComponent error="Snapshot test error" />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with API error response', () => {
    const errorResponse: ApiErrorResponse = {
      error: { message: 'Not Found', code: 'ERR_404' },
      status: 404,
      message: 'Resource not found',
      requestId: 'req-456',
    };

    const { container } = renderWithRouter(<ErrorComponent error={errorResponse} />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot without home button', () => {
    const { container } = renderWithRouter(<ErrorComponent error="Test error" hideHomeButton={true} />);
    expect(container).toMatchSnapshot();
  });
});
