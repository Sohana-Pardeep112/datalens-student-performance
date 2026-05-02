import { render, screen, waitFor } from '@testing-library/react';
import { DataProfile } from './DataProfile';
import { fetchProfile } from '../services/api';
import { vi } from 'vitest';

vi.mock('../services/api', () => ({
  fetchProfile: vi.fn()
}));

const mockProfileData = {
  num_rows: 100,
  num_columns: 2,
  columns: {
    age: {
      type: 'numeric',
      null_count: 0,
      stats: { min: 10, max: 20, mean: 15 }
    },
    gender: {
      type: 'categorical',
      null_count: 5,
      stats: { unique_values: 2, value_counts: { M: 50, F: 45 } }
    }
  }
};

describe('DataProfile Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    (fetchProfile as any).mockReturnValue(new Promise(() => {})); // Never resolves
    render(<DataProfile datasetId={1} />);
    expect(screen.getByText(/Loading dataset profile/i)).toBeInTheDocument();
  });

  it('renders profile data correctly', async () => {
    (fetchProfile as any).mockResolvedValue(mockProfileData);
    render(<DataProfile datasetId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Dataset Profile')).toBeInTheDocument();
    });

    expect(screen.getByText('100 Rows')).toBeInTheDocument();
    expect(screen.getByText('2 Columns')).toBeInTheDocument();
    
    // Check numeric column
    expect(screen.getByText('age')).toBeInTheDocument();
    expect(screen.getByText('numeric')).toBeInTheDocument();
    expect(screen.getByText('15.00')).toBeInTheDocument(); // mean
    
    // Check categorical column
    expect(screen.getByText('gender')).toBeInTheDocument();
    expect(screen.getByText('categorical')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // null count
  });

  it('handles error state', async () => {
    (fetchProfile as any).mockRejectedValue(new Error('API Error'));
    render(<DataProfile datasetId={1} />);

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });
});
