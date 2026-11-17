export type ItemCondition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR';
export type ItemStatus = 'STORED' | 'LISTED' | 'SOLD';

export interface StorageItem {
  id?: string;
  userId: string;
  title: string;
  description: string;  
  categoryId: string;
  condition: ItemCondition;
  status: ItemStatus;       
  images: string[];        
  createdAt: string;
}