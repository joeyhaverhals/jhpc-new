import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAboutStore } from '@/stores/aboutStore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const About: React.FC = () => {
  const { content, isLoading, error, fetchContent } = useAboutStore();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  React.useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Error loading content</p>
      </div>
    );
  }

  return (
    <section 
      id="about" 
      className="relative min-h-screen py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #000000, #1a1a1a)',
      }}
    >
      {/* Content */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="relative z-10">
          {/* Glass Container */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12">
            {/* Content */}
            <div className="prose prose-lg prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: content?.content || '' }} />
            </div>

            {/* Image Gallery */}
            {content?.images && content.images.length > 0 && (
              <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
                {content.images.map((image, index) => (
                  <motion.div
                    key={image}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 
                     bg-gradient-to-br from-purple-500/10 to-transparent 
                     rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 -left-1/4 w-1/2 h-1/2 
                     bg-gradient-to-tr from-blue-500/10 to-transparent 
                     rounded-full blur-3xl"
        />
      </div>
    </section>
  );
};

export default About;
