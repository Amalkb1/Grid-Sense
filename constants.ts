
import { GridData, Alert } from './types';

export const REGIONS = ['North Region', 'South Region', 'East Region', 'West Region', 'Central Region'];

export const INITIAL_GRID_DATA: GridData[] = [
  { region: 'North Region', substation: 'N-ALPHA', consumption: 450, capacity: 600, status: 'Normal', timestamp: new Date().toISOString() },
  { region: 'South Region', substation: 'S-BETA', consumption: 580, capacity: 600, status: 'Warning', timestamp: new Date().toISOString() },
  { region: 'East Region', substation: 'E-GAMMA', consumption: 320, capacity: 500, status: 'Normal', timestamp: new Date().toISOString() },
  { region: 'West Region', substation: 'W-DELTA', consumption: 720, capacity: 750, status: 'Critical', timestamp: new Date().toISOString() },
  { region: 'Central Region', substation: 'C-EPSILON', consumption: 510, capacity: 800, status: 'Normal', timestamp: new Date().toISOString() },
];

export const INITIAL_ALERTS: Alert[] = [
  { id: '1', region: 'West Region', severity: 'High', message: 'W-DELTA Substation operating at 96% capacity. Load shedding recommended.', time: '10 mins ago' },
  { id: '2', region: 'South Region', severity: 'Medium', message: 'Unexpected consumption spike in S-BETA industrial zone.', time: '25 mins ago' }
];

export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  grid: '#334155'
};
