class ProdukDetailApp {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('sentralplastik_cart')) || [];
        this.products = this.initializeProducts();
        this.product = null;
        this.initializeEventListeners();
        this.updateCartCount();
        this.initializeSearch();
        this.loadProductDetail();
    }

    initializeProducts() {
        return [
            {
                id: 1,
                name: "Cup Plastik 16oz Premium",
                category: "CUP PLASTIK",
                price: 45000,
                oldPrice: 50000,
                image: "cup-16oz.jpg",
                stock: 50,
                isNew: true,
                isTrending: false,
                isTop: true,
                description: "Cup plastik 16oz dengan kualitas premium, tahan panas dan dingin, cocok untuk minuman panas dan dingin. Bahan food grade yang aman untuk makanan dan minuman."
            },
            {
                id: 2,
                name: "Box Makanan Segi Empat 500ml",
                category: "KEMASAN MAKANAN",
                price: 81000,
                oldPrice: 90000,
                image: "box-makanan.jpg",
                stock: 30,
                isNew: true,
                isTrending: true,
                isTop: false,
                description: "Box makanan segi empat dengan kapasitas 500ml, dilengkapi tutup yang rapat dan tahan bocor. Cocok untuk makanan berkuah dan kering."
            },
            {
                id: 3,
                name: "Sendok Garpu Plastik 50pcs",
                category: "ALAT MAKAN",
                price: 76000,
                oldPrice: 25000,
                image: "sendok-garpu.jpg",
                stock: 100,
                isNew: true,
                isTrending: false,
                isTop: true,
                description: "Set sendok dan garpu plastik dalam kemasan 50 pasang. Bahan tebal dan kuat, cocok untuk acara atau usaha makanan."
            },
            {
                id: 4,
                name: "Tutup Cup Universal",
                category: "AKSESORIS",
                price: 49000,
                oldPrice: 15000,
                image: "tutup-cup.jpg",
                stock: 75,
                isNew: false,
                isTrending: true,
                isTop: false,
                description: "Tutup cup universal yang cocok untuk berbagai ukuran cup plastik. Kedap udara dan tahan bocor."
            },
            {
                id: 5,
                name: "Sedotan Plastik Warna-warni 100pcs",
                category: "AKSESORIS",
                price: 78000,
                oldPrice: 9000,
                image: "sedotan.jpg",
                stock: 60,
                isNew: false,
                isTrending: true,
                isTop: true,
                description: "Sedotan plastik dengan berbagai warna cerah, dalam kemasan 100 buah. Aman untuk makanan dan minuman."
            },
            {
                id: 6,
                name: "Plastik Klip Set 3 Ukuran",
                category: "PERLENGKAPAN RUMAH TANGGA",
                price: 94000,
                oldPrice: 22000,
                image: "plastik-klip.jpg",
                stock: 40,
                isNew: false,
                isTrending: true,
                isTop: false,
                description: "Set plastik klip dengan 3 ukuran berbeda (S, M, L). Praktis untuk menyimpan makanan sisa atau bahan makanan."
            },
            {
                id: 7,
                name: "Aluminium Foil Makanan 30cm",
                category: "PERLENGKAPAN DAPUR",
                price: 54000,
                oldPrice: 5000,
                image: "aluminium-foil.jpg",
                stock: 45,
                isNew: false,
                isTrending: true,
                isTop: true,
                description: "Aluminium foil makanan dengan lebar 30cm. Tahan panas tinggi, cocok untuk memanggang dan membungkus makanan."
            },
            {
                id: 8,
                name: "Cup Plastik 8oz Box 100pcs",
                category: "CUP PLASTIK",
                price: 50000,
                oldPrice: 34000,
                image: "cup-8oz.jpg",
                stock: 35,
                isNew: false,
                isTrending: false,
                isTop: true,
                description: "Cup plastik 8oz dalam kemasan box berisi 100 buah. Cocok untuk usaha minuman kecil dan menengah."
            }
        ];
    }

    initializeEventListeners() {
        const cartButton = document.getElementById('cartButton');
        const cartButtonMobile = document.getElementById('cartButtonMobile');
        const checkoutButton = document.getElementById('checkoutButton');
        const submitOrderButton = document.getElementById('submitOrderButton');

        if (cartButton) {
            cartButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showCartModal();
            });
        }
        
        if (cartButtonMobile) {
            cartButtonMobile.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showCartModal();
            });
        }

        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                if (this.cart.length === 0) {
                    this.showAlert('Keranjang belanja kosong', 'warning');
                    return;
                }
                this.showCheckoutModal();
            });
        }

        if (submitOrderButton) {
            submitOrderButton.addEventListener('click', () => {
                this.submitOrder();
            });
        }

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-add-to-cart') || 
                e.target.closest('.btn-add-to-cart')) {
                if (this.product) {
                    this.addToCart(this.product.id);
                }
            }
        });
    }

    initializeSearch() {
        const searchInputs = [
            { id: 'searchInput', resultsId: 'desktopSearchResults' },
            { id: 'searchInputMobile', resultsId: 'mobileSearchResults' }
        ];
        
        searchInputs.forEach(({ id, resultsId }) => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', (e) => {
                    this.performSearch(e.target.value, resultsId);
                });
                
                input.addEventListener('focus', (e) => {
                    if (e.target.value.trim() !== '') {
                        this.performSearch(e.target.value, resultsId);
                    }
                });
                
                input.addEventListener('blur', () => {
                    setTimeout(() => this.hideSearchResults(resultsId), 200);
                });
            }
        });
    }

    performSearch(query, resultsId) {
        if (query.trim() === '') {
            this.hideSearchResults(resultsId);
            return;
        }
        
        const filteredProducts = this.products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        
        this.showSearchResults(filteredProducts, resultsId);
    }

    showSearchResults(products, resultsId) {
        const resultsContainer = document.getElementById(resultsId);
        if (!resultsContainer) return;
        
        if (products.length === 0) {
            resultsContainer.innerHTML = '<div class="search-result-item">Produk tidak ditemukan</div>';
        } else {
            resultsContainer.innerHTML = products.map(product => `
                <div class="search-result-item" data-id="${product.id}">
                    <div class="search-result-name">${product.name}</div>
                    <div class="search-result-price">Rp ${product.price.toLocaleString('id-ID')}</div>
                    <div class="search-result-category">${product.category}</div>
                </div>
            `).join('');
        }
        
        resultsContainer.style.display = 'block';
        
        resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const productId = parseInt(item.getAttribute('data-id'));
                window.location.href = `produk.html?id=${productId}`;
            });
        });
    }

    hideSearchResults(resultsId) {
        const resultsContainer = document.getElementById(resultsId);
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
    }

    loadProductDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        
        if (productId) {
            this.product = this.products.find(p => p.id === productId);
            if (this.product) {
                this.displayProductDetail(this.product);
            } else {
                this.displayProductNotFound();
            }
        } else {
            this.displayProductNotFound();
        }
    }

    displayProductDetail(product) {
        const container = document.getElementById('productDetailContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="row">
                <div class="col-lg-6">
                    <div class="product-detail-card">
                        <div class="product-detail-image">
                            ${product.isNew ? '<span class="product-detail-badge">BARU</span>' : ''}
                            ${product.isTop ? '<span class="product-detail-badge" style="background-color: var(--blue);">TERLARIS</span>' : ''}
                            <div style="text-align: center;">
                                <i class="fas fa-box fa-5x" style="color: var(--gray); margin-bottom: 15px;"></i>
                                <p style="color: var(--gray);">Gambar produk: ${product.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="product-detail-info">
                        <div class="product-detail-category">${product.category}</div>
                        <h1 class="product-detail-name">${product.name}</h1>
                        <div class="product-detail-price">
                            Rp ${product.price.toLocaleString('id-ID')}
                            ${product.oldPrice ? `<span class="product-detail-old-price">Rp ${product.oldPrice.toLocaleString('id-ID')}</span>` : ''}
                        </div>
                        <div class="product-detail-stock">
                            <i class="fas fa-check-circle" style="color: var(--orange);"></i>
                            Stok tersedia: ${product.stock} unit
                        </div>
                        
                        <div class="product-detail-description">
                            <h5>Deskripsi Produk</h5>
                            <p>${product.description}</p>
                        </div>
                        
                        <div class="product-detail-actions">
                            <button class="btn-detail-primary btn-add-to-cart">
                                <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                            </button>
                            <button class="btn-detail-secondary" onclick="app.shareProduct()">
                                <i class="fas fa-share"></i> Bagikan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    displayProductNotFound() {
        const container = document.getElementById('productDetailContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="product-not-found">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Produk Tidak Ditemukan</h3>
                <p>Produk yang Anda cari tidak tersedia atau telah dihapus</p>
                <a href="../index.html" class="btn btn-primary mt-3">
                    <i class="fas fa-home"></i> Kembali ke Beranda
                </a>
            </div>
        `;
    }

    shareProduct() {
        const productUrl = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: this.product.name,
                text: `Lihat produk ${this.product.name} di SENTRAL PLASTIK`,
                url: productUrl
            }).then(() => {
                this.showAlert('Produk berhasil dibagikan', 'success');
            }).catch(err => {
                console.error('Error sharing:', err);
                this.copyProductLink();
            });
        } else {
            this.copyProductLink();
        }
    }

    copyProductLink() {
        const productUrl = window.location.href;
        
        navigator.clipboard.writeText(productUrl).then(() => {
            this.showAlert('Link produk berhasil disalin!', 'success');
        }).catch(err => {
            console.error('Gagal menyalin link: ', err);
            this.showAlert('Gagal menyalin link', 'error');
        });
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                this.showAlert(`Stok ${product.name} tidak mencukupi`, 'warning');
                return;
            }
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                category: product.category
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.showAlert(`${product.name} ditambahkan ke keranjang`, 'success');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.showCartModal();
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;

        const product = this.products.find(p => p.id === productId);
        
        item.quantity += change;
        
        if (item.quantity < 1) {
            this.removeFromCart(productId);
            return;
        }
        
        if (product && item.quantity > product.stock) {
            item.quantity = product.stock;
            this.showAlert(`Stok ${product.name} hanya tersedia ${product.stock} item`, 'warning');
        }

        this.saveCart();
        this.updateCartCount();
        this.showCartModal();
    }

    saveCart() {
        localStorage.setItem('sentralplastik_cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const cartCounts = ['cartCount', 'cartCountMobile'];
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        cartCounts.forEach(id => {
            const cartCount = document.getElementById(id);
            if (cartCount) {
                cartCount.textContent = totalItems;
                cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
            }
        });
    }

    showCartModal() {
        const cartModalElement = document.getElementById('cartModal');
        if (!cartModalElement) return;

        const cartModal = new bootstrap.Modal(cartModalElement, {
            backdrop: true,
            keyboard: true,
            focus: true
        });

        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <p>Keranjang belanja kosong</p>
                </div>
            `;
            document.getElementById('cartTotal').textContent = 'Rp 0';
        } else {
            let total = 0;
            cartItems.innerHTML = this.cart.map(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                return `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h6>${item.name}</h6>
                            <small class="text-muted">${item.category}</small>
                        </div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="app.updateQuantity(${item.id}, -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="app.updateQuantity(${item.id}, 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <div class="cart-item-price">
                            Rp ${itemTotal.toLocaleString('id-ID')}
                        </div>
                        <button class="btn btn-sm btn-danger" onclick="app.removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
            }).join('');

            document.getElementById('cartTotal').textContent = `Rp ${total.toLocaleString('id-ID')}`;
        }

        cartModal.show();
    }

    showCheckoutModal() {
        const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
        checkoutModal.show();
        
        document.getElementById('orderForm').reset();
        document.getElementById('transferDetails').style.display = 'none';
        
        const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        if (cartModal) {
            cartModal.hide();
        }
    }

    togglePaymentDetails() {
        const method = document.getElementById('paymentMethod').value;
        const transferDetails = document.getElementById('transferDetails');
        const paymentInfo = document.getElementById('paymentInfo');
        
        if (['dana', 'bca', 'bri', 'mandiri'].includes(method)) {
            transferDetails.style.display = 'block';
            
            let info = '';
            const randomCode = Math.floor(Math.random() * 90) + 10;
            
            switch(method) {
                case 'dana':
                    info = `
                        <p><strong>DANA:</strong> 0812-3456-7890</p>
                        <p><strong>Atas Nama:</strong> PT SENTRAL PLASTIK</p>
                        <p><strong>Kode Unik:</strong> ${randomCode}</p>
                        <p class="text-danger"><strong>Total Transfer:</strong> Rp <span id="transferAmount">0</span> + ${randomCode}</p>
                    `;
                    break;
                case 'bca':
                    info = `
                        <p><strong>BCA:</strong> 123-456-7890</p>
                        <p><strong>Atas Nama:</strong> PT SENTRAL PLASTIK</p>
                        <p><strong>Kode Unik:</strong> ${randomCode}</p>
                        <p class="text-danger"><strong>Total Transfer:</strong> Rp <span id="transferAmount">0</span> + ${randomCode}</p>
                    `;
                    break;
                case 'bri':
                    info = `
                        <p><strong>BRI:</strong> 987-654-3210</p>
                        <p><strong>Atas Nama:</strong> PT SENTRAL PLASTIK</p>
                        <p><strong>Kode Unik:</strong> ${randomCode}</p>
                        <p class="text-danger"><strong>Total Transfer:</strong> Rp <span id="transferAmount">0</span> + ${randomCode}</p>
                    `;
                    break;
                case 'mandiri':
                    info = `
                        <p><strong>MANDIRI:</strong> 555-123-4567</p>
                        <p><strong>Atas Nama:</strong> PT SENTRAL PLASTIK</p>
                        <p><strong>Kode Unik:</strong> ${randomCode}</p>
                        <p class="text-danger"><strong>Total Transfer:</strong> Rp <span id="transferAmount">0</span> + ${randomCode}</p>
                    `;
                    break;
            }
            
            paymentInfo.innerHTML = info;
            
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            document.getElementById('transferAmount').textContent = total.toLocaleString('id-ID');
        } else {
            transferDetails.style.display = 'none';
        }
    }

    async submitOrder() {
        const form = document.getElementById('orderForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const paymentMethod = document.getElementById('paymentMethod').value;
        if (paymentMethod === '') {
            this.showAlert('Pilih metode pembayaran', 'warning');
            return;
        }

        const orderData = {
            customer: {
                name: document.getElementById('customerName').value,
                phone: document.getElementById('customerPhone').value,
                email: document.getElementById('customerEmail').value || '',
                address: document.getElementById('customerAddress').value,
                note: document.getElementById('customerNote').value || ''
            },
            payment: paymentMethod,
            items: this.cart,
            total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            orderId: 'SP' + Date.now() + Math.floor(Math.random() * 1000),
            orderDate: new Date().toISOString()
        };

        try {
            const response = await fetch('simpan-order.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (result.success) {
                this.showAlert('Pesanan berhasil dikirim! Konfirmasi akan dikirim via WhatsApp/Email.', 'success');
                
                this.cart = [];
                this.saveCart();
                this.updateCartCount();
                
                bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
                
                this.sendWhatsAppNotification(orderData);
                
                form.reset();
                document.getElementById('transferDetails').style.display = 'none';
            } else {
                throw new Error(result.message || 'Terjadi kesalahan');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showAlert('Gagal mengirim pesanan. Silakan coba lagi.', 'error');
        }
    }

    sendWhatsAppNotification(orderData) {
        const phone = '6281234567890';
        const itemsText = orderData.items.map(item => 
            `- ${item.name} (${item.quantity}x): Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`
        ).join('%0A');
        
        let paymentInfo = '';
        if (['dana', 'bca', 'bri', 'mandiri'].includes(orderData.payment)) {
            paymentInfo = `%0A%0A*INFORMASI PEMBAYARAN:*%0A`;
            switch(orderData.payment) {
                case 'dana':
                    paymentInfo += `Transfer DANA ke: 0812-3456-7890%0Aa.n. PT SENTRAL PLASTIK`;
                    break;
                case 'bca':
                    paymentInfo += `Transfer BCA ke: 123-456-7890%0Aa.n. PT SENTRAL PLASTIK`;
                    break;
                case 'bri':
                    paymentInfo += `Transfer BRI ke: 987-654-3210%0Aa.n. PT SENTRAL PLASTIK`;
                    break;
                case 'mandiri':
                    paymentInfo += `Transfer Mandiri ke: 555-123-4567%0Aa.n. PT SENTRAL PLASTIK`;
                    break;
            }
            paymentInfo += `%0A%0A*Konfirmasi pembayaran via WhatsApp ini dengan mengirim bukti transfer.*`;
        }
        
        const message = `*PESANAN BARU - SENTRAL PLASTIK*%0A%0A` +
                       `ID Pesanan: ${orderData.orderId}%0A` +
                       `Nama: ${orderData.customer.name}%0A` +
                       `Telepon: ${orderData.customer.phone}%0A` +
                       `Alamat: ${orderData.customer.address}%0A` +
                       `Metode: ${orderData.payment === 'cod' ? 'COD' : 'Transfer'}%0A%0A` +
                       `*DETAIL PESANAN:*%0A${itemsText}%0A%0A` +
                       `*TOTAL: Rp ${orderData.total.toLocaleString('id-ID')}*` +
                       paymentInfo + `%0A%0A` +
                       `Catatan: ${orderData.customer.note || '-'}`;
        
        const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
        
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 1500);
    }

    showAlert(message, type = 'info') {
        const alertClass = {
            success: 'alert-success',
            error: 'alert-danger',
            warning: 'alert-warning',
            info: 'alert-info'
        }[type] || 'alert-info';

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert ${alertClass} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 250px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-size: 14px;
        `;
        
        alertDiv.innerHTML = `
            <strong>${type === 'success' ? 'Sukses!' : type === 'error' ? 'Error!' : type === 'warning' ? 'Peringatan!' : 'Info!'}</strong>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 4000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new ProdukDetailApp();
});