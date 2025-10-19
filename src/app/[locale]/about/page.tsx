import { Metadata } from 'next';
import Image from 'next/image';
import { Award, Users, Globe, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Über uns - Gemilike',
  description: 'Erfahren Sie mehr über Gemilike und unsere Leidenschaft für exklusive Edelsteine',
};

interface StatisticProps {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  color: string;
}

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  description: string;
}

const statistics: StatisticProps[] = [
  {
    icon: Award,
    value: '15+',
    label: 'Jahre Erfahrung',
    color: 'text-blue-400'
  },
  {
    icon: Users,
    value: '10,000+',
    label: 'Zufriedene Kunden',
    color: 'text-green-400'
  },
  {
    icon: Globe,
    value: '50+',
    label: 'Länder weltweit',
    color: 'text-purple-400'
  },
  {
    icon: Shield,
    value: '100%',
    label: 'Zertifizierte Qualität',
    color: 'text-orange-400'
  }
];

const teamMembers: TeamMemberProps[] = [
  {
    name: 'Dr. Sarah Müller',
    role: 'Geschäftsführerin & Edelsteinexpertin',
    image: '/team/sarah-mueller.jpg',
    description: 'Mit über 15 Jahren Erfahrung in der Edelsteinbranche leitet Sarah unser Unternehmen mit Leidenschaft und Expertise.'
  },
  {
    name: 'Michael Schmidt',
    role: 'Leiter Qualitätssicherung',
    image: '/team/michael-schmidt.jpg',
    description: 'Michael sorgt dafür, dass jeder Edelstein unseren hohen Qualitätsstandards entspricht.'
  },
  {
    name: 'Anna Weber',
    role: 'Kundenservice & Beratung',
    image: '/team/anna-weber.jpg',
    description: 'Anna steht unseren Kunden mit fachkundiger Beratung und persönlichem Service zur Seite.'
  }
];

export default function AboutPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-black">
      <div className="container-responsive py-16">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display mb-6 gemilike-text-gradient">
              Über Gemilike
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Seit über 15 Jahren sind wir Ihr vertrauensvoller Partner für exklusive Edelsteine von höchster Qualität.
            </p>
          </div>

          {/* Company Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl sm:text-4xl font-heading mb-6 text-white">
                Unsere Geschichte
              </h2>
              <div className="space-y-4 text-slate-300">
                <p>
                  Gemilike wurde 2008 mit einer einfachen Vision gegründet: die schönsten und seltensten 
                  Edelsteine der Welt direkt zu unseren Kunden zu bringen. Was als kleines Familienunternehmen 
                  begann, ist heute zu einem international anerkannten Namen in der Edelsteinbranche geworden.
                </p>
                <p>
                  Unser Team von Experten reist regelmäßig zu den besten Minen der Welt, um handverlesene 
                  Steine von außergewöhnlicher Qualität zu finden. Jeder Edelstein wird sorgfältig geprüft, 
                  zertifiziert und mit der größten Sorgfalt behandelt.
                </p>
                <p>
                  Wir glauben, dass jeder Edelstein eine einzigartige Geschichte erzählt und dass unsere 
                  Kunden das Recht auf absolute Transparenz und Qualität haben.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/about/company-story.jpg"
                alt="Gemilike Team"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-4">
                  <stat.icon className={`w-12 h-12 mx-auto ${stat.color}`} />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading mb-12 text-center text-white">
              Unsere Werte
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-slate-800/50 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Qualität</h3>
                <p className="text-slate-300">
                  Jeder Edelstein wird von unseren Experten handverlesen und zertifiziert, 
                  um höchste Qualität zu gewährleisten.
                </p>
              </div>
              <div className="text-center p-6 bg-slate-800/50 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Transparenz</h3>
                <p className="text-slate-300">
                  Wir bieten vollständige Transparenz über Herkunft, Behandlung und 
                  Eigenschaften jedes Edelsteins.
                </p>
              </div>
              <div className="text-center p-6 bg-slate-800/50 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Nachhaltigkeit</h3>
                <p className="text-slate-300">
                  Wir arbeiten nur mit verantwortungsvollen Lieferanten zusammen und 
                  fördern nachhaltige Praktiken.
                </p>
              </div>
            </div>
          </div>

          {/* Team */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-heading mb-12 text-center text-white">
              Unser Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={200}
                      height={200}
                      className="w-48 h-48 mx-auto rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-400 mb-4">
                    {member.role}
                  </p>
                  <p className="text-slate-300 text-sm">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
