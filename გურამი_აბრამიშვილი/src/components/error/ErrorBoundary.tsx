import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Error boundaries can only be class components: React has no hook equivalent.
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  // Called while rendering: switches the next render to the fallback UI.
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  // Called after the error: the place for logging.
  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div role="alert" className="container-page py-16">
        <div className="card mx-auto max-w-lg space-y-4 p-8 text-center">
          <h1 className="text-2xl font-bold">Something went wrong.</h1>
          <p className="text-muted">An unexpected error happened while showing this page. Reloading usually fixes it.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-5 font-semibold text-white transition-colors hover:bg-brand-hover focus-ring"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
