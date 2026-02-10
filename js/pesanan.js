class PesananPage {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('sentralplastik_orders')) || [];
        this.currentFilter = 'all';
        this.isCartLoading = false;
        this.cart = JSON.parse(localStorage.getItem('sentralplastik_cart')) || [];
        this.isMobileMenuOpen = false;
        
        this.initializeEventListeners();
        this.loadOrders();
        this.updateCartCount();
        this.updateOrderCount();
        this.initializeMobileMenu();
        this.initializeSearch();
    }

    initializeEventListeners() {
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.loadOrders();
            });
        });

        document.getElementById('refreshOrders')?.addEventListener('click', () => {
            this.loadOrders();
        });

        document.getElementById('cancelOrderButton')?.addEventListener('click', () => {
            this.cancelCurrentOrder();
        });

        document.getElementById('cartButtonPesanan')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showCartModal();
        });
        
        document.getElementById('cartButtonMobilePesanan')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showCartModal();
        });

        document.getElementById('checkoutButtonPesanan')?.addEventListener('click', () => {
            if (this.cart.length === 0) {
                this.showAlert('Keranjang belanja kosong', 'warning');
                return;
            }
            window.location.href = '../index.html';
        });

        document.getElementById('orderButtonPesanan')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '#';
        });
        
        document.getElementById('orderButtonMobilePesanan')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '#';
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-order-detail')) {
                const orderCard = e.target.closest('.order-card');
                const orderId = orderCard.dataset.orderId;
                this.showOrderDetail(orderId);
            }
            
            if (e.target.closest('.btn-cancel-order')) {
                const orderCard = e.target.closest('.order-card');
                const orderId = orderCard.dataset.orderId;
                if (confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
                    this.cancelOrder(orderId);
                }
            }
        });
    }

    initializeMobileMenu() {
        const menuToggle = document.getElementById('mobileMenuTogglePesanan');
        const menuClose = document.getElementById('mobileMenuClosePesanan');
        const menuOverlay = document.getElementById('mobileMenuOverlayPesanan');
        const hamburgerIcon = menuToggle?.querySelector('.hamburger-icon');
        
        if (menuToggle && menuOverlay && hamburgerIcon) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu(true);
            });
            
            menuClose?.addEventListener('click', () => {
                this.toggleMobileMenu(false);
            });
            
            menuOverlay.addEventListener('click', (e) => {
                if (e.target === menuOverlay) {
                    this.toggleMobileMenu(false);
                }
            });
            
            document.querySelectorAll('.mobile-nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    this.toggleMobileMenu(false);
                });
            });
        }
    }

    toggleMobileMenu(open) {
        const menuToggle = document.getElementById('mobileMenuTogglePesanan');
        const menuOverlay = document.getElementById('mobileMenuOverlayPesanan');
        const hamburgerIcon = menuToggle?.querySelector('.hamburger-icon');
        
        if (open !== undefined) {
            this.isMobileMenuOpen = open;
        } else {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
        }
        
        if (menuOverlay) {
            if (this.isMobileMenuOpen) {
                menuOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
        
        if (hamburgerIcon) {
            const spans = hamburgerIcon.querySelectorAll('span');
            if (this.isMobileMenuOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    }

    initializeSearch() {
        const searchInputs = [
            { id: 'searchInputPesanan', resultsId: 'desktopSearchResultsPesanan' },
            { id: 'searchInputMobilePesanan', resultsId: 'mobileSearchResultsPesanan' }
        ];

        const mobileSearchInput = document.getElementById('searchInputMobilePesanan');
        if (mobileSearchInput) {
            mobileSearchInput.addEventListener('focus', () => {
                document.body.classList.add('search-focused');
            });

            mobileSearchInput.addEventListener('blur', () => {
                document.body.classList.remove('search-focused');
            });
        }
        
        searchInputs.forEach(({ id, resultsId }) => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const query = e.target.value.trim();
                        if (query) {
                            window.location.href = `hasil.html?q=${encodeURIComponent(query)}`;
                        }
                    }
                });
                
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
                    window.location.href = `hasil.html?q=${encodeURIComponent(product.nama)}`;
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

    loadOrders() {
        const ordersList = document.getElementById('ordersList');
        const noOrders = document.getElementById('noOrders');
        const orderCountText = document.getElementById('orderCountText');

        let filteredOrders = [...this.orders];
        
        if (this.currentFilter !== 'all') {
            filteredOrders = filteredOrders.filter(order => order.status === this.currentFilter);
        }

        filteredOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        if (orderCountText) {
            orderCountText.textContent = `${filteredOrders.length} pesanan ditemukan`;
        }

        this.updateOrderStats();

        if (ordersList) {
            if (filteredOrders.length === 0) {
                ordersList.innerHTML = '';
                if (noOrders) noOrders.style.display = 'block';
            } else {
                ordersList.innerHTML = filteredOrders.map(order => this.createOrderHTML(order)).join('');
                if (noOrders) noOrders.style.display = 'none';
            }
        }

        document.querySelectorAll('.view-order-detail').forEach(button => {
            button.addEventListener('click', (e) => {
                const orderId = e.target.closest('.order-card').dataset.orderId;
                this.showOrderDetail(orderId);
            });
        });
    }

    updateOrderStats() {
        const pendingCount = this.orders.filter(order => order.status === 'pending').length;
        const processingCount = this.orders.filter(order => order.status === 'processing').length;
        const deliveredCount = this.orders.filter(order => order.status === 'delivered').length;
        
        document.getElementById('pendingOrdersCount').textContent = pendingCount;
        document.getElementById('processingOrdersCount').textContent = processingCount;
        document.getElementById('completedOrdersCount').textContent = deliveredCount;
    }

    createOrderHTML(order) {
        const orderDate = new Date(order.orderDate);
        const estimateDate = new Date(order.estimateDate);
        const statusClass = this.getStatusClass(order.status);
        const statusText = this.getStatusText(order.status);
        const canCancel = order.status === 'pending' || order.status === 'processing';
        
        return `
            <div class="order-card mb-4" data-order-id="${order.orderId}">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-0">${order.orderId}</h6>
                            <small class="text-muted">${orderDate.toLocaleDateString('id-ID')} ${orderDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</small>
                        </div>
                        <span class="order-status ${statusClass}">${statusText}</span>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-8">
                                <h6>${order.customer.name}</h6>
                                <p class="text-muted mb-2">${order.customer.phone}</p>
                                <p class="mb-0">${order.items.length} item • Rp ${order.total.toLocaleString('id-ID')}</p>
                                <p class="mb-0"><small>Estimasi: ${estimateDate.toLocaleDateString('id-ID')}</small></p>
                            </div>
                            <div class="col-md-4 text-md-end">
                                <button class="btn btn-outline-primary btn-sm view-order-detail mb-2">
                                    <i class="fas fa-eye"></i> Detail
                                </button>
                                ${canCancel ? `
                                <button class="btn btn-outline-danger btn-sm btn-cancel-order">
                                    <i class="fas fa-times"></i> Batalkan
                                </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getStatusClass(status) {
        switch(status) {
            case 'pending':
                return 'status-pending';
            case 'processing':
                return 'status-processing';
            case 'shipped':
                return 'status-shipped';
            case 'delivered':
                return 'status-delivered';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return 'status-pending';
        }
    }

    getStatusText(status) {
        switch(status) {
            case 'pending':
                return 'Menunggu';
            case 'processing':
                return 'Diproses';
            case 'shipped':
                return 'Dikirim';
            case 'delivered':
                return 'Selesai';
            case 'cancelled':
                return 'Dibatalkan';
            default:
                return status;
        }
    }

    showOrderDetail(orderId) {
        const order = this.orders.find(o => o.orderId === orderId);
        if (!order) return;

        const modalContent = document.getElementById('orderDetailContent');
        const cancelButton = document.getElementById('cancelOrderButton');
        const orderDate = new Date(order.orderDate);
        const estimateDate = new Date(order.estimateDate);
        const statusText = this.getStatusText(order.status);
        const canCancel = order.status === 'pending' || order.status === 'processing';

        let itemsHTML = '';
        order.items.forEach(item => {
            itemsHTML += `
                <tr>
                    <td>${item.nama}</td>
                    <td>${item.quantity}</td>
                    <td>Rp ${item.harga.toLocaleString('id-ID')}</td>
                    <td>Rp ${(item.harga * item.quantity).toLocaleString('id-ID')}</td>
                </tr>
            `;
        });

        let statusHistoryHTML = '';
        if (order.statusHistory) {
            order.statusHistory.forEach(history => {
                const historyDate = new Date(history.timestamp);
                statusHistoryHTML += `
                    <div class="mb-2">
                        <strong>${this.getStatusText(history.status)}</strong>
                        <div class="text-muted">${historyDate.toLocaleDateString('id-ID')} ${historyDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                        <small>${history.note || ''}</small>
                    </div>
                `;
            });
        }

        modalContent.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Informasi Pesanan</h6>
                    <p><strong>ID Pesanan:</strong> ${order.orderId}</p>
                    <p><strong>Tanggal:</strong> ${orderDate.toLocaleDateString('id-ID')} ${orderDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                    <p><strong>Status:</strong> <span class="order-status ${this.getStatusClass(order.status)}">${statusText}</span></p>
                    <p><strong>Estimasi Sampai:</strong> ${estimateDate.toLocaleDateString('id-ID')}</p>
                    
                    <h6 class="mt-4">Informasi Pelanggan</h6>
                    <p><strong>Nama:</strong> ${order.customer.name}</p>
                    <p><strong>Telepon:</strong> ${order.customer.phone}</p>
                    <p><strong>Email:</strong> ${order.customer.email || '-'}</p>
                    <p><strong>Alamat:</strong> ${order.customer.address}</p>
                    <p><strong>Catatan:</strong> ${order.customer.note || '-'}</p>
                </div>
                <div class="col-md-6">
                    <h6>Detail Produk</h6>
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Produk</th>
                                    <th>Qty</th>
                                    <th>Harga</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHTML}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3" class="text-end"><strong>Total:</strong></td>
                                    <td><strong>Rp ${order.total.toLocaleString('id-ID')}</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    
                    <h6 class="mt-4">Riwayat Status</h6>
                    <div class="status-history">
                        ${statusHistoryHTML || '<p>Tidak ada riwayat status</p>'}
                    </div>
                </div>
            </div>
        `;

        if (cancelButton) {
            cancelButton.style.display = canCancel ? 'inline-block' : 'none';
            cancelButton.onclick = () => {
                if (confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
                    this.cancelOrder(orderId);
                }
            };
        }

        const modal = new bootstrap.Modal(document.getElementById('orderDetailModal'));
        modal.show();
    }

    cancelOrder(orderId) {
        const orderIndex = this.orders.findIndex(o => o.orderId === orderId);
        if (orderIndex === -1) return;

        const order = this.orders[orderIndex];
        
        if (order.status !== 'pending' && order.status !== 'processing') {
            this.showAlert('Pesanan tidak dapat dibatalkan karena sudah dalam proses pengiriman', 'warning');
            return;
        }

        order.status = 'cancelled';
        order.statusHistory = order.statusHistory || [];
        order.statusHistory.push({
            status: 'cancelled',
            timestamp: new Date().toISOString(),
            note: 'Dibatalkan oleh pelanggan'
        });

        order.items.forEach(item => {
            BARANG_DATA.tambahStok(item.id, item.quantity);
        });

        localStorage.setItem('sentralplastik_orders', JSON.stringify(this.orders));
        
        this.sendCancellationEmail(order);

        this.loadOrders();
        this.updateOrderCount();
        
        bootstrap.Modal.getInstance(document.getElementById('orderDetailModal')).hide();
        
        this.showAlert('Pesanan berhasil dibatalkan', 'success');
    }

    cancelCurrentOrder() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('orderDetailModal'));
        const orderId = document.querySelector('.order-card.active')?.dataset.orderId;
        
        if (orderId) {
            this.cancelOrder(orderId);
            if (modal) modal.hide();
        }
    }

    sendCancellationEmail(order) {
        console.log(`Pesanan ${order.orderId} dibatalkan oleh ${order.customer.name}`);
    }

    showCartModal() {
        if (this.isCartLoading) return;
        
        const cartItems = document.getElementById('cartItemsPesanan');
        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart fa-3x"></i>
                    <h4>Keranjang Belanja Kosong</h4>
                    <p>Tambahkan produk ke keranjang untuk mulai berbelanja</p>
                </div>
            `;
            document.getElementById('cartTotalPesanan').textContent = 'Rp 0';
            
            const cartModal = new bootstrap.Modal(document.getElementById('cartModalPesanan'));
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
                        <button class="quantity-btn" onclick="pesananPage.updateQuantity(${item.id}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="pesananPage.updateQuantity(${item.id}, 1)" ${product && item.quantity >= product.stok ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-price">
                        Rp ${itemTotal.toLocaleString('id-ID')}
                    </div>
                    <button class="btn btn-sm btn-danger" onclick="pesananPage.removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }).join('');

        document.getElementById('cartTotalPesanan').textContent = `Rp ${total.toLocaleString('id-ID')}`;
        
        const cartModal = new bootstrap.Modal(document.getElementById('cartModalPesanan'));
        cartModal.show();
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

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.showCartModal();
    }

    saveCart() {
        localStorage.setItem('sentralplastik_cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const cartCounts = ['cartCountPesanan', 'cartCountMobilePesanan'];
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
        const orderCounts = ['orderCountPesanan', 'orderCountMobilePesanan'];
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

let pesananPage;

document.addEventListener('DOMContentLoaded', () => {
    pesananPage = new PesananPage();
});

window.pesananPage = pesananPage;