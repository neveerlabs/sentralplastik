// barang.js - Data produk SENTRAL PLASTIK
class BarangData {
    constructor() {
        this.produk = [
            {
                id: 1,
                nama: "Cup Plastik 16oz Premium",
                deskripsi: "Cup plastik ukuran 16oz dengan kualitas premium, tebal dan tidak mudah bocor",
                kategori: "CUP PLASTIK",
                subKategori: "gelas",
                harga: 45000,
                hargaLama: 50000,
                stok: 50,
                tag: ["terbaru", "terlaris", "diskon"],
                rating: 4.8,
                totalPenjualan: 1250,
                gambar: "images/cup-16oz.jpg",
                warna: ["Putih", "Transparan"],
                ukuran: "16oz",
                bahan: "PP Food Grade",
                minimalPembelian: 1,
                berat: 200,
                dimensi: "8x8x12 cm"
            },
            {
                id: 2,
                nama: "Box Makanan Segi Empat 500ml",
                deskripsi: "Box makanan plastik segi empat dengan tutup rapat, cocok untuk usaha makanan",
                kategori: "KEMASAN MAKANAN",
                subKategori: "wadah",
                harga: 81000,
                hargaLama: 90000,
                stok: 30,
                tag: ["terbaru", "diskon"],
                rating: 4.5,
                totalPenjualan: 890,
                gambar: "images/box-makanan.jpg",
                warna: ["Putih", "Transparan"],
                ukuran: "500ml",
                bahan: "PP Food Grade",
                minimalPembelian: 1,
                berat: 150,
                dimensi: "15x10x5 cm"
            },
            {
                id: 3,
                nama: "Sendok Garpu Plastik 50pcs",
                deskripsi: "Set sendok dan garpu plastik premium, 50 pasang per pack",
                kategori: "ALAT MAKAN PLASTIK",
                subKategori: "alat makan",
                harga: 76000,
                hargaLama: 80000,
                stok: 100,
                tag: ["terlaris"],
                rating: 4.7,
                totalPenjualan: 2100,
                gambar: "images/sendok-garpu.jpg",
                warna: ["Putih"],
                ukuran: "Standar",
                bahan: "PP Food Grade",
                minimalPembelian: 1,
                berat: 300,
                dimensi: "20x15x5 cm"
            },
            {
                id: 4,
                nama: "Tutup Cup Universal",
                deskripsi: "Tutup cup plastik universal cocok untuk berbagai ukuran cup",
                kategori: "KEMASAN MAKANAN",
                subKategori: "tutup",
                harga: 49000,
                hargaLama: 55000,
                stok: 75,
                tag: ["diskon"],
                rating: 4.3,
                totalPenjualan: 670,
                gambar: "images/tutup-cup.jpg",
                warna: ["Transparan"],
                ukuran: "Universal",
                bahan: "PP Food Grade",
                minimalPembelian: 1,
                berat: 100,
                dimensi: "10x10x2 cm"
            },
            {
                id: 5,
                nama: "Sedotan Plastik Warna-warni 100pcs",
                deskripsi: "Sedotan plastik warna-warni, 100 buah per pack",
                kategori: "PERLENGKAPAN RUMAH TANGGA",
                subKategori: "sedotan",
                harga: 78000,
                hargaLama: 85000,
                stok: 0, // Stok habis
                tag: ["terbaru", "terlaris"],
                rating: 4.6,
                totalPenjualan: 980,
                gambar: "images/sedotan.jpg",
                warna: ["Merah", "Biru", "Hijau", "Kuning"],
                ukuran: "Standar",
                bahan: "PP Food Grade",
                minimalPembelian: 1,
                berat: 250,
                dimensi: "20x10x5 cm"
            },
            {
                id: 6,
                nama: "Plastik Klip Set 3 Ukuran",
                deskripsi: "Set plastik klip 3 ukuran berbeda untuk penyimpanan makanan",
                kategori: "PERLENGKAPAN RUMAH TANGGA",
                subKategori: "plastik klip",
                harga: 94000,
                hargaLama: 100000,
                stok: 40,
                tag: ["diskon"],
                rating: 4.4,
                totalPenjualan: 450,
                gambar: "images/plastik-klip.jpg",
                warna: ["Transparan"],
                ukuran: "S/M/L",
                bahan: "PE Food Grade",
                minimalPembelian: 1,
                berat: 400,
                dimensi: "25x20x8 cm"
            },
            {
                id: 7,
                nama: "Aluminium Foil Makanan 30cm",
                deskripsi: "Aluminium foil khusus makanan lebar 30cm, 10 meter per roll",
                kategori: "ALUMINIUM FOIL",
                subKategori: "aluminium",
                harga: 54000,
                hargaLama: 60000,
                stok: 45,
                tag: ["terbaru", "terlaris", "diskon"],
                rating: 4.9,
                totalPenjualan: 1120,
                gambar: "images/aluminium-foil.jpg",
                warna: ["Silver"],
                ukuran: "30cm x 10m",
                bahan: "Aluminium Food Grade",
                minimalPembelian: 1,
                berat: 350,
                dimensi: "30x30x5 cm"
            },
            {
                id: 8,
                nama: "Cup Plastik 8oz Box 100pcs",
                deskripsi: "Cup plastik 8oz dalam box, 100 buah per pack",
                kategori: "CUP PLASTIK",
                subKategori: "gelas",
                harga: 50000,
                hargaLama: 55000,
                stok: 35,
                tag: ["diskon"],
                rating: 4.2,
                totalPenjualan: 780,
                gambar: "images/cup-8oz.jpg",
                warna: ["Putih"],
                ukuran: "8oz",
                bahan: "PP Food Grade",
                minimalPembelian: 1,
                berat: 800,
                dimensi: "25x25x15 cm"
            },
            {
                id: 9,
                nama: "Wadah Plastik Bertingkat 3",
                deskripsi: "Wadah plastik bertingkat 3 untuk penyimpanan bahan makanan",
                kategori: "PERLENGKAPAN RUMAH TANGGA",
                subKategori: "wadah",
                harga: 65000,
                hargaLama: 70000,
                stok: 25,
                tag: ["terbaru", "diskon"],
                rating: 4.5,
                totalPenjualan: 320,
                gambar: "images/wadah-3tingkat.jpg",
                warna: ["Putih", "Biru"],
                ukuran: "3 Tier",
                bahan: "PP Food Grade",
                minimalPembelian: 1,
                berat: 600,
                dimensi: "20x20x25 cm"
            },
            {
                id: 10,
                nama: "Sendok Plastik Premium 100pcs",
                deskripsi: "Sendok plastik premium, 100 buah per pack",
                kategori: "ALAT MAKAN PLASTIK",
                subKategori: "alat makan",
                harga: 35000,
                hargaLama: 40000,
                stok: 80,
                tag: ["terlaris"],
                rating: 4.7,
                totalPenjualan: 1560,
                gambar: "images/sendok-premium.jpg",
                warna: ["Putih"],
                ukuran: "Standar",
                bahan: "PP Food Grade",
                minimalPembelian: 1,
                berat: 400,
                dimensi: "20x15x5 cm"
            },
            {
                id: 11,
                nama: "Box Kue Plastik Transparan",
                deskripsi: "Box kue plastik transparan dengan tutup, cocok untuk kue tart",
                kategori: "KEMASAN MAKANAN",
                subKategori: "box kue",
                harga: 72000,
                hargaLama: 80000,
                stok: 20,
                tag: ["terbaru", "diskon"],
                rating: 4.4,
                totalPenjualan: 210,
                gambar: "images/box-kue.jpg",
                warna: ["Transparan"],
                ukuran: "25cm",
                bahan: "PET Food Grade",
                minimalPembelian: 1,
                berat: 180,
                dimensi: "25x25x10 cm"
            },
            {
                id: 12,
                nama: "Ember Plastik 20 Liter",
                deskripsi: "Ember plastik kapasitas 20 liter dengan pegangan yang kuat",
                kategori: "PERLENGKAPAN RUMAH TANGGA",
                subKategori: "ember",
                harga: 85000,
                hargaLama: 90000,
                stok: 15,
                tag: ["terlaris"],
                rating: 4.8,
                totalPenjualan: 890,
                gambar: "images/ember-20l.jpg",
                warna: ["Merah", "Biru", "Hijau"],
                ukuran: "20 Liter",
                bahan: "HDPE",
                minimalPembelian: 1,
                berat: 1200,
                dimensi: "30x30x35 cm"
            },
            {
                id: 13,
                nama: "Gelas Plastik 12oz 50pcs",
                deskripsi: "Gelas plastik ukuran 12oz, 50 buah per pack",
                kategori: "CUP PLASTIK",
                subKategori: "gelas",
                harga: 55000,
                hargaLama: 60000,
                stok: 60,
                tag: ["terbaru", "diskon"],
                rating: 4.3,
                totalPenjualan: 670,
                gambar: "images/gelas-12oz.jpg",
                warna: ["Putih", "Transparan"],
                ukuran: "12oz",
                bahan: "PP Food Grade",
                minimalPembelian: 1,
                berat: 500,
                dimensi: "20x20x15 cm"
            },
            {
                id: 14,
                nama: "Pisau Plastik 24pcs",
                deskripsi: "Pisau plastik makanan, 24 buah per pack",
                kategori: "ALAT MAKAN PLASTIK",
                subKategori: "alat makan",
                harga: 28000,
                hargaLama: 32000,
                stok: 45,
                tag: ["terlaris"],
                rating: 4.6,
                totalPenjualan: 980,
                gambar: "images/pisau-plastik.jpg",
                warna: ["Putih"],
                ukuran: "Standar",
                bahan: "PP Food Grade",
                minimalPembelian: 1,
                berat: 250,
                dimensi: "20x10x3 cm"
            },
            {
                id: 15,
                nama: "Wadah Makanan 750ml",
                deskripsi: "Wadah makanan plastik dengan tutup rapat, kapasitas 750ml",
                kategori: "KEMASAN MAKANAN",
                subKategori: "wadah",
                harga: 68000,
                hargaLama: 75000,
                stok: 35,
                tag: ["terbaru", "diskon"],
                rating: 4.5,
                totalPenjualan: 430,
                gambar: "images/wadah-750ml.jpg",
                warna: ["Putih", "Transparan"],
                ukuran: "750ml",
                bahan: "PP Food Grade",
                minimalPembelian: 1,
                berat: 220,
                dimensi: "15x10x8 cm"
            },
            {
                id: 16,
                nama: "Tempat Saus Plastik 50ml",
                deskripsi: "Tempat saus plastik kecil kapasitas 50ml",
                kategori: "PERLENGKAPAN DAPUR",
                subKategori: "tempat saus",
                harga: 25000,
                hargaLama: 30000,
                stok: 120,
                tag: ["terlaris"],
                rating: 4.4,
                totalPenjualan: 1560,
                gambar: "images/tempat-saus.jpg",
                warna: ["Transparan"],
                ukuran: "50ml",
                bahan: "PP Food Grade",
                minimalPembelian: 10,
                berat: 150,
                dimensi: "5x5x8 cm"
            },
            {
                id: 17,
                nama: "Plastik Pembungkus 1kg",
                deskripsi: "Plastik pembungkus makanan ukuran 1kg",
                kategori: "KEBUTUHAN USAHA",
                subKategori: "plastik packaging",
                harga: 45000,
                hargaLama: 50000,
                stok: 200,
                tag: ["terlaris"],
                rating: 4.6,
                totalPenjualan: 2340,
                gambar: "images/plastik-1kg.jpg",
                warna: ["Transparan"],
                ukuran: "1kg",
                bahan: "PE Food Grade",
                minimalPembelian: 1,
                berat: 1000,
                dimensi: "30x40 cm"
            },
            {
                id: 18,
                nama: "Cup Plastik 22oz dengan Tutup",
                deskripsi: "Cup plastik besar 22oz lengkap dengan tutup",
                kategori: "CUP PLASTIK",
                subKategori: "gelas",
                harga: 65000,
                hargaLama: 70000,
                stok: 40,
                tag: ["terbaru"],
                rating: 4.7,
                totalPenjualan: 560,
                gambar: "images/cup-22oz.jpg",
                warna: ["Putih"],
                ukuran: "22oz",
                bahan: "PP Food Grade",
                minimalPembelian: 1,
                berat: 300,
                dimensi: "10x10x15 cm"
            },
            {
                id: 19,
                nama: "Baskom Plastik 30cm",
                deskripsi: "Baskom plastik diameter 30cm untuk kebutuhan dapur",
                kategori: "PERLENGKAPAN DAPUR",
                subKategori: "baskom",
                harga: 75000,
                hargaLama: 80000,
                stok: 25,
                tag: ["diskon"],
                rating: 4.5,
                totalPenjualan: 340,
                gambar: "images/baskom-30cm.jpg",
                warna: ["Merah", "Biru", "Hijau"],
                ukuran: "30cm",
                bahan: "PP Food Grade",
                minimalPembelian: 1,
                berat: 800,
                dimensi: "30x30x15 cm"
            },
            {
                id: 20,
                nama: "Box Makanan 3 Compartment",
                deskripsi: "Box makanan dengan 3 sekat terpisah",
                kategori: "KEMASAN MAKANAN",
                subKategori: "box makanan",
                harga: 95000,
                hargaLama: 100000,
                stok: 18,
                tag: ["terbaru", "diskon"],
                rating: 4.8,
                totalPenjualan: 190,
                gambar: "images/box-3compart.jpg",
                warna: ["Hitam", "Putih"],
                ukuran: "3 Compartment",
                bahan: "PP Food Grade",
                minimalPembelian: 1,
                berat: 280,
                dimensi: "20x15x5 cm"
            }
        ];
    }

    // Mendapatkan produk berdasarkan ID
    getProdukById(id) {
        return this.produk.find(p => p.id === id);
    }

    // Mendapatkan produk berdasarkan kategori
    getProdukByKategori(kategori) {
        return this.produk.filter(p => p.kategori === kategori);
    }

    // Mendapatkan produk baru (tag terbaru)
    getProdukNew() {
        return this.produk.filter(p => p.tag.includes("terbaru") && p.stok > 0);
    }

    // Mendapatkan produk trending (rating tinggi dan penjualan tinggi)
    getProdukTrending() {
        return this.produk
            .filter(p => p.rating >= 4.5 && p.stok > 0)
            .sort((a, b) => b.totalPenjualan - a.totalPenjualan)
            .slice(0, 8);
    }

    // Mendapatkan produk terlaris
    getProdukTop() {
        return this.produk
            .filter(p => p.tag.includes("terlaris") && p.stok > 0)
            .sort((a, b) => b.totalPenjualan - a.totalPenjualan)
            .slice(0, 8);
    }

    // Mendapatkan produk dengan diskon
    getProdukDiscount() {
        return this.produk.filter(p => p.hargaLama && p.stok > 0);
    }

    // Mencari produk berdasarkan kata kunci
    cariProduk(keyword) {
        const kataKunci = keyword.toLowerCase().trim();
        if (!kataKunci) return this.produk.filter(p => p.stok > 0);
        
        return this.produk.filter(p => 
            p.nama.toLowerCase().includes(kataKunci) ||
            p.kategori.toLowerCase().includes(kataKunci) ||
            p.subKategori.toLowerCase().includes(kataKunci) ||
            p.deskripsi.toLowerCase().includes(kataKunci) ||
            p.tag.some(tag => tag.toLowerCase().includes(kataKunci))
        );
    }

    // Mengurangi stok produk
    kurangiStok(id, jumlah) {
        const produk = this.getProdukById(id);
        if (produk && produk.stok >= jumlah) {
            produk.stok -= jumlah;
            produk.totalPenjualan += jumlah;
            return true;
        }
        return false;
    }

    // Menambah stok produk
    tambahStok(id, jumlah) {
        const produk = this.getProdukById(id);
        if (produk) {
            produk.stok += jumlah;
            return true;
        }
        return false;
    }

    // Mendapatkan semua kategori unik
    getAllKategori() {
        const kategori = [...new Set(this.produk.map(p => p.kategori))];
        return kategori.map(kat => ({
            nama: kat,
            jumlah: this.produk.filter(p => p.kategori === kat && p.stok > 0).length
        }));
    }

    // Mendapatkan produk dengan stok hampir habis (kurang dari 10)
    getProdukStokRendah() {
        return this.produk.filter(p => p.stok > 0 && p.stok < 10);
    }

    // Mendapatkan produk habis stok
    getProdukSoldOut() {
        return this.produk.filter(p => p.stok === 0);
    }

    // Simpan data produk ke localStorage (untuk simulasi backend)
    simpanKeLocalStorage() {
        localStorage.setItem('sentralplastik_barang', JSON.stringify(this.produk));
    }

    // Muat data produk dari localStorage
    muatDariLocalStorage() {
        const data = localStorage.getItem('sentralplastik_barang');
        if (data) {
            this.produk = JSON.parse(data);
        }
    }

    // Update data produk dari server (simulasi)
    async updateDariServer() {
        try {
            const response = await fetch('data/barang.json');
            if (response.ok) {
                const data = await response.json();
                this.produk = data;
                this.simpanKeLocalStorage();
                return true;
            }
        } catch (error) {
            console.error('Gagal memuat data dari server:', error);
        }
        return false;
    }
}

// Inisialisasi data produk
const BARANG_DATA = new BarangData();

// Muat data dari localStorage jika ada
BARANG_DATA.muatDariLocalStorage();

// Ekspor data produk
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BARANG_DATA;
}