import React, { useEffect, useState } from 'react';
import { useTestimonialStore } from '@/stores/testimonialStore';
import { Testimonial } from '@/types';
import { Check, X, Star, Trash2 } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const TestimonialRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const Testimonials: React.FC = () => {
  const { testimonials, isLoading, error, fetchTestimonials, updateTestimonialStatus, deleteTestimonial } = useTestimonialStore();
  const [selectedStatus, setSelectedStatus] = useState<Testimonial['status']>('pending');

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const filteredTestimonials = testimonials.filter(
    testimonial => testimonial.status === selectedStatus
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Testimonials Management</h1>
        <div className="flex space-x-2">
          {(['pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedStatus === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {filteredTestimonials.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No testimonials found with status: {selectedStatus}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredTestimonials.map((testimonial) => (
              <li key={testimonial.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        User ID: {testimonial.userId}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(testimonial.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <TestimonialRating rating={testimonial.rating} />
                    <p className="text-gray-700">{testimonial.content}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedStatus === 'pending' && (
                      <>
                        <button
                          onClick={() => updateTestimonialStatus(testimonial.id, 'approved')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                          title="Approve"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => updateTestimonialStatus(testimonial.id, 'rejected')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                          title="Reject"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this testimonial?')) {
                          deleteTestimonial(testimonial.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-50 rounded-full"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Testimonials;
