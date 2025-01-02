import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Quote } from 'lucide-react';
import { useTestimonialStore } from '@/stores/testimonialStore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const TestimonialCard: React.FC<{ 
  content: string;
  author: string;
  rating: number;
  delay: number;
}> = ({ content, author, rating, delay }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8, delay }}
      className="relative"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 h-full">
        <Quote className="h-8 w-8 text-purple-500 mb-4" />
        
        <div className="flex mb-4">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`h-5 w-5 ${
                index < rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-400'
              }`}
            />
          ))}
        </div>
        
        <p className="text-white/80 mb-6 line-clamp-4">
          {content}
        </p>
        
        <p className="text-white font-medium">
          {author}
        </p>
      </div>
    </motion.div>
  );
};

const Testimonials: React.FC = () => {
  const { testimonials, isLoading, error, fetchTestimonials } = useTestimonialStore();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  React.useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

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
        <p>Error loading testimonials</p>
      </div>
    );
  }

  // Get only approved testimonials and take the 4 most recent
  const approvedTestimonials = testimonials
    .filter(t => t.status === 'approved')
    .slice(0, 4);

  return (
    <section 
      id="testimonials" 
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
            Client Testimonials
          </h2>
          <p className="text-xl text-white/80">
            What our clients say about us
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {approvedTestimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              content={testimonial.content}
              author={testimonial.userId}
              rating={testimonial.rating}
              delay={index * 0.2}
            />
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

export default Testimonials;
