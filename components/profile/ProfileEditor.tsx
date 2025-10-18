'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Calendar, MapPin, Bell, Shield, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  bio?: string;
  preferences: {
    newsletter: boolean;
    orderUpdates: boolean;
    marketingEmails: boolean;
    smsNotifications: boolean;
  };
}

export default function ProfileEditor() {
  const { data: session, update } = useSession();
  const t = useTranslations('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: 'prefer-not-to-say',
    bio: '',
    preferences: {
      newsletter: true,
      orderUpdates: true,
      marketingEmails: false,
      smsNotifications: false,
    },
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Update profile via API
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        // Update session
        await update({
          ...session,
          user: {
            ...session?.user,
            name: profileData.name,
            email: profileData.email,
          },
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      try {
        const response = await fetch('/api/profile', {
          method: 'DELETE',
        });

        if (response.ok) {
          // Redirect to home page
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Persönliche Informationen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Persönliche Informationen
          </CardTitle>
          <CardDescription>
            Verwalten Sie Ihre persönlichen Daten
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Vollständiger Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail-Adresse</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefonnummer</Label>
              <Input
                id="phone"
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditing}
                placeholder="+49 123 456789"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Geburtsdatum</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Geschlecht</Label>
            <Select
              value={profileData.gender}
              onValueChange={(value: any) => setProfileData({ ...profileData, gender: value })}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Geschlecht auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Männlich</SelectItem>
                <SelectItem value="female">Weiblich</SelectItem>
                <SelectItem value="other">Divers</SelectItem>
                <SelectItem value="prefer-not-to-say">Möchte ich nicht angeben</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Über mich</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              disabled={!isEditing}
              placeholder="Erzählen Sie etwas über sich..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Benachrichtigungseinstellungen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Benachrichtigungseinstellungen
          </CardTitle>
          <CardDescription>
            Wählen Sie aus, welche Benachrichtigungen Sie erhalten möchten
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Newsletter</Label>
              <p className="text-sm text-muted-foreground">
                Erhalten Sie Updates über neue Edelsteine und Angebote
              </p>
            </div>
            <Switch
              checked={profileData.preferences.newsletter}
              onCheckedChange={(checked) =>
                setProfileData({
                  ...profileData,
                  preferences: { ...profileData.preferences, newsletter: checked },
                })
              }
              disabled={!isEditing}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Bestellupdates</Label>
              <p className="text-sm text-muted-foreground">
                Benachrichtigungen über den Status Ihrer Bestellungen
              </p>
            </div>
            <Switch
              checked={profileData.preferences.orderUpdates}
              onCheckedChange={(checked) =>
                setProfileData({
                  ...profileData,
                  preferences: { ...profileData.preferences, orderUpdates: checked },
                })
              }
              disabled={!isEditing}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing-E-Mails</Label>
              <p className="text-sm text-muted-foreground">
                Spezielle Angebote und Werbeaktionen
              </p>
            </div>
            <Switch
              checked={profileData.preferences.marketingEmails}
              onCheckedChange={(checked) =>
                setProfileData({
                  ...profileData,
                  preferences: { ...profileData.preferences, marketingEmails: checked },
                })
              }
              disabled={!isEditing}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SMS-Benachrichtigungen</Label>
              <p className="text-sm text-muted-foreground">
                Wichtige Updates per SMS
              </p>
            </div>
            <Switch
              checked={profileData.preferences.smsNotifications}
              onCheckedChange={(checked) =>
                setProfileData({
                  ...profileData,
                  preferences: { ...profileData.preferences, smsNotifications: checked },
                })
              }
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sicherheit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sicherheit
          </CardTitle>
          <CardDescription>
            Verwalten Sie Ihre Kontosicherheit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Passwort ändern</Label>
              <p className="text-sm text-muted-foreground">
                Ändern Sie Ihr Passwort für mehr Sicherheit
              </p>
            </div>
            <Button variant="outline" size="sm">
              Passwort ändern
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Zwei-Faktor-Authentifizierung</Label>
              <p className="text-sm text-muted-foreground">
                Zusätzliche Sicherheit für Ihr Konto
              </p>
            </div>
            <Button variant="outline" size="sm">
              Aktivieren
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gefährliche Aktionen */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Gefährliche Aktionen
          </CardTitle>
          <CardDescription>
            Diese Aktionen können nicht rückgängig gemacht werden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Konto löschen</Label>
              <p className="text-sm text-muted-foreground">
                Löschen Sie Ihr Konto dauerhaft
              </p>
            </div>
            <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
              Konto löschen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Aktions-Buttons */}
      <div className="flex gap-4">
        {isEditing ? (
          <>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Speichern...' : 'Änderungen speichern'}
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Abbrechen
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            Profil bearbeiten
          </Button>
        )}
      </div>
    </div>
  );
}
