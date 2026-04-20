export type Priority = 'low' | 'medium' | 'high';

export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  priority?: Priority;
  categoryId?: string;
  dueDate?: string;
  createdAtDate?: string;
};

export type Filter = 'all' | 'active' | 'completed';
export type SortOption = 'created' | 'dueDate' | 'priority' | 'alphabetical';
