import React from 'react';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTimeTracking } from './hooks/use-time-tracking';
import { Login } from './pages/login';
import { Dashboard } from './pages/dashboard';

function App() {
  const { user, login, logout } = useTimeTracking();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          {user ? (
            <Dashboard onLogout={logout} />
          ) : (
            <Login onLogin={login} />
          )}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
