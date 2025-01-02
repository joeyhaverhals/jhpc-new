import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useFAQStore } from '@/stores/faqStore';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const FAQ: React.FC = () => {
  const { faqs, isLoading, error, fetchFAQs } = useFAQStore();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  // Group FAQs by category
  const groupedFAQs = React.useMemo(() => {
    const filtered = faqs.filter(
      faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.reduce((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    }, {} as Record<string, typeof faqs>);
  }, [faqs, searchTerm]);

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
        <p>Error loading FAQs</p>
      </div>
    );
  }

  return (
    <section 
      id="faq" 
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
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-white/80">
            Find answers to common questions about our services
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-lg rounded-lg 
                       text-white placeholder-white/60 focus:outline-none focus:ring-2 
                       focus:ring-purple-500"
            />
          </div>
        </motion.div>

        {/* FAQ Categories */}
        {Object.entries(groupedFAQs).map(([category, categoryFaqs], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
            className="mb-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">{category}</h3>
            <div className="space-y-4">
              {categoryFaqs.map((faq) => (
                <motion.div
                  key={faq.id}
                  className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                  >
                    <span className="text-lg font-medium text-white">{faq.question}</span>
                    {expandedId === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-white/60" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-white/60" />
                    )}
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedId === faq.id ? 'auto' : 0,
                      opacity: expandedId === faq.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4">
                      <p className="text-white/80">{faq.answer}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
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

export default FAQ;
