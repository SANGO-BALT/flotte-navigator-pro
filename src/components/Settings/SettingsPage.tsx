import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Settings, 
  Database, 
  Palette, 
  Bell, 
  Shield, 
  Upload,
  Download,
  Globe,
  FileText,
  Car,
  Fuel,
  Wrench,
  AlertTriangle,
  Users,
  MapPin,
  Server
} from 'lucide-react';
import ProductionTutorial from './ProductionTutorial';

const SettingsPage = () => {
  const [generalSettings, setGeneralSettings] = useState({
    appName: 'Fleet Management System',
    timezone: 'UTC',
    language: 'fr'
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    primaryColor: '#2563eb',
    logoUrl: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30
  });

  const [dataSettings, setDataSettings] = useState({
    backupFrequency: 'weekly',
    dataRetention: 365
  });

  const [apiSettings, setApiSettings] = useState({
    googleMapsApiKey: '',
    externalApiUrl: ''
  });

  const [listSettings, setListSettings] = useState({
    defaultPageSize: 25,
    sortOrder: 'asc'
  });

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setGeneralSettings({ ...generalSettings, [e.target.name]: e.target.value });
  };

  const handleAppearanceSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppearanceSettings({ ...appearanceSettings, [e.target.name]: e.target.value });
  };

  const handleNotificationSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationSettings({ ...notificationSettings, [e.target.name]: e.target.checked });
  };

  const handleSecuritySettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecuritySettings({ ...securitySettings, [e.target.name]: e.target.checked });
  };

  const handleDataSettingsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDataSettings({ ...dataSettings, [e.target.name]: e.target.value });
  };

  const handleApiSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiSettings({ ...apiSettings, [e.target.name]: e.target.value });
  };

  const handleListSettingsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setListSettings({ ...listSettings, [e.target.name]: e.target.value });
  };

  const saveSettings = () => {
    toast.success('Paramètres sauvegardés avec succès!');
  };

  return (
    <div className="flex-1 space-y-8 p-8">
      <div>
        <h3 className="text-3xl font-bold tracking-tight">Paramètres</h3>
        <p className="text-muted-foreground text-lg">
          Gérez les paramètres de votre système de gestion de flotte
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-8">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="data">Données</TabsTrigger>
          <TabsTrigger value="apis">APIs</TabsTrigger>
          <TabsTrigger value="lists">Listes</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Généraux</CardTitle>
              <CardDescription>Configurez les paramètres généraux de votre application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app-name">Nom de l'application</Label>
                <Input id="app-name" name="appName" value={generalSettings.appName} onChange={handleGeneralSettingsChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <Select onValueChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value })}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select" defaultValue={generalSettings.timezone} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                    <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select onValueChange={(value) => setGeneralSettings({ ...generalSettings, language: value })}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select" defaultValue={generalSettings.language} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">Anglais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={saveSettings}>Enregistrer</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>Personnalisez l'apparence de votre application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Thème</Label>
                <Select onValueChange={(value) => setAppearanceSettings({ ...appearanceSettings, theme: value })}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="system">Système</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="primary-color">Couleur primaire</Label>
                <Input type="color" id="primary-color" name="primaryColor" value={appearanceSettings.primaryColor} onChange={handleAppearanceSettingsChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo-url">URL du logo</Label>
                <Input id="logo-url" name="logoUrl" value={appearanceSettings.logoUrl} onChange={handleAppearanceSettingsChange} />
              </div>
              <Button onClick={saveSettings}>Enregistrer</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Gérez vos préférences de notification.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-md border p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Notifications par e-mail</p>
                  <p className="text-sm text-muted-foreground">Recevez des notifications par e-mail.</p>
                </div>
                <Switch id="email-notifications" name="emailNotifications" checked={notificationSettings.emailNotifications} onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })} />
              </div>
              <div className="flex items-center justify-between rounded-md border p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Notifications SMS</p>
                  <p className="text-sm text-muted-foreground">Recevez des notifications par SMS.</p>
                </div>
                <Switch id="sms-notifications" name="smsNotifications" checked={notificationSettings.smsNotifications} onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsNotifications: checked })} />
              </div>
              <div className="flex items-center justify-between rounded-md border p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Notifications push</p>
                  <p className="text-sm text-muted-foreground">Recevez des notifications push sur votre appareil.</p>
                </div>
                <Switch id="push-notifications" name="pushNotifications" checked={notificationSettings.pushNotifications} onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, pushNotifications: checked })} />
              </div>
              <Button onClick={saveSettings}>Enregistrer</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>Configurez les paramètres de sécurité de votre compte.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-md border p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Authentification à deux facteurs</p>
                  <p className="text-sm text-muted-foreground">Ajoutez une couche de sécurité supplémentaire à votre compte.</p>
                </div>
                <Switch id="two-factor-auth" name="twoFactorAuth" checked={securitySettings.twoFactorAuth} onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Délai d'expiration de la session (minutes)</Label>
                <Input type="number" id="session-timeout" name="sessionTimeout" value={securitySettings.sessionTimeout} onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })} />
              </div>
              <Button onClick={saveSettings}>Enregistrer</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des données</CardTitle>
              <CardDescription>Configurez les paramètres de gestion des données.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Fréquence de sauvegarde</Label>
                <Select onValueChange={(value) => setDataSettings({ ...dataSettings, backupFrequency: value })}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Quotidien</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-retention">Durée de conservation des données (jours)</Label>
                <Input type="number" id="data-retention" name="dataRetention" value={dataSettings.dataRetention} onChange={(e) => setDataSettings({ ...dataSettings, dataRetention: parseInt(e.target.value) })} />
              </div>
              <Button onClick={saveSettings}>Enregistrer</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intégrations API</CardTitle>
              <CardDescription>Configurez les clés API et les intégrations externes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google-maps-api-key">Clé API Google Maps</Label>
                <Input id="google-maps-api-key" name="googleMapsApiKey" value={apiSettings.googleMapsApiKey} onChange={handleApiSettingsChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="external-api-url">URL de l'API externe</Label>
                <Input id="external-api-url" name="externalApiUrl" value={apiSettings.externalApiUrl} onChange={handleApiSettingsChange} />
              </div>
              <Button onClick={saveSettings}>Enregistrer</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lists" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de liste</CardTitle>
              <CardDescription>Configurez les paramètres par défaut pour les listes et les tableaux.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-page-size">Taille de page par défaut</Label>
                <Select onValueChange={(value) => setListSettings({ ...listSettings, defaultPageSize: value })}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort-order">Ordre de tri</Label>
                <Select onValueChange={(value) => setListSettings({ ...listSettings, sortOrder: value })}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Croissant</SelectItem>
                    <SelectItem value="desc">Décroissant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={saveSettings}>Enregistrer</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="production" className="space-y-6">
          <ProductionTutorial />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
