/**
 * Safe event handler wrapper to prevent browser extension interference
 * 
 * This utility wraps event handlers to catch and suppress errors from
 * browser extensions (like ad blockers, password managers) that inject
 * code and interfere with form interactions.
 */

export function safeEventHandler<T extends Event>(
  handler: ((event: T) => void) | undefined,
  fallback?: () => void
): (event: T) => void {
  return (event: T) => {
    try {
      // Check if the event is from an injected script
      const target = event.target as HTMLElement;
      const isInjected = 
        target?.ownerDocument?.defaultView !== window ||
        event.isTrusted === false;

      if (isInjected) {
        console.warn('[Carbon] Blocked event from injected script', event);
        event.stopPropagation();
        event.preventDefault();
        return;
      }

      handler?.(event);
    } catch (error) {
      // Log the error but don't let it crash the app
      console.error('[Carbon] Event handler error (possibly from browser extension):', error);
      
      // Try the fallback if provided
      try {
        fallback?.();
      } catch (fallbackError) {
        console.error('[Carbon] Fallback handler also failed:', fallbackError);
      }
    }
  };
}

/**
 * Wrap keyboard event handlers with additional protection
 */
export function safeKeyboardHandler<T extends KeyboardEvent>(
  handler: ((event: T) => void) | undefined,
  allowedKeys?: string[]
): (event: T) => void {
  return (event: T) => {
    try {
      // If allowedKeys is specified, only allow those keys
      if (allowedKeys && !allowedKeys.includes(event.key)) {
        return;
      }

      // Check for suspicious event properties that indicate injection
      const hasInjectedProperties = Object.keys(event).some(key => 
        key.startsWith('_') || key.includes('injected') || key.includes('extension')
      );

      if (hasInjectedProperties) {
        console.warn('[Carbon] Blocked keyboard event with injected properties', event);
        event.stopPropagation();
        event.preventDefault();
        return;
      }

      handler?.(event);
    } catch (error) {
      // Silently catch errors from browser extensions
      if (error instanceof Error && error.stack?.includes('injected.js')) {
        console.warn('[Carbon] Blocked error from injected.js:', error.message);
        event.stopPropagation();
        event.preventDefault();
        return;
      }
      
      console.error('[Carbon] Keyboard handler error:', error);
    }
  };
}

/**
 * Create a protected event listener that won't crash from extension interference
 */
export function addProtectedEventListener<K extends keyof HTMLElementEventMap>(
  element: HTMLElement | Document | Window,
  type: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): () => void {
  const wrappedHandler = (event: Event) => {
    try {
      handler(event as HTMLElementEventMap[K]);
    } catch (error) {
      if (error instanceof Error && error.stack?.includes('injected')) {
        console.warn('[Carbon] Suppressed error from browser extension');
        return;
      }
      throw error;
    }
  };

  element.addEventListener(type, wrappedHandler, options);

  // Return cleanup function
  return () => {
    element.removeEventListener(type, wrappedHandler, options);
  };
}
