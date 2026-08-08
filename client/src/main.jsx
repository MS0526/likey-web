import { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// 에러 잡는 컴포넌트 추가. 렌더링 중에 에러가 발생하면 화면에 에러 메시지를 보여줌
class ErrorCatcher extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'monospace', color: '#B00' }}>
          <h1 style={{ fontSize: 20 }}>렌더링 에러</h1>
          <p style={{ marginTop: 12, fontSize: 15 }}>{this.state.error.message}</p>
          <pre style={{ marginTop: 16, fontSize: 12, whiteSpace: 'pre-wrap', color: '#555' }}>
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorCatcher>
      <App />
    </ErrorCatcher>
  </StrictMode>
);
