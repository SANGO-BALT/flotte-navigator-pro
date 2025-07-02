
export interface UserPermissions {
  vehicles: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    print: boolean;
  };
  users: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    print: boolean;
  };
  maintenance: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    print: boolean;
  };
  gps: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    export: boolean;
  };
  fuel: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    print: boolean;
  };
  violations: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    print: boolean;
  };
  travel: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    print: boolean;
    booking: boolean;
    invoice: boolean;
  };
  documents: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    download: boolean;
  };
  reports: {
    view: boolean;
    generate: boolean;
    export: boolean;
  };
  settings: {
    view: boolean;
    edit: boolean;
  };
  userManagement: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
}

export const getPermissionsByRole = (role: string): UserPermissions => {
  const basePermissions: UserPermissions = {
    vehicles: { view: false, create: false, edit: false, delete: false, print: false },
    users: { view: false, create: false, edit: false, delete: false, print: false },
    maintenance: { view: false, create: false, edit: false, delete: false, print: false },
    gps: { view: false, create: false, edit: false, delete: false, export: false },
    fuel: { view: false, create: false, edit: false, delete: false, print: false },
    violations: { view: false, create: false, edit: false, delete: false, print: false },
    travel: { view: false, create: false, edit: false, delete: false, print: false, booking: false, invoice: false },
    documents: { view: false, create: false, edit: false, delete: false, download: false },
    reports: { view: false, generate: false, export: false },
    settings: { view: false, edit: false },
    userManagement: { view: false, create: false, edit: false, delete: false },
  };

  switch (role) {
    case 'super-admin':
      // Toutes les permissions
      Object.keys(basePermissions).forEach(module => {
        Object.keys(basePermissions[module]).forEach(action => {
          basePermissions[module][action] = true;
        });
      });
      break;

    case 'manager':
      // Permissions élevées sauf gestion utilisateurs système
      Object.keys(basePermissions).forEach(module => {
        if (module !== 'userManagement') {
          Object.keys(basePermissions[module]).forEach(action => {
            basePermissions[module][action] = true;
          });
        }
      });
      break;

    case 'operator':
      // Permissions opérationnelles
      basePermissions.vehicles = { view: true, create: true, edit: true, delete: false, print: true };
      basePermissions.users = { view: true, create: true, edit: true, delete: false, print: true };
      basePermissions.maintenance = { view: true, create: true, edit: true, delete: false, print: true };
      basePermissions.gps = { view: true, create: false, edit: false, delete: false, export: true };
      basePermissions.fuel = { view: true, create: true, edit: true, delete: false, print: true };
      basePermissions.violations = { view: true, create: true, edit: true, delete: false, print: true };
      basePermissions.travel = { view: true, create: true, edit: true, delete: false, print: true, booking: true, invoice: true };
      basePermissions.documents = { view: true, create: true, edit: false, delete: false, download: true };
      basePermissions.reports = { view: true, generate: true, export: false };
      basePermissions.settings = { view: true, edit: false };
      break;

    case 'viewer':
      // Permissions lecture seule
      Object.keys(basePermissions).forEach(module => {
        if (module !== 'userManagement') {
          basePermissions[module].view = true;
          if (module === 'documents') {
            basePermissions[module].download = true;
          }
          if (module === 'reports') {
            basePermissions[module].generate = true;
          }
          if (module === 'travel') {
            basePermissions[module].booking = true;
          }
        }
      });
      break;
  }

  return basePermissions;
};

export const hasPermission = (userRole: string, module: string, action: string): boolean => {
  const permissions = getPermissionsByRole(userRole);
  return permissions[module]?.[action] || false;
};
