import React, { useEffect, useState } from 'react';
import { useMediaStore } from '@/stores/mediaStore';
import { useDropzone } from 'react-dropzone';
import { 
  FolderPlus, 
  Upload, 
  Folder, 
  Image as ImageIcon, 
  Trash2,
  Grid,
  List
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { uploadOptimizedImage } from '@/utils/imageOptimization';

const Media: React.FC = () => {
  const { 
    files, 
    folders, 
    isLoading, 
    error, 
    currentFolder,
    fetchMedia, 
    uploadFile, 
    deleteFile,
    createFolder,
    setCurrentFolder
  } = useMediaStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia, currentFolder]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    onDrop: async (acceptedFiles) => {
      try {
        for (const file of acceptedFiles) {
          const path = currentFolder
            ? `${currentFolder}/${file.name}`
            : file.name;

          await uploadOptimizedImage(file, path, {
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 0.8,
            format: 'webp'
          });
        }
        await fetchMedia();
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    },
  });

  const handleCreateFolder = async () => {
    if (newFolderName) {
      await createFolder(newFolderName);
      setNewFolderName('');
      setShowNewFolderModal(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (window.confirm('Are you sure you want to delete selected files?')) {
      for (const fileId of selectedFiles) {
        await deleteFile(fileId);
      }
      setSelectedFiles([]);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
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
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
            className="p-2 text-gray-400 hover:text-gray-500"
          >
            {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setShowNewFolderModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </button>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm">
        <button
          onClick={() => setCurrentFolder('')}
          className="text-gray-600 hover:text-gray-900"
        >
          Root
        </button>
        {currentFolder && (
          <>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{currentFolder}</span>
          </>
        )}
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <Upload className="h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop files here, or click to select files
          </p>
        </div>
      </div>

      {/* Folders Grid/List */}
      {folders.length > 0 && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-6 gap-4' : 'space-y-2'}>
          {folders.map((folder) => (
            <button
              key={folder}
              onClick={() => setCurrentFolder(folder)}
              className={`flex items-center p-4 rounded-lg hover:bg-gray-50 ${
                viewMode === 'grid' ? 'flex-col' : 'space-x-4'
              }`}
            >
              <Folder className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-900">{folder}</span>
            </button>
          ))}
        </div>
      )}

      {/* Files Grid/List */}
      {files.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-6 gap-4' : 'space-y-2'}>
          {files.map((file) => (
            <div
              key={file.id}
              className={`relative group ${
                viewMode === 'grid'
                  ? 'aspect-square rounded-lg overflow-hidden'
                  : 'flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50'
              }`}
            >
              {file.type.startsWith('image/') ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className={`${
                    viewMode === 'grid'
                      ? 'w-full h-full object-cover'
                      : 'w-16 h-16 object-cover rounded'
                  }`}
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-gray-400" />
              )}
              
              <div className={`${
                viewMode === 'grid'
                  ? 'absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'
                  : 'flex-1'
              }`}>
                <div className={`${
                  viewMode === 'grid'
                    ? 'text-white space-y-2'
                    : 'text-gray-900'
                }`}>
                  <p className="text-sm truncate">{file.name}</p>
                  <p className="text-xs">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                
                <div className={`${
                  viewMode === 'grid'
                    ? 'absolute top-2 right-2'
                    : 'flex items-center space-x-2'
                }`}>
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => toggleFileSelection(file.id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this file?')) {
                        deleteFile(file.id);
                      }
                    }}
                    className="p-1 text-red-400 hover:text-red-500 rounded-full hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No files in this folder
        </div>
      )}

      {/* Bulk Actions */}
      {selectedFiles.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {selectedFiles.length} files selected
            </span>
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create New Folder
            </h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;
