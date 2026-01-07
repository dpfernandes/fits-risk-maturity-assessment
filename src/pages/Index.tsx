import { HeroSection } from '@/components/assessment/HeroSection';
import { AssessmentContainer } from '@/components/assessment/AssessmentContainer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <main className="pb-16">
        <AssessmentContainer />
      </main>
      <footer className="border-t border-border py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Risk Maturity Assessment • Your data is anonymous and not stored
        </p>
      </footer>
    </div>
  );
};

export default Index;
