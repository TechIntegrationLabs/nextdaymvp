import React from 'react';
import { Hero } from '../components/Hero';
import { Services } from '../components/Services';
import { Process } from '../components/Process';
import { Contact } from '../components/Contact';
import RecentProjects from '../components/RecentProjects';
import { Pricing } from '../components/Pricing';

export function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div id="home">
        <Hero />
      </div>
      <div id="services">
        <Services />
      </div>
      <div id="projects">
        <RecentProjects />
      </div>
      <div id="process">
        <Process />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <div id="contact">
        <Contact />
      </div>
    </div>
  );
}