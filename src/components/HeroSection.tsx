import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import heroImage from "@/assets/hero-triathlon.jpg";
import demoThumbnail from "@/assets/demo-video-thumbnail.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-subtle">
      <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                Master Your
                <span className="block bg-gradient-athletic bg-clip-text text-transparent">
                  Triathlon Training
                </span>
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl max-w-2xl">
                AI-powered training plans, smart analytics, and race-day preparation. 
                The complete platform for serious triathletes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="group">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Demo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl">
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    <img 
                      src={demoThumbnail} 
                      alt="TriFlow App Demo" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                        <h3 className="text-white font-semibold text-lg mb-2">TriFlow Demo</h3>
                        <p className="text-white/80 text-sm">
                          See how TriFlow helps triathletes plan training, track workouts, and analyze performance with AI-powered insights.
                        </p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-glow">
              <img
                src={heroImage}
                alt="Triathlon training visualization"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-athletic opacity-20"></div>
            </div>
            
            {/* Floating cards */}
            <div className="absolute -top-4 -left-4 bg-card p-4 rounded-lg shadow-primary border hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-sport-swim rounded-full"></div>
                <span className="text-sm font-medium">Swim: 2.4mi</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-card p-4 rounded-lg shadow-primary border hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-sport-run rounded-full"></div>
                <span className="text-sm font-medium">Run: 26.2mi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;