import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

export const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Registra una vista de página cada vez que la URL cambia
    ReactGA.send({ 
      hitType: "pageview", 
      page: location.pathname + location.search,
      title: document.title 
    });
  }, [location]);

  return null;
}