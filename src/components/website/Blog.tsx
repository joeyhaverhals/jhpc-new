import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
}

const Blog: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Example posts - replace with actual data from your CMS
  const posts: BlogPost[] = [
    {
      id: '1',
      title: 'The Future of AI in Business',
      excerpt: 'Discover how artificial intelligence is transforming modern business practices and what it means for your organization.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80',
      author: 'John Doe',
      date: '2023-10-15',
      category: 'Technology'
    },
    {
      id: '2',
      title: 'Implementing Digital Transformation',
      excerpt: 'A comprehensive guide to successfully implementing digital transformation in your enterprise.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
      author: 'Jane Smith',
      date: '2023-10-14',
      category: 'Strategy'
    },
    {
      id: '3',
      title: 'Cybersecurity Best Practices',
      excerpt: 'Essential cybersecurity practices every modern business should implement to protect their digital assets.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
      author: 'Mike Johnson',
      date: '2023-10-13',
      category: 'Security'
    },
  ];

  return (
    <section 
      id="blog" 
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
            Latest Insights
          </h2>
          <p className="text-xl text-white/80">
            Stay updated with our latest thoughts and discoveries
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Featured Post */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            className="col-span-2 relative group"
          >
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <img
                src={posts[0].image}
                alt={posts[0].title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-lg text-white text-sm mb-4">
                  {posts[0].category}
                </span>
                <h3 className="text-3xl font-bold text-white mb-4">
                  {posts[0].title}
                </h3>
                <p className="text-white/80 mb-6">
                  {posts[0].excerpt}
                </p>
                <div className="flex items-center text-white/60">
                  <User className="h-4 w-4 mr-2" />
                  <span className="mr-4">{posts[0].author}</span>
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{format(new Date(posts[0].date), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>
          </motion.article>

          {/* Regular Posts */}
          {posts.slice(1).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: (index + 1) * 0.2 }}
              className="relative group"
            >
              <div className="relative h-[300px] rounded-2xl overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-lg text-white text-sm mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {post.title}
                  </h3>
                  <div className="flex items-center text-white/60 text-sm">
                    <User className="h-4 w-4 mr-2" />
                    <span className="mr-4">{post.author}</span>
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{format(new Date(post.date), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white/10 backdrop-blur-lg rounded-full 
                     text-white font-medium hover:bg-white/20 transition-all
                     flex items-center space-x-2 mx-auto"
          >
            <span>View All Posts</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
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

export default Blog;
