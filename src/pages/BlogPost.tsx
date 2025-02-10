import { useParams } from 'react-router-dom';
import { Calendar, Clock, Tag, User, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { fetchBlogPosts, type BlogPost } from '../lib/sheets';
import { useInView } from '../hooks/useInView';

export function BlogPost() {
  const { id } = useParams();
  const [ref, isVisible] = useInView({ threshold: 0.1 });
  const { data: posts, error, isLoading } = useSWR('blog-posts', fetchBlogPosts);
  const post = posts?.find(p => p.id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-custom-blue animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              {error ? 'Error loading post' : 'Post not found'}
            </h1>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-custom-blue hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <article ref={ref} className="max-w-4xl mx-auto px-4">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-custom-blue hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <div className={`space-y-8 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="relative h-[400px] rounded-2xl overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-sky-900/50 text-sky-200"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime} read
              </div>
            </div>

            <div className="prose prose-lg prose-invert max-w-none">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="text-slate-300 mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}