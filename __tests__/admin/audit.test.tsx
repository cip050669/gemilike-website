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

  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: { user: { id: 'admin-001', role: 'admin' } },
      status: 'authenticated',
    });

    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    anchorClickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});

    jest.useFakeTimers();
  });

  afterEach(() => {
    alertSpy?.mockRestore();
    anchorClickSpy?.mockRestore();
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
    fireEvent.change(searchInput, { target: { value: 'CREATE' } });

    // Wait for filtering to complete
    await waitFor(() => {
      expect(screen.getByText('EMERALD-001')).toBeInTheDocument();
    });

    fireEvent.change(searchInput, { target: { value: 'DELETE' } });

    await waitFor(() => {
      expect(screen.getByText('SAPPHIRE-003')).toBeInTheDocument();
      expect(screen.queryByText('EMERALD-001')).not.toBeInTheDocument();
    });
  });

  it('filters logs by action select', async () => {
    await renderPage();

    const actionSelect = screen.getByDisplayValue('Alle Aktionen');
    fireEvent.change(actionSelect, { target: { value: 'CREATE' } });

    await waitFor(() => {
      expect(screen.getByText('EMERALD-001')).toBeInTheDocument();
      expect(screen.queryByText('SAPPHIRE-003')).not.toBeInTheDocument();
    });
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
