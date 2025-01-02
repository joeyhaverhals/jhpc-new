import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';

const Features: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      title: "AI-Powered Solutions",
      description: "Leverage cutting-edge artificial intelligence to transform your business processes.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80",
    },
    {
      title: "Real-time Analytics",
      description: "Get instant insights with our advanced analytics platform.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
    },
    {
      title: "Secure Infrastructure",
      description: "Enterprise-grade security for your peace of mind.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section 
      id="features" 
      className="relative min-h-screen py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #1a1a1a, #000000)',
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
            Cutting-Edge Features
          </h2>
          <p className="text-xl text-white/80">
            Discover what makes our platform unique
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:transform hover:scale-105 transition-all duration-300">
                <div className="h-48 mb-6 overflow-hidden rounded-xl">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-white/80 mb-6">
                  {feature.description}
                </p>
                
                <motion.button
                  whileHover={{ x: 5 }}
                  className="flex items-center text-white/60 hover:text-white transition-colors"
                >
                  <span>Learn More</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
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

export default Features;
