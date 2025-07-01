
import React from 'react';
import { AlertTriangle, Calendar, Wrench } from 'lucide-react';

const VehicleAlerts: React.FC = () => {
  const alerts = [
    {
      id: 1,
      type: 'service',
      message: 'Peugeot 308 - 5 ans de service atteints',
      vehicle: 'AB-123-CD',
      priority: 'high',
      icon: Calendar,
    },
    {
      id: 2,
      type: 'maintenance',
      message: 'Maintenance programmée dans 3 jours',
      vehicle: 'EF-456-GH',
      priority: 'medium',
      icon: Wrench,
    },
    {
      id: 3,
      type: 'violation',
      message: 'Nouvelle contravention reçue',
      vehicle: 'IJ-789-KL',
      priority: 'low',
      icon: AlertTriangle,
    },
  ];

  const priorityColors = {
    high: 'border-red-500 bg-red-50',
    medium: 'border-orange-500 bg-orange-50',
    low: 'border-yellow-500 bg-yellow-50',
  };

  return (
    <div className="fleet-card">
      <h3 className="text-lg font-semibold mb-4">Alertes et Notifications</h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 border-l-4 rounded-r-lg ${priorityColors[alert.priority]}`}
          >
            <div className="flex items-start space-x-3">
              <alert.icon className="w-5 h-5 mt-0.5 text-gray-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                <p className="text-xs text-gray-600 mt-1">Véhicule: {alert.vehicle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleAlerts;
