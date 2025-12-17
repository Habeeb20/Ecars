// import React, { useState } from 'react';
// import { User, Mail, MessageSquare, Send, Phone, MapPin, Clock } from 'lucide-react';
// import { toast } from 'react-hot-toast';

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     subject: '',
//     message: '',
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.name || !formData.email || !formData.subject || !formData.message) {
//       toast.error('Please fill out all fields.');
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       toast.error('Please enter a valid email address.');
//       return;
//     }

//     setIsLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       toast.success('Your message has been sent successfully!');
//       setIsLoading(false);
//       setFormData({ name: '', email: '', subject: '', message: '' });
//     }, 1000);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 dark:from-gray-900 dark:to-indigo-900 py-12 px-4 sm:px-6 lg:px-8 mt-12">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
//             Contact Us
//           </h1>
//           <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//             Whether you have questions about buying, selling, or car parts, our team is ready to assist you.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Contact Form */}
//           <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
//             <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
//               Send Us a Message
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Name */}
//               <div className="relative">
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Name
//                 </label>
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pt-7">
//                   <User className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
//                   placeholder="Enter your name"
//                 />
//               </div>

//               {/* Email */}
//               <div className="relative">
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Email
//                 </label>
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pt-7">
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
//                   placeholder="Enter your email"
//                 />
//               </div>

//               {/* Subject */}
//               <div className="relative">
//                 <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Subject
//                 </label>
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pt-7">
//                   <MessageSquare className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   id="subject"
//                   name="subject"
//                   value={formData.subject}
//                   onChange={handleInputChange}
//                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
//                   placeholder="What's your inquiry about?"
//                 />
//               </div>

//               {/* Message */}
//               <div className="relative">
//                 <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Message
//                 </label>
//                 <div className="absolute left-3 top-10">
//                   <MessageSquare className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <textarea
//                   id="message"
//                   name="message"
//                   rows={6}
//                   value={formData.message}
//                   onChange={handleInputChange}
//                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
//                   placeholder="Share your message here..."
//                 />
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full flex justify-center items-center py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isLoading ? (
//                   <span className="flex items-center">
//                     <svg
//                       className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Sending...
//                   </span>
//                 ) : (
//                   <span className="flex items-center">
//                     <Send className="h-5 w-5 mr-2" />
//                     Send Message
//                   </span>
//                 )}
//               </button>
//             </form>
//           </div>

//           {/* Contact Information */}
//           <div className="bg-indigo-600 dark:bg-indigo-800 rounded-2xl shadow-xl p-8 text-white">
//             <h2 className="text-2xl font-semibold mb-6">Our Contact Details</h2>
//             <div className="space-y-6">
//               <div className="flex items-start">
//                 <Phone className="h-6 w-6 mr-4 mt-1" />
//                 <div>
//                   <p className="text-sm font-medium">Phone</p>
//                   <p className="text-base">+234 901 234 5678</p>
//                 </div>
//               </div>
//               <div className="flex items-start">
//                 <Mail className="h-6 w-6 mr-4 mt-1" />
//                 <div>
//                   <p className="text-sm font-medium">Email</p>
//                   <p className="text-base">info@autohub.ng</p>
//                 </div>
//               </div>
//               <div className="flex items-start">
//                 <MapPin className="h-6 w-6 mr-4 mt-1" />
//                 <div>
//                   <p className="text-sm font-medium">Address</p>
//                   <p className="text-base">
//                     456 Motor Road, Surulere, Lagos, Nigeria
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-start">
//                 <Clock className="h-6 w-6 mr-4 mt-1" />
//                 <div>
//                   <p className="text-sm font-medium">Hours</p>
//                   <p className="text-base">
//                     Mon - Fri: 9:00 AM - 6:00 PM WAT<br />
//                     Sat: 10:00 AM - 3:00 PM WAT
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Contact;


import React, { useState } from 'react';
import { User, Mail, MessageSquare, Send, Phone, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';  // Added for API call

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill out all fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/contact`, formData);
      toast.success(response.data.message || 'Your message has been sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 dark:from-gray-900 dark:to-indigo-900 py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Whether you have questions about buying, selling, or car parts, our team is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="relative">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pt-7">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pt-7">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
                  placeholder="Enter your email"
                />
              </div>

              {/* Subject */}
              <div className="relative">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pt-7">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
                  placeholder="What's your inquiry about?"
                />
              </div>

              {/* Message */}
              <div className="relative">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <div className="absolute left-3 top-10">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
                  placeholder="Share your message here..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-indigo-600 dark:bg-indigo-800 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-semibold mb-6">Our Contact Details</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <Phone className="h-6 w-6 mr-4 mt-1" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-base">+234 901 234 5678</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-6 w-6 mr-4 mt-1" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-base">info@autohub.ng</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-6 w-6 mr-4 mt-1" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-base">
                    456 Motor Road, Surulere, Lagos, Nigeria
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-6 w-6 mr-4 mt-1" />
                <div>
                  <p className="text-sm font-medium">Hours</p>
                  <p className="text-base">
                    Mon - Fri: 9:00 AM - 6:00 PM WAT<br />
                    Sat: 10:00 AM - 3:00 PM WAT
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;