
import React from 'react';
import { X, MapPin, Calendar, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GPSHistoryModalProps {
  vehicleId: string;
  onClose: () => void;
}

const GPSHistoryModal: React.FC<GPSHistoryModalProps> = ({ vehicleId, onClose }) => {
  // Données d'exemple d'historique GPS
  const historyData = [
    {
      id: '1',
      timestamp: '2024-07-01 14:30:00',
      location: 'Avenue Bouet, Libreville',
      coordinates: { lat: 0.4162, lng: 9.4673 },
      speed: 45,
      status: 'en-mouvement'
    },
    {
      id: '2',
      timestamp: '2024-07-01 14:15:00',
      location: 'Boulevard Triomphal, Libreville',
      coordinates: { lat: 0.4125, lng: 9.4521 },
      speed: 35,
      status: 'en-mouvement'
    },
    {
      id: '3',
      timestamp: '2024-07-01 14:00:00',
      location: 'Marché Mont-Bouët, Libreville',
      coordinates: { lat: 0.4089, lng: 9.4478 },
      speed: 0,
      status: 'arrêté'
    },
    {
      id: '4',
      timestamp: '2024-07-01 13:45:00',
      location: 'Aéroport Léon-Mba, Libreville',
      coordinates: { lat: 0.4586, lng: 9.4123 },
      speed: 60,
      status: 'en-mouvement'
    },
  ];

  const vehicle = {
    plate: 'AB-123-CD',
    brand: 'Peugeot 308',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Historique GPS
              </h2>
              <p className="text-sm text-muted-foreground">
                {vehicle.plate} - {vehicle.brand}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          {/* Filtres de date */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                defaultValue="2024-07-01"
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">à</span>
              <input
                type="date"
                defaultValue="2024-07-01"
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              />
            </div>
            <Button variant="outline">
              Filtrer
            </Button>
          </div>

          {/* Timeline d'historique */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Parcours du 01/07/2024
            </h3>
            
            {historyData.map((entry, index) => (
              <div key={entry.id} className="relative">
                {/* Ligne de connexion */}
                {index < historyData.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-border"></div>
                )}
                
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    entry.status === 'en-mouvement' ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    {entry.status === 'en-mouvement' ? (
                      <Navigation className="w-5 h-5 text-green-600" />
                    ) : (
                      <MapPin className="w-5 h-5 text-orange-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {new Date(entry.timestamp).toLocaleTimeString('fr-FR')}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        entry.status === 'en-mouvement' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {entry.status === 'en-mouvement' ? 'En mouvement' : 'Arrêté'}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-foreground font-medium">{entry.location}</p>
                      <p className="text-sm text-muted-foreground">
                        Coordonnées: {entry.coordinates.lat.toFixed(4)}, {entry.coordinates.lng.toFixed(4)}
                      </p>
                      {entry.speed > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Vitesse: {entry.speed} km/h
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Résumé du parcours */}
          <div className="mt-6 p-4 bg-primary/5 rounded-lg">
            <h4 className="font-semibold text-foreground mb-3">Résumé du parcours</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Distance parcourue:</span>
                <p className="font-medium text-foreground">45.2 km</p>
              </div>
              <div>
                <span className="text-muted-foreground">Temps de conduite:</span>
                <p className="font-medium text-foreground">1h 15min</p>
              </div>
              <div>
                <span className="text-muted-foreground">Vitesse moyenne:</span>
                <p className="font-medium text-foreground">36 km/h</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button className="fleet-button-primary">
            Exporter PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GPSHistoryModal;
