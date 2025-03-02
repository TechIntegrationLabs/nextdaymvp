import React from 'react';
import { Hero } from '../components/Hero';
import { Services } from '../components/Services';
import { Process } from '../components/Process';
import { Contact } from '../components/Contact';
import RecentProjects from '../components/RecentProjects';
import { Pricing } from '../components/Pricing';

// Divider component for consistency between sections
const SectionDivider = () => (
  <div className="relative w-full h-px">
    <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-custom-blue/50 to-transparent"></div>
  </div>
);

export function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div id="home">
        <Hero />
      </div>
      
      <SectionDivider />
      
      <div id="services">
        <Services />
      </div>
      
      <SectionDivider />
      
      <div id="projects">
        <RecentProjects />
      </div>
      
      <SectionDivider />
      
      <div id="process">
        <Process />
      </div>
      
      <SectionDivider />
      
      <div id="pricing">
        <Pricing />
      </div>
      
      <SectionDivider />
      
      <div id="contact">
        <Contact />
      </div>
    </div>
  );
}