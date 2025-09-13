import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Film, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md card-gradient p-8 text-center">
        <Film className="h-16 w-16 text-cinema-gold mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Movie Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          The page you're looking for seems to have vanished like a plot twist nobody saw coming.
        </p>
        <Button className="btn-gold" asChild>
          <a href="/">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </a>
        </Button>
      </Card>
    </div>
  );
};

export default NotFound;
