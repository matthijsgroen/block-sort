import { useRegisterSW } from "virtual:pwa-register/react";

import { WoodButton } from "./ui/WoodButton/WoodButton";

import styles from "./PWABadge.module.css";

function PWABadge() {
  // periodic sync is disabled, change the value to enable it, the period is in milliseconds
  // You can remove onRegisteredSW callback and registerPeriodicSync function
  const period = 0;

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return;
      if (r?.active?.state === "activated") {
        registerPeriodicSync(period, swUrl, r);
      } else if (r?.installing) {
        r.installing.addEventListener("statechange", (e) => {
          const sw = e.target as ServiceWorker;
          if (sw.state === "activated") registerPeriodicSync(period, swUrl, r);
        });
      }
    }
  });

  function close() {
    setOfflineReady(false);
    setNeedRefresh(false);
  }

  return (
    <div className="PWABadge" role="alert" aria-labelledby="toast-message">
      {(offlineReady || needRefresh) && (
        <div className={styles.PWABadgeToast}>
          <div className={styles.PWABadgeToastMessage}>
            {offlineReady ? (
              <span id="toast-message">App ready to work offline</span>
            ) : (
              <span id="toast-message">
                New content available, click on reload button to update. <br />
                Use Settings &gt; Advanced &gt; Recent changes to view changes.
              </span>
            )}
          </div>
          <div className="flex flex-row gap-4">
            {needRefresh && (
              <WoodButton onClick={() => updateServiceWorker(true)}>
                <span className="inline-block px-2 pt-1">Reload</span>
              </WoodButton>
            )}
            <WoodButton onClick={() => close()}>
              <span className="inline-block px-2 pt-1">Close</span>
            </WoodButton>
          </div>
        </div>
      )}
    </div>
  );
}

export default PWABadge;

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(
  period: number,
  swUrl: string,
  r: ServiceWorkerRegistration
) {
  if (period <= 0) return;

  setInterval(async () => {
    if ("onLine" in navigator && !navigator.onLine) return;

    const resp = await fetch(swUrl, {
      cache: "no-store",
      headers: {
        cache: "no-store",
        "cache-control": "no-cache"
      }
    });

    if (resp?.status === 200) await r.update();
  }, period);
}
