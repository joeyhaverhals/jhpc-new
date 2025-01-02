import React, { useEffect, useState } from 'react';
import { useAboutStore } from '@/stores/aboutStore';
import { useDropzone } from 'react-dropzone';
import { History, Save, Upload, Eye, ArrowUpRight } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { uploadOptimizedImage } from '@/utils/imageOptimization';
import { format } from 'date-fns';

const About: React.FC = () => {
  const { 
    content, 
    versions, 
    isLoading, 
    error, 
    fetchContent, 
    fetchVersions,
    updateContent,
    publishContent,
    revertToVersion
  } = useAboutStore();

  const [editedContent, setEditedContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchContent();
    fetchVersions();
  }, [fetchContent, fetchVersions]);

  useEffect(() => {
    if (content) {
      setEditedContent(content.content);
      setImages(content.images);
    }
  }, [content]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    multiple: true,
    onDrop: async (acceptedFiles) => {
      setUploadingImage(true);
      try {
        const uploadedUrls = await Promise.all(
          acceptedFiles.map(file => 
            uploadOptimizedImage(file, `about/${Date.now()}-${file.name}`, {
              maxWidth: 1920,
              maxHeight: 1080,
              quality: 0.8,
              format: 'webp',
            })
          )
        );
        setImages(prev => [...prev, ...uploadedUrls]);
      } catch (error) {
        console.error('Error uploading images:', error);
      } finally {
        setUploadingImage(false);
      }
    },
  });

  const handleSave = async () => {
    await updateContent(editedContent, images);
  };

  const handlePublish = async () => {
    await publishContent();
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
        <h1 className="text-2xl font-bold text-gray-900">About Page Management</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowVersions(!showVersions)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <History className="h-4 w-4 mr-2" />
            Version History
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            onClick={handlePublish}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Publish
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Content</h2>
              <RichTextEditor
                value={editedContent}
                onChange={setEditedContent}
                onImageUpload={async (file) => {
                  const url = await uploadOptimizedImage(
                    file,
                    `about/${Date.now()}-${file.name}`,
                    {
                      maxWidth: 1920,
                      maxHeight: 1080,
                      quality: 0.8,
                      format: 'webp',
                    }
                  );
                  return url;
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Image Gallery</h2>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 ${
                  uploadingImage ? 'opacity-50' : ''
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop images here, or click to select files
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {images.map((url, index) => (
                  <div key={url} className="relative group">
                    <img
                      src={url}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setImages(images.filter(img => img !== url))}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Preview</h2>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: editedContent }} />
            </div>
            {images.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Gallery</h3>
                <div className="grid grid-cols-2 gap-4">
                  {images.map((url, index) => (
                    <img
                      key={url}
                      src={url}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Version History Modal */}
      {showVersions && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Version History</h3>
              <button
                onClick={() => setShowVersions(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Version {version.version}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(version.createdAt), 'PPpp')}
                      </p>
                      {version.publishedAt && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Published
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        revertToVersion(version.id);
                        setShowVersions(false);
                      }}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                    >
                      Revert to this version
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
