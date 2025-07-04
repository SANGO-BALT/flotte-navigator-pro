import React, { useState } from 'react';
import { Settings, Palette, Bell, Shield, List, Zap, MapPin, Database, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface SettingsData {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notificationsEnabled: boolean;
  securityUpdatesEnabled: boolean;
  // Configuration Google Maps APIs
  googleMapsApiKey: string;
  enableRouteOptimization: boolean;
  enableDistanceMatrix: boolean;
  enableSnapToRoads: boolean;
  defaultTravelMode: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';
  avoidHighways: boolean;
  avoidTolls: boolean;
  fuelConsumptionRate: number; // L/100km
  fuelPrice: number; // FCFA/L
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SettingsData>({
    theme: 'system',
    language: 'fr',
    notificationsEnabled: true,
    securityUpdatesEnabled: true,
    // Configuration Google Maps APIs
    googleMapsApiKey: '',
    enableRouteOptimization: true,
    enableDistanceMatrix: true,
    enableSnapToRoads: true,
    defaultTravelMode: 'DRIVING',
    avoidHighways: false,
    avoidTolls: false,
    fuelConsumptionRate: 8, // L/100km
    fuelPrice: 650, // FCFA/L
  });

  const handleSave = () => {
    toast.success('Paramètres enregistrés avec succès!');
    console.log('Paramètres enregistrés:', settings);
  };

  const handleGoogleMapsTest = async () => {
    if (!settings.googleMapsApiKey) {
      toast.error('Veuillez d\'abord saisir votre clé API Google Maps');
      return;
    }

    try {
      // Test simple de l'API
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=Libreville,Gabon&key=${settings.googleMapsApiKey}`);
      const data = await response.json();
      
      if (data.status === 'OK') {
        toast.success('Configuration Google Maps testée avec succès!');
      } else {
        toast.error(`Erreur de configuration: ${data.status}`);
      }
    } catch (error) {
      toast.error('Erreur lors du test de l\'API Google Maps');
    }
  };

  return (
    <div className="p-12 max-w-8xl mx-auto min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar - Interface élargie */}
        <div className="lg:w-80">
          <h2 className="text-4xl font-bold text-foreground mb-8">Paramètres</h2>
          <nav className="space-y-3">
            {[
              { id: 'general', label: 'Général', icon: Settings },
              { id: 'appearance', label: 'Apparence', icon: Palette },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Sécurité', icon: Shield },
              { id: 'lists', label: 'Listes du système', icon: List },
              { id: 'integrations', label: 'Intégrations', icon: Zap },
              { id: 'googlemaps', label: 'Google Maps APIs', icon: MapPin },
              { id: 'backup', label: 'Sauvegarde', icon: Database },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 text-left rounded-lg transition-colors text-lg ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <tab.icon className="w-6 h-6" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content - Interface élargie */}
        <div className="flex-1">
          <div className="fleet-card p-10">
            {activeTab === 'general' && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <Settings className="w-10 h-10 text-blue-600" />
                  <div>
                    <h3 className="text-3xl font-semibold text-foreground">Paramètres Généraux</h3>
                    <p className="text-lg text-muted-foreground">Configuration de base du système</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-lg font-medium text-foreground mb-3">
                      Thème
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value as 'light' | 'dark' | 'system' }))}
                      className="w-full px-4 py-3 text-lg border border-border rounded-lg bg-background text-foreground"
                    >
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                      <option value="system">Système</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-foreground mb-3">
                      Langue
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-4 py-3 text-lg border border-border rounded-lg bg-background text-foreground"
                    >
                      <option value="fr">Français</option>
                      <option value="en">Anglais</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <Palette className="w-10 h-10 text-purple-600" />
                  <div>
                    <h3 className="text-3xl font-semibold text-foreground">Apparence</h3>
                    <p className="text-lg text-muted-foreground">Personnalisation de l'interface</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <p className="text-lg text-foreground">
                    Fonctionnalité en cours de développement...
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <Bell className="w-10 h-10 text-yellow-600" />
                  <div>
                    <h3 className="text-3xl font-semibold text-foreground">Notifications</h3>
                    <p className="text-lg text-muted-foreground">Gestion des alertes et notifications</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <label className="text-lg font-medium text-foreground">Activer les notifications</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notificationsEnabled}
                        onChange={(e) => setSettings(prev => ({ ...prev, notificationsEnabled: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <Shield className="w-10 h-10 text-red-600" />
                  <div>
                    <h3 className="text-3xl font-semibold text-foreground">Sécurité</h3>
                    <p className="text-lg text-muted-foreground">Paramètres de sécurité et confidentialité</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <label className="text-lg font-medium text-foreground">Activer les mises à jour de sécurité</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.securityUpdatesEnabled}
                        onChange={(e) => setSettings(prev => ({ ...prev, securityUpdatesEnabled: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'lists' && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <List className="w-10 h-10 text-gray-600" />
                  <div>
                    <h3 className="text-3xl font-semibold text-foreground">Listes du système</h3>
                    <p className="text-lg text-muted-foreground">Gestion des listes de données du système</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <p className="text-lg text-foreground">
                    Fonctionnalité en cours de développement...
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <Zap className="w-10 h-10 text-orange-600" />
                  <div>
                    <h3 className="text-3xl font-semibold text-foreground">Intégrations</h3>
                    <p className="text-lg text-muted-foreground">Connexion avec d'autres services et applications</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <p className="text-lg text-foreground">
                    Fonctionnalité en cours de développement...
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'googlemaps' && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <MapPin className="w-10 h-10 text-blue-600" />
                  <div>
                    <h3 className="text-3xl font-semibold text-foreground">Google Maps APIs</h3>
                    <p className="text-lg text-muted-foreground">Configuration des services de géolocalisation</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Configuration API */}
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="text-xl font-semibold text-foreground mb-4">Configuration de l'API</h4>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-medium text-foreground mb-3">
                          Clé API Google Maps
                        </label>
                        <div className="flex gap-4">
                          <Input
                            type="password"
                            placeholder="Saisissez votre clé API Google Maps"
                            value={settings.googleMapsApiKey}
                            onChange={(e) => setSettings(prev => ({ ...prev, googleMapsApiKey: e.target.value }))}
                            className="flex-1 h-12 text-lg"
                          />
                          <Button onClick={handleGoogleMapsTest} variant="outline" className="h-12 px-6 text-lg">
                            Tester
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Obtenez votre clé API sur{' '}
                          <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Google Cloud Console
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Services activés */}
                  <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="text-xl font-semibold text-foreground mb-4">Services activés</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">Routes API</p>
                          <p className="text-sm text-muted-foreground">Calcul d'itinéraires</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.enableRouteOptimization}
                            onChange={(e) => setSettings(prev => ({ ...prev, enableRouteOptimization: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">Distance Matrix</p>
                          <p className="text-sm text-muted-foreground">Calcul de distances</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.enableDistanceMatrix}
                            onChange={(e) => setSettings(prev => ({ ...prev, enableDistanceMatrix: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">Snap to Roads</p>
                          <p className="text-sm text-muted-foreground">Alignement routes</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.enableSnapToRoads}
                            onChange={(e) => setSettings(prev => ({ ...prev, enableSnapToRoads: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Paramètres de trajet */}
                  <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <h4 className="text-xl font-semibold text-foreground mb-4">Paramètres de trajet</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-lg font-medium text-foreground mb-3">
                          Mode de transport par défaut
                        </label>
                        <select
                          value={settings.defaultTravelMode}
                          onChange={(e) => setSettings(prev => ({ ...prev, defaultTravelMode: e.target.value as 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT' }))}
                          className="w-full px-4 py-3 text-lg border border-border rounded-lg bg-background text-foreground"
                        >
                          <option value="DRIVING">Conduite</option>
                          <option value="WALKING">Marche</option>
                          <option value="BICYCLING">Vélo</option>
                          <option value="TRANSIT">Transport en commun</option>
                        </select>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-lg font-medium text-foreground">Éviter les autoroutes</label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.avoidHighways}
                              onChange={(e) => setSettings(prev => ({ ...prev, avoidHighways: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="text-lg font-medium text-foreground">Éviter les péages</label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.avoidTolls}
                              onChange={(e) => setSettings(prev => ({ ...prev, avoidTolls: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Paramètres de carburant */}
                  <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h4 className="text-xl font-semibold text-foreground mb-4">Estimation de carburant</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-lg font-medium text-foreground mb-3">
                          Consommation moyenne (L/100km)
                        </label>
                        <Input
                          type="number"
                          step="0.1"
                          min="1"
                          max="50"
                          value={settings.fuelConsumptionRate}
                          onChange={(e) => setSettings(prev => ({ ...prev, fuelConsumptionRate: parseFloat(e.target.value) || 8 }))}
                          className="h-12 text-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-lg font-medium text-foreground mb-3">
                          Prix du carburant (FCFA/L)
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={settings.fuelPrice}
                          onChange={(e) => setSettings(prev => ({ ...prev, fuelPrice: parseInt(e.target.value) || 650 }))}
                          className="h-12 text-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* APIs disponibles */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <h4 className="text-xl font-semibold text-foreground mb-4">APIs Google Maps disponibles</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
                        <h5 className="font-semibold text-foreground">Routes API</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                          Calcul d'itinéraires optimisés avec waypoints et évitement de zones
                        </p>
                      </div>
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-green-500">
                        <h5 className="font-semibold text-foreground">Distance Matrix API</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                          Calcul de distances et temps de trajet entre plusieurs points
                        </p>
                      </div>
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-purple-500">
                        <h5 className="font-semibold text-foreground">Snap to Roads API</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                          Alignement précis des trajets GPS sur les routes existantes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'backup' && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <Database className="w-10 h-10 text-green-600" />
                  <div>
                    <h3 className="text-3xl font-semibold text-foreground">Sauvegarde</h3>
                    <p className="text-lg text-muted-foreground">Sauvegarde et restauration des données</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <p className="text-lg text-foreground">
                    Fonctionnalité en cours de développement...
                  </p>
                </div>
              </div>
            )}

            {/* Save Button - Interface élargie */}
            <div className="flex justify-end pt-8 mt-8 border-t border-border">
              <Button onClick={handleSave} size="lg" className="px-12 py-4 text-lg">
                <Save className="w-6 h-6 mr-3" />
                Enregistrer les paramètres
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
