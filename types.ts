
export interface GridData {
  region: string;
  substation: string;
  consumption: number; // MW
  capacity: number; // MW
  status: 'Normal' | 'Warning' | 'Critical';
  timestamp: string;
}

export interface DemandForecast {
  hour: string;
  predicted: number;
  historical: number;
}

export interface Alert {
  id: string;
  region: string;
  severity: 'High' | 'Medium' | 'Low';
  message: string;
  time: string;
}

export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  FORECAST = 'FORECAST',
  ALERTS = 'ALERTS',
  REPORTS = 'REPORTS'
}
