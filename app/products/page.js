'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation'; // Changed from 'next/router'
import Swal from 'sweetalert2';
import { ShoppingBagIcon, TrashIcon, PlusIcon, MinusIcon, ShoppingCartIcon, CurrencyDollarIcon, CreditCardIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { SparklesIcon, FaceSmileIcon, BeakerIcon, ScissorsIcon, HeartIcon } from '@heroicons/react/24/solid';

export default function ProductsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('semua');

    // Payment states
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [cashAmount, setCashAmount] = useState('');
    const [change, setChange] = useState(0);
    const [qrisImage, setQrisImage] = useState('');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Kategori kosmetik & skincare dengan Heroicons
    const categories = [
        { id: 'semua', name: 'Semua', icon: <SparklesIcon className="w-5 h-5" /> },
        { id: 'skincare', name: 'Skincare', icon: <FaceSmileIcon className="w-5 h-5" /> },
        { id: 'makeup', name: 'Makeup', icon: <BeakerIcon className="w-5 h-5" /> },
        { id: 'bodycare', name: 'Bodycare', icon: <HeartIcon className="w-5 h-5" /> },
        { id: 'haircare', name: 'Haircare', icon: <ScissorsIcon className="w-5 h-5" /> },
    ];

    // Fetch products on component mount
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

    // Handle search and category filtering
    useEffect(() => {
        let filtered = products;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.nama.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== 'semua') {
            filtered = filtered.filter(product => {
                const productCategory = product.kategori ? product.kategori.toLowerCase() : '';
                return productCategory.includes(selectedCategory);
            });
        }

        setFilteredProducts(filtered);
    }, [searchTerm, products, selectedCategory]);

    // Notifikasi SweetAlert2
    const showSuccess = (msg) => {
        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: msg,
            confirmButtonColor: '#d946ef',
        });
    };
    const showError = (msg) => {
        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: msg,
            confirmButtonColor: '#d946ef',
        });
    };

    // Add to cart
    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
            showSuccess('Jumlah produk di keranjang bertambah!');
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
            showSuccess('Produk ditambahkan ke keranjang!');
        }
    };

    // Update quantity in cart
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity === 0) {
            removeFromCart(productId);
            return;
        }

        setCart(cart.map(item =>
            item.id === productId
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    // Update total whenever cart changes
    useEffect(() => {
        const sum = cart.reduce((acc, item) => acc + (item.harga * item.quantity), 0);
        setTotal(sum);
    }, [cart]);

    // Remove from cart
    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
        showSuccess('Produk dihapus dari keranjang!');
    };

    // Clear cart
    const clearCart = () => {
        setCart([]);
        showSuccess('Keranjang dikosongkan!');
    };

    // Get product count by category
    const getProductCountByCategory = (categoryId) => {
        if (categoryId === 'semua') return products.length;
        return products.filter(product => {
            const productCategory = product.kategori ? product.kategori.toLowerCase() : '';
            return productCategory.includes(categoryId);
        }).length;
    };

    // Generate QRIS image (simulated)
    const generateQRIS = async (amount) => {
        // Simulasi generate QRIS - dalam implementasi nyata, ini akan memanggil API QRIS
        // Untuk demo, kita gunakan placeholder atau gambar QRIS dummy
        const qrisData = `00020101021226660014ID.CO.QRIS.WWW0215ID2022040800000330303UME51440014ID.CO.TELKOM.WWW021801234567890123456789520454995303360540${amount}5802ID5909TOKO DEMO6007JAKARTA61051234062070703A0163040C79`;

        // Simulasi delay untuk generate QRIS
        return new Promise((resolve) => {
            setTimeout(() => {
                // Dalam implementasi nyata, ini akan return URL gambar QRIS yang sudah di-generate
                resolve(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrisData)}`);
            }, 1000);
        });
    };

    // Save transaction to database/local storage
    // Save transaction to database
    const saveTransactionToReport = async (orderData) => {
        try {
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...orderData,
                    status: 'pending', // Order needs admin confirmation
                    orderDate: new Date().toISOString(),
                    orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    customerInfo: {
                        userId: user?.id,
                        name: user?.fullName || user?.username,
                        email: user?.email,
                        address: user?.address
                    }
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error saving order:', error);
            throw error;
        }
    };

    // Example: Fetch transactions for reports
    const fetchTransactions = async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams();

            // Add filters
            if (filters.kasir) queryParams.append('kasir', filters.kasir);
            if (filters.paymentMethod) queryParams.append('paymentMethod', filters.paymentMethod);
            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);
            if (filters.page) queryParams.append('page', filters.page);
            if (filters.pageSize) queryParams.append('pageSize', filters.pageSize);

            const response = await fetch(`/api/transactions?${queryParams}`);

            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error fetching transactions:', error);

            // Fallback: get from localStorage
            try {
                const localTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
                return {
                    success: true,
                    transactions: localTransactions,
                    pagination: {
                        currentPage: 1,
                        pageSize: localTransactions.length,
                        totalCount: localTransactions.length,
                        totalPages: 1,
                        hasNext: false,
                        hasPrev: false
                    }
                };
            } catch (localError) {
                console.error('Error fetching from localStorage:', localError);
                throw error;
            }
        }
    };

    // Example: Fetch statistics
    const fetchTransactionStats = async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams();

            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);
            if (filters.kasir) queryParams.append('kasir', filters.kasir);
            if (filters.period) queryParams.append('period', filters.period);

            const response = await fetch(`/api/transactions/stats?${queryParams}`);

            if (!response.ok) {
                throw new Error('Failed to fetch statistics');
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error fetching statistics:', error);
            throw error;
        }
    };

    // Handle payment method selection
    const handlePayment = async (method) => {
        setPaymentMethod(method);
        setIsProcessingPayment(true);

        if (method === 'qris') {
            try {
                // Generate QRIS image
                const qrisImageUrl = await generateQRIS(total);
                setQrisImage(qrisImageUrl);
            } catch (error) {
                console.error('Error generating QRIS:', error);
                alert('Gagal membuat QRIS. Silakan coba lagi.');
                setPaymentMethod('');
            }
        } else {
            // For cash, we need to input amount
            setCashAmount('');
            setChange(0);
        }

        setIsProcessingPayment(false);
    };

    // Calculate change when cash amount changes
    useEffect(() => {
        if (paymentMethod === 'tunai' && cashAmount) {
            const cash = parseInt(cashAmount) || 0;
            const changeAmount = cash - total;
            setChange(changeAmount);
        }
    }, [cashAmount, total, paymentMethod]);

    // Process payment
    const processPayment = async () => {
        try {
            const orderData = {
                items: cart.map(item => ({
                    id: item.id,
                    name: item.nama,
                    price: item.harga,
                    quantity: item.quantity,
                    subtotal: item.harga * item.quantity
                })),
                totalAmount: total,
                paymentMethod: paymentMethod,
                paymentStatus: 'pending',
                orderStatus: 'pending',
                paymentDetails: paymentMethod === 'tunai' ? {
                    cashAmount: parseInt(cashAmount),
                    changeAmount: change
                } : {
                    qrisReference: Date.now().toString()
                }
            };

            const result = await saveTransactionToReport(orderData);
            if (!result || !result.success) {
                throw new Error(result?.message || 'Gagal membuat pesanan');
            }
            Swal.fire({
                icon: 'success',
                title: 'Pesanan berhasil dibuat!',
                html: `Nomor Order: <b>${result.orderNumber}</b><br/>Total: <b>Rp ${total.toLocaleString('id-ID')}</b><br/>Status: <b>Menunggu konfirmasi admin</b><br/><br/>Silakan pantau status pesanan Anda di halaman Pesanan Saya.`,
                confirmButtonColor: '#d946ef',
                confirmButtonText: 'OK',
            });
            resetPaymentState();
            router.push('/orders');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: error?.message || 'Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.',
                confirmButtonColor: '#d946ef',
            });
        }
    };

    // Reset payment state
    const resetPaymentState = () => {
        setCart([]);
        setShowPaymentModal(false);
        setPaymentMethod('');
        setCashAmount('');
        setChange(0);
        setQrisImage('');
        setIsProcessingPayment(false);
    };

    // Handle cash payment submit
    const handleCashPayment = () => {
        const cash = parseInt(cashAmount) || 0;
        if (cash < total) {
            Swal.fire({
                icon: 'warning',
                title: 'Jumlah uang tidak mencukupi!',
                confirmButtonColor: '#d946ef',
            });
            return;
        }
        processPayment();
    };

    // Handle cancel payment
    const handleCancelPayment = () => {
        setPaymentMethod('');
        setCashAmount('');
        setChange(0);
        setQrisImage('');
    };

    return (
        <main className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-rose-100 to-fuchsia-100">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-fuchsia-700 tracking-tight mb-2">racare.glow</h1>
                    <p className="text-lg text-rose-500 font-medium">Temukan produk kosmetik & skincare terbaik untuk kulit sehat dan glowing</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Products Section */}
                    <div className="md:col-span-8">
                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari produk kecantikan..."
                                    className="w-full px-4 py-3 pl-12 rounded-full border-none bg-white shadow-md focus:ring-2 focus:ring-pink-400 transition-all duration-200 text-pink-700 placeholder-pink-300"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <MagnifyingGlassIcon className="w-6 h-6 text-pink-300 absolute left-4 top-3" />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="mb-6">
                            <div className="flex flex-wrap gap-3">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-200 ${selectedCategory === category.id
                                                ? 'bg-pink-500 text-white border-pink-500 shadow-md'
                                                : 'bg-white text-pink-700 border-pink-100 hover:border-pink-300 hover:bg-pink-50'
                                            }`}
                                    >
                                        <span>{category.icon}</span>
                                        <span className="font-medium">{category.name}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${selectedCategory === category.id
                                                ? 'bg-pink-600 text-white'
                                                : 'bg-pink-100 text-pink-600'
                                            }`}>
                                            {getProductCountByCategory(category.id)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <div
                                        key={product.id}
                                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 border border-pink-100"
                                        onClick={() => addToCart(product)}
                                    >
                                        <div className="relative h-36 w-full bg-pink-50 flex items-center justify-center">
                                            <img
                                                src={product.gambar || '/placeholder-cosmetic.png'}
                                                alt={product.nama}
                                                className="w-full h-full object-cover bg-pink-100"
                                            />
                                            <div className="absolute top-2 right-2 bg-pink-500 bg-opacity-80 text-white text-xs px-2 py-1 rounded-full">
                                                {product.kategori || 'Lainnya'}
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-semibold text-pink-800 text-sm mb-1 truncate">{product.nama}</h3>
                                            <p className="text-pink-600 font-bold text-sm">
                                                Rp {parseInt(product.harga).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <FaceSmileIcon className="w-16 h-16 text-pink-200 mx-auto mb-4" />
                                    <p className="text-pink-400 text-lg">Tidak ada produk ditemukan</p>
                                    <p className="text-pink-300 text-sm">Coba ubah kata kunci pencarian atau kategori</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cart Section */}
                    <div className="md:col-span-4">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4 border border-pink-100">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-fuchsia-700">Keranjang Belanja</h2>
                                {cart.length > 0 && (
                                    <button
                                        onClick={clearCart}
                                        className="text-pink-400 hover:text-pink-600 text-sm font-medium flex items-center gap-1"
                                    >
                                        <TrashIcon className="w-4 h-4" /> Hapus Semua
                                    </button>
                                )}
                            </div>

                            {cart.length === 0 ? (
                                <div className="text-center py-8">
                                    <ShoppingBagIcon className="w-10 h-10 text-pink-100 mx-auto mb-2" />
                                    <p className="text-pink-400">Keranjang masih kosong</p>
                                    <p className="text-pink-200 text-sm">Pilih produk untuk mulai berbelanja</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                        {cart.map(item => (
                                            <div key={item.id} className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-sm text-pink-800">{item.nama}</h3>
                                                    <p className="text-xs text-pink-500">
                                                        Rp {parseInt(item.harga).toLocaleString('id-ID')} / item
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-6 h-6 rounded-full bg-pink-200 text-pink-700 hover:bg-pink-300 flex items-center justify-center"
                                                    >
                                                        <MinusIcon className="w-4 h-4" />
                                                    </button>
                                                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-6 h-6 rounded-full bg-pink-400 text-white hover:bg-pink-500 flex items-center justify-center"
                                                    >
                                                        <PlusIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-pink-400 hover:text-pink-600 ml-2"
                                                    >
                                                        <XMarkIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-lg font-bold text-pink-700">Total:</span>
                                            <span className="text-xl font-bold text-pink-600">
                                                Rp {total.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <button
                                            className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white py-3 px-4 rounded-lg hover:from-pink-600 hover:to-fuchsia-600 transition-all duration-200 font-medium shadow-md"
                                            onClick={() => setShowPaymentModal(true)}
                                        >
                                            Checkout ({cart.length} item)
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Payment Modal */}
                {showPaymentModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full m-4 max-h-[90vh] overflow-y-auto border border-pink-200">
                            <h2 className="text-2xl font-bold mb-6 text-fuchsia-700 text-center">Pilih Metode Pembayaran</h2>

                            {/* Order Summary */}
                            <div className="bg-pink-50 rounded-lg p-4 mb-6">
                                <h3 className="font-semibold mb-2 text-pink-700">Ringkasan Pesanan:</h3>
                                <div className="space-y-2">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span>{item.nama} x{item.quantity}</span>
                                            <span>Rp {(item.harga * item.quantity).toLocaleString('id-ID')}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                                    <span>Total:</span>
                                    <span className="text-pink-600">Rp {total.toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            {!paymentMethod ? (
                                // Payment Method Selection
                                <div className="space-y-4">
                                    <button
                                        onClick={() => handlePayment('qris')}
                                        disabled={isProcessingPayment}
                                        className="w-full p-4 border-2 border-pink-100 rounded-lg hover:border-pink-400 hover:bg-pink-50 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50"
                                    >
                                        <CreditCardIcon className="w-6 h-6 text-pink-400" />
                                        <div className="text-left">
                                            <div className="font-semibold text-pink-700">QRIS</div>
                                            <div className="text-sm text-pink-400">Bayar dengan scan QR Code</div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => handlePayment('tunai')}
                                        disabled={isProcessingPayment}
                                        className="w-full p-4 border-2 border-pink-100 rounded-lg hover:border-pink-400 hover:bg-pink-50 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50"
                                    >
                                        <CurrencyDollarIcon className="w-6 h-6 text-pink-400" />
                                        <div className="text-left">
                                            <div className="font-semibold text-pink-700">Tunai</div>
                                            <div className="text-sm text-pink-400">Bayar dengan uang tunai</div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setShowPaymentModal(false)}
                                        className="w-full mt-4 px-6 py-2 rounded-lg border border-pink-200 hover:bg-pink-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <XMarkIcon className="w-5 h-5 text-pink-400" /> Batal
                                    </button>
                                </div>
                            ) : paymentMethod === 'qris' ? (
                                // QRIS Payment
                                <div className="text-center">
                                    <div className="bg-pink-50 rounded-lg p-8 mb-4">
                                        <div className="text-lg font-semibold mb-4 text-pink-700">Scan QR Code untuk Pembayaran</div>

                                        {isProcessingPayment ? (
                                            <div className="flex flex-col items-center justify-center py-8">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mb-4"></div>
                                                <div className="text-sm text-pink-400">Membuat QR Code...</div>
                                            </div>
                                        ) : qrisImage ? (
                                            <div className="flex flex-col items-center">
                                                <img
                                                    src={qrisImage}
                                                    alt="QRIS Payment Code"
                                                    className="w-48 h-48 border-2 border-pink-200 rounded-lg mb-4"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'block';
                                                    }}
                                                />
                                                <div className="hidden text-4xl mb-2">⬜</div>
                                                <div className="text-sm text-pink-400 mb-4">
                                                    Gunakan aplikasi mobile banking atau e-wallet untuk scan
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-white border-2 border-dashed border-pink-200 rounded-lg p-8 mb-4">
                                                <div className="text-4xl mb-2">⬜</div>
                                                <div className="text-xs text-pink-300">Gagal memuat QR Code</div>
                                            </div>
                                        )}

                                        <div className="text-lg font-bold text-pink-600">
                                            Rp {total.toLocaleString('id-ID')}
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            onClick={handleCancelPayment}
                                            className="flex-1 px-4 py-2 rounded-lg border border-pink-200 hover:bg-pink-50 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <XMarkIcon className="w-5 h-5 text-pink-400" /> Kembali
                                        </button>
                                        <button
                                            onClick={processPayment}
                                            disabled={!qrisImage}
                                            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${qrisImage
                                                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                                                    : 'bg-pink-100 text-pink-400 cursor-not-allowed'
                                                }`}
                                        >
                                            <CreditCardIcon className="w-5 h-5" /> Konfirmasi Bayar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Cash Payment
                                <div>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-pink-700 mb-2">
                                            Jumlah Uang Diterima
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3 text-pink-400">Rp</span>
                                            <input
                                                type="number"
                                                value={cashAmount}
                                                onChange={(e) => setCashAmount(e.target.value)}
                                                placeholder="0"
                                                className="w-full px-4 py-3 pl-12 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 text-lg text-pink-700"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    {/* Quick Amount Buttons */}
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {[total, 50000, 100000, 150000, 200000, 500000].map((amount) => (
                                            <button
                                                key={amount}
                                                onClick={() => setCashAmount(amount.toString())}
                                                className="px-3 py-2 text-sm rounded-lg border border-pink-200 hover:bg-pink-50 transition-colors text-pink-700"
                                            >
                                                {amount.toLocaleString()}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Change Display */}
                                    {cashAmount && (
                                        <div className="bg-pink-50 rounded-lg p-4 mb-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Total Belanja:</span>
                                                <span>Rp {total.toLocaleString('id-ID')}</span>
                                            </div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Uang Diterima:</span>
                                                <span>Rp {parseInt(cashAmount || 0).toLocaleString('id-ID')}</span>
                                            </div>
                                            <div className={`flex justify-between font-bold text-lg ${change >= 0 ? 'text-pink-600' : 'text-red-600'
                                                }`}>
                                                <span>Kembalian:</span>
                                                <span>{change >= 0 ? 'Rp ' : '-Rp '}{Math.abs(change).toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex space-x-3">
                                        <button
                                            onClick={handleCancelPayment}
                                            className="flex-1 px-4 py-2 rounded-lg border border-pink-200 hover:bg-pink-50 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <XMarkIcon className="w-5 h-5 text-pink-400" /> Kembali
                                        </button>
                                        <button
                                            onClick={handleCashPayment}
                                            disabled={!cashAmount || change < 0}
                                            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${cashAmount && change >= 0
                                                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                                                    : 'bg-pink-100 text-pink-400 cursor-not-allowed'
                                                }`}
                                        >
                                            <CurrencyDollarIcon className="w-5 h-5" /> Proses Bayar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}