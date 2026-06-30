// Intro Loader gate: delays mounting the React app until the intro animation finishes.
// This prevents any homepage flash/FOUC.
//
// Usage (in src/main.jsx):
//   import { createIntroLoaderGate } from './introLoaderGate'
//   const gate = createIntroLoaderGate();
//   gate.renderWithGate(<App />)

export function createIntroLoaderGate(options = {}) {
  const {
    sessionKey = 'acm_intro_seen_v2',
    // Callback invoked when intro is done (used for mounting/unmounting).
    // If omitted, renderWithGate will mount immediately after gate completes.
    mountIfIntroAlreadySeen = true,
  } = options;

  function introAlreadySeen() {
    try {
      return window.sessionStorage?.getItem(sessionKey);
    } catch {
      return null;
    }
  }

  function setBodyBackground(color) {
    // Ensure background matches the intro immediately.
    document.body.style.background = color;
  }

  // Returns a Promise that resolves when intro should be finished.
  async function runIntroOrSkip(IntroComponent, props = {}) {
    // SSR not needed for this project.
    if (introAlreadySeen() && mountIfIntroAlreadySeen) return;

    // Ensure background matches the intro before React paints.
    setBodyBackground('#000');

    // Create a minimal overlay root for the intro only.
    const existingRoot = document.getElementById('root');
    if (!existingRoot) return;

    // Hide the existing root until we are ready.
    existingRoot.style.visibility = 'hidden';

    // Create a separate container for the intro to avoid flashing the main app.
    let overlayHost = document.getElementById('__intro_loader_host__');
    if (!overlayHost) {
      overlayHost = document.createElement('div');
      overlayHost.id = '__intro_loader_host__';
      overlayHost.style.position = 'fixed';
      overlayHost.style.inset = '0';
      overlayHost.style.zIndex = '100000';
      overlayHost.style.background = '#000';
      overlayHost.style.overflow = 'hidden';
      document.body.appendChild(overlayHost);
    }

    // Dynamically import react-dom so we can keep this gate lightweight.
    const { createRoot } = await import('react-dom/client');
    const overlayRoot = createRoot(overlayHost);

    const React = (await import('react')).default;
    await new Promise((resolve) => {
      // The IntroComponent must call props.onDone when animation finishes.
      overlayRoot.render(
        React.createElement(IntroComponent, {
          ...props,
          sessionKey,
          onDone: () => {
            resolve();
          },
        }),
      );
    });

    // Mark as seen (once intro completed successfully).
    try {
      window.sessionStorage?.setItem(sessionKey, '1');
    } catch {
      // ignore
    }

    // Unmount overlay
    try {
      overlayRoot.unmount();
    } catch {
      // ignore
    }

    overlayHost.remove();
    existingRoot.style.visibility = 'visible';
  }

  async function renderWithGate(AppElement, { IntroComponent, introProps } = {}) {
    if (!IntroComponent) {
      // If not provided, just mount normally.
      const { createRoot } = await import('react-dom/client');
      createRoot(document.getElementById('root')).render(AppElement);
      return;
    }


    // If intro already seen, mount immediately.
    if (introAlreadySeen() && mountIfIntroAlreadySeen) {
      const { createRoot } = await import('react-dom/client');
      createRoot(document.getElementById('root')).render(AppElement);
      return;
    }


    // Otherwise, run intro and only then mount the real app.
    (async () => {
      const { createRoot } = await import('react-dom/client');
      const rootEl = document.getElementById('root');
      if (!rootEl) return;


      // Hide root immediately to prevent flash.
      rootEl.style.visibility = 'hidden';
      rootEl.style.background = '#030712';

      try {
        await runIntroOrSkip(IntroComponent, introProps || {});
      } finally {
        // Ensure the app becomes visible even if intro errors.
        rootEl.style.visibility = 'visible';
        rootEl.style.background = '';
        document.body.style.background = '';
      }

      // Mount real app.
      createRoot(rootEl).render(AppElement);
    })();
  }


  return { renderWithGate };
}

