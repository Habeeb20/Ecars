import React from 'react';
import { Users, Car, Shield, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 dark:from-gray-900 dark:to-indigo-900 py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About E-Cars
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Nigeria's premier marketplace for buying, selling, and finding car parts, connecting automotive enthusiasts across the nation.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Company Story */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Our Story
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Founded in 2025 in Lagos, Nigeria, E-Cars was born from a passion for making car ownership and trading seamless and accessible. We recognized the challenges of navigating the automotive market in Nigeria—whether it’s finding a reliable vehicle, sourcing quality parts, or selling a car at a fair price. Our platform bridges these gaps by offering a trusted, transparent, and user-friendly experience.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              From humble beginnings, we’ve grown to serve thousands of customers across Nigeria, helping them find their dream cars, secure hard-to-find parts, and connect with trustworthy sellers. Our commitment to innovation and customer satisfaction drives us to continually enhance our services.
            </p>
            <img
              src="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg"
              alt="E-Cars Marketplace"
              className="w-full h-64 object-cover rounded-lg mt-4"
            />
          </div>

          {/* Mission & Vision */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Our Mission & Vision
            </h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <Car className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-4 mt-1" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Mission
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    To simplify automotive transactions in Nigeria by providing a secure, transparent, and efficient platform for buying, selling, and sourcing car parts.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Globe className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-4 mt-1" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Vision
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    To become Nigeria’s leading automotive marketplace, empowering every car owner and enthusiast with access to a vibrant, trusted community.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-4 mt-1" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Values
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Integrity, transparency, and customer-centricity guide everything we do, ensuring trust in every transaction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Chukwuemeka Okoye',
                role: 'Founder & CEO',
                image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
              },
              {
                name: 'Aisha Ibrahim',
                role: 'Chief Operations Officer',
                image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
              },
              {
                name: 'Tunde Adebayo',
                role: 'Head of Technology',
                image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
              },
              {
                name: 'Ngozi Eze',
                role: 'Customer Success Manager',
                image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
              },
            ].map((member) => (
              <div
                key={member.name}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-indigo-600 dark:bg-indigo-800 rounded-2xl shadow-xl p-8 text-white text-center">
          <h2 className="text-2xl font-semibold mb-6">E-Cars by the Numbers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <Users className="h-12 w-12 mx-auto mb-2" />
              <p className="text-3xl font-bold">10,000+</p>
              <p className="text-base">Happy Customers</p>
            </div>
            <div>
              <Car className="h-12 w-12 mx-auto mb-2" />
              <p className="text-3xl font-bold">5,000+</p>
              <p className="text-base">Cars Sold</p>
            </div>
            <div>
              <Shield className="h-12 w-12 mx-auto mb-2" />
              <p className="text-3xl font-bold">100%</p>
              <p className="text-base">Secure Transactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;