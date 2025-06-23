'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import Image from 'next/image';
import { SparklesIcon, FaceSmileIcon, BeakerIcon, ScissorsIcon, HeartIcon } from '@heroicons/react/24/solid';

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    nama: '',
    harga: '',
    gambar: '',
    kategori: '',
    deskripsi: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const { user } = useAuth();

  // Kategori kosmetik & skincare
  const categories = [
    { id: 'skincare', name: 'Skincare', icon: <FaceSmileIcon className="w-5 h-5 inline" /> },
    { id: 'makeup', name: 'Makeup', icon: <BeakerIcon className="w-5 h-5 inline" /> },
    { id: 'bodycare', name: 'Bodycare', icon: <HeartIcon className="w-5 h-5 inline" /> },
    { id: 'haircare', name: 'Haircare', icon: <ScissorsIcon className="w-5 h-5 inline" /> },
    { id: 'tools', name: 'Tools', icon: <SparklesIcon className="w-5 h-5 inline" /> },
  ];

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = products.filter(product =>
      product.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Reset form
  const resetForm = () => {
    setNewProduct({
      nama: '',
      harga: '',
      gambar: '',
      kategori: '',
      deskripsi: ''
    });
    setImagePreview(null);
    setIsEditMode(false);
    setEditingProduct(null);
  };

  // Handle Edit - Open modal with product data
  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsEditMode(true);
    setNewProduct({
      nama: product.nama,
      harga: product.harga.toString(),
      gambar: product.gambar,
      kategori: product.kategori,
      deskripsi: product.deskripsi
    });
    setImagePreview(product.gambar);
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDelete = async (productId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      try {
        const response = await fetch('/api/products', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: productId }),
        });

        if (response.ok) {
          setProducts(products.filter(product => product.id !== productId));
          alert('Menu berhasil dihapus!');
        } else {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Gagal menghapus menu');
      }
    }
  };

  // Handle form submit (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (isEditMode) {
        // Update existing product
        response = await fetch('/api/products', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingProduct.id,
            ...newProduct
          }),
        });
      } else {
        // Add new product
        response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProduct),
        });
      }

      if (response.ok) {
        // Ambil ulang data produk dari backend setelah update/insert
        const fetchProducts = async () => {
          try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
            setFilteredProducts(data);
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        };
        await fetchProducts();

        alert(isEditMode ? 'Menu berhasil diupdate!' : 'Menu berhasil ditambahkan!');
        resetForm();
        setIsModalOpen(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Gagal menyimpan menu');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewProduct({ ...newProduct, gambar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-rose-100 to-fuchsia-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-fuchsia-700">Produk Kosmetik & Skincare</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white px-6 py-2 rounded-full hover:from-pink-600 hover:to-fuchsia-600 transition-all duration-200 shadow-md"
          >
            + Tambah Produk
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Cari produk kosmetik/skincare..."
            className="w-full px-4 py-3 pl-12 rounded-full border-none bg-white shadow-md focus:ring-2 focus:ring-pink-400 transition-all duration-200 text-pink-700 placeholder-pink-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SparklesIcon className="w-6 h-6 text-pink-300 absolute left-4 top-3" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white/80 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-pink-100">
              <div className="relative h-48 w-full bg-pink-50 flex items-center justify-center">
                <Image
                  src={product.gambar || '/placeholder-cosmetic.png'}
                  alt={product.nama}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-pink-800 mb-2">{product.nama}</h3>
                <p className="text-pink-600 font-bold mb-2">
                  Rp {parseInt(product.harga).toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-pink-400 mb-4 flex items-center gap-1">
                  {categories.find(c => c.id === product.kategori)?.icon}
                  {categories.find(c => c.id === product.kategori)?.name || product.kategori}
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-pink-500 hover:text-pink-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full m-4">
              <h2 className="text-2xl font-bold mb-6 text-fuchsia-700">
                {isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h2>
              <form onSubmit={handleSubmit}>
                {/* Image Upload */}
                <div className="mb-6">
                  <div className="relative h-40 bg-pink-50 rounded-lg overflow-hidden">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <SparklesIcon className="w-12 h-12 text-pink-200" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nama Produk"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-pink-200 focus:ring-pink-400 focus:border-pink-400 text-pink-700"
                    value={newProduct.nama}
                    onChange={(e) => setNewProduct({ ...newProduct, nama: e.target.value })}
                  />
                  <div className="relative">
                    <span className="absolute left-4 top-2 text-pink-400">Rp</span>
                    <input
                      type="number"
                      placeholder="Harga"
                      required
                      className="w-full px-4 py-2 pl-12 rounded-lg border border-pink-200 focus:ring-pink-400 focus:border-pink-400 text-pink-700"
                      value={newProduct.harga}
                      onChange={(e) => setNewProduct({ ...newProduct, harga: e.target.value })}
                    />
                  </div>
                  <select
                    value={newProduct.kategori}
                    onChange={(e) => setNewProduct({ ...newProduct, kategori: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-pink-200 focus:ring-pink-400 focus:border-pink-400 text-pink-700"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Deskripsi produk (opsional)"
                    className="w-full px-4 py-2 rounded-lg border border-pink-200 focus:ring-pink-400 focus:border-pink-400 text-pink-700"
                    rows="3"
                    value={newProduct.deskripsi}
                    onChange={(e) => setNewProduct({ ...newProduct, deskripsi: e.target.value })}
                  />
                </div>

                {/* Modal Actions */}
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-6 py-2 rounded-full border border-pink-200 hover:bg-pink-50 transition-colors text-pink-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white hover:from-pink-600 hover:to-fuchsia-600 transition-all duration-200"
                  >
                    {isEditMode ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}