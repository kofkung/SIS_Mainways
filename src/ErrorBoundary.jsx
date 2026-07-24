import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("SIS website render error", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="system-message-page">
        <div className="system-message-card">
          <p className="section-kicker">SIS Website</p>
          <h1>เกิดข้อผิดพลาดชั่วคราว</h1>
          <p>Temporary error. Please refresh the page and try again.</p>
          <button className="btn btn-primary" type="button" onClick={() => window.location.reload()}>
            โหลดหน้าอีกครั้ง / Reload
          </button>
        </div>
      </main>
    );
  }
}
