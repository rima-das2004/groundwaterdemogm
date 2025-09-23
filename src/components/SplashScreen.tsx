import React from 'react';
import { Button } from './ui/button';
import { Droplets, Waves } from 'lucide-react';
import { WaterDropletBackground } from './WaterDropletBackground';

interface SplashScreenProps {
  onGetStarted: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col items-center justify-center p-6 relative">
      {/* Water Droplet Background */}
      <WaterDropletBackground intensity="heavy" dropletCount={70} />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-md mx-auto backdrop-blur-sm bg-background/80 rounded-3xl p-8 border border-border/30 shadow-2xl">
        {/* Logo */}
        <div className="mb-8">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full shadow-2xl shadow-primary/25"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <Droplets className="w-8 h-8 text-primary" />
            </div>
            <Waves className="absolute -bottom-2 -right-2 w-6 h-6 text-secondary" />
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">
            AquaWatch
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Groundwater Monitoring & Research
          </p>
        </div>

        {/* Description */}
        <div className="mb-12 space-y-4">
          <p className="text-base text-muted-foreground leading-relaxed">
            Monitor groundwater levels, receive intelligent alerts, and contribute to sustainable water management.
          </p>
          
          <div className="flex justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Real-time Monitoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span className="text-muted-foreground">AI Predictions</span>
            </div>
          </div>
        </div>

        {/* Get Started Button */}
        <Button 
          onClick={onGetStarted}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/25 transition-all duration-300 transform hover:scale-105"
        >
          Get Started
        </Button>

        {/* Footer */}
        <p className="text-xs text-muted-foreground mt-8">
          Supporting sustainable water management across India
        </p>
      </div>
    </div>
  );
};