import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary specifically designed to catch and handle errors
 * from browser extensions without disrupting the user experience
 */
export class ExtensionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Check if this is a browser extension error
    const isExtensionError = 
      error.stack?.includes('injected.js') ||
      error.stack?.includes('chrome-extension://') ||
      error.stack?.includes('moz-extension://') ||
      error.stack?.includes('extension') ||
      error.message?.includes('extension');

    if (isExtensionError) {
      console.warn('[Carbon] Browser extension error caught and suppressed:', error);
      // Don't show error UI for extension errors
      return { hasError: false };
    }

    // For real application errors, show the error UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Check if this is a browser extension error
    const isExtensionError = 
      error.stack?.includes('injected.js') ||
      error.stack?.includes('chrome-extension://') ||
      error.stack?.includes('moz-extension://') ||
      errorInfo.componentStack?.includes('injected');

    if (isExtensionError) {
      console.warn('[Carbon] Browser extension error details:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
      
      // Reset the error state so the app continues working
      this.setState({ hasError: false, error: null, errorInfo: null });
      return;
    }

    // Log real application errors
    console.error('[Carbon] Application error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="max-w-md w-full bg-destructive/10 border border-destructive rounded-lg p-6">
            <h2 className="text-lg font-semibold text-destructive mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              An unexpected error occurred. Please refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Global error handler to catch unhandled errors from browser extensions
 */
export function setupGlobalErrorHandlers() {
  // Catch unhandled errors
  window.addEventListener('error', (event) => {
    const isExtensionError = 
      event.filename?.includes('injected.js') ||
      event.filename?.includes('chrome-extension://') ||
      event.filename?.includes('moz-extension://') ||
      event.error?.stack?.includes('injected') ||
      event.error?.stack?.includes('extension');

    if (isExtensionError) {
      console.warn('[Carbon] Global error from browser extension suppressed:', event.error);
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const isExtensionError = 
      event.reason?.stack?.includes('injected') ||
      event.reason?.stack?.includes('extension') ||
      event.reason?.message?.includes('extension');

    if (isExtensionError) {
      console.warn('[Carbon] Unhandled rejection from browser extension suppressed:', event.reason);
      event.preventDefault();
      return false;
    }
  });

  // Protect against extension-modified prototypes
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    const wrappedListener = function(this: any, event: Event) {
      try {
        if (typeof listener === 'function') {
          return listener.call(this, event);
        } else if (listener && typeof listener.handleEvent === 'function') {
          return listener.handleEvent(event);
        }
      } catch (error) {
        if (error instanceof Error && error.stack?.includes('injected')) {
          console.warn('[Carbon] Event listener error from extension suppressed');
          return;
        }
        throw error;
      }
    };

    return originalAddEventListener.call(this, type, wrappedListener, options);
  };
}
