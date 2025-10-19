'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminCard from '@/components/admin/AdminCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Save, 
  Send, 
  Users,
  Mail,
  Plus,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: 'pending' | 'confirmed' | 'unsubscribed';
  subscribedAt: string;
  tags?: string[];
}

interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent';
  scheduledAt?: string;
  sentAt?: string;
  recipients: number;
  opened: number;
  clicked: number;
}

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    scheduledAt: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    const mockSubscribers: Subscriber[] = [
      {
        id: '1',
        email: 'max.mustermann@email.com',
        name: 'Max Mustermann',
        status: 'confirmed',
        subscribedAt: '2024-01-15',
        tags: ['VIP', 'Saphire']
      },
      {
        id: '2',
        email: 'anna.schmidt@email.com',
        name: 'Anna Schmidt',
        status: 'confirmed',
        subscribedAt: '2024-01-10',
        tags: ['Smaragde']
      },
      {
        id: '3',
        email: 'peter.weber@email.com',
        status: 'unsubscribed',
        subscribedAt: '2023-12-01',
        tags: []
      }
    ];

    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        name: 'Neue Saphire Kollektion',
        subject: 'Entdecken Sie unsere neuen Saphire',
        content: 'Wir freuen uns, Ihnen unsere neueste Saphire-Kollektion vorstellen zu können...',
        status: 'sent',
        sentAt: '2024-01-20',
        recipients: 1247,
        opened: 856,
        clicked: 234
      },
      {
        id: '2',
        name: 'Frühjahrs-Sale',
        subject: 'Bis zu 30% Rabatt auf alle Edelsteine',
        content: 'Nutzen Sie unsere Frühjahrs-Aktion und sparen Sie bis zu 30%...',
        status: 'scheduled',
        scheduledAt: '2024-02-01T10:00:00Z',
        recipients: 0,
        opened: 0,
        clicked: 0
      }
    ];

    setSubscribers(mockSubscribers);
    setCampaigns(mockCampaigns);
    setLoading(false);
  };

  const handleCreateCampaign = () => {
    const campaign: Campaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      subject: newCampaign.subject,
      content: newCampaign.content,
      status: 'draft',
      recipients: 0,
      opened: 0,
      clicked: 0
    };
    
    setCampaigns([...campaigns, campaign]);
    setNewCampaign({ name: '', subject: '', content: '', scheduledAt: '' });
    setShowCampaignForm(false);
  };

  const handleDeleteSubscriber = (id: string) => {
    if (confirm('Sind Sie sicher, dass Sie diesen Abonnenten entfernen möchten?')) {
      setSubscribers(subscribers.filter(s => s.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'unsubscribed': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Bestätigt';
      case 'pending': return 'Ausstehend';
      case 'unsubscribed': return 'Abgemeldet';
      default: return 'Unbekannt';
    }
  };

  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'scheduled': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'draft': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getCampaignStatusText = (status: string) => {
    switch (status) {
      case 'sent': return 'Gesendet';
      case 'scheduled': return 'Geplant';
      case 'draft': return 'Entwurf';
      default: return 'Unbekannt';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminHeader
          title="Newsletter verwalten"
          description="Lade Newsletter-Daten..."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <AdminCard key={i} title="">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </AdminCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Newsletter verwalten"
        description="Verwalten Sie Newsletter-Abonnenten und Kampagnen."
        actions={
          <Button onClick={() => setShowCampaignForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Neue Kampagne
          </Button>
        }
      />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminCard title="Abonnenten">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {subscribers.filter(s => s.status === 'confirmed').length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aktive Abonnenten
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </AdminCard>

        <AdminCard title="Kampagnen">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {campaigns.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gesamt
              </p>
            </div>
            <Mail className="w-8 h-8 text-green-500" />
          </div>
        </AdminCard>

        <AdminCard title="Öffnungsrate">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                68.7%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Durchschnitt
              </p>
            </div>
            <Eye className="w-8 h-8 text-purple-500" />
          </div>
        </AdminCard>

        <AdminCard title="Klickrate">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                18.8%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Durchschnitt
              </p>
            </div>
            <Send className="w-8 h-8 text-orange-500" />
          </div>
        </AdminCard>
      </div>

      {/* Campaigns */}
      <AdminCard title="Newsletter-Kampagnen">
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {campaign.name}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCampaignStatusColor(campaign.status)}`}>
                    {getCampaignStatusText(campaign.status)}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-2">{campaign.subject}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="font-medium">Empfänger:</span> {campaign.recipients}
                  </div>
                  <div>
                    <span className="font-medium">Geöffnet:</span> {campaign.opened}
                  </div>
                  <div>
                    <span className="font-medium">Geklickt:</span> {campaign.clicked}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Ansehen
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Bearbeiten
                </Button>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Subscribers */}
      <AdminCard title="Abonnenten">
        <div className="space-y-4">
          {subscribers.map((subscriber) => (
            <div key={subscriber.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {subscriber.name || subscriber.email}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscriber.status)}`}>
                    {getStatusText(subscriber.status)}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-2">{subscriber.email}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Angemeldet: {new Date(subscriber.subscribedAt).toLocaleDateString('de-DE')}</span>
                  {subscriber.tags && subscriber.tags.length > 0 && (
                    <div className="flex space-x-2">
                      {subscriber.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Bearbeiten
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteSubscriber(subscriber.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Entfernen
                </Button>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Campaign Form Modal */}
      {showCampaignForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Neue Newsletter-Kampagne</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="campaignName" className="text-sm font-medium">Kampagnenname</Label>
                <Input
                  id="campaignName"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                  placeholder="z.B. Neue Saphire Kollektion"
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="campaignSubject" className="text-sm font-medium">Betreff</Label>
                <Input
                  id="campaignSubject"
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                  placeholder="z.B. Entdecken Sie unsere neuen Saphire"
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="campaignContent" className="text-sm font-medium">Inhalt</Label>
                <Textarea
                  id="campaignContent"
                  value={newCampaign.content}
                  onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                  placeholder="Newsletter-Inhalt..."
                  rows={8}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowCampaignForm(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleCreateCampaign}>
                Kampagne erstellen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
