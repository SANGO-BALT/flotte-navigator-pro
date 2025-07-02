
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const FleetOverview: React.FC = () => {
  const vehicleStatusData = [
    { name: 'Actifs', value: 89, color: '#22c55e' },
    { name: 'En maintenance', value: 23, color: '#f59e0b' },
    { name: 'Inactifs', value: 12, color: '#ef4444' },
    { name: 'En mission', value: 32, color: '#3b82f6' },
  ];

  const monthlyData = [
    { month: 'Jan', missions: 45, maintenance: 8 },
    { month: 'Fév', missions: 52, maintenance: 12 },
    { month: 'Mar', missions: 48, maintenance: 15 },
    { month: 'Avr', missions: 61, maintenance: 9 },
    { month: 'Mai', missions: 55, maintenance: 11 },
    { month: 'Jun', missions: 67, maintenance: 7 },
  ];

  const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6'];

  return (
    <div className="fleet-card">
      <h3 className="text-lg font-semibold mb-4">Aperçu de la Flotte</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique en secteurs - Statut des véhicules */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Statut des véhicules</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {vehicleStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {vehicleStatusData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-muted-foreground">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Graphique en barres - Activité mensuelle */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Activité mensuelle</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="missions" fill="#3b82f6" name="Missions" />
                <Bar dataKey="maintenance" fill="#f59e0b" name="Maintenance" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">156</p>
          <p className="text-sm text-muted-foreground">Total véhicules</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-500">89</p>
          <p className="text-sm text-muted-foreground">Opérationnels</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-500">32</p>
          <p className="text-sm text-muted-foreground">En mission</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-500">23</p>
          <p className="text-sm text-muted-foreground">En maintenance</p>
        </div>
      </div>
    </div>
  );
};

export default FleetOverview;
