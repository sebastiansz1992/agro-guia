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

export interface Tree {
  id: string;
  icon: string;
  name: string;
  category: TreeCategory;
  harvestTime: string;
  description: string;
  steps: TreeStep[];
}

