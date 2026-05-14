import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExecutiveSummary } from './ExecutiveSummary';
import { fetchSummary } from '../services/api';

vi.mock('../services/api', () => ({
  fetchSummary: vi.fn(),
}));

describe('ExecutiveSummary', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('shows loading spinner initially', () => {
    vi.mocked(fetchSummary).mockReturnValue(new Promise(() => {})); // Never resolves
    render(<ExecutiveSummary datasetId={1} />);
    expect(screen.getByTestId('executive-summary-loading')).toBeInTheDocument();
    expect(screen.getByText(/generating executive summary/i)).toBeInTheDocument();
  });

  it('displays summary paragraphs on success', async () => {
    const mockSummary = "First paragraph.\n\nSecond paragraph.";
    vi.mocked(fetchSummary).mockResolvedValue({ summary: mockSummary });
    
    render(<ExecutiveSummary datasetId={1} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('executive-summary-content')).toBeInTheDocument();
    });

    expect(screen.getByText('First paragraph.')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph.')).toBeInTheDocument();
    expect(screen.queryByTestId('executive-summary-loading')).not.toBeInTheDocument();
  });

  it('displays error message on failure', async () => {
    vi.mocked(fetchSummary).mockRejectedValue(new Error('Failed to fetch'));
    
    render(<ExecutiveSummary datasetId={1} />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });
});
