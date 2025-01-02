import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react';
import { useTestimonialStore } from '@/stores/testimonialStore';

const testimonialSchema = z.object({
  content: z.string()
    .min(10, 'Testimonial must be at least 10 characters long')
    .max(500, 'Testimonial cannot exceed 500 characters'),
  rating: z.number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

const TestimonialForm: React.FC<{ userId: string; onSuccess?: () => void }> = ({
  userId,
  onSuccess,
}) => {
  const { submitTestimonial, isLoading } = useTestimonialStore();
  const [hoveredRating, setHoveredRating] = React.useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      rating: 0,
    },
  });

  const currentRating = watch('rating');

  const onSubmit = async (data: TestimonialFormData) => {
    try {
      await submitTestimonial({
        userId,
        content: data.content,
        rating: data.rating,
      });
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting testimonial:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Rating</label>
        <div className="mt-1 flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onMouseEnter={() => setHoveredRating(rating)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setValue('rating', rating)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                className={`h-6 w-6 ${
                  rating <= (hoveredRating || currentRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Your Testimonial</label>
        <textarea
          {...register('content')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Share your experience..."
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit Testimonial'}
        </button>
      </div>
    </form>
  );
};

export default TestimonialForm;
