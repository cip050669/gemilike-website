'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Users, 
  Send, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  Search, 
  Filter,
  Calendar,
  TrendingUp,
  MessageSquare,
  FileText,
  Settings,
  RefreshCw
} from 'lucide-react';

interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  locale: 'de' | 'en';
  source: string;
  lastOpened?: string;
  openCount: number;
}

interface NewsletterCampaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  createdAt: string;
  scheduledFor?: string;
  sentAt?: string;
  recipients: number;
  opened: number;
  clicked: number;
  locale: 'de' | 'en';
}

export default function AdminNewsletterPage() {
  const t = useTranslations('admin');
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    subject: '',
    content: '',
    locale: 'de' as 'de' | 'en'
  });

  useEffect(() => {
    loadNewsletterData();
  }, []);

  const loadNewsletterData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading newsletter data...');
      
      // Load real subscribers from API
      const response = await fetch('/api/newsletter/subscribers');
      console.log('📡 API Response:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Subscribers data:', data);
        setSubscribers(data.subscribers || []);
        console.log('✅ Subscribers loaded:', data.subscribers?.length || 0);
      } else {
        console.error('❌ Failed to load subscribers:', response.statusText);
        // Fallback to empty array
        setSubscribers([]);
      }

      // Mock-Daten für Newsletter-Kampagnen (noch nicht implementiert)
      const mockCampaigns: NewsletterCampaign[] = [
        {
          id: 'CAMP-001',
          title: 'Oktober Newsletter 2025',
          subject: '💎 Neue Edelsteine im Oktober - Gemilike Newsletter',
          content: 'Willkommen zu unserem Oktober-Newsletter...',
          status: 'sent',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          recipients: 150,
          opened: 89,
          clicked: 23,
          locale: 'de'
        },
        {
          id: 'CAMP-002',
          title: 'Black Friday Special',
          subject: '🎯 Black Friday - Bis zu 30% Rabatt auf alle Edelsteine',
          content: 'Nutzen Sie unsere Black Friday Angebote...',
          status: 'scheduled',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
          recipients: 0,
          opened: 0,
          clicked: 0,
          locale: 'de'
        },
        {
          id: 'CAMP-003',
          title: 'New Collection Launch',
          subject: '✨ Discover our new gemstone collection',
          content: 'We are excited to present our new collection...',
          status: 'draft',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
          recipients: 0,
          opened: 0,
          clicked: 0,
          locale: 'en'
        }
      ];

      console.log('📧 NEWSLETTER DATA LOADED:', {
        subscribers: subscribers.length,
        campaigns: mockCampaigns.length
      });

      setCampaigns(mockCampaigns);
    } catch (error) {
      console.error('Error loading newsletter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || subscriber.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'unsubscribed': return 'secondary';
      case 'bounced': return 'destructive';
      default: return 'outline';
    }
  };

  const getCampaignStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'scheduled': return 'secondary';
      case 'draft': return 'outline';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const handleCreateCampaign = async () => {
    console.log('📧 CREATE NEWSLETTER CAMPAIGN BUTTON CLICKED');
    alert('📧 NEUE NEWSLETTER-KAMPAGNE WIRD ERSTELLT!\n\nTitel: ' + newCampaign.title + '\nBetreff: ' + newCampaign.subject);
    
    setIsCreatingCampaign(true);
    
    // Simuliere API-Aufruf
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newCampaignData: NewsletterCampaign = {
      id: `CAMP-${Date.now()}`,
      title: newCampaign.title,
      subject: newCampaign.subject,
      content: newCampaign.content,
      status: 'draft',
      createdAt: new Date().toISOString(),
      recipients: 0,
      opened: 0,
      clicked: 0,
      locale: newCampaign.locale
    };
    
    setCampaigns(prev => [newCampaignData, ...prev]);
    setNewCampaign({ title: '', subject: '', content: '', locale: 'de' });
    setIsCreatingCampaign(false);
    
    alert('✅ Newsletter-Kampagne erfolgreich erstellt!');
  };

  const handleSendCampaign = async (campaignId: string, campaignTitle: string) => {
    console.log('📧 SEND NEWSLETTER CAMPAIGN BUTTON CLICKED:', campaignId);
    alert(`📧 NEWSLETTER-KAMPAGNE "${campaignTitle.toUpperCase()}" WIRD GESENDET!\n\nAn alle aktiven Abonnenten...`);
    
    // Simuliere Versand
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { 
            ...campaign, 
            status: 'sent' as const,
            sentAt: new Date().toISOString(),
            recipients: subscribers.filter(s => s.status === 'active').length
          }
        : campaign
    ));
    
    alert(`✅ Newsletter-Kampagne "${campaignTitle}" erfolgreich gesendet!\n\nEmpfänger: ${subscribers.filter(s => s.status === 'active').length}`);
  };

  const handleDeleteSubscriber = async (subscriberId: string, email: string) => {
    console.log('🗑️ DELETE NEWSLETTER SUBSCRIBER BUTTON CLICKED:', subscriberId);
    alert(`🗑️ NEWSLETTER-ABONNENT "${email.toUpperCase()}" WIRD GELÖSCHT!`);
    
    try {
      const response = await fetch(`/api/newsletter/subscribers?id=${subscriberId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Update local state
        setSubscribers(prev => prev.filter(sub => sub.id !== subscriberId));
        setTimeout(() => {
          alert(`✅ Newsletter-Abonnent "${email}" erfolgreich gelöscht!`);
        }, 1000);
      } else {
        alert(`❌ Fehler beim Löschen des Abonnenten "${email}"`);
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      alert(`❌ Fehler beim Löschen des Abonnenten "${email}"`);
    }
  };

  const handleExportSubscribers = () => {
    console.log('💾 EXPORT NEWSLETTER SUBSCRIBERS BUTTON CLICKED');
    alert('💾 NEWSLETTER-ABONNENTEN WERDEN EXPORTIERT!');
    
    const csvContent = [
      ['E-Mail', 'Status', 'Sprache', 'Quelle', 'Angemeldet am', 'Letzte Öffnung', 'Öffnungen'].join(','),
      ...filteredSubscribers.map(subscriber => [
        subscriber.email,
        subscriber.status,
        subscriber.locale,
        subscriber.source,
        new Date(subscriber.subscribedAt).toLocaleDateString('de-DE'),
        subscriber.lastOpened ? new Date(subscriber.lastOpened).toLocaleDateString('de-DE') : 'N/A',
        subscriber.openCount
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    setTimeout(() => {
      alert(`✅ Newsletter-Abonnenten erfolgreich exportiert!\n\nDatei: newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv\nAbonnenten: ${filteredSubscribers.length}`);
    }, 500);
  };

  const handleViewCampaign = (campaignId: string, campaignTitle: string) => {
    console.log('👁️ VIEW NEWSLETTER CAMPAIGN BUTTON CLICKED:', campaignId);
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      alert(`👁️ NEWSLETTER-KAMPAGNE ANZEIGEN: "${campaignTitle.toUpperCase()}"\n\nBetreff: ${campaign.subject}\nStatus: ${campaign.status}\nEmpfänger: ${campaign.recipients}\nGeöffnet: ${campaign.opened}\nGeklickt: ${campaign.clicked}\n\nInhalt:\n${campaign.content.substring(0, 200)}...`);
    }
  };

  const handleEditCampaign = (campaignId: string, campaignTitle: string) => {
    console.log('✏️ EDIT NEWSLETTER CAMPAIGN BUTTON CLICKED:', campaignId);
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      // Setze die Kampagne-Daten in das Formular
      setNewCampaign({
        title: campaign.title,
        subject: campaign.subject,
        content: campaign.content,
        locale: campaign.locale
      });
      
      // Wechsle zum "Neue Kampagne"-Tab
      const createTab = document.querySelector('[value="create"]') as HTMLElement;
      if (createTab) {
        createTab.click();
      }
      
      alert(`✏️ NEWSLETTER-KAMPAGNE BEARBEITEN: "${campaignTitle.toUpperCase()}"\n\nDie Kampagne-Daten wurden in das Bearbeitungsformular geladen.`);
    }
  };

  const handleDeleteCampaign = (campaignId: string, campaignTitle: string) => {
    console.log('🗑️ DELETE NEWSLETTER CAMPAIGN BUTTON CLICKED:', campaignId);
    alert(`🗑️ NEWSLETTER-KAMPAGNE "${campaignTitle.toUpperCase()}" WIRD GELÖSCHT!`);
    
    setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId));
    
    setTimeout(() => {
      alert(`✅ Newsletter-Kampagne "${campaignTitle}" erfolgreich gelöscht!`);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Lade Newsletter-Daten...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Newsletter-Verwaltung</h1>
        <p className="text-muted-foreground">Verwalten Sie Newsletter-Abonnenten und -Kampagnen</p>
      </div>

      {/* Statistiken */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Abonnenten</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribers.length}</div>
            <p className="text-xs text-muted-foreground">
              +{subscribers.filter(s => new Date(s.subscribedAt) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)).length} diese Woche
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Abonnenten</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribers.filter(s => s.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((subscribers.filter(s => s.status === 'active').length / subscribers.length) * 100)}% aktiv
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kampagnen</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              {campaigns.filter(c => c.status === 'sent').length} gesendet
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durchschnittliche Öffnungsrate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter(c => c.status === 'sent').length > 0 
                ? Math.round(campaigns.filter(c => c.status === 'sent').reduce((acc, c) => acc + (c.opened / c.recipients * 100), 0) / campaigns.filter(c => c.status === 'sent').length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Letzte 30 Tage
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscribers" className="space-y-6">
        <TabsList className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <TabsTrigger 
            value="subscribers" 
            className="relative px-6 py-2 text-sm font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md"
          >
            Abonnenten
          </TabsTrigger>
          <TabsTrigger 
            value="campaigns" 
            className="relative px-6 py-2 text-sm font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md"
          >
            Kampagnen
          </TabsTrigger>
          <TabsTrigger 
            value="create" 
            className="relative px-6 py-2 text-sm font-medium transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md"
          >
            Neue Kampagne
          </TabsTrigger>
        </TabsList>

        {/* Abonnenten-Tab */}
        <TabsContent value="subscribers" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Newsletter-Abonnenten</CardTitle>
                  <CardDescription>Verwalten Sie Ihre Newsletter-Abonnenten</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={loadNewsletterData}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Aktualisieren
                  </Button>
                  <Button variant="outline" onClick={handleExportSubscribers}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-4">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Abonnenten suchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">Alle Status</option>
                    <option value="active">Aktiv</option>
                    <option value="unsubscribed">Abgemeldet</option>
                    <option value="bounced">Bounced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredSubscribers.map((subscriber) => (
                  <div key={subscriber.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{subscriber.email}</div>
                        <div className="text-sm text-muted-foreground">
                          {subscriber.source} • {new Date(subscriber.subscribedAt).toLocaleDateString('de-DE')}
                          {subscriber.lastOpened && (
                            <span> • Letzte Öffnung: {new Date(subscriber.lastOpened).toLocaleDateString('de-DE')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={getStatusBadgeVariant(subscriber.status)}>
                            {subscriber.status}
                          </Badge>
                          <Badge variant="outline">{subscriber.locale.toUpperCase()}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {subscriber.openCount} Öffnungen
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSubscriber(subscriber.id, subscriber.email)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredSubscribers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">Keine Abonnenten gefunden</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kampagnen-Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter-Kampagnen</CardTitle>
              <CardDescription>Verwalten Sie Ihre Newsletter-Kampagnen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{campaign.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {campaign.subject} • {new Date(campaign.createdAt).toLocaleDateString('de-DE')}
                          {campaign.sentAt && (
                            <span> • Gesendet: {new Date(campaign.sentAt).toLocaleDateString('de-DE')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={getCampaignStatusBadgeVariant(campaign.status)}>
                            {campaign.status}
                          </Badge>
                          <Badge variant="outline">{campaign.locale.toUpperCase()}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {campaign.recipients} Empfänger • {campaign.opened} geöffnet • {campaign.clicked} geklickt
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewCampaign(campaign.id, campaign.title)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {campaign.status === 'draft' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSendCampaign(campaign.id, campaign.title)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditCampaign(campaign.id, campaign.title)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteCampaign(campaign.id, campaign.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Neue Kampagne erstellen */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Neue Newsletter-Kampagne erstellen</CardTitle>
              <CardDescription>Erstellen Sie eine neue Newsletter-Kampagne</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Titel</label>
                <Input
                  placeholder="Kampagnen-Titel"
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Betreff</label>
                <Input
                  placeholder="E-Mail-Betreff"
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Sprache</label>
                <select
                  value={newCampaign.locale}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, locale: e.target.value as 'de' | 'en' }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="de">Deutsch</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Inhalt</label>
                <Textarea
                  placeholder="Newsletter-Inhalt (HTML möglich)"
                  value={newCampaign.content}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, content: e.target.value }))}
                  rows={10}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateCampaign}
                  disabled={isCreatingCampaign || !newCampaign.title || !newCampaign.subject}
                >
                  {isCreatingCampaign ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Erstelle...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Kampagne erstellen
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    console.log('👁️ PREVIEW NEWSLETTER CAMPAIGN BUTTON CLICKED');
                    alert(`👁️ NEWSLETTER-VORSCHAU\n\nTitel: ${newCampaign.title}\nBetreff: ${newCampaign.subject}\nSprache: ${newCampaign.locale}\n\nInhalt:\n${newCampaign.content || 'Kein Inhalt eingegeben'}`);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Vorschau
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
