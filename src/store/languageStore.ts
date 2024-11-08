import { create } from 'zustand';

type Language = 'en' | 'it';

interface Translations {
  // Auth
  signIn: string;
  signOut: string;
  email: string;
  password: string;
  enterEmail: string;
  enterPassword: string;
  invalidCredentials: string;
  demoCredentials: string;
  fleet1Admin: string;
  fleet2Admin: string;
  driver: string;

  // Navigation
  dashboard: string;
  vehicles: string;
  drivers: string;
  schedule: string;
  reports: string;
  maintenance: string;
  settings: string;
  logout: string;

  // Dashboard
  fleetOverview: string;
  driverDashboard: string;
  totalVehicles: string;
  availableVehicles: string;
  inMaintenance: string;
  lastUpdated: string;
  completedRoutes: string;
  totalDistance: string;
  vehicleInspections: string;

  // Vehicles
  addVehicle: string;
  plateNumber: string;
  model: string;
  status: string;
  lastMaintenance: string;
  viewDetails: string;
  startInspection: string;
  endInspection: string;

  // Drivers
  inviteDriver: string;
  addDriver: string;
  fullName: string;
  phoneNumber: string;
  cancel: string;
  pending: string;
  accepted: string;

  // Schedule
  newAssignment: string;
  date: string;
  startTime: string;
  endTime: string;
  selectDriver: string;
  selectVehicle: string;
  createAssignment: string;
  todaysAssignments: string;
  noAssignments: string;
  assignmentsFor: string;
  viewPhotos: string;
  startPhotos: string;
  endPhotos: string;
  creating: string;
  createAssignments: string;
  odometerReading: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Auth
    signIn: 'Sign In',
    signOut: 'Sign Out',
    email: 'Email Address',
    password: 'Password',
    enterEmail: 'Enter your email',
    enterPassword: 'Enter your password',
    invalidCredentials: 'Invalid credentials',
    demoCredentials: 'Demo Credentials',
    fleet1Admin: 'Fleet 1 Admin: admin@fleet.com / admin123',
    fleet2Admin: 'Fleet 2 Admin: admin2@fleet.com / admin123',
    driver: 'Driver: driver@fleet.com / driver123',

    // Navigation
    dashboard: 'Dashboard',
    vehicles: 'Vehicles',
    drivers: 'Drivers',
    schedule: 'Schedule',
    reports: 'Reports',
    maintenance: 'Maintenance',
    settings: 'Settings',
    logout: 'Logout',

    // Dashboard
    fleetOverview: 'Fleet Overview',
    driverDashboard: 'Driver Dashboard',
    totalVehicles: 'Total Vehicles',
    availableVehicles: 'Available Vehicles',
    inMaintenance: 'In Maintenance',
    lastUpdated: 'Last updated',
    completedRoutes: 'Completed Routes',
    totalDistance: 'Total Distance',
    vehicleInspections: 'Vehicle Inspections',

    // Vehicles
    addVehicle: 'Add Vehicle',
    plateNumber: 'Plate Number',
    model: 'Model',
    status: 'Status',
    lastMaintenance: 'Last Maintenance',
    viewDetails: 'View Details',
    startInspection: 'Start Inspection',
    endInspection: 'End Inspection',

    // Drivers
    inviteDriver: 'Invite Driver',
    addDriver: 'Add Driver',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    cancel: 'Cancel',
    pending: 'Pending',
    accepted: 'Accepted',

    // Schedule
    newAssignment: 'New Assignment',
    date: 'Date',
    startTime: 'Start Time',
    endTime: 'End Time',
    selectDriver: 'Select a driver',
    selectVehicle: 'Select a vehicle',
    createAssignment: 'Create Assignment',
    todaysAssignments: "Today's Assignments",
    noAssignments: 'No assignments scheduled for this date',
    assignmentsFor: 'Assignments for',
    viewPhotos: 'View Photos',
    startPhotos: 'Start Photos',
    endPhotos: 'End Photos',
    creating: 'Creating...',
    createAssignments: 'Create Assignments',
    odometerReading: 'Odometer Reading',
  },
  it: {
    // Auth
    signIn: 'Accedi',
    signOut: 'Esci',
    email: 'Indirizzo Email',
    password: 'Password',
    enterEmail: 'Inserisci la tua email',
    enterPassword: 'Inserisci la tua password',
    invalidCredentials: 'Credenziali non valide',
    demoCredentials: 'Credenziali Demo',
    fleet1Admin: 'Admin Flotta 1: admin@fleet.com / admin123',
    fleet2Admin: 'Admin Flotta 2: admin2@fleet.com / admin123',
    driver: 'Autista: driver@fleet.com / driver123',

    // Navigation
    dashboard: 'Cruscotto',
    vehicles: 'Veicoli',
    drivers: 'Autisti',
    schedule: 'Programmazione',
    reports: 'Rapporti',
    maintenance: 'Manutenzione',
    settings: 'Impostazioni',
    logout: 'Esci',

    // Dashboard
    fleetOverview: 'Panoramica Flotta',
    driverDashboard: 'Cruscotto Autista',
    totalVehicles: 'Totale Veicoli',
    availableVehicles: 'Veicoli Disponibili',
    inMaintenance: 'In Manutenzione',
    lastUpdated: 'Ultimo aggiornamento',
    completedRoutes: 'Percorsi Completati',
    totalDistance: 'Distanza Totale',
    vehicleInspections: 'Ispezioni Veicoli',

    // Vehicles
    addVehicle: 'Aggiungi Veicolo',
    plateNumber: 'Targa',
    model: 'Modello',
    status: 'Stato',
    lastMaintenance: 'Ultima Manutenzione',
    viewDetails: 'Visualizza Dettagli',
    startInspection: 'Inizia Ispezione',
    endInspection: 'Termina Ispezione',

    // Drivers
    inviteDriver: 'Invita Autista',
    addDriver: 'Aggiungi Autista',
    fullName: 'Nome Completo',
    phoneNumber: 'Numero di Telefono',
    cancel: 'Annulla',
    pending: 'In Attesa',
    accepted: 'Accettato',

    // Schedule
    newAssignment: 'Nuovo Incarico',
    date: 'Data',
    startTime: 'Ora Inizio',
    endTime: 'Ora Fine',
    selectDriver: 'Seleziona un autista',
    selectVehicle: 'Seleziona un veicolo',
    createAssignment: 'Crea Incarico',
    todaysAssignments: 'Incarichi di Oggi',
    noAssignments: 'Nessun incarico programmato per questa data',
    assignmentsFor: 'Incarichi per',
    viewPhotos: 'Visualizza Foto',
    startPhotos: 'Foto Iniziali',
    endPhotos: 'Foto Finali',
    creating: 'Creazione in corso...',
    createAssignments: 'Crea Incarichi',
    odometerReading: 'Lettura Contachilometri',
  }
};

interface LanguageState {
  language: Language;
  translations: Translations;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'en',
  translations: translations.en,
  setLanguage: (language: Language) => 
    set({ language, translations: translations[language] })
}));