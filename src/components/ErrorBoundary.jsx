import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    try {
      console.warn('[kreation] section failed', err && err.message);
    } catch {}
  }
  render() {
    if (!this.state.failed) return this.props.children;
    if (this.props.silent) return null;
    return (
      <div className={this.props.fullPage ? 'eb eb-full' : 'eb'} role="alert">
        <p className="eyebrow">KREATION</p>
        <p className="eb-t">Something did not load.</p>
        <button className="btn" onClick={() => (this.props.fullPage ? location.reload() : this.setState({ failed: false }))}>
          Try again
        </button>
        <p className="muted small">
          Or reach us directly on <a href="https://wa.me/919288508305">WhatsApp</a>.
        </p>
      </div>
    );
  }
}
