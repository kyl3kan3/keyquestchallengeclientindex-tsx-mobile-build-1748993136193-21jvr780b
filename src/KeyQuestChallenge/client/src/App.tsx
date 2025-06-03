import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Lesson from "@/pages/lesson";
import MiniGame from "@/pages/mini-game";
import NotFound from "@/pages/not-found";
import Auth from "@/components/auth";

function AuthenticatedRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 to-cyan-400 flex items-center justify-center">
        <div className="text-white text-xl font-fredoka">Loading KeyQuest...</div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/auth" component={Auth} />
      {user ? (
        <>
          <Route path="/app" component={Home} />
          <Route path="/lesson/:worldId/:levelId" component={Lesson} />
          <Route path="/mini-game/:gameType" component={MiniGame} />
        </>
      ) : (
        <Route path="*" component={Auth} />
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <AuthenticatedRouter />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
