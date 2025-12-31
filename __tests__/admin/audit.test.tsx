import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import AuditLogPage from '@/app/[locale]/admin/audit/page';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

const getCardValue = (label: string) => {
  const header = screen.getByText(label).parentElement;
  return header?.nextElementSibling?.querySelector('.text-2xl') as HTMLElement | null;
};

describe('AuditLogPage', () => {
  let alertSpy: jest.SpyInstance | null = null;
  let anchorClickSpy: jest.SpyInstance | null = null;
  const originalConsoleError = console.error;

  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: { user: { id: 'admin-001', role: 'admin' } },
      status: 'authenticated',
    });

    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    anchorClickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});

    jest.spyOn(console, 'error').mockImplementation((msg: unknown, ...rest: unknown[]) => {
      if (typeof msg === 'string' && msg.includes('Missing `Description`')) return;
      // @ts-expect-error - console.error can accept any arguments
      originalConsoleError(msg, ...rest);
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    alertSpy?.mockRestore();
    anchorClickSpy?.mockRestore();
    (console.error as jest.Mock).mockRestore();
    jest.useRealTimers();
  });

  const renderPage = async () => {
    render(<AuditLogPage />);
    await waitFor(() => expect(screen.getByText('Audit-Log')).toBeInTheDocument());
  };

  it('renders header and default logs', async () => {
    await renderPage();
    expect(screen.getAllByText('Admin User').length).toBeGreaterThan(0);
  });

  it('displays audit log statistics', async () => {
    await renderPage();

    expect(getCardValue('Gesamt Einträge')?.textContent).toContain('5');
    expect(getCardValue('Aktive Benutzer')?.textContent).toContain('2');
    expect(getCardValue('Aktionen')?.textContent).toContain('5');
  });

  it('filters logs via search input', async () => {
    await renderPage();

    const searchInput = screen.getByPlaceholderText('Audit-Logs suchen...');
    
    // First verify EMERALD-001 is visible before filtering
    expect(screen.getByText(/EMERALD-001/)).toBeInTheDocument();
    
    // Type the search term - this triggers the filter
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'EMERALD' } });
    });

    // Wait for filtering to complete - entityId appears as "Gemstone: EMERALD-001"
    await waitFor(() => {
      expect(screen.getByText(/EMERALD-001/)).toBeInTheDocument();
    }, { timeout: 3000, interval: 100 });

    // Clear and search for SAPPHIRE
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '' } });
    });
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'SAPPHIRE' } });
    });

    await waitFor(() => {
      expect(screen.getByText(/SAPPHIRE-003/)).toBeInTheDocument();
      expect(screen.queryByText(/EMERALD-001/)).not.toBeInTheDocument();
    }, { timeout: 3000, interval: 100 });
  });

  it('filters logs by action select', async () => {
    await renderPage();

    // First verify all logs are visible
    expect(screen.getByText(/EMERALD-001/)).toBeInTheDocument();
    expect(screen.getByText(/SAPPHIRE-003/)).toBeInTheDocument();

    const actionSelect = screen.getByDisplayValue('Alle Aktionen');
    
    await act(async () => {
      fireEvent.change(actionSelect, { target: { value: 'CREATE' } });
    });

    // Wait for re-render after filter change - use regex for flexible matching
    await waitFor(() => {
      expect(screen.getByText(/EMERALD-001/)).toBeInTheDocument();
    }, { timeout: 3000, interval: 100 });

    // SAPPHIRE-003 should not be visible as it's a DELETE action
    await waitFor(() => {
      expect(screen.queryByText(/SAPPHIRE-003/)).not.toBeInTheDocument();
    }, { timeout: 2000, interval: 100 });
  });

  it('filters logs by date option', async () => {
    await renderPage();

    const dateSelect = screen.getByDisplayValue('Alle Zeiten');
    fireEvent.change(dateSelect, { target: { value: 'today' } });

    expect(screen.getAllByText('Admin User').length).toBeGreaterThan(0);
  });

  it('exports logs to CSV', async () => {
    await renderPage();

    const exportButton = screen.getByText('Export CSV');
    fireEvent.click(exportButton);

    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    expect(anchorClickSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalled();
  });

  it('shows audit log details modal on click', async () => {
    await renderPage();

    const viewButtons = screen.getAllByRole('button').filter((button) =>
      button.querySelector('svg')?.classList.contains('lucide-eye')
    );

    expect(viewButtons.length).toBeGreaterThan(0);

    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Audit-Log Details')).toBeInTheDocument();
    });
  });

  it('shows empty state when no entries match filters', async () => {
    await renderPage();

    const searchInput = screen.getByPlaceholderText('Audit-Logs suchen...');
    fireEvent.change(searchInput, { target: { value: 'unbekannt' } });

    expect(screen.getByText('Keine Audit-Logs gefunden')).toBeInTheDocument();
  });

  it('renders localized timestamps', async () => {
    await renderPage();

    const dateString = new Date().toLocaleDateString('de-DE');
    expect(
      screen.getAllByText((content) => content.includes(dateString)).length
    ).toBeGreaterThan(0);
  });
});
