import React, { useEffect, useState } from 'react';
import { useFAQStore } from '@/stores/faqStore';
import { FAQ } from '@/types';
import { Edit2, Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const faqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  category: z.string().min(1, 'Category is required'),
});

type FAQFormData = z.infer<typeof faqSchema>;

const FAQs: React.FC = () => {
  const { faqs, categories, isLoading, error, fetchFAQs, createFAQ, updateFAQ, deleteFAQ, moveFAQ } = useFAQStore();
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FAQFormData>({
    resolver: zodResolver(faqSchema),
  });

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  useEffect(() => {
    if (selectedFAQ) {
      reset({
        question: selectedFAQ.question,
        answer: selectedFAQ.answer,
        category: selectedFAQ.category,
      });
    } else {
      reset({
        question: '',
        answer: '',
        category: categories[0] || '',
      });
    }
  }, [selectedFAQ, reset, categories]);

  const onSubmit = async (data: FAQFormData) => {
    try {
      if (selectedFAQ) {
        await updateFAQ(selectedFAQ.id, data);
      } else {
        await createFAQ({
          ...data,
          order: 0, // Will be set properly in the store
        });
      }
      setShowEditor(false);
      setSelectedFAQ(null);
    } catch (error) {
      console.error('Error saving FAQ:', error);
    }
  };

  const groupedFAQs = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

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
        <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
        <button
          onClick={() => {
            setSelectedFAQ(null);
            setShowEditor(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New FAQ
        </button>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedFAQs).map(([category, categoryFAQs]) => (
          <div key={category} className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">{category}</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {categoryFAQs.map((faq, index) => (
                <li key={faq.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">{faq.question}</h4>
                      <p className="mt-1 text-sm text-gray-600">{faq.answer}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => moveFAQ(faq.id, 'up', category)}
                        disabled={index === 0}
                        className="p-2 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                      >
                        <ArrowUp className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => moveFAQ(faq.id, 'down', category)}
                        disabled={index === categoryFAQs.length - 1}
                        className="p-2 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                      >
                        <ArrowDown className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFAQ(faq);
                          setShowEditor(true);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-500"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this FAQ?')) {
                            deleteFAQ(faq.id);
                          }
                        }}
                        className="p-2 text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* FAQ Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {selectedFAQ ? 'Edit FAQ' : 'New FAQ'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Question</label>
                <input
                  type="text"
                  {...register('question')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.question && (
                  <p className="mt-1 text-sm text-red-600">{errors.question.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Answer</label>
                <textarea
                  {...register('answer')}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.answer && (
                  <p className="mt-1 text-sm text-red-600">{errors.answer.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <div className="mt-1 flex space-x-2">
                  {!showNewCategoryInput ? (
                    <>
                      <select
                        {...register('category')}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowNewCategoryInput(true)}
                        className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
                      >
                        New Category
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New category name"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newCategory) {
                            setValue('category', newCategory);
                            setShowNewCategoryInput(false);
                            setNewCategory('');
                          }
                        }}
                        className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewCategoryInput(false);
                          setNewCategory('');
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditor(false);
                    setSelectedFAQ(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  {selectedFAQ ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQs;
