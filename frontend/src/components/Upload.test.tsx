import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Upload } from './Upload';
import { uploadCsv } from '../services/api';
import { vi } from 'vitest';

// Mock the API service
vi.mock('../services/api', () => ({
  uploadCsv: vi.fn()
}));

describe('Upload Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upload component', () => {
    render(<Upload onUploadSuccess={vi.fn()} />);
    expect(screen.getByText('Upload Dataset')).toBeInTheDocument();
  });

  it('handles successful upload', async () => {
    const mockOnSuccess = vi.fn();
    (uploadCsv as any).mockResolvedValueOnce({ id: 1, filename: 'test.csv', message: 'Upload successful' });

    render(<Upload onUploadSuccess={mockOnSuccess} />);

    // Create a mock file
    const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });
    const input = screen.getByTestId('file-input');
    
    fireEvent.change(input, { target: { files: [file] } });

    const button = screen.getByTestId('upload-button');
    expect(button).not.toBeDisabled();
    
    fireEvent.click(button);
    
    expect(button).toHaveTextContent('Uploading...');
    
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });

    expect(screen.getByText(/Successfully uploaded test.csv/i)).toBeInTheDocument();
    expect(mockOnSuccess).toHaveBeenCalledWith(1);
    expect(uploadCsv).toHaveBeenCalledTimes(1);
  });

  it('handles upload failure', async () => {
    (uploadCsv as any).mockRejectedValueOnce(new Error('Network error'));

    render(<Upload onUploadSuccess={vi.fn()} />);

    const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });
    const input = screen.getByTestId('file-input');
    
    fireEvent.change(input, { target: { files: [file] } });

    const button = screen.getByTestId('upload-button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });
});
