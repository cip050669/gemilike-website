/**
 * Admin Newsletter Management Functionality Tests
 * Tests statistics, newsletter list, subscriber management, and actions
 */

import { render, screen } from '@testing-library/react';
import NewsletterAdminPage from '@/app/[locale]/admin/newsletter/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/de/admin/newsletter',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe('Admin Newsletter Management', () => {
  describe('Page Rendering', () => {
    it('should render newsletter page with title and description', () => {
      render(<NewsletterAdminPage />);

      expect(screen.getByText('Newsletter-Verwaltung')).toBeInTheDocument();
      expect(screen.getByText(/Verwalten Sie Newsletter und Abonnements/)).toBeInTheDocument();
    });

    it('should display new newsletter button', () => {
      render(<NewsletterAdminPage />);

      const newButton = screen.getByText('+ Neuer Newsletter');
      expect(newButton.closest('form')).toHaveAttribute('action', '/de/admin/newsletter/new');
    });
  });

  describe('Statistics Display', () => {
    it('should display subscriber count', () => {
      render(<NewsletterAdminPage />);

      expect(screen.getAllByText('1,247').length).toBeGreaterThan(0);
      expect(screen.getByText('Abonnenten')).toBeInTheDocument();
    });

    it('should display sent newsletters count', () => {
      render(<NewsletterAdminPage />);

      expect(screen.getByText('23')).toBeInTheDocument();
      expect(screen.getByText('Newsletter gesendet')).toBeInTheDocument();
    });

    it('should display open rate', () => {
      render(<NewsletterAdminPage />);

      expect(screen.getAllByText('68%').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Öffnungsrate').length).toBeGreaterThan(0);
    });

    it('should display click rate', () => {
      render(<NewsletterAdminPage />);

      expect(screen.getByText('12%')).toBeInTheDocument();
      expect(screen.getByText('Klickrate')).toBeInTheDocument();
    });
  });

  describe('Newsletter List', () => {
    it('should display newsletter table with headers', () => {
      render(<NewsletterAdminPage />);

      expect(screen.getAllByText('Betreff').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Empfänger').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Status').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Gesendet').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Öffnungsrate').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Aktionen').length).toBeGreaterThan(0);
    });

    it('should display newsletter subjects and descriptions', () => {
      render(<NewsletterAdminPage />);

      expect(screen.getByText('Neue Edelstein-Kollektion')).toBeInTheDocument();
      expect(screen.getByText(/Entdecken Sie unsere neuesten Diamanten/)).toBeInTheDocument();
    });

    it('should display newsletter status badges', () => {
      render(<NewsletterAdminPage />);

      expect(screen.getAllByText('Gesendet').length).toBeGreaterThan(0);
      expect(screen.getByText('Entwurf')).toBeInTheDocument();
    });

    it('should display recipient counts', () => {
      render(<NewsletterAdminPage />);

      expect(screen.getAllByText('1,247').length).toBeGreaterThan(0);
      expect(screen.getByText('1,200')).toBeInTheDocument();
    });

    it('should display open rates', () => {
      render(<NewsletterAdminPage />);

      expect(screen.getByText('72%')).toBeInTheDocument();
      expect(screen.getByText('65%')).toBeInTheDocument();
    });
  });

  describe('Newsletter Actions', () => {
    it('should display view action buttons', () => {
      render(<NewsletterAdminPage />);

      const viewButtons = screen.getAllByText('Anzeigen');
      expect(viewButtons.length).toBeGreaterThan(0);
      expect(viewButtons[0].closest('form')).toHaveAttribute('action', '/de/admin/newsletter/view/1');
    });

    it('should display duplicate action for sent newsletters', () => {
      render(<NewsletterAdminPage />);

      const duplicateButtons = screen.getAllByText('Duplizieren');
      expect(duplicateButtons.length).toBeGreaterThan(0);
    });

    it('should display edit and send actions for drafts', () => {
      render(<NewsletterAdminPage />);

      expect(screen.getByText('Bearbeiten')).toBeInTheDocument();
      expect(screen.getByText('Senden')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('should display pagination controls', () => {
      render(<NewsletterAdminPage />);

      expect(screen.getByText(/Zeige 1-4 von 23 Ergebnissen/)).toBeInTheDocument();
      expect(screen.getByText('Vorherige')).toBeInTheDocument();
      expect(screen.getByText('Nächste')).toBeInTheDocument();
    });

    it('should display page numbers', () => {
      render(<NewsletterAdminPage />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('Subscriber Management', () => {
    it('should display subscriber section header', () => {
      render(<NewsletterAdminPage />);

      expect(screen.getByText(/Abonnenten \(1,247\)/)).toBeInTheDocument();
    });

    it('should display export and import buttons', () => {
      render(<NewsletterAdminPage />);

      expect(screen.getByText('Export CSV')).toBeInTheDocument();
      expect(screen.getByText('Import CSV')).toBeInTheDocument();
    });

    it('should display subscriber search input', () => {
      render(<NewsletterAdminPage />);

      const searchInput = screen.getByPlaceholderText('Abonnenten suchen...');
      expect(searchInput).toBeInTheDocument();
    });

    it('should display subscriber table', () => {
      render(<NewsletterAdminPage />);

      expect(screen.getAllByText('E-Mail').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Name').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Abonniert seit').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Status').length).toBeGreaterThan(0);
    });

    it('should display subscriber data', () => {
      render(<NewsletterAdminPage />);

      expect(screen.getByText('max@example.com')).toBeInTheDocument();
      expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
      expect(screen.getByText('anna@example.com')).toBeInTheDocument();
    });

    it('should display unsubscribe action buttons', () => {
      render(<NewsletterAdminPage />);

      const unsubscribeButtons = screen.getAllByText('Abmelden');
      expect(unsubscribeButtons.length).toBeGreaterThan(0);
    });
  });
});
