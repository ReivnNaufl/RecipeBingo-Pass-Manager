import React from 'react';
import icondownload from '../assets/icon_download.svg'
import icongithub from '../assets/mdi_github.svg'

function Hero() {
  return (
    <section className="bg-green-50 py-20 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          Solusi Untuk Makanan anda
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          {/* Tambahkan deskripsi jika perlu */}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          {/* Tombol Unduh */}
          <a
            href="https://github.com/reivnnaufl/RecipeBingo/releases/latest/download/RecipeBingo.apk"
            className="bg-green-600 text-white px-6 py-3 rounded-full text-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <img
              src={icondownload}
              alt="Download Icon"
              className="w-6 h-6"
            />
            Unduh Sekarang
          </a>

          {/* Tombol GitHub */}
          <a
            href="https://github.com/ReivnNaufl/RecipeBingo/"
            className="border border-green-600 text-green-600 px-6 py-3 rounded-full text-lg hover:bg-green-100 transition flex items-center gap-2"
          >
            <img
              src={icongithub}
              alt="GitHub Icon"
              className="w-6 h-6"
            />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
