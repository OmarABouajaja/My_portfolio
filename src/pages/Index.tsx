import { useState } from "react";

// Core System Overlays
import { BootLoader } from "@/components/BootLoader";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollProgress } from "@/components/ScrollProgress";
import { CustomCursor } from "@/components/CustomCursor";
import { CommandMenu } from "@/components/CommandMenu";
import { SEOJsonLd } from "@/components/SEOJsonLd";

// Content Modules
import { Hero } from "@/components/Hero";
import { BentoSection } from "@/components/BentoSection";
import { Timeline } from "@/components/Timeline";
import { TechMarquee } from "@/components/TechMarquee";
import { Testimonials } from "@/components/Testimonials";
import { BlogSection } from "@/components/BlogSection";
import { ContactSection } from "@/components/ContactSection";
import { ServicesSection } from "@/components/ServicesSection";
import { EquipmentSection } from "@/components/EquipmentSection";

import { useSiteMetadata } from "@/hooks/useSiteMetadata";

const Index = () => {
  const metadataState = useSiteMetadata();
  const [isBootSequenceComplete, setIsBootSequenceComplete] = useState(false);
  const [isDOMPreloading, setIsDOMPreloading] = useState(false);
  
  const siteConfig = metadataState.status === "online" ? metadataState.data : undefined;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CustomCursor />
      <CommandMenu />
      <SEOJsonLd />
      
      {!isBootSequenceComplete && (
        <BootLoader 
          state={metadataState} 
          onEngage={() => setIsDOMPreloading(true)} 
          onDone={() => setIsBootSequenceComplete(true)} 
        />
      )}

      {isDOMPreloading && (
        <>
          <ScrollProgress isOffline={metadataState.status !== "online"} />
          <SiteNav />
          <main>
            <Hero meta={siteConfig} />
            {siteConfig?.enable_projects !== false && <BentoSection meta={siteConfig} />}
            {siteConfig?.enable_tech_stack !== false && <TechMarquee />}
            <ServicesSection />
            {siteConfig?.enable_timeline !== false && <Timeline />}
            <EquipmentSection />
            {siteConfig?.enable_testimonials !== false && <Testimonials />}
            {siteConfig?.enable_blog !== false && <BlogSection />}
            {siteConfig?.enable_contact !== false && <ContactSection />}
          </main>
          <SiteFooter />
        </>
      )}
    </div>
  );
};

export default Index;
