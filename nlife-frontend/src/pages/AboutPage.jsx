import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">ABOUT US</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src="/placeholder-doctors.jpg"
              alt="Doctors smiling"
              className="w-full h-auto"
            />
          </div>

          {/* About Text */}
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              Welcome To NLife, Your Trusted Partner In Managing Your Healthcare Needs Conveniently And Efficiently.
              At NLife, We Understand The Challenges Individuals Face When It Comes To Scheduling Doctor
              Appointments And Managing Their Health Records.
            </p>

            <p className="text-gray-700 leading-relaxed">
              NLife Is Committed To Excellence In Healthcare Technology. We Continuously Strive To Enhance Our
              Platform, Integrating The Latest Advancements To Improve User Experience And Deliver Superior Service.
              Whether You're Booking Your First Appointment Or Managing Ongoing Care, NLife Is Here To Support You
              Every Step Of The Way.
            </p>

            <div className="pt-4">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                Our Vision At NLife Is To Create A Seamless Healthcare Experience For Every User. We Aim To Bridge The
                Gap Between Patients And Healthcare Providers, Making It Easier For You To Access The Care You Need, When
                You Need It.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">WHY CHOOSE US</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Efficiency */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase">Efficiency:</h3>
              <p className="text-gray-700 mb-4">
                Streamlined Appointment Scheduling That Fits Into Your Busy Lifestyle.
              </p>
            </div>

            {/* Convenience */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase">Convenience:</h3>
              <p className="text-gray-700 mb-4">
                Access To A Network Of Trusted Healthcare Professionals In Your Area.
              </p>
            </div>

            {/* Personalization */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase">Personalization:</h3>
              <p className="text-gray-700 mb-4">
                Tailored Recommendations And Reminders To Help You Stay On Top Of Your Health.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to experience better healthcare?</h2>
          <p className="text-xl text-indigo-100 mb-8">Join thousands of satisfied users who have simplified their healthcare journey with NLife.</p>
          <Button
            to="/register"
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-primary"
          >
            Create Account
          </Button>
        </div>
      </div>

      {/* Team Section (Optional) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the dedicated professionals working to make healthcare more accessible for everyone.
          </p>
        </div>

        {/* Team members would go here */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* This would be populated with actual team members */}
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900">NVJ</h3>
            <p className="text-gray-600">CEO & Founder</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
