import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import Experiences from "./pages/Experiences";
import Culture from "./pages/Culture";
import Heritage from "./pages/Heritage";
import Services from "./pages/Services";
import TripPlanner from "./pages/TripPlanner";
import AtlasGateway from "./pages/AtlasGateway";
import DestinationDetail from "./pages/DestinationDetail";
import Events from "./pages/Events";
import { TripProvider } from "./contexts/TripContext";
import { PageNavigationLoader } from "./components/PageNavigationLoader";
import TranslationReview from "./pages/TranslationReview";
import { useLanguage } from "./contexts/LanguageContext";
import { useEffect } from "react";

const localePattern = "ar|en|fr|it|de|es|zh";
function LocalizedPage({ Page }: { Page: typeof Home }) {
  const { setLanguage } = useLanguage();
  const location = window.location.pathname;
  const locale = location.split("/")[1];
  useEffect(() => { if (locale && new RegExp(`^(${localePattern})$`).test(locale)) setLanguage(locale as "ar" | "en" | "fr" | "it" | "de" | "es" | "zh"); }, [locale, setLanguage]);
  return <Page />;
}

function AppRouter() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/destinations"} component={Destinations} />
      <Route path={"/destinations/:id"} component={DestinationDetail} />
      <Route path={"/experiences"} component={Experiences} />
      <Route path={"/culture"} component={Culture} />
      <Route path={"/heritage"} component={Heritage} />
      <Route path={"/services"} component={Services} />
      <Route path={"/atlas"} component={AtlasGateway} />
      <Route path={"/events"} component={Events} />
      <Route path={"/trip"} component={TripPlanner} />
      <Route path={"/admin/translations"} component={TranslationReview} />
      <Route path={"/:locale"} component={() => <LocalizedPage Page={Home} />} />
      <Route path={"/:locale/destinations"} component={() => <LocalizedPage Page={Destinations} />} />
      <Route path={"/:locale/destinations/:id"} component={() => <LocalizedPage Page={DestinationDetail} />} />
      <Route path={"/:locale/experiences"} component={() => <LocalizedPage Page={Experiences} />} />
      <Route path={"/:locale/culture"} component={() => <LocalizedPage Page={Culture} />} />
      <Route path={"/:locale/heritage"} component={() => <LocalizedPage Page={Heritage} />} />
      <Route path={"/:locale/services"} component={() => <LocalizedPage Page={Services} />} />
      <Route path={"/:locale/atlas"} component={() => <LocalizedPage Page={AtlasGateway} />} />
      <Route path={"/:locale/events"} component={() => <LocalizedPage Page={Events} />} />
      <Route path={"/:locale/trip"} component={() => <LocalizedPage Page={TripPlanner} />} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  const routerBase = import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <TripProvider>
            <Toaster />
            <PageNavigationLoader />
            <WouterRouter base={routerBase}>
              <AppRouter />
            </WouterRouter>
          </TripProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
