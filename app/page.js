"use client";
import {
  ShoppingBagIcon, ShoppingCartIcon, TruckIcon, CurrencyDollarIcon, DevicePhoneMobileIcon,
  SparklesIcon, GiftIcon, HeartIcon, StarIcon, GlobeAltIcon,
  FireIcon, TrophyIcon, LightBulbIcon, SunIcon, MoonIcon,
  CloudIcon, BoltIcon, BeakerIcon, RocketLaunchIcon, WrenchIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const features = [
    {
      title: "Konsultasi Kecantikan Cerdas",
      description: "Dapatkan rekomendasi skincare & kosmetik terbaik sesuai kebutuhan kulitmu dengan teknologi AI.",
      icon: (
        <SparklesIcon className="h-7 w-7 text-pink-500" />
      ),
    },
    {
      title: "Produk 100% Original",
      description: "Hanya menjual produk skincare & kosmetik asli dari brand terpercaya dan bersertifikat.",
      icon: (
        <GiftIcon className="h-7 w-7 text-rose-400" />
      ),
    },
    {
      title: "Pengiriman Aman & Cepat",
      description: "Pesananmu dikemas rapi, dikirim cepat, dan bisa dilacak hingga sampai di tanganmu.",
      icon: (
        <TruckIcon className="h-7 w-7 text-blue-400" />
      ),
    },
  ];

  const testimonials = [
    {
      name: "Ayu Pratiwi",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "Kulitku makin glowing setelah rutin belanja skincare di racare.glow! Packing aman & produk selalu original.",
    },
    {
      name: "Rizky Saputra",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Banyak promo menarik, konsultasi gratis, dan CS-nya ramah banget. Racare.glow selalu jadi andalan!",
    },
    {
      name: "Citra Dewi",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "Makeup & skincare lengkap, pengiriman super cepat. Suka banget sama racare.glow!",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-100 to-white font-sans">
      {/* Animated Blobs Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <svg className="absolute left-1/2 top-0 -translate-x-1/2 animate-spin-slow" width="900" height="900" viewBox="0 0 900 900" fill="none">
          <ellipse cx="450" cy="450" rx="350" ry="350" fill="#f472b6" fillOpacity="0.13" />
        </svg>
        <svg className="absolute right-0 bottom-0 animate-pulse" width="400" height="400" viewBox="0 0 400 400" fill="none">
          <ellipse cx="200" cy="200" rx="180" ry="120" fill="#f9a8d4" fillOpacity="0.10" />
        </svg>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-35 pb-32 relative z-10 text-center">
          <h1
            className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-500 mb-8 animate-fade-in-up leading-tight md:leading-[1.15]"
            style={{ paddingBottom: '0.2em', lineHeight: 1.15, overflow: 'visible' }}
          >
            racare.glow
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
            Toko kosmetik & skincare original, solusi glowing dan cantikmu. Konsultasi gratis, produk lengkap, dan promo menarik setiap hari!
          </p>
          <a href="#features" className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-300 animate-bounce">
            Mulai Glowing
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-10 shadow-xl shadow-rose-100/40 hover:shadow-2xl hover:scale-105 transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl mb-6 group-hover:rotate-6 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-pink-500 transition-colors duration-300">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-pink-500 to-fuchsia-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 animate-fade-in-up">
              <div className="text-5xl font-extrabold text-white mb-2">150K+</div>
              <div className="text-pink-100 text-lg">Pelanggan Glowing</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 animate-fade-in-up delay-100">
              <div className="text-5xl font-extrabold text-white mb-2">300+</div>
              <div className="text-pink-100 text-lg">Brand Kosmetik & Skincare</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 animate-fade-in-up delay-200">
              <div className="text-5xl font-extrabold text-white mb-2">24/7</div>
              <div className="text-pink-100 text-lg">Beauty Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 animate-fade-in-up">Apa Kata Mereka?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Testimoni pelanggan setia racare.glow yang sudah merasakan manfaat produk original dan pelayanan terbaik.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg shadow-rose-100/40 flex flex-col items-center animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
              <img src={t.avatar} alt={t.name} className="w-20 h-20 rounded-full border-4 border-pink-200 mb-4 shadow-md" />
              <p className="text-gray-700 text-lg mb-3 text-center">“{t.text}”</p>
              <span className="font-semibold text-pink-500">{t.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 animate-fade-in-up">Brand Kecantikan Premium</h2>
          <p className="text-gray-600 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Koleksi brand skincare & kosmetik terbaik, original, dan terkurasi untukmu
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.9s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        .animate-fade-in-up.delay-100 { animation-delay: 0.1s; }
        .animate-fade-in-up.delay-200 { animation-delay: 0.2s; }
        .animate-fade-in-up.delay-300 { animation-delay: 0.3s; }
        .animate-spin-slow { animation: spin 18s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
