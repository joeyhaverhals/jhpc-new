import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  LinkedIn,
  Send
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Implement your contact form submission logic here
      console.log('Form data:', data);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const businessHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: LinkedIn, href: '#', label: 'LinkedIn' },
  ];

  return (
    <section 
      id="contact" 
      className="relative min-h-screen py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #000000, #1a1a1a)',
      }}
    >
      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-white/80">
            We'd love to hear from you
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Contact Details */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Mail className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Email</h3>
                  <p className="text-white/80">info@example.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Phone className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Phone</h3>
                  <p className="text-white/80">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <MapPin className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Address</h3>
                  <p className="text-white/80">123 Business Street, Suite 100<br />City, State 12345</p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-lg font-medium text-white">Business Hours</h3>
              </div>
              
              <div className="space-y-4">
                {businessHours.map(({ day, hours }) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-white/80">{day}</span>
                    <span className="text-white font-medium">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-white/10 backdrop-blur-lg rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Icon className="h-6 w-6 text-white" />
                  <span className="sr-only">{label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white">
                  Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/20 
                           rounded-lg text-white placeholder-white/60 focus:outline-none 
                           focus:ring-2 focus:ring-purple-500"
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/20 
                           rounded-lg text-white placeholder-white/60 focus:outline-none 
                           focus:ring-2 focus:ring-purple-500"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-white">
                  Subject
                </label>
                <input
                  type="text"
                  {...register('subject')}
                  className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/20 
                           rounded-lg text-white placeholder-white/60 focus:outline-none 
                           focus:ring-2 focus:ring-purple-500"
                  placeholder="Message subject"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-400">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white">
                  Message
                </label>
                <textarea
                  {...register('message')}
                  rows={6}
                  className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/20 
                           rounded-lg text-white placeholder-white/60 focus:outline-none 
                           focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Your message"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center px-8 py-4 
                         bg-gradient-to-r from-purple-600 to-blue-600 
                         rounded-lg text-white font-medium disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 
                   bg-gradient-to-br from-purple-500/20 to-transparent 
                   rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -180, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-1/4 -left-1/4 w-1/2 h-1/2 
                   bg-gradient-to-tr from-blue-500/20 to-transparent 
                   rounded-full blur-3xl"
      />
    </section>
  );
};

export default Contact;
