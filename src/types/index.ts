export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  priority?: Priority;
  categoryId?: string;
  dueDate?: string;
  createdAtDate?: string;
}

export type Priority = 'low' | 'medium' | 'high';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}