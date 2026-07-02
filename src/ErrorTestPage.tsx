import { useState } from 'react'
import * as Sentry from '@sentry/react'

function BrokenComponent() {
  throw new Error('렌더링 중 강제 에러 발생 (React Error Boundary 테스트)')
}

export default function ErrorTestPage() {
  const [showBroken, setShowBroken] = useState(false)

  const triggerJsError = () => {
    throw new Error('JavaScript 런타임 에러 테스트')
  }

  const triggerUnhandledPromise = () => {
    Promise.reject(new Error('처리되지 않은 Promise 거부 테스트'))
  }

  const triggerManualCapture = () => {
    Sentry.captureException(new Error('수동으로 캡처한 예외 (captureException)'))
    alert('Sentry에 예외가 수동으로 전송되었습니다.')
  }

  const triggerManualMessage = () => {
    Sentry.captureMessage('수동 메시지 테스트 (captureMessage)', 'warning')
    alert('Sentry에 경고 메시지가 전송되었습니다.')
  }

  const triggerTypeError = () => {
    const obj = null
    // @ts-expect-error intentional null access
    obj.nonExistentMethod()
  }

  const triggerNetworkError = async () => {
    try {
      await fetch('https://this-domain-does-not-exist-sentry-test.invalid/api')
    } catch (err) {
      Sentry.captureException(err)
      alert('네트워크 에러가 Sentry에 전송되었습니다.')
    }
  }

  const triggerWithContext = () => {
    Sentry.withScope((scope) => {
      scope.setUser({ id: 'user-42', email: 'test@example.com' })
      scope.setTag('test_type', 'context_error')
      scope.setExtra('debugInfo', { buttonClicked: 'contextError', timestamp: Date.now() })
      Sentry.captureException(new Error('사용자 컨텍스트가 포함된 에러 테스트'))
    })
    alert('사용자 컨텍스트가 포함된 에러가 Sentry에 전송되었습니다.')
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ borderBottom: '2px solid #6c5fc7', paddingBottom: '0.5rem' }}>
        🔍 Sentry 에러 테스트 환경
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        아래 버튼을 클릭하여 다양한 종류의 에러를 Sentry로 전송하세요.
        <br />
        <strong>Organization:</strong> papa-jg &nbsp;|&nbsp; <strong>Project:</strong> papa-jg
      </p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <ErrorSection title="런타임 에러">
          <TestButton
            label="JavaScript 에러 발생"
            description="try/catch 없이 throw — window.onerror로 캡처됨"
            color="#e04e39"
            onClick={triggerJsError}
          />
          <TestButton
            label="TypeError (null 접근)"
            description="null 객체의 메서드 호출"
            color="#e04e39"
            onClick={triggerTypeError}
          />
          <TestButton
            label="미처리 Promise 거부"
            description="unhandledrejection 이벤트로 캡처됨"
            color="#f0a500"
            onClick={triggerUnhandledPromise}
          />
        </ErrorSection>

        <ErrorSection title="수동 캡처">
          <TestButton
            label="captureException()"
            description="에러 객체를 직접 Sentry에 전송"
            color="#6c5fc7"
            onClick={triggerManualCapture}
          />
          <TestButton
            label="captureMessage() - warning"
            description="경고 메시지를 Sentry에 전송"
            color="#6c5fc7"
            onClick={triggerManualMessage}
          />
          <TestButton
            label="사용자 컨텍스트 포함 에러"
            description="user/tag/extra가 붙은 에러 전송"
            color="#6c5fc7"
            onClick={triggerWithContext}
          />
        </ErrorSection>

        <ErrorSection title="네트워크">
          <TestButton
            label="네트워크 에러"
            description="존재하지 않는 URL fetch → captureException"
            color="#2b7de9"
            onClick={triggerNetworkError}
          />
        </ErrorSection>

        <ErrorSection title="React Error Boundary">
          <TestButton
            label="컴포넌트 렌더 에러"
            description="렌더 중 throw → ErrorBoundary가 잡아 Sentry 전송"
            color="#e04e39"
            onClick={() => setShowBroken(true)}
          />
          {showBroken && <BrokenComponent />}
        </ErrorSection>
      </div>
    </div>
  )
}

function ErrorSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1rem' }}>
      <h3 style={{ margin: '0 0 0.75rem', color: '#444', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>{children}</div>
    </div>
  )
}

function TestButton({
  label,
  description,
  color,
  onClick,
}: {
  label: string
  description: string
  color: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      title={description}
      style={{
        background: color,
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: 600,
      }}
    >
      {label}
    </button>
  )
}
