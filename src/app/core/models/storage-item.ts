export type ItemCondition = 'Nuevo' | 'Como nuevo' | 'Buen estado' | 'Regular';
export type ItemStatus = 'STORED' | 'LISTED' | 'SOLD';

export interface StorageItem {
  id?: string;
  userId: string;
  title: string;
  description: string;  
  condition: ItemCondition;
  status: ItemStatus;       
  images: string[];        
  createdAt: string;
}