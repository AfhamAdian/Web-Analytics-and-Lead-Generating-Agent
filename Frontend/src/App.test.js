import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login page by default', () => {
  render(<App />);
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});
