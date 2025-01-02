import React from 'react';
import { Post } from '@/types';
import { format } from 'date-fns';

interface PostPreviewProps {
  post: Partial<Post>;
  className?: string;
}

const PostPreview: React.FC<PostPreviewProps> = ({ post, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">
          {post.title || 'Untitled Post'}
        </h1>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <span>
            {post.createdAt 
              ? format(new Date(post.createdAt), 'MMMM d, yyyy')
              : format(new Date(), 'MMMM d, yyyy')}
          </span>
          {post.categories?.length > 0 && (
            <>
              <span className="mx-2">•</span>
              <span>{post.categories.join(', ')}</span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 prose prose-lg max-w-none">
        <div 
          dangerouslySetInnerHTML={{ 
            __html: post.content || 'No content yet...'
          }} 
        />
      </div>

      {/* Footer */}
      {post.tags?.length > 0 && (
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPreview;
