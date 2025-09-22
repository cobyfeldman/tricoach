import { Button } from "@/components/ui/button";
import { Activity, Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <Activity className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block text-foreground">
              TriFlow
            </span>
          </a>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </nav>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="md:hidden">
              <a className="flex items-center space-x-2" href="/">
                <Activity className="h-6 w-6 text-primary" />
                <span className="font-bold text-foreground">TriFlow</span>
              </a>
            </div>
          </div>
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>
              Start Free Trial
            </Button>
          </nav>
        </div>
      </div>
      {isMenuOpen && (
        <div className="border-t md:hidden">
          <nav className="container mx-auto flex flex-col space-y-2 p-4">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;