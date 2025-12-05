import { Link } from 'react-router-dom';
import { mockBlogPosts, BlogPost } from '../data/blog';
import { Calendar, Clock, Tag } from 'lucide-react';

const Blog = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Automotive Insights</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Stay updated with the latest car news, maintenance tips, and industry trends in Nigeria.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockBlogPosts.map((post) => (
          <Link
            to={`/blog/${post.slug}`}
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <Tag className="w-4 h-4 mr-1" />
                {post.category}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                {post.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {post.readTime} min read
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {mockBlogPosts.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Posts Found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Check back soon for new automotive insights!
          </p>
        </div>
      )}
    </div>
  );
};

export default Blog;