import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Palette, Globe, Database, Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from './ThemeProvider';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { theme, setTheme } = useTheme();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  
  const [settings, setSettings] = useState({
    // Paramètres généraux
    companyName: 'Système de Gestion de Flotte',
    companyAddress: 'Libreville, Gabon',
    companyPhone: '+241 01 23 45 67',
    companyEmail: 'contact@fleet.ga',
    companyLogo: '',
    
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
    
    // Listes système
    vehicleTypes: ['Voiture', 'Camion', 'Bus', 'Moto', 'Utilitaire'],
    fuelTypes: ['Essence', 'Diesel', 'Hybride', 'Électrique'],
    maintenanceTypes: ['Préventive', 'Corrective', 'Révision', 'Réparation'],
    violationTypes: ['Excès de vitesse', 'Stationnement', 'Feu rouge', 'Alcool', 'Téléphone'],
    userRoles: ['Administrateur', 'Gestionnaire', 'Conducteur', 'Mécanicien'],
    departments: ['Transport', 'Administration', 'Maintenance', 'Commercial']
  });

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'lists', label: 'Listes système', icon: Database },
    { id: 'system', label: 'Système', icon: Database },
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleListItemAdd = (listKey: string, newItem: string) => {
    if (newItem.trim()) {
      const currentList = settings[listKey] as string[];
      handleSettingChange(listKey, [...currentList, newItem.trim()]);
    }
  };

  const handleListItemRemove = (listKey: string, index: number) => {
    const currentList = settings[listKey] as string[];
    handleSettingChange(listKey, currentList.filter((_, i) => i !== index));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        toast.error('Le fichier est trop volumineux (max 5MB)');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner un fichier image');
        return;
      }
      
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        handleSettingChange('companyLogo', result);
      };
      reader.readAsDataURL(file);
      toast.success('Logo téléchargé avec succès');
    }
  };

  const handleSave = () => {
    // Sauvegarder dans localStorage
    localStorage.setItem('fleet_settings', JSON.stringify(settings));
    toast.success('Paramètres sauvegardés avec succès!');
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir restaurer les paramètres par défaut ?')) {
      localStorage.removeItem('fleet_settings');
      toast.success('Paramètres restaurés aux valeurs par défaut');
      window.location.reload();
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-medium text-foreground mb-6">Logo de l'entreprise</h3>
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/30">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="w-full h-full object-contain rounded-lg" />
            ) : (
              <Image className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div>
            <Button 
              onClick={() => document.getElementById('logo-upload')?.click()}
              variant="outline"
              className="mb-2"
            >
              <Upload className="w-4 h-4 mr-2" />
              Télécharger un logo
            </Button>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <p className="text-sm text-muted-foreground">PNG, JPG jusqu'à 5MB</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-medium text-foreground mb-6">Informations de l'entreprise</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nom de l'entreprise
            </label>
            <Input
              value={settings.companyName}
              onChange={(e) => handleSettingChange('companyName', e.target.value)}
              className="text-base py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Adresse
            </label>
            <Input
              value={settings.companyAddress}
              onChange={(e) => handleSettingChange('companyAddress', e.target.value)}
              className="text-base py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Téléphone
            </label>
            <Input
              value={settings.companyPhone}
              onChange={(e) => handleSettingChange('companyPhone', e.target.value)}
              className="text-base py-3"
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
              className="text-base py-3"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-medium text-foreground mb-6">Préférences régionales</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Langue
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full px-4 py-3 text-base border border-border rounded-lg bg-background text-foreground"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Devise
            </label>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              className="w-full px-4 py-3 text-base border border-border rounded-lg bg-background text-foreground"
            >
              <option value="FCFA">FCFA (Franc CFA)</option>
              <option value="EUR">Euro (€)</option>
              <option value="USD">Dollar US ($)</option>
              <option value="CAD">Dollar Canadien (CAD)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderListSettings = () => (
    <div className="space-y-8">
      <h3 className="text-xl font-medium text-foreground mb-6">Configuration des listes système</h3>
      
      {Object.entries({
        vehicleTypes: 'Types de véhicules',
        fuelTypes: 'Types de carburant',
        maintenanceTypes: 'Types de maintenance',
        violationTypes: 'Types de contraventions',
        userRoles: 'Rôles utilisateurs',
        departments: 'Départements'
      }).map(([key, label]) => (
        <div key={key} className="space-y-4">
          <h4 className="text-lg font-medium text-foreground">{label}</h4>
          <div className="space-y-3">
            {(settings[key] as string[]).map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <Input
                  value={item}
                  onChange={(e) => {
                    const newList = [...(settings[key] as string[])];
                    newList[index] = e.target.value;
                    handleSettingChange(key, newList);
                  }}
                  className="flex-1 text-base py-3"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleListItemRemove(key, index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Supprimer
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => {
                const newItem = prompt(`Ajouter un nouveau ${label.toLowerCase()}:`);
                if (newItem) handleListItemAdd(key, newItem);
              }}
              className="w-full text-base py-3"
            >
              + Ajouter un élément
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-8">
      <h3 className="text-xl font-medium text-foreground mb-6">Préférences de notification</h3>
      <div className="space-y-6">
        {[
          { key: 'emailNotifications', label: 'Notifications par email', desc: 'Recevoir les alertes par email' },
          { key: 'maintenanceAlerts', label: 'Alertes de maintenance', desc: 'Notifications pour les maintenances dues' },
          { key: 'fuelAlerts', label: 'Alertes de carburant', desc: 'Alertes de consommation élevée' },
          { key: 'violationAlerts', label: 'Alertes de contravention', desc: 'Notifications des infractions' },
        ].map(notification => (
          <div key={notification.key} className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <label className="text-base font-medium text-foreground">{notification.label}</label>
              <p className="text-sm text-muted-foreground">{notification.desc}</p>
            </div>
            <input
              type="checkbox"
              checked={settings[notification.key]}
              onChange={(e) => handleSettingChange(notification.key, e.target.checked)}
              className="w-5 h-5 rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-8">
      <h3 className="text-xl font-medium text-foreground mb-6">Paramètres de sécurité</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-base font-medium text-foreground mb-3">
            Durée de session (minutes)
          </label>
          <Input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
            className="text-base py-3"
          />
        </div>
        <div>
          <label className="block text-base font-medium text-foreground mb-3">
            Expiration mot de passe (jours)
          </label>
          <Input
            type="number"
            value={settings.passwordExpiry}
            onChange={(e) => handleSettingChange('passwordExpiry', e.target.value)}
            className="text-base py-3"
          />
        </div>
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div>
            <label className="text-base font-medium text-foreground">Authentification à deux facteurs</label>
            <p className="text-sm text-muted-foreground">Sécurité renforcée pour la connexion</p>
          </div>
          <input
            type="checkbox"
            checked={settings.twoFactorAuth}
            onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
            className="w-5 h-5 rounded"
          />
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-8">
      <h3 className="text-xl font-medium text-foreground mb-6">Personnalisation</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-base font-medium text-foreground mb-3">
            Thème de l'application
          </label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
            className="w-full px-4 py-3 text-base border border-border rounded-lg bg-background text-foreground"
          >
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
            <option value="system">Système (automatique)</option>
          </select>
          <p className="text-sm text-muted-foreground mt-2">
            Le thème système s'adapte automatiquement aux préférences de votre appareil
          </p>
        </div>
        
        <div>
          <label className="block text-base font-medium text-foreground mb-3">
            Couleur principale
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
              className="w-16 h-12 rounded border border-border cursor-pointer"
            />
            <Input
              value={settings.primaryColor}
              onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
              className="flex-1 text-base py-3"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-8">
      <h3 className="text-xl font-medium text-foreground mb-6">Paramètres système</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div>
            <label className="text-base font-medium text-foreground">Sauvegarde automatique</label>
            <p className="text-sm text-muted-foreground">Sauvegarde automatique des données</p>
          </div>
          <input
            type="checkbox"
            checked={settings.autoBackup}
            onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
            className="w-5 h-5 rounded"
          />
        </div>
        <div>
          <label className="block text-base font-medium text-foreground mb-3">
            Fréquence de sauvegarde
          </label>
          <select
            value={settings.backupFrequency}
            onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
            className="w-full px-4 py-3 text-base border border-border rounded-lg bg-background text-foreground"
          >
            <option value="hourly">Chaque heure</option>
            <option value="daily">Quotidienne</option>
            <option value="weekly">Hebdomadaire</option>
            <option value="monthly">Mensuelle</option>
          </select>
        </div>
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div>
            <label className="text-base font-medium text-foreground">Mode maintenance</label>
            <p className="text-sm text-muted-foreground">Désactiver l'accès pendant la maintenance</p>
          </div>
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
            className="w-5 h-5 rounded"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Navigation des onglets */}
        <div className="xl:w-80">
          <div className="fleet-card p-6">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Paramètres</h2>
            <nav className="space-y-3">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-4 px-4 py-3 rounded-lg text-left transition-colors text-base ${
                    activeTab === tab.id 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
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
          <div className="fleet-card p-8">
            {activeTab === 'general' && renderGeneralSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'appearance' && renderAppearanceSettings()}
            {activeTab === 'lists' && renderListSettings()}
            {activeTab === 'system' && renderSystemSettings()}

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-4 mt-12 pt-8 border-t border-border">
              <Button variant="outline" onClick={handleReset} className="text-base py-3 px-6">
                Restaurer par défaut
              </Button>
              <Button onClick={handleSave} className="fleet-button-primary text-base py-3 px-6">
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
