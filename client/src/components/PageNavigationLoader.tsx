import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

const LOADING_WINDOW_MS = 360;

export function shouldShowRouteLoader(previousLocation: string, nextLocation: string) {
  return previousLocation !== nextLocation;
}

export function PageNavigationLoader() {
  const [location] = useLocation();
  const previousLocation = useRef(location);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!shouldShowRouteLoader(previousLocation.current, location)) return;

    previousLocation.current = location;
    setIsLoading(true);
    const timer = window.setTimeout(() => setIsLoading(false), LOADING_WINDOW_MS);

    return () => window.clearTimeout(timer);
  }, [location]);

  return (
    <>
      <div className={`route-loading ${isLoading ? "is-active" : ""}`} aria-hidden="true">
        <span className="route-loading__bar" />
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {isLoading ? "جاري الانتقال إلى الصفحة التالية" : ""}
      </p>
    </>
  );
}
