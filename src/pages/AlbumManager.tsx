// pages/AlbumManager.tsx - Large Screen Optimized
import { useState } from "react";
import { Plus, Trash2 } from 'lucide-react';
import { initialAlbums } from "../data/data";
import { useAuth } from "../hooks/useAuth";
import AddAlbumModal from "../components/modals/AddAlbumModal";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";
import { type Album } from "../types/Album";

const AlbumManager: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);
  const { logout } = useAuth();

  const handleAddAlbum = (newAlbum: Album) => {
    setAlbums([...albums, newAlbum]);
    setShowAddModal(false);
  };

  const handleDeleteClick = (album: Album) => {
    setAlbumToDelete(album);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (albumToDelete) {
      setAlbums(albums.filter(album => album.id !== albumToDelete.id));
      setShowDeleteModal(false);
      setAlbumToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center py-10">
            <h1 className="text-5xl font-bold text-gray-900" data-testid="app-title">
              Album Manager
            </h1>
            <button
              onClick={logout}
              className="px-8 py-4 text-xl text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="logout-button"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Add Button - Larger - Aligned to left */}
        <div className="mb-10 flex justify-start">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-8 py-4 text-xl bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all shadow-lg"
            data-testid="add-album-button"
          >
            <Plus className="h-8 w-8 mr-4" />
            Add New Album
          </button>
        </div>

        {/* Table - Much larger for presentation */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200" data-testid="albums-table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-6 text-left text-lg font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-8 py-6 text-left text-lg font-bold text-gray-700 uppercase tracking-wider">
                  Year Released
                </th>
                <th className="px-8 py-6 text-left text-lg font-bold text-gray-700 uppercase tracking-wider">
                  Band Name
                </th>
                <th className="px-8 py-6 text-left text-lg font-bold text-gray-700 uppercase tracking-wider">
                  Album Name
                </th>
                <th className="px-8 py-6 text-right text-lg font-bold text-gray-700 uppercase tracking-wider">
                  Image
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {albums.map((album) => (
                <tr key={album.id} data-testid={`album-row-${album.id}`} className="hover:bg-gray-50">
                  <td className="px-8 py-8 whitespace-nowrap text-lg text-gray-500">
                    <button
                      onClick={() => handleDeleteClick(album)}
                      className="text-red-600 hover:text-red-800 inline-flex items-center px-6 py-3 border border-red-300 rounded-lg hover:bg-red-50 transition-all font-medium"
                      data-testid={`delete-button-${album.id}`}
                    >
                      <Trash2 className="h-6 w-6 mr-3" />
                      Delete
                    </button>
                  </td>
                  <td className="px-8 py-8 whitespace-nowrap text-lg text-gray-600 font-medium" data-testid={`album-year-${album.id}`}>
                    {album.year}
                  </td>
                  <td className="px-8 py-8 whitespace-nowrap text-lg text-gray-600 font-medium" data-testid={`band-name-${album.id}`}>
                    {album.band}
                  </td>
                  <td className="px-8 py-8 whitespace-nowrap text-xl font-bold text-gray-900" data-testid={`album-name-${album.id}`}>
                    {album.name}
                  </td>
                  <td className="px-8 py-8 whitespace-nowrap text-right">
                    <img
                      src={album.image}
                      alt={album.name}
                      className="w-24 h-24 object-cover rounded-lg shadow-md border-2 border-gray-200 ml-auto"
                      data-testid={`album-image-${album.id}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty state - if no albums */}
          {albums.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-2xl mb-4">No albums found</div>
              <p className="text-gray-500 text-lg">Click "Add New Album" to get started</p>
            </div>
          )}
        </div>
      </div>

      <AddAlbumModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddAlbum}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        albumName={albumToDelete?.name}
      />
    </div>
  );
};

export default AlbumManager;