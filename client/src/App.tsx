import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Directory from "./pages/Directory";
import LoginPage from "./pages/LoginPage";

function Router({ onLogout, companyName }: { onLogout: () => void; companyName: string }) {
  return (
    <Switch>
      <Route path="/" component={() => <Directory onLogout={onLogout} companyName={companyName} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [companyName, setCompanyName] = useState("Компания");

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/check").then((r) => r.json()),
      fetch("/api/config").then((r) => r.json()),
    ]).then(([auth, config]) => {
      setAuthenticated(auth.authenticated);
      if (config.companyName) setCompanyName(config.companyName);
    }).catch(() => setAuthenticated(false));
  }, []);

  const handleLogin = () => setAuthenticated(true);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    queryClient.clear();
    setAuthenticated(false);
  };

  if (authenticated === null) {
    return (
      <div
        className="min-h-[100dvh] flex items-center justify-center"
        style={{ backgroundColor: "#e8f5f0" }}
      />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {authenticated ? (
          <Router onLogout={handleLogout} companyName={companyName} />
        ) : (
          <LoginPage onLogin={handleLogin} companyName={companyName} />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
