'use client';

import { Mail, Phone, MapPin, Clock, MessageCircle, Globe } from 'lucide-react';

interface ContactInfoProps {
  className?: string;
}

interface ContactItemProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  details: string;
  description: string;
  color: string;
}

const contactItems: ContactItemProps[] = [
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

const faqItems = [
  {
    question: 'Wie kann ich einen Termin vereinbaren?',
    answer: 'Rufen Sie uns einfach an oder senden Sie uns eine E-Mail. Wir vereinbaren gerne einen persönlichen Beratungstermin mit Ihnen.'
  },
  {
    question: 'Bieten Sie auch Online-Beratung an?',
    answer: 'Ja, wir bieten auch Video-Beratungen an. Kontaktieren Sie uns für weitere Informationen.'
  },
  {
    question: 'Wie lange dauert die Bearbeitung meiner Anfrage?',
    answer: 'Wir antworten in der Regel innerhalb von 24 Stunden auf alle Anfragen.'
  },
  {
    question: 'Kann ich Edelsteine vor Ort begutachten?',
    answer: 'Ja, nach vorheriger Terminvereinbarung können Sie unsere Edelsteine in unserem Showroom begutachten.'
  }
];

export default function ContactInfo({ className }: ContactInfoProps): JSX.Element {
  return (
    <div className={`space-y-8 ${className || ''}`}>
      {/* Contact Methods */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-6">Kontaktmöglichkeiten</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contactItems.map((item, index) => (
            <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-start gap-3">
                <item.icon className={`w-5 h-5 mt-1 ${item.color}`} />
                <div>
                  <h4 className="font-medium text-white mb-1">{item.title}</h4>
                  <p className="text-slate-300 text-sm mb-1">{item.details}</p>
                  <p className="text-slate-400 text-xs">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-6">Häufige Fragen</h3>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
              <h4 className="font-medium text-white mb-2">{item.question}</h4>
              <p className="text-slate-300 text-sm">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/30">
        <div className="flex items-start gap-3">
          <MessageCircle className="w-6 h-6 text-blue-400 mt-1" />
          <div>
            <h4 className="font-semibold text-white mb-2">Persönliche Beratung</h4>
            <p className="text-slate-300 text-sm mb-3">
              Unsere Edelsteinexperten stehen Ihnen gerne für eine persönliche Beratung zur Verfügung. 
              Wir helfen Ihnen dabei, den perfekten Edelstein für Ihre Bedürfnisse zu finden.
            </p>
            <div className="flex items-center gap-2 text-sm text-blue-300">
              <Globe className="w-4 h-4" />
              <span>Online-Beratung verfügbar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
