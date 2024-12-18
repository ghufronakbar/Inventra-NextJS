"use client";

import React, { useState } from "react";
import { Package, Warehouse, BarChart, Check, Zap, Shield } from "lucide-react";
import Link from "next/link";

const InventoryLandingPage: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const features = [
    {
      icon: <Package className="w-12 h-12 text-blue-600" />,
      title: "Manajemen Inventaris Lengkap",
      description:
        "Kelola seluruh stok barang dengan mudah dan akurat. Pantau pergerakan barang, catat pembelian, dan lakukan penjualan dengan cepat.",
    },
    {
      icon: <Warehouse className="w-12 h-12 text-green-600" />,
      title: "Pelacakan Gudang Real-Time",
      description:
        "Dapatkan informasi mendalam tentang stok di setiap gudang. Pantau lokasi, jumlah, dan status barang secara instan.",
    },
    {
      icon: <BarChart className="w-12 h-12 text-purple-600" />,
      title: "Analitik Mendalam",
      description:
        "Dapatkan wawasan bisnis dengan laporan dan grafik yang komprehensif. Buat keputusan cerdas berdasarkan data aktual.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Package className="w-10 h-10 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Inventra</h1>
          </div>
          <nav className="space-x-4">
            <a
              href="#features"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Fitur
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Harga
            </a>
            <Link href="/login">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Mulai Sekarang
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Kelola Inventaris Bisnis Anda dengan Mudah dan Cerdas
          </h2>
          <p className="text-xl text-gray-600">
            Inventra membantu Anda mengoptimalkan manajemen stok, mengurangi
            biaya, dan meningkatkan efisiensi bisnis Anda.
          </p>
          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg">
              Coba Gratis
            </button>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg border border-blue-600 hover:bg-blue-50 transition">
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="bg-blue-100 rounded-xl p-6 transform rotate-3 shadow-xl">
            <div className="bg-white rounded-xl p-6 space-y-4 relative z-10">
              <div className="flex items-center space-x-4">
                <Package className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Total Stok</h3>
                  <p className="text-2xl font-bold text-blue-600">1,234 Item</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Stok Tersedia</p>
                    <p className="font-semibold">1,100</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Stok Habis</p>
                    <p className="font-semibold text-red-600">134</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sistem inventaris canggih yang dirancang untuk mendukung
              pertumbuhan bisnis Anda
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 cursor-pointer ${
                  activeFeature === index ? "ring-4 ring-blue-300" : ""
                }`}
                onMouseEnter={() => setActiveFeature(index)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                {feature.icon}
                <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Mengapa Memilih Inventra?
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: <Zap className="w-8 h-8 text-blue-600" />,
                    text: "Efisiensi Operasional Maksimal",
                  },
                  {
                    icon: <Shield className="w-8 h-8 text-green-600" />,
                    text: "Keamanan Data Terjamin",
                  },
                  {
                    icon: <Check className="w-8 h-8 text-purple-600" />,
                    text: "Akurasi Laporan Tinggi",
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    {benefit.icon}
                    <span className="text-lg text-gray-800">
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Siap Mengoptimalkan Inventaris?
              </h3>
              <p className="text-gray-600 mb-6">
                Bergabunglah dengan ribuan bisnis yang sudah meningkatkan
                efisiensi dengan Inventra
              </p>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                Mulai Uji Coba Gratis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Package className="w-10 h-10 text-blue-500 mr-3" />
              <h3 className="text-xl font-bold">Inventra</h3>
            </div>
            <p className="text-gray-400">
              Solusi cerdas untuk manajemen inventaris modern
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Produk</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Fitur
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Harga
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Demo
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Perusahaan</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Kontak
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Karier
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Hubungi Kami</h4>
            <p className="text-gray-400 mb-2">Email: support@Inventra.com</p>
            <p className="text-gray-400">Telepon: +62 812 3456 7890</p>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-4 border-t border-gray-800 text-center">
          <p className="text-gray-500">
            © 2024 Inventra. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default InventoryLandingPage;
