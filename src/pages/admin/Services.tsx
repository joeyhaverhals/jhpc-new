import React, { useEffect, useState } from 'react';
import { useServiceStore } from '@/stores/serviceStore';
import { Service, SEOData } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Edit2, Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SEOForm from '@/components/seo/SEOForm';

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  fullDescription: z.string().min(1, 'Full description is required'),
  price: z.number().min(0, 'Price must be positive'),
  billingFrequency: z.enum(['per_4_weeks', 'one_time']),
  imageUrl: z.string().url('Valid image URL is required'),
  isActive: z.boolean(),
  seo: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    ogImage: z.string().optional(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    canonicalUrl: z.string().optional(),
    metaRobots: z.string().optional(),
  }),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

const Services: React.FC = () => {
  const { services, isLoading, error, fetchServices, createService, updateService, deleteService, updateOrder } = useServiceStore();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showSEO, setShowSEO] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
  });

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    if (selectedService) {
      reset({
        title: selectedService.title,
        shortDescription: selectedService.shortDescription,
        fullDescription: selectedService.fullDescription,
        price: selectedService.price,
        billingFrequency: selectedService.billingFrequency,
        imageUrl: selectedService.imageUrl,
        isActive: selectedService.isActive,
        seo: selectedService.seo,
      });
    } else {
      reset({
        title: '',
        shortDescription: '',
        fullDescription: '',
        price: 0,
        billingFrequency: 'one_time',
        imageUrl: '',
        isActive: true,
        seo: {
          title: '',
          description: '',
          keywords: [],
        },
      });
    }
  }, [selectedService, reset]);

  const onSubmit = async (data: ServiceFormData) => {
    try {
      if (selectedService) {
        await updateService(selectedService.id, data);
      } else {
        await createService(data);
      }
      setShowEditor(false);
      setSelectedService(null);
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleSEOUpdate = async (seoData: SEOData) => {
    if (selectedService) {
      await updateService(selectedService.id, { seo: seoData });
      setShowSEO(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
        <button
          onClick={() => {
            setSelectedService(null);
            setShowEditor(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Service
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Billing
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 relative">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service, index) => (
              <tr key={service.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={service.imageUrl}
                        alt={service.title}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {service.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {service.shortDescription}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    €{service.price.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {service.billingFrequency === 'per_4_weeks'
                      ? 'Per 4 Weeks'
                      : 'One Time'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    service.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => updateOrder(service.id, 'up')}
                    disabled={index === 0}
                    className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                  >
                    <ArrowUp className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => updateOrder(service.id, 'down')}
                    disabled={index === services.length - 1}
                    className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                  >
                    <ArrowDown className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setShowSEO(true);
                    }}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    SEO
                  </button>
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setShowEditor(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this service?')) {
                        deleteService(service.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Service Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {selectedService ? 'Edit Service' : 'New Service'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
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
                  Short Description
                </label>
                <input
                  type="text"
                  {...register('shortDescription')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.shortDescription && (
                  <p className="mt-1 text-sm text-red-600">{errors.shortDescription.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Description
                </label>
                <textarea
                  {...register('fullDescription')}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.fullDescription && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullDescription.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price (EUR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Billing Frequency
                  </label>
                  <select
                    {...register('billingFrequency')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="one_time">One Time</option>
                    <option value="per_4_weeks">Per 4 Weeks</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="text"
                  {...register('imageUrl')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.imageUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('isActive')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditor(false);
                    setSelectedService(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  {selectedService ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEO Modal */}
      {showSEO && selectedService && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">SEO Settings</h3>
              <button
                onClick={() => setShowSEO(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <SEOForm
              initialData={selectedService.seo}
              onSubmit={handleSEOUpdate}
              onCancel={() => setShowSEO(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
