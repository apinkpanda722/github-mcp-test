import * as Sentry from '@sentry/react'
import ErrorTestPage from './ErrorTestPage'

const FallbackUI = ({ error, resetError }: { error: Error; resetError: () => void }) => (
  <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
    <h2 style={{ color: '#e04e39' }}>에러가 발생했습니다 (ErrorBoundary 캡처됨)</h2>
    <pre style={{ background: '#f8f8f8', padding: '1rem', borderRadius: '6px', textAlign: 'left', maxWidth: '600px', margin: '1rem auto', overflow: 'auto' }}>
      {error.message}
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

function App() {
  return (
    <Sentry.ErrorBoundary fallback={FallbackUI} showDialog>
      <ErrorTestPage />
    </Sentry.ErrorBoundary>
  )
}

export default App
