import { useMemo, useState } from 'react'
import * as Sentry from '@sentry/react'
import ErrorTestPage from './ErrorTestPage'
import TodoFilter from './components/TodoFilter'
import type { Todo, TodoFilterType } from './types/todo'

const FallbackUI = ({ error, resetError }: { error: unknown; resetError: () => void }) => (
  <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
    <h2 style={{ color: '#e04e39' }}>에러가 발생했습니다 (ErrorBoundary 캡처됨)</h2>
    <pre style={{ background: '#f8f8f8', padding: '1rem', borderRadius: '6px', textAlign: 'left', maxWidth: '600px', margin: '1rem auto', overflow: 'auto' }}>
      {error instanceof Error ? error.message : String(error)}
    </pre>
    <p style={{ color: '#666' }}>이 에러는 Sentry에 자동으로 전송되었습니다.</p>
    <button
      onClick={resetError}
      style={{ background: '#6c5fc7', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' }}
    >
      다시 시도
    </button>
  </div>
)

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<TodoFilterType>('all')
  const [text, setText] = useState('')

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed)
      case 'completed':
        return todos.filter((todo) => todo.completed)
      default:
        return todos
    }
  }, [todos, filter])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text: trimmed, completed: false }])
    setText('')
  }

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ borderBottom: '2px solid #6c5fc7', paddingBottom: '0.5rem' }}>Todo</h1>

      <form onSubmit={addTodo} style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="할 일을 입력하세요"
          style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{ background: '#6c5fc7', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
        >
          추가
        </button>
      </form>

      <TodoFilter currentFilter={filter} onFilterChange={setFilter} />

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            style={{
              padding: '0.5rem',
              borderBottom: '1px solid #eee',
              cursor: 'pointer',
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#999' : '#333',
            }}
          >
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

function App() {
  return (
    <Sentry.ErrorBoundary fallback={FallbackUI} showDialog>
      <TodoApp />
      <ErrorTestPage />
    </Sentry.ErrorBoundary>
  )
}

export default App
