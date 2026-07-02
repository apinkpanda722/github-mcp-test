import type { TodoFilterType } from '../types/todo'

interface TodoFilterProps {
  currentFilter: TodoFilterType
  onFilterChange: (filter: TodoFilterType) => void
}

const FILTERS: { value: TodoFilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

export default function TodoFilter({ currentFilter, onFilterChange }: TodoFilterProps) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          aria-pressed={currentFilter === value}
          style={{
            padding: '0.4rem 1rem',
            borderRadius: '6px',
            border: currentFilter === value ? '2px solid #6c5fc7' : '1px solid #ccc',
            background: currentFilter === value ? '#6c5fc7' : '#fff',
            color: currentFilter === value ? '#fff' : '#333',
            cursor: 'pointer',
            fontWeight: currentFilter === value ? 600 : 400,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
