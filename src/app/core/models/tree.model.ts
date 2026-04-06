export interface TreeMetric {
  label: string;
  value: string;
}

export interface TreeStep {
  id: number;
  label: string;
  icon: string;
  title: string;
  metrics: TreeMetric[];
  tips: string[];
  alert?: string;
}

export type TreeCategory = 'frutal' | 'tropical' | 'cacao';

export type ZoneId = 'san-vicente' | 'yali' | 'rionegro' | 'san-jeronimo';

export interface Zone {
  id: ZoneId;
  name: string;
  icon: string;
  altitude: string;
  climate: string;
}

export interface Tree {
  id: string;
  icon: string;
  name: string;
  category: TreeCategory;
  harvestTime: string;
  description: string;
  zones: ZoneId[];
  steps: TreeStep[];
}

