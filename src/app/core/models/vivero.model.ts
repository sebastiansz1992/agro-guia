export interface ViveroProduct {
  name: string;
  description: string;
  price: number;
  unit: string;
  treeId?: string;
}

export interface Vivero {
  id: string;
  name: string;
  location: string;
  phone?: string;
  whatsapp?: string;
  story: string;
  photo: string;
  foundedYear?: number;
  products: ViveroProduct[];
}
