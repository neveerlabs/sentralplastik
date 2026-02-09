// utama.js - JavaScript utama SENTRAL PLASTIK - Diperbarui
class SentralPlastikApp {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('sentralplastik_cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('sentralplastik_wishlist')) || [];
        this.orders = JSON.parse(localStorage.getItem('sentralplastik_orders')) || [];
        this.recentPurchases = JSON.parse(localStorage.getItem('recent_purchases')) || [];
        this.notificationQueue = [];
        this.isCartLoading = false;
        
        this.initializeEventListeners();
        this.loadAllProducts();
        this.updateCartCount();
        this.updateOrderCount();
        this.updateWishlistCount();
        this.initializeSearch();
        this.startNotificationCycle();
        this.initializePurchaseNotifications();
        this.checkPendingOrders();
    }

    initializeEventListeners() {
        // Cart buttons
        document.getElementById('cartButton').addEventListener('click', (e) => {
            e.preventDefault();
            this.showCartModal();
        });
        
        document.getElementById('cartButtonMobile').addEventListener('click', (e) => {
            e.preventDefault();
            this.showCartModal();
        });

        // Order buttons
        document.getElementById('orderButton').addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'templates/pesanan.html';
        });
        
        document.getElementById('orderButtonMobile').addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'templates/pesanan.html';
        });

        // Checkout button
        document.getElementById('checkoutButton').addEventListener('click', () => {
            if (this.cart.length === 0) {
                this.showAlert('Keranjang belanja kosong', 'warning');
                return;
            }
            this.showCheckoutModal();
        });

        // Submit order button
        document.getElementById('submitOrderButton').addEventListener('click', () => {
            this.submitOrder();
        });

        // Beli sekarang button
        document.getElementById('beliSekarang').addEventListener('click', () => {
            const firstProduct = BARANG_DATA.produk[0];
            if (firstProduct) {
                this.addToCart(firstProduct.id);
                this.showCartModal();
            }
        });

        // Payment method change
        document.getElementById('paymentMethod')?.addEventListener('change', () => {
            this.togglePaymentDetails();
        });

        // Close modal events
        document.querySelectorAll('.modal .btn-close, .btn-secondary').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = bootstrap.Modal.getInstance(btn.closest('.modal'));
                if (modal) {
                    modal.hide();
                }
            });
        });

        // Wishlist toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-link.wishlist')) {
                const btn = e.target.closest('.btn-link.wishlist');
                const productId = parseInt(btn.dataset.productId);
                this.toggleWishlist(productId);
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
                // Enter untuk langsung ke halaman hasil
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const query = e.target.value.trim();
                        if (query) {
                            window.location.href = `templates/hasil.html?q=${encodeURIComponent(query)}`;
                        }
                    }
                });
                
                // Real-time search suggestions
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
        
        const filteredProducts = BARANG_DATA.cariProduk(query);
        
        this.showSearchResults(filteredProducts, resultsId);
    }

    showSearchResults(products, resultsId) {
        const resultsContainer = document.getElementById(resultsId);
        if (!resultsContainer) return;
    
        if (products.length === 0) {
           resultsContainer.innerHTML = `
                <div class="search-result-item">
                    <div class="search-result-name">Produk tidak ditemukan</div>
                    <div class="search-result-category">Coba gunakan kata kunci lain</div>
                </div>
           `;
        } else {
            resultsContainer.innerHTML = products.slice(0, 5).map(product => `
                <div class="search-result-item" data-id="${product.id}">
                    <div class="search-result-name">${product.nama}</div>
                    <div class="search-result-price">Rp ${product.harga.toLocaleString('id-ID')}</div>
                    <div class="search-result-category">${product.kategori}</div>
                </div>
            `).join('');
        }
    
        resultsContainer.style.display = 'block';
    
        resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const productId = parseInt(item.getAttribute('data-id'));
                const product = BARANG_DATA.getProdukById(productId);
                if (product) {
                    window.location.href = `templates/hasil.html?q=${encodeURIComponent(product.nama)}`;
                }
            });
        });
    }

    hideSearchResults(resultsId) {
        const resultsContainer = document.getElementById(resultsId);
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
    }

    togglePaymentDetails() {
        const method = document.getElementById('paymentMethod')?.value;
        const transferDetails = document.getElementById('transferDetails');
        const paymentInfo = document.getElementById('paymentInfo');
        
        if (!method || !transferDetails || !paymentInfo) return;
        
        if (['dana', 'bca', 'bri', 'mandiri'].includes(method)) {
            transferDetails.style.display = 'block';
            
            let info = '';
            const randomCode = Math.floor(Math.random() * 90) + 10;
            const total = this.cart.reduce((sum, item) => sum + (item.harga * item.quantity), 0);
            const totalWithCode = total + randomCode;
            
            switch(method) {
                case 'dana':
                    info = `
                        <p><strong>DANA:</strong> ${CONFIG.transfer.dana.number}</p>
                        <p><strong>Atas Nama:</strong> ${CONFIG.transfer.dana.name}</p>
                        <p><strong>Kode Unik:</strong> ${randomCode}</p>
                        <p class="text-danger"><strong>Total Transfer:</strong> Rp ${totalWithCode.toLocaleString('id-ID')}</p>
                        <p class="text-muted small">(Rp ${total.toLocaleString('id-ID')} + ${randomCode})</p>
                    `;
                    break;
                case 'bca':
                    info = `
                        <p><strong>BCA:</strong> ${CONFIG.transfer.bca.number}</p>
                        <p><strong>Atas Nama:</strong> ${CONFIG.transfer.bca.name}</p>
                        <p><strong>Kode Unik:</strong> ${randomCode}</p>
                        <p class="text-danger"><strong>Total Transfer:</strong> Rp ${totalWithCode.toLocaleString('id-ID')}</p>
                        <p class="text-muted small">(Rp ${total.toLocaleString('id-ID')} + ${randomCode})</p>
                    `;
                    break;
                case 'bri':
                    info = `
                        <p><strong>BRI:</strong> ${CONFIG.transfer.bri.number}</p>
                        <p><strong>Atas Nama:</strong> ${CONFIG.transfer.bri.name}</p>
                        <p><strong>Kode Unik:</strong> ${randomCode}</p>
                        <p class="text-danger"><strong>Total Transfer:</strong> Rp ${totalWithCode.toLocaleString('id-ID')}</p>
                        <p class="text-muted small">(Rp ${total.toLocaleString('id-ID')} + ${randomCode})</p>
                    `;
                    break;
                case 'mandiri':
                    info = `
                        <p><strong>MANDIRI:</strong> ${CONFIG.transfer.mandiri.number}</p>
                        <p><strong>Atas Nama:</strong> ${CONFIG.transfer.mandiri.name}</p>
                        <p><strong>Kode Unik:</strong> ${randomCode}</p>
                        <p class="text-danger"><strong>Total Transfer:</strong> Rp ${totalWithCode.toLocaleString('id-ID')}</p>
                        <p class="text-muted small">(Rp ${total.toLocaleString('id-ID')} + ${randomCode})</p>
                    `;
                    break;
            }
            
            paymentInfo.innerHTML = info;
        } else {
            transferDetails.style.display = 'none';
        }
    }

    startNotificationCycle() {
        const defaultNotifications = [
            { buyer: "Bambang Mulyono", item: "Cup Plastik 16oz", time: "2 Menit yang lalu" },
            { buyer: "Geng Yakuza", item: "Sendok Plastik 50pcs", time: "15 Menit yang lalu" },
            { buyer: "Yesus", item: "Wadah Makanan 500ml (10pcs)", time: "30 Menit yang lalu" },
            { buyer: "Prabowo", item: "Box Makanan Segi Empat 500ml buat MBG", time: "1 Jam yang lalu" },
            { buyer: "Fir' aun", item: "Cup Plastik 8oz Box 100pcs", time: "2 Jam yang lalu" }
        ];
        
        this.notificationQueue = [...defaultNotifications];
        
        const showNextNotification = () => {
            if (this.notificationQueue.length > 0) {
                const notif = this.notificationQueue.shift();
                this.showNotification(`${notif.buyer} membeli ${notif.item} • ${notif.time}`);
                this.notificationQueue.push(notif);
            }
        };
        
        // Tampilkan notifikasi pertama
        setTimeout(showNextNotification, 3000);
        
        // Tampilkan notifikasi berikutnya setiap 8 detik
        setInterval(showNextNotification, 8000);
    }

    initializePurchaseNotifications() {
        const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
        this.recentPurchases = this.recentPurchases.filter(p => p.timestamp > twentyFourHoursAgo);
        localStorage.setItem('recent_purchases', JSON.stringify(this.recentPurchases));
        
        this.recentPurchases.forEach(purchase => {
            const timeAgo = this.getTimeAgo(purchase.timestamp);
            this.notificationQueue.push({
                buyer: purchase.buyer,
                item: purchase.item,
                time: timeAgo
            });
        });
    }

    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        
        if (hours > 0) {
            return `${hours} Jam yang lalu`;
        } else {
            return `${minutes} Menit yang lalu`;
        }
    }

    showNotification(message) {
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = 'notification-item';
        notification.innerHTML = `<i class="fas fa-shopping-cart"></i> ${message}`;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    loadAllProducts() {
        this.loadNewProducts();
        this.loadTrendingProducts();
        this.loadTopProducts();
    }

    loadNewProducts() {
        const container = document.getElementById('newProducts');
        if (!container) return;

        const newProducts = BARANG_DATA.getProdukNew();
        container.innerHTML = newProducts.map(product => this.createProductHTML(product)).join('');
    }

    loadTrendingProducts() {
        const container = document.getElementById('trendingProducts');
        if (!container) return;

        const trendingProducts = BARANG_DATA.getProdukTrending();
        container.innerHTML = trendingProducts.map(product => this.createProductHTML(product)).join('');
    }

    loadTopProducts() {
        const container = document.getElementById('topProducts');
        if (!container) return;

        const topProducts = BARANG_DATA.getProdukTop();
        container.innerHTML = topProducts.map(product => this.createProductHTML(product)).join('');
    }

    createProductHTML(product) {
        const isSoldOut = product.stok === 0;
        const isLowStock = product.stok > 0 && product.stok < 10;
        const stockClass = product.stok > 10 ? 'stock-available' : 
                          product.stok > 0 ? 'stock-low' : 'stock-out';
        const stockText = product.stok > 0 ? 
                         `${product.stok} tersedia` : 'Stok Habis';
        
        const isInWishlist = this.wishlist.includes(product.id);
        const wishlistClass = isInWishlist ? 'wishlist active' : 'wishlist';

        return `
            <div class="col-lg-3 col-md-4 col-sm-6">
                <div class="product-card">
                    <div class="product-image">
                        ${product.tag.includes('terbaru') ? '<span class="product-badge badge-new">BARU</span>' : ''}
                        ${product.tag.includes('terlaris') ? '<span class="product-badge badge-trending">TERLARIS</span>' : ''}
                        ${product.hargaLama ? '<span class="product-badge badge-discount">DISKON</span>' : ''}
                        ${isSoldOut ? '<span class="product-badge badge-soldout">HABIS</span>' : ''}
                        <div style="padding: 20px; text-align: center;">
                            <i class="fas fa-box-open fa-3x" style="color: #666; margin-bottom: 10px;"></i>
                            <div style="font-size: 12px; color: #999;">${product.nama}</div>
                        </div>
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.kategori}</div>
                        <div class="product-name">${product.nama}</div>
                        <div class="product-stock">
                            <i class="fas fa-box${isSoldOut ? '-open' : ''}"></i>
                            <span class="${stockClass}">${stockText}</span>
                        </div>
                        ${product.rating ? `
                        <div class="product-rating">
                            <div class="stars">
                                ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                            </div>
                            <div class="rating-count">(${product.rating})</div>
                        </div>
                        ` : ''}
                        <div class="product-price">
                            Rp ${product.harga.toLocaleString('id-ID')}
                            ${product.hargaLama ? `<span class="old-price">Rp ${product.hargaLama.toLocaleString('id-ID')}</span>` : ''}
                        </div>
                        <button class="btn-product" onclick="app.addToCart(${product.id})" 
                                ${isSoldOut ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus"></i> 
                            ${isSoldOut ? 'Stok Habis' : 'Tambah ke Keranjang'}
                        </button>
                        <div class="product-actions">
                            <button class="btn-link wishlist ${wishlistClass}" data-product-id="${product.id}">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button class="btn-link" onclick="app.showProductDetail(${product.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    addToCart(productId) {
        if (this.isCartLoading) return;
        
        const product = BARANG_DATA.getProdukById(productId);
        if (!product) return;

        if (product.stok === 0) {
            this.showAlert(`Stok ${product.nama} habis`, 'warning');
            return;
        }

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            if (existingItem.quantity >= product.stok) {
                this.showAlert(`Stok ${product.nama} hanya tersedia ${product.stok} item`, 'warning');
                return;
            }
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                nama: product.nama,
                harga: product.harga,
                quantity: 1,
                kategori: product.kategori,
                stokTersedia: product.stok,
                gambar: product.gambar
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.showAlert(`${product.nama} ditambahkan ke keranjang`, 'success');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.showCartModal();
    }

    updateQuantity(productId, change) {
        if (this.isCartLoading) return;
        
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;

        const product = BARANG_DATA.getProdukById(productId);
        
        item.quantity += change;
        
        if (item.quantity < 1) {
            this.removeFromCart(productId);
            return;
        }
        
        if (product && item.quantity > product.stok) {
            item.quantity = product.stok;
            this.showAlert(`Stok ${product.nama} hanya tersedia ${product.stok} item`, 'warning');
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

    updateOrderCount() {
        const orderCounts = ['orderCount', 'orderCountMobile'];
        const pendingOrders = this.orders.filter(order => 
            order.status === 'pending' || order.status === 'processing'
        ).length;
        
        orderCounts.forEach(id => {
            const orderCount = document.getElementById(id);
            if (orderCount) {
                orderCount.textContent = pendingOrders;
                orderCount.style.display = pendingOrders > 0 ? 'flex' : 'none';
            }
        });
    }

    updateWishlistCount() {
        const wishlistCount = document.getElementById('wishlistCount');
        if (wishlistCount) {
            wishlistCount.textContent = this.wishlist.length;
            wishlistCount.style.display = this.wishlist.length > 0 ? 'flex' : 'none';
        }
    }

    toggleWishlist(productId) {
        const index = this.wishlist.indexOf(productId);
        const product = BARANG_DATA.getProdukById(productId);
        
        if (index === -1) {
            this.wishlist.push(productId);
            this.showAlert(`${product.nama} ditambahkan ke wishlist`, 'success');
        } else {
            this.wishlist.splice(index, 1);
            this.showAlert(`${product.nama} dihapus dari wishlist`, 'info');
        }
        
        localStorage.setItem('sentralplastik_wishlist', JSON.stringify(this.wishlist));
        this.updateWishlistCount();
        
        // Update button state
        const wishlistBtn = document.querySelector(`.wishlist[data-product-id="${productId}"]`);
        if (wishlistBtn) {
            wishlistBtn.classList.toggle('active');
        }
    }

    showCartModal() {
        if (this.isCartLoading) return;
        
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart fa-3x"></i>
                    <h4>Keranjang Belanja Kosong</h4>
                    <p>Tambahkan produk ke keranjang untuk mulai berbelanja</p>
                </div>
            `;
            document.getElementById('cartTotal').textContent = 'Rp 0';
            
            const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
            cartModal.show();
            return;
        }

        let total = 0;
        cartItems.innerHTML = this.cart.map(item => {
            const itemTotal = item.harga * item.quantity;
            total += itemTotal;
            const product = BARANG_DATA.getProdukById(item.id);
            const isLowStock = product && product.stok < 10;
            
            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h6>${item.nama}</h6>
                        <small class="text-muted">${item.kategori}</small>
                        ${isLowStock ? `<small class="text-warning"><i class="fas fa-exclamation-triangle"></i> Stok terbatas</small>` : ''}
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="app.updateQuantity(${item.id}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="app.updateQuantity(${item.id}, 1)" ${product && item.quantity >= product.stok ? 'disabled' : ''}>
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
        
        const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
        cartModal.show();
    }

    showCheckoutModal() {
        const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
        checkoutModal.show();
        
        // Reset form
        document.getElementById('orderForm').reset();
        document.getElementById('transferDetails').style.display = 'none';
        
        // Prefill jika ada data di localStorage
        const savedData = JSON.parse(localStorage.getItem('sentralplastik_customer')) || {};
        if (savedData.name) document.getElementById('customerName').value = savedData.name;
        if (savedData.phone) document.getElementById('customerPhone').value = savedData.phone;
        if (savedData.email) document.getElementById('customerEmail').value = savedData.email;
        if (savedData.address) document.getElementById('customerAddress').value = savedData.address;
        
        // Tutup modal keranjang
        const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        if (cartModal) {
            cartModal.hide();
        }
    }

    async submitOrder() {
        if (this.isCartLoading) return;
        
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

        // Simpan data customer ke localStorage
        const customerData = {
            name: document.getElementById('customerName').value,
            phone: document.getElementById('customerPhone').value,
            email: document.getElementById('customerEmail').value || '',
            address: document.getElementById('customerAddress').value
        };
        localStorage.setItem('sentralplastik_customer', JSON.stringify(customerData));

        const orderData = {
            customer: {
                ...customerData,
                note: document.getElementById('customerNote').value || ''
            },
            payment: paymentMethod,
            items: this.cart.map(item => ({
                id: item.id,
                nama: item.nama,
                harga: item.harga,
                quantity: item.quantity,
                kategori: item.kategori
            })),
            total: this.cart.reduce((sum, item) => sum + (item.harga * item.quantity), 0),
            orderId: 'SP' + Date.now() + Math.floor(Math.random() * 1000),
            orderDate: new Date().toISOString(),
            estimateDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
        };

        try {
            this.isCartLoading = true;
            
            // Update stock di BARANG_DATA
            let allStockAvailable = true;
            for (const item of orderData.items) {
                const product = BARANG_DATA.getProdukById(item.id);
                if (!product || product.stok < item.quantity) {
                    allStockAvailable = false;
                    this.showAlert(`Stok ${item.nama} tidak mencukupi`, 'error');
                    break;
                }
            }

            if (!allStockAvailable) {
                this.isCartLoading = false;
                return;
            }

            // Kurangi stok
            for (const item of orderData.items) {
                BARANG_DATA.kurangiStok(item.id, item.quantity);
            }

            // Simpan pembelian untuk notifikasi
            const purchaseRecord = {
                buyer: orderData.customer.name,
                item: this.cart.length > 0 ? this.cart[0].nama : 'Barang',
                timestamp: Date.now()
            };
            
            this.recentPurchases.push(purchaseRecord);
            localStorage.setItem('recent_purchases', JSON.stringify(this.recentPurchases));
            
            // Tambahkan ke notifikasi queue
            this.notificationQueue.push({
                buyer: purchaseRecord.buyer,
                item: purchaseRecord.item,
                time: 'Baru saja'
            });

            // Simpan order ke localStorage
            this.orders.push(orderData);
            localStorage.setItem('sentralplastik_orders', JSON.stringify(this.orders));
            this.updateOrderCount();

            // Kirim data ke server
            const response = await fetch('simpan-order.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...orderData,
                    config: CONFIG
                })
            });

            let result;
            try {
                result = await response.json();
            } catch (e) {
                result = { success: true }; // Fallback jika server tidak merespons
            }

            if (result.success) {
                this.showAlert('Pesanan berhasil dikirim! Konfirmasi akan dikirim via WhatsApp/Email.', 'success');
                
                // Reset cart
                this.cart = [];
                this.saveCart();
                this.updateCartCount();
                
                // Simpan data produk ke localStorage
                BARANG_DATA.simpanKeLocalStorage();
                
                // Tutup modal
                const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
                if (checkoutModal) {
                    checkoutModal.hide();
                }
                
                // Kirim notifikasi WhatsApp
                this.sendWhatsAppNotification(orderData);
                
                // Reset form
                form.reset();
                document.getElementById('transferDetails').style.display = 'none';
            } else {
                throw new Error(result.message || 'Terjadi kesalahan');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showAlert('Gagal mengirim pesanan. Silakan coba lagi.', 'error');
        } finally {
            this.isCartLoading = false;
        }
    }

    sendWhatsAppNotification(orderData) {
        const phone = CONFIG.whatsapp.number;
        const itemsText = orderData.items.map(item => 
            `- ${item.nama} (${item.quantity}x): Rp ${(item.harga * item.quantity).toLocaleString('id-ID')}`
        ).join('%0A');
        
        let paymentInfo = '';
        if (['dana', 'bca', 'bri', 'mandiri'].includes(orderData.payment)) {
            paymentInfo = `%0A%0A*INFORMASI PEMBAYARAN:*%0A`;
            switch(orderData.payment) {
                case 'dana':
                    paymentInfo += `Transfer DANA ke: ${CONFIG.transfer.dana.number}%0Aa.n. ${CONFIG.transfer.dana.name}`;
                    break;
                case 'bca':
                    paymentInfo += `Transfer BCA ke: ${CONFIG.transfer.bca.number}%0Aa.n. ${CONFIG.transfer.bca.name}`;
                    break;
                case 'bri':
                    paymentInfo += `Transfer BRI ke: ${CONFIG.transfer.bri.number}%0Aa.n. ${CONFIG.transfer.bri.name}`;
                    break;
                case 'mandiri':
                    paymentInfo += `Transfer Mandiri ke: ${CONFIG.transfer.mandiri.number}%0Aa.n. ${CONFIG.transfer.mandiri.name}`;
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
                       `Catatan: ${orderData.customer.note || '-'}%0A%0A` +
                       `*Estimasi sampai: ${new Date(orderData.estimateDate).toLocaleDateString('id-ID')}*`;
        
        const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
        
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 1000);
    }

    showProductDetail(productId) {
        const product = BARANG_DATA.getProdukById(productId);
        if (!product) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'productDetailModal';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Detail Produk</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="product-image" style="height: 300px; margin-bottom: 20px;">
                                    <div style="padding: 40px; text-align: center;">
                                        <i class="fas fa-box-open fa-4x" style="color: #666; margin-bottom: 20px;"></i>
                                        <div style="font-size: 14px; color: #999;">${product.nama}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <h4>${product.nama}</h4>
                                <div class="product-category">${product.kategori}</div>
                                <div class="product-price" style="font-size: 24px; margin: 15px 0;">
                                    Rp ${product.harga.toLocaleString('id-ID')}
                                    ${product.hargaLama ? `<span class="old-price">Rp ${product.hargaLama.toLocaleString('id-ID')}</span>` : ''}
                                </div>
                                <div class="product-stock" style="font-size: 14px;">
                                    <i class="fas fa-box"></i>
                                    <span class="${product.stok > 10 ? 'stock-available' : product.stok > 0 ? 'stock-low' : 'stock-out'}">
                                        ${product.stok > 0 ? `${product.stok} tersedia` : 'Stok Habis'}
                                    </span>
                                </div>
                                <p style="margin: 15px 0;">${product.deskripsi}</p>
                                <div class="row" style="margin: 15px 0;">
                                    <div class="col-6">
                                        <small><strong>Ukuran:</strong> ${product.ukuran}</small>
                                    </div>
                                    <div class="col-6">
                                        <small><strong>Bahan:</strong> ${product.bahan}</small>
                                    </div>
                                    <div class="col-6">
                                        <small><strong>Warna:</strong> ${product.warna.join(', ')}</small>
                                    </div>
                                    <div class="col-6">
                                        <small><strong>Min. Beli:</strong> ${product.minimalPembelian}</small>
                                    </div>
                                </div>
                                <button class="btn-product" onclick="app.addToCart(${product.id})" style="margin-top: 20px;" ${product.stok === 0 ? 'disabled' : ''}>
                                    <i class="fas fa-cart-plus"></i> 
                                    ${product.stok === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const productModal = new bootstrap.Modal(modal);
        productModal.show();
        
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    checkPendingOrders() {
        // Cek order yang sudah melewati estimasi
        const now = new Date();
        this.orders.forEach(order => {
            if (order.status === 'processing') {
                const estimateDate = new Date(order.estimateDate);
                if (now > estimateDate) {
                    // Update status menjadi shipped
                    order.status = 'shipped';
                    this.showAlert(`Pesanan ${order.orderId} sedang dalam perjalanan`, 'info');
                }
            }
        });
        
        localStorage.setItem('sentralplastik_orders', JSON.stringify(this.orders));
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
            max-width: 300px;
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

// Inisialisasi aplikasi
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new SentralPlastikApp();
});

window.app = app;
