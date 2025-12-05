import { useParams, Link } from 'react-router-dom';
import { mockBlogPosts, markdownToHtml } from '../data/blog';
import { Calendar, Clock, Tag, ArrowLeft, User } from 'lucide-react';

const Article = () => {
  const { slug } = useParams();
  const post = mockBlogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Blog
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Article Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The requested article could not be found. Please check the URL or return to the blog.
          </p>
        </article>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Blog
        </Link>

        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-96 object-cover rounded-2xl mb-8"
        />

        <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-1" />
            {post.category}
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(post.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {post.readTime} min read
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {post.title}
        </h1>

        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="ml-3">
            <div className="font-semibold text-gray-900 dark:text-white">{post.author}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Automotive Expert</div>
          </div>
        </div>

        <div
          className="prose dark:prose-invert prose-lg text-gray-700 dark:text-gray-300 mb-8"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
        />

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/blog"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
          >
            Read More Articles
          </Link>
        </div>
      </article>
    </div>
  );
};

export default Article;