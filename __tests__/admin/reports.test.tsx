import { render, screen, act } from '@testing-library/react';
import { DashboardReports } from '@/components/admin/DashboardReports';

describe('DashboardReports', () => {
  let anchorClickSpy: jest.SpyInstance | null = null;
  let alertSpy: jest.SpyInstance | null = null;
  let printSpy: jest.SpyInstance | null = null;

  const flushTimers = async () => {
    await act(async () => {
      jest.runOnlyPendingTimers();
      await Promise.resolve();
    });
  };

  const renderReports = async () => {
    render(<DashboardReports />);
    await flushTimers();
  };

  beforeEach(() => {
    jest.useFakeTimers();
    anchorClickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    printSpy = jest.spyOn(window, 'print').mockImplementation(() => {});
  });

  afterEach(() => {
    anchorClickSpy?.mockRestore();
    alertSpy?.mockRestore();
    printSpy?.mockRestore();
    jest.useRealTimers();
  });

  it('renders dashboard reports with KPI cards', async () => {
    await renderReports();

    expect(screen.getByText('Dashboard-Berichte')).toBeInTheDocument();
    expect(screen.getByText('Gesamtumsatz')).toBeInTheDocument();
    expect(screen.getByText('Edelsteine gesamt')).toBeInTheDocument();
  });

  it('changes period when selecting another filter', async () => {
    await renderReports();

    const quarterButton = screen.getByRole('button', { name: 'Quartal' });
    await act(async () => {
      quarterButton.click();
      jest.runOnlyPendingTimers();
      await Promise.resolve();
    });

    expect(window.alert).toHaveBeenCalled();
  });

  it('exports report data', async () => {
    await renderReports();

    const exportButton = screen.getByRole('button', { name: 'Exportieren' });
    await act(async () => {
      exportButton.click();
    });

    expect(anchorClickSpy).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();
  });

  it('opens print dialog', async () => {
    await renderReports();

    const printButton = screen.getByRole('button', { name: 'Drucken' });
    await act(async () => {
      printButton.click();
    });

    expect(window.print).toHaveBeenCalled();
  });
});
