import Hero from '../components/common/Hero';
import SpecialtiesSection from '../components/specialties/SpecialtiesSection';
import DoctorsSection from '../components/doctors/DoctorsSection';
import FeaturesSection from '../components/common/FeaturesSection';
import TestimonialsSection from '../components/common/TestimonialsSection';
import CtaSection from '../components/common/CtaSection';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <SpecialtiesSection />
      <DoctorsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
};

export default HomePage;
