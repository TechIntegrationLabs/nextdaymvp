import { useInView } from '../hooks/useInView';
import { Calendar, Clock, Tag, User, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { fetchBlogPosts, type BlogPost } from '../lib/sheets';

export function Blog() {
  const [ref, isVisible] = useInView({ threshold: 0.1 });
  const { data: posts, error, isLoading } = useSWR('blog-posts', fetchBlogPosts);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div ref={ref} className="space-y-16">
          <div className={`transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Latest Insights
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl">
              Explore our latest thoughts on technology, development, and innovation.
              Stay updated with industry trends and best practices.
            </p>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-custom-blue animate-spin" />
            </div>
          )}

          {error && (
            <div className="text-center text-red-400 py-12">
              <p>Failed to load blog posts. Please try again later.</p>
            </div>
          )}

          {posts && (
          <div className="grid gap-12">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className={`group grid md:grid-cols-2 gap-8 transition-all duration-[2000ms] ${
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <Link
                  to={`/blog/${post.id}`}
                  className="relative h-64 md:h-full rounded-2xl overflow-hidden"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                  />
                </Link>

                <div className="flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 mb-4">
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

                  <Link to={`/blog/${post.id}`}>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-custom-blue transition-colors">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-slate-300 mb-6">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-slate-400">
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
                </div>
              </article>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}