'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminCard from '@/components/admin/AdminCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mail, 
  Send, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  BarChart3,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribedAt: string;
  lastActivity?: string;
  preferences: {
    categories: string[];
    frequency: 'daily' | 'weekly' | 'monthly';
  };
}

interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  recipients: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
}

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [campaignData, setCampaignData] = useState({
    name: '',
    subject: '',
    content: '',
    scheduledAt: ''
  });

  useEffect(() => {
    fetchNewsletterData();
  }, []);

  const fetchNewsletterData = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock subscribers
    const mockSubscribers: Subscriber[] = [
      {
        id: '1',
        email: 'max.mustermann@email.com',
        name: 'Max Mustermann',
        status: 'active',
        subscribedAt: '2024-01-15',
        lastActivity: '2024-01-20',
        preferences: {
          categories: ['Saphire', 'Rubine'],
          frequency: 'weekly'
        }
      },
      {
        id: '2',
        email: 'anna.schmidt@email.com',
        name: 'Anna Schmidt',
        status: 'active',
        subscribedAt: '2024-01-10',
        lastActivity: '2024-01-18',
        preferences: {
          categories: ['Smaragde'],
          frequency: 'monthly'
        }
      },
      {
        id: '3',
        email: 'peter.weber@email.com',
        status: 'unsubscribed',
        subscribedAt: '2023-12-01',
        preferences: {
          categories: ['Diamanten'],
          frequency: 'weekly'
        }
      }
    ];

    // Mock campaigns
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        name: 'Neue Saphire Kollektion',
        subject: 'Entdecken Sie unsere neuen Saphire!',
        content: 'Wir freuen uns, Ihnen unsere neue Saphire-Kollektion vorstellen zu können...',
        status: 'sent',
        sentAt: '2024-01-20',
        recipients: 1247,
        opened: 892,
        clicked: 234,
        unsubscribed: 3
      },
      {
        id: '2',
        name: 'Valentinstag Special',
        subject: 'Romantische Edelsteine für Valentinstag',
        content: 'Verwöhnen Sie Ihre Liebsten mit unseren romantischen Edelsteinen...',
        status: 'scheduled',
        scheduledAt: '2024-02-10',
        recipients: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0
      },
      {
        id: '3',
        name: 'Frühjahrs-Update',
        subject: 'Neue Edelsteine für den Frühling',
        content: 'Der Frühling bringt neue Farben und Edelsteine...',
        status: 'draft',
        recipients: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0
      }
    ];

    setSubscribers(mockSubscribers);
    setCampaigns(mockCampaigns);
    setLoading(false);
  };

  const handleCreateCampaign = () => {
    setEditingCampaign(null);
    setCampaignData({
      name: '',
      subject: '',
      content: '',
      scheduledAt: ''
    });
    setShowCampaignForm(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setCampaignData({
      name: campaign.name,
      subject: campaign.subject,
      content: campaign.content,
      scheduledAt: campaign.scheduledAt || ''
    });
    setShowCampaignForm(true);
  };

  const handleSaveCampaign = () => {
    if (editingCampaign) {
      // Update existing campaign
      setCampaigns(campaigns.map(c => 
        c.id === editingCampaign.id 
          ? {
              ...c,
              name: campaignData.name,
              subject: campaignData.subject,
              content: campaignData.content,
              scheduledAt: campaignData.scheduledAt
            }
          : c
      ));
    } else {
      // Create new campaign
      const newCampaign: Campaign = {
        id: Date.now().toString(),
        name: campaignData.name,
        subject: campaignData.subject,
        content: campaignData.content,
        status: 'draft',
        scheduledAt: campaignData.scheduledAt,
        recipients: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0
      };
      setCampaigns([...campaigns, newCampaign]);
    }

    setShowCampaignForm(false);
    setEditingCampaign(null);
  };

  const handleSendCampaign = (campaignId: string) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaignId 
        ? { ...c, status: 'sending' as any }
        : c
    ));
    
    // Simulate sending
    setTimeout(() => {
      setCampaigns(campaigns.map(c => 
        c.id === campaignId 
          ? { 
              ...c, 
              status: 'sent' as any, 
              sentAt: new Date().toISOString().split('T')[0],
              recipients: subscribers.filter(s => s.status === 'active').length
            }
          : c
      ));
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'unsubscribed': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'bounced': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'draft': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
      case 'scheduled': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'sending': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'sent': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'failed': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktiv';
      case 'unsubscribed': return 'Abgemeldet';
      case 'bounced': return 'Bounced';
      case 'draft': return 'Entwurf';
      case 'scheduled': return 'Geplant';
      case 'sending': return 'Wird gesendet';
      case 'sent': return 'Gesendet';
      case 'failed': return 'Fehlgeschlagen';
      default: return 'Unbekannt';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'unsubscribed': return <XCircle className="w-4 h-4" />;
      case 'bounced': return <XCircle className="w-4 h-4" />;
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'scheduled': return <Calendar className="w-4 h-4" />;
      case 'sending': return <Send className="w-4 h-4" />;
      case 'sent': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const activeSubscribers = subscribers.filter(s => s.status === 'active').length;
  const totalCampaigns = campaigns.length;
  const sentCampaigns = campaigns.filter(c => c.status === 'sent').length;

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminHeader
          title="Newsletter verwalten"
          description="Lade Newsletter-Daten..."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
          <Button onClick={handleCreateCampaign}>
            <Plus className="w-4 h-4 mr-2" />
            Neue Kampagne
          </Button>
        }
      />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminCard title="Abonnenten">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeSubscribers}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Aktive Abonnenten</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </AdminCard>

        <AdminCard title="Kampagnen">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalCampaigns}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Gesamt Kampagnen</p>
            </div>
            <Mail className="w-8 h-8 text-green-500" />
          </div>
        </AdminCard>

        <AdminCard title="Gesendet">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{sentCampaigns}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Erfolgreich gesendet</p>
            </div>
            <Send className="w-8 h-8 text-purple-500" />
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
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(campaign.status)}`}>
                    {getStatusIcon(campaign.status)}
                    <span className="ml-1">{getStatusText(campaign.status)}</span>
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-2">{campaign.subject}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="font-medium">Empfänger:</span> {campaign.recipients}
                  </div>
                  <div>
                    <span className="font-medium">Geöffnet:</span> {campaign.opened}
                  </div>
                  <div>
                    <span className="font-medium">Geklickt:</span> {campaign.clicked}
                  </div>
                  <div>
                    <span className="font-medium">Abgemeldet:</span> {campaign.unsubscribed}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditCampaign(campaign)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Bearbeiten
                </Button>
                
                {campaign.status === 'draft' && (
                  <Button 
                    size="sm"
                    onClick={() => handleSendCampaign(campaign.id)}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Senden
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Subscribers */}
      <AdminCard title="Abonnenten">
        <div className="space-y-4">
          {subscribers.map((subscriber) => (
            <div key={subscriber.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {subscriber.name || subscriber.email}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscriber.status)}`}>
                    {getStatusText(subscriber.status)}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>{subscriber.email}</p>
                  <p>Abonniert: {new Date(subscriber.subscribedAt).toLocaleDateString('de-DE')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Campaign Form Modal */}
      {showCampaignForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingCampaign ? 'Kampagne bearbeiten' : 'Neue Kampagne erstellen'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Kampagnenname</Label>
                <Input
                  id="name"
                  value={campaignData.name}
                  onChange={(e) => setCampaignData({...campaignData, name: e.target.value})}
                  placeholder="z.B. Neue Saphire Kollektion"
                />
              </div>
              
              <div>
                <Label htmlFor="subject">Betreff</Label>
                <Input
                  id="subject"
                  value={campaignData.subject}
                  onChange={(e) => setCampaignData({...campaignData, subject: e.target.value})}
                  placeholder="E-Mail-Betreff"
                />
              </div>
              
              <div>
                <Label htmlFor="content">Inhalt</Label>
                <Textarea
                  id="content"
                  value={campaignData.content}
                  onChange={(e) => setCampaignData({...campaignData, content: e.target.value})}
                  placeholder="Newsletter-Inhalt..."
                  rows={6}
                />
              </div>
              
              <div>
                <Label htmlFor="scheduledAt">Geplant für (optional)</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={campaignData.scheduledAt}
                  onChange={(e) => setCampaignData({...campaignData, scheduledAt: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowCampaignForm(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleSaveCampaign}>
                {editingCampaign ? 'Aktualisieren' : 'Erstellen'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}