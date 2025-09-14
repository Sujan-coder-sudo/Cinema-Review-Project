import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider, useAuth } from "@/contexts/AppContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Movies from "@/pages/Movies";
import MovieDetail from "@/pages/MovieDetail";
import TMDBHome from "@/pages/TMDBHome";
import TMDBMovies from "@/pages/TMDBMovies";
import TMDBMovieDetail from "@/pages/TMDBMovieDetail";
import TMDBDemo from "@/components/TMDBDemo";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Component to initialize authentication
const AuthInitializer = () => {
  const { checkAuthStatus } = useAuth();
  
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  return null;
};

const AppRoutes = () => (
  <BrowserRouter>
    <AuthInitializer />
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<TMDBHome />} />
          <Route path="/movies" element={<TMDBMovies />} />
          <Route path="/movies/:id" element={<TMDBMovieDetail />} />
          <Route path="/demo" element={<TMDBDemo />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/watchlist" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  </BrowserRouter>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
