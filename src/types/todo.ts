export interface Todo {
  id: string
  text: string
  completed: boolean
}

export type TodoFilterType = 'all' | 'active' | 'completed'
