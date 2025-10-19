import { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import ContactForm from '../../../components/contact/ContactForm';
import ContactInfo from '../../../components/contact/ContactInfo';

export const metadata: Metadata = {
  title: 'Kontakt - Gemilike',
  description: 'Kontaktieren Sie uns für Beratung und Fragen zu unseren Edelsteinen',
};

interface ContactMethodProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  details: string;
  description: string;
  color: string;
}

const contactMethods: ContactMethodProps[] = [
  {
    icon: Mail,
    title: 'E-Mail',
    details: 'info@gemilike.de',
    description: 'Wir antworten innerhalb von 24 Stunden',
    color: 'text-blue-400'
  },
  {
    icon: Phone,
    title: 'Telefon',
    details: '+49 123 456789',
    description: 'Mo-Fr: 9:00-18:00 Uhr',
    color: 'text-green-400'
  },
  {
    icon: MapPin,
    title: 'Adresse',
    details: 'Musterstraße 1, 12345 Musterstadt',
    description: 'Besuchen Sie uns nach Terminvereinbarung',
    color: 'text-purple-400'
  },
  {
    icon: Clock,
    title: 'Öffnungszeiten',
    details: 'Mo-Fr: 9:00-18:00',
    description: 'Samstag: 10:00-16:00',
    color: 'text-orange-400'
  }
];

export default function ContactPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-black">
      <div className="container-responsive py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display mb-6 gemilike-text-gradient">
              Kontakt
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
              Haben Sie Fragen zu unseren Edelsteinen? Wir beraten Sie gerne persönlich.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <div key={index} className="text-center p-6 bg-slate-800/50 rounded-lg">
                <method.icon className={`w-12 h-12 mx-auto mb-4 ${method.color}`} />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {method.title}
                </h3>
                <p className="text-slate-300 mb-2">
                  {method.details}
                </p>
                <p className="text-slate-400 text-sm">
                  {method.description}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading mb-6 text-white">
                Nachricht senden
              </h2>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading mb-6 text-white">
                Weitere Informationen
              </h2>
              <ContactInfo />
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-16">
            <h2 className="text-2xl sm:text-3xl font-heading mb-6 text-center text-white">
              Unser Standort
            </h2>
            <div className="bg-slate-800/50 rounded-lg p-8 text-center">
              <MapPin className="w-16 h-16 mx-auto text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Gemilike GmbH
              </h3>
              <p className="text-slate-300 mb-4">
                Musterstraße 1<br />
                12345 Musterstadt<br />
                Deutschland
              </p>
              <p className="text-slate-400 text-sm">
                Besuchen Sie uns nach vorheriger Terminvereinbarung
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
