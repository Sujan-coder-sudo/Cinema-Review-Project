import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Film, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

// API configuration
const API_BASE_URL = 'http://localhost:5000/api/auth';

// Types for API responses
interface LoginResponse {
  token: string;
}

interface RegisterResponse {
  message: string;
  token: string;
}

interface ApiError {
  error: string;
}

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { toast } = useToast();
  
  const isLogin = location.pathname === '/login';
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).error || 'Login failed');
      }

      const { token } = data as LoginResponse;
      
      // Store JWT token in localStorage
      localStorage.setItem('authToken', token);
      
      // Update app context with successful login
      login(email, password);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      navigate('/');
      
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).error || 'Registration failed');
      }

      const { token } = data as RegisterResponse;
      
      // Store JWT token in localStorage
      localStorage.setItem('authToken', token);
      
      // Update app context with successful registration
      register(username, email, password);
      
      toast({
        title: "Account created!",
        description: "Welcome to CinemaReview!",
      });
      
      navigate('/');
      
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await handleLogin(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Password mismatch",
            description: "Passwords do not match.",
            variant: "destructive",
          });
          return;
        }
        
        await handleRegister(formData.username, formData.email, formData.password);
      }
    } catch (error) {
      // Error handling is done in the respective functions
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cinema-darker via-background to-cinema-purple/10 px-4">
      <Card className="w-full max-w-md card-gradient border-cinema-purple/30">
        <div className="p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 group">
              <Film className="h-8 w-8 text-cinema-gold transition-transform group-hover:scale-110" />
              <span className="text-2xl font-bold bg-gradient-to-r from-cinema-gold to-cinema-silver bg-clip-text text-transparent">
                CinemaReview
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLogin 
                ? 'Sign in to your account to continue' 
                : 'Join our community of movie lovers'
              }
            </p>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    placeholder="Your username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="pl-10 bg-secondary/50 border-cinema-purple/30 focus:border-cinema-gold"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 bg-secondary/50 border-cinema-purple/30 focus:border-cinema-gold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 bg-secondary/50 border-cinema-purple/30 focus:border-cinema-gold"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 bg-secondary/50 border-cinema-purple/30 focus:border-cinema-gold"
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full btn-gold text-lg py-6"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6">
            <Separator className="mb-4" />
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <Link
                to={isLogin ? '/register' : '/login'}
                className="text-cinema-gold hover:text-cinema-gold/80 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Auth;