
import React from 'react';
import { X, User, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  address: string;
  profession: string;
  grade: string;
  licenseNumber: string;
  status: string;
  joinDate: string;
  leaveStatus?: string;
  leaveStartDate?: string;
  leaveEndDate?: string;
  image?: string;
}

interface UserPrintModalProps {
  user: User;
  onClose: () => void;
}

const UserPrintModal: React.FC<UserPrintModalProps> = ({ user, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto print:shadow-none print:max-w-none print:max-h-none">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Fiche Utilisateur - {user.firstName} {user.lastName}</h2>
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="fleet-button-primary">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-8 print:p-6">
          {/* En-tête */}
          <div className="text-center mb-8 print:mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">FICHE UTILISATEUR</h1>
            <div className="text-lg font-bold text-gray-700">{user.firstName} {user.lastName}</div>
            <div className="text-sm text-gray-600">{user.profession} - {user.grade}</div>
          </div>

          {/* Photo de profil */}
          <div className="mb-6 text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto border-4 border-gray-200">
              <img
                src={user.image || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80`}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Informations personnelles</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Téléphone:</span>
                  <span>{user.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date de naissance:</span>
                  <span>{new Date(user.birthDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sexe:</span>
                  <span>{user.gender === 'M' ? 'Homme' : 'Femme'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Informations professionnelles</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Profession:</span>
                  <span>{user.profession}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Grade:</span>
                  <span>{user.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">N° Permis:</span>
                  <span>{user.licenseNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Statut:</span>
                  <span>{user.status === 'active' ? 'Actif' : 'Inactif'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date d'embauche:</span>
                  <span>{new Date(user.joinDate).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Adresse</h3>
            <p>{user.address}</p>
          </div>

          {/* Congés si applicable */}
          {user.leaveStatus && user.leaveStatus !== 'none' && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Congé en cours</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex justify-between">
                  <span className="font-medium">Type:</span>
                  <span>
                    {user.leaveStatus === 'leave' && 'Congé'}
                    {user.leaveStatus === 'mission' && 'Mission'}
                    {user.leaveStatus === 'sick' && 'Congé maladie'}
                    {user.leaveStatus === 'maternity' && 'Congé maternité'}
                  </span>
                </div>
                {user.leaveStartDate && (
                  <div className="flex justify-between">
                    <span className="font-medium">Début:</span>
                    <span>{new Date(user.leaveStartDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
                {user.leaveEndDate && (
                  <div className="flex justify-between">
                    <span className="font-medium">Fin:</span>
                    <span>{new Date(user.leaveEndDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pied de page */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>Fiche générée le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPrintModal;
