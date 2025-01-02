import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SEOData } from '@/types';

const seoSchema = z.object({
  title: z.string().min(1, 'Meta title is required'),
  description: z.string().min(1, 'Meta description is required'),
  keywords: z.array(z.string()),
  ogImage: z.string().url().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  canonicalUrl: z.string().url().optional(),
  metaRobots: z.string().optional(),
  structuredData: z.any().optional(),
});

type SEOFormData = z.infer<typeof seoSchema>;

interface SEOFormProps {
  initialData: SEOData;
  onSubmit: (data: SEOData) => void;
  onCancel: () => void;
}

const SEOForm: React.FC<SEOFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SEOFormData>({
    resolver: zodResolver(seoSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Meta Title
        </label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Meta Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Keywords
        </label>
        <input
          type="text"
          placeholder="Enter keywords separated by commas"
          onChange={(e) => {
            setValue(
              'keywords',
              e.target.value.split(',').map((keyword) => keyword.trim())
            );
          }}
          defaultValue={initialData.keywords.join(', ')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Open Graph Image URL
        </label>
        <input
          type="text"
          {...register('ogImage')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.ogImage && (
          <p className="mt-1 text-sm text-red-600">{errors.ogImage.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Open Graph Title
        </label>
        <input
          type="text"
          {...register('ogTitle')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Open Graph Description
        </label>
        <textarea
          {...register('ogDescription')}
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Canonical URL
        </label>
        <input
          type="text"
          {...register('canonicalUrl')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.canonicalUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.canonicalUrl.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Meta Robots
        </label>
        <input
          type="text"
          {...register('metaRobots')}
          placeholder="index, follow"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Save SEO Settings
        </button>
      </div>
    </form>
  );
};

export default SEOForm;
