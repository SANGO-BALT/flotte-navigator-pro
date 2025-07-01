
import React from 'react';
import { Calendar, Wrench, Clock } from 'lucide-react';

const MaintenanceSchedule: React.FC = () => {
  const maintenances = [
    {
      id: 1,
      vehicle: 'AB-123-CD',
      type: 'Révision complète',
      date: '2024-07-05',
      status: 'programmé',
    },
    {
      id: 2,
      vehicle: 'EF-456-GH',
      type: 'Changement pneus',
      date: '2024-07-08',
      status: 'en_attente',
    },
    {
      id: 3,
      vehicle: 'IJ-789-KL',
      type: 'Contrôle technique',
      date: '2024-07-12',
      status: 'programmé',
    },
  ];

  const statusColors = {
    programmé: 'bg-blue-100 text-blue-800',
    en_attente: 'bg-yellow-100 text-yellow-800',
    terminé: 'bg-green-100 text-green-800',
  };

  return (
    <div className="fleet-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Planning Maintenance</h3>
        <Calendar className="w-5 h-5 text-muted-foreground" />
      </div>
      
      <div className="space-y-3">
        {maintenances.map((maintenance) => (
          <div key={maintenance.id} className="p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Wrench className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">{maintenance.vehicle}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[maintenance.status]}`}>
                {maintenance.status}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-1">{maintenance.type}</p>
            
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{new Date(maintenance.date).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceSchedule;
