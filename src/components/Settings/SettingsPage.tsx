import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Palette, Globe, Database, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from './ThemeProvider';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    // Paramètres généraux
    companyName: 'Système de Gestion de Flotte',
    companyAddress: 'Libreville, Gabon',
    companyPhone: '+241 01 23 45 67',
    companyEmail: 'contact@fleet.ga',
    
    // Notifications
    emailNotifications: true,
    maintenanceAlerts: true,
    fuelAlerts: true,
    violationAlerts: true,
    
    // Sécurité
    sessionTimeout: '60',
    passwordExpiry: '90',
    twoFactorAuth: false,
    
    // Personnalisation
    primaryColor: '#3b82f6',
    language: 'fr',
    currency: 'FCFA',
    
    // Système
    autoBackup: true,
    backupFrequency: 'daily',
    maintenanceMode: false,
  });

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'system', label: 'Système', icon: Database },
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    console.log('Paramètres sauvegardés:', settings);
    alert('Paramètres sauvegardés avec succès!');
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir restaurer les paramètres par défaut ?')) {
      // Restaurer les paramètres par défaut
      console.log('Paramètres restaurés');
      alert('Paramètres restaurés aux valeurs par défaut');
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Informations de l'entreprise</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nom de l'entreprise
            </label>
            <Input
              value={settings.companyName}
              onChange={(e) => handleSettingChange('companyName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Adresse
            </label>
            <Input
              value={settings.companyAddress}
              onChange={(e) => handleSettingChange('companyAddress', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Téléphone
            </label>
            <Input
              value={settings.companyPhone}
              onChange={(e) => handleSettingChange('companyPhone', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <Input
              type="email"
              value={settings.companyEmail}
              onChange={(e) => handleSettingChange('companyEmail', e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Préférences régionales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Langue
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Devise
            </label>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="FCFA">FCFA</option>
              <option value="EUR">Euro</option>
              <option value="USD">Dollar US</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-foreground mb-4">Préférences de notification</h3>
      <div className="space-y-4">
        {[
          { key: 'emailNotifications', label: 'Notifications par email' },
          { key: 'maintenanceAlerts', label: 'Alertes de maintenance' },
          { key: 'fuelAlerts', label: 'Alertes de carburant' },
          { key: 'violationAlerts', label: 'Alertes de contravention' },
        ].map(notification => (
          <div key={notification.key} className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">{notification.label}</label>
            <input
              type="checkbox"
              checked={settings[notification.key]}
              onChange={(e) => handleSettingChange(notification.key, e.target.checked)}
              className="rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-foreground mb-4">Paramètres de sécurité</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Durée de session (minutes)
          </label>
          <Input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Expiration mot de passe (jours)
          </label>
          <Input
            type="number"
            value={settings.passwordExpiry}
            onChange={(e) => handleSettingChange('passwordExpiry', e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Authentification à deux facteurs</label>
          <input
            type="checkbox"
            checked={settings.twoFactorAuth}
            onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
            className="rounded"
          />
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-foreground mb-4">Personnalisation</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Thème de l'application
          </label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
            <option value="system">Système (automatique)</option>
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Le thème système s'adapte automatiquement aux préférences de votre appareil
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Couleur principale
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
              className="w-12 h-8 rounded border border-border"
            />
            <Input
              value={settings.primaryColor}
              onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-foreground mb-4">Paramètres système</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Sauvegarde automatique</label>
          <input
            type="checkbox"
            checked={settings.autoBackup}
            onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
            className="rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Fréquence de sauvegarde
          </label>
          <select
            value={settings.backupFrequency}
            onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="hourly">Chaque heure</option>
            <option value="daily">Quotidienne</option>
            <option value="weekly">Hebdomadaire</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Mode maintenance</label>
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
            className="rounded"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation des onglets */}
        <div className="lg:w-64">
          <div className="fleet-card p-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">Paramètres</h2>
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenu des paramètres */}
        <div className="flex-1">
          <div className="fleet-card p-6">
            {activeTab === 'general' && renderGeneralSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'appearance' && renderAppearanceSettings()}
            {activeTab === 'system' && renderSystemSettings()}

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-border">
              <Button variant="outline" onClick={handleReset}>
                Restaurer par défaut
              </Button>
              <Button onClick={handleSave} className="fleet-button-primary">
                Sauvegarder les modifications
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
