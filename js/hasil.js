class HasilPencarian {
    constructor() {
        this.query = new URLSearchParams(window.location.search).get('q') || '';
        this.cart = JSON.parse(localStorage.getItem('sentralplastik_cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('sentralplastik_wishlist')) || [];
        this.orders = JSON.parse(localStorage.getItem('sentralplastik_orders')) || [];
        this.currentFilter = 'all';
        this.currentSort = 'default';
        this.currentView = 'grid';
        this.productsPerPage = 12;
        this.currentPage = 1;
        this.allProducts = [];
        this.filteredProducts = [];
        this.displayedProducts = [];
        this.isCartLoading = false;
        this.isMobileMenuOpen = false;
        
        this.initializeEventListeners();
        this.initializeMobileMenu();
        this.loadSearchResults();
        this.loadSuggestedProducts();
        this.updateCartCount();
        this.updateOrderCount();
        this.updateWishlistCount();
        this.initializeSearch();
    }

    initializeEventListeners() {
        document.getElementById('cartButton')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showCartModal();
        });
        
        document.getElementById('cartButtonMobile')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showCartModal();
        });

        document.getElementById('orderButton')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'pesanan.html';
        });
        
        document.getElementById('orderButtonMobile')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'pesanan.html';
        });

        document.getElementById('checkoutButton')?.addEventListener('click', () => {
            if (this.cart.length === 0) {
                this.showAlert('Keranjang belanja kosong', 'warning');
                return;
            }
            this.showCheckoutModal();
        });

        document.getElementById('submitOrderButton')?.addEventListener('click', () => {
            this.submitOrder();
        });

        document.getElementById('resetSearch')?.addEventListener('click', () => {
            window.location.href = 'kategori.html';
        });

        document.getElementById('loadMoreButton')?.addEventListener('click', () => {
            this.loadMoreProducts();
        });

        document.getElementById('paymentMethod')?.addEventListener('change', () => {
            this.togglePaymentDetails();
        });

        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                this.setActiveFilter(e.target.dataset.filter);
                this.applyFilterAndSort();
            });
        });

        document.getElementById('sortSelect')?.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.applyFilterAndSort();
        });

        document.querySelectorAll('.view-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.setActiveView(e.target.closest('.view-option').dataset.view);
            });
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-link.wishlist')) {
                const btn = e.target.closest('.btn-link.wishlist');
                const productId = parseInt(btn.dataset.productId);
                this.toggleWishlist(productId);
            }
            
            if (e.target.closest('.btn-product')) {
                const btn = e.target.closest('.btn-product');
                if (!btn.disabled) {
                    const productId = parseInt(btn.dataset.productId);
                    this.addToCart(productId);
                }
            }
            
            if (e.target.closest('.view-detail')) {
                const btn = e.target.closest('.view-detail');
                const productId = parseInt(btn.dataset.productId);
                this.showProductDetail(productId);
            }
        });
    }

    initializeMobileMenu() {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const menuClose = document.getElementById('mobileMenuClose');
        const menuOverlay = document.getElementById('mobileMenuOverlay');
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
        const menuToggle = document.getElementById('mobileMenuToggle');
        const menuOverlay = document.getElementById('mobileMenuOverlay');
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
            { id: 'searchInput', resultsId: 'desktopSearchResults' },
            { id: 'searchInputMobile', resultsId: 'mobileSearchResults' }
        ];

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
                
                if (this.query && input) {
                    input.value = this.query;
                }
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

    setActiveFilter(filter) {
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.classList.remove('active');
        });
        document.querySelector(`.filter-tag[data-filter="${filter}"]`)?.classList.add('active');
        this.currentFilter = filter;
    }

    setActiveView(view) {
        document.querySelectorAll('.view-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`.view-option[data-view="${view}"]`)?.classList.add('active');
        this.currentView = view;
        this.displayProducts();
    }

    loadSearchResults() {
        const title = document.getElementById('searchTitle');
        const subtitle = document.getElementById('searchSubtitle');
        const resultCountText = document.getElementById('resultCountText');
        const resultCount = document.getElementById('resultCount');

        if (title) title.textContent = this.query ? `"${this.query}"` : 'HASIL PENCARIAN';
        if (subtitle) subtitle.textContent = this.query ? `Hasil pencarian untuk "${this.query}"` : 'Menampilkan semua produk';

        const loadingElement = document.getElementById('loadingResults');
        if (loadingElement) loadingElement.style.display = 'block';

        setTimeout(() => {
            if (this.query) {
                this.allProducts = BARANG_DATA.cariProduk(this.query);
            } else {
                this.allProducts = [...BARANG_DATA.produk];
            }

            this.filteredProducts = [...this.allProducts];
            this.currentPage = 1;
            
            this.applyFilterAndSort();
            
            if (loadingElement) loadingElement.style.display = 'none';
            
            const totalProducts = this.filteredProducts.length;
            if (resultCountText) resultCountText.textContent = `${totalProducts} produk ditemukan`;
            if (resultCount) resultCount.textContent = `${totalProducts} produk`;
            
            const noResults = document.getElementById('noResults');
            if (noResults) {
                noResults.style.display = totalProducts === 0 ? 'block' : 'none';
            }
            
            const loadMoreSection = document.getElementById('loadMoreSection');
            if (loadMoreSection) {
                loadMoreSection.style.display = totalProducts > this.productsPerPage ? 'block' : 'none';
            }
        }, 500);
    }

    applyFilterAndSort() {
        let filtered = [...this.allProducts];

        switch(this.currentFilter) {
            case 'available':
                filtered = filtered.filter(p => p.stok > 0);
                break;
            case 'discount':
                filtered = filtered.filter(p => p.hargaLama && p.hargaLama > 0);
                break;
            case 'best':
                filtered = filtered.filter(p => p.tag && p.tag.includes('terlaris'));
                break;
            case 'new':
                filtered = filtered.filter(p => p.tag && p.tag.includes('terbaru'));
                break;
        }

        switch(this.currentSort) {
            case 'price_asc':
                filtered.sort((a, b) => a.harga - b.harga);
                break;
            case 'price_desc':
                filtered.sort((a, b) => b.harga - a.harga);
                break;
            case 'name_asc':
                filtered.sort((a, b) => a.nama.localeCompare(b.nama));
                break;
            case 'name_desc':
                filtered.sort((a, b) => b.nama.localeCompare(a.nama));
                break;
            case 'stock_desc':
                filtered.sort((a, b) => b.stok - a.stok);
                break;
        }

        this.filteredProducts = filtered;
        this.currentPage = 1;
        this.displayProducts();
        
        const totalProducts = this.filteredProducts.length;
        document.getElementById('resultCountText').textContent = `${totalProducts} produk ditemukan`;
        document.getElementById('resultCount').textContent = `${totalProducts} produk`;
        
        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.style.display = totalProducts === 0 ? 'block' : 'none';
        }
        
        const loadMoreSection = document.getElementById('loadMoreSection');
        if (loadMoreSection) {
            loadMoreSection.style.display = totalProducts > this.productsPerPage ? 'block' : 'none';
        }
    }

    displayProducts() {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;

        const startIndex = 0;
        const endIndex = this.currentPage * this.productsPerPage;
        this.displayedProducts = this.filteredProducts.slice(startIndex, endIndex);

        if (this.displayedProducts.length === 0) {
            resultsContainer.innerHTML = '';
            return;
        }

        if (this.currentView === 'list') {
            resultsContainer.className = 'row';
            resultsContainer.innerHTML = this.displayedProducts.map(product => this.createProductListHTML(product)).join('');
        } else {
            resultsContainer.className = 'row';
            resultsContainer.innerHTML = this.displayedProducts.map(product => this.createProductGridHTML(product)).join('');
        }

        const loadMoreSection = document.getElementById('loadMoreSection');
        if (loadMoreSection) {
            loadMoreSection.style.display = this.filteredProducts.length > this.displayedProducts.length ? 'block' : 'none';
        }
    }

    createProductGridHTML(product) {
        const isSoldOut = product.stok === 0;
        const isLowStock = product.stok > 0 && product.stok < 10;
        const stockClass = product.stok > 10 ? 'stock-available' : 
                          product.stok > 0 ? 'stock-low' : 'stock-out';
        const stockText = product.stok > 0 ? 
                         `${product.stok} tersedia` : 'Stok Habis';
        
        const isInWishlist = this.wishlist.includes(product.id);
        const wishlistClass = isInWishlist ? 'wishlist active' : 'wishlist';
        const discountPercent = product.hargaLama ? 
            Math.round(((product.hargaLama - product.harga) / product.hargaLama) * 100) : 0;

        return `
            <div class="col-lg-3 col-md-4 col-sm-6">
                <div class="product-card">
                    <div class="product-image">
                        ${product.tag && product.tag.includes('terbaru') ? '<span class="product-badge badge-new">BARU</span>' : ''}
                        ${product.tag && product.tag.includes('terlaris') ? '<span class="product-badge badge-trending">TERLARIS</span>' : ''}
                        ${product.hargaLama ? `<span class="product-badge badge-discount">-${discountPercent}%</span>` : ''}
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
                        <button class="btn-product" data-product-id="${product.id}" ${isSoldOut ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus"></i> 
                            ${isSoldOut ? 'Stok Habis' : 'Tambah ke Keranjang'}
                        </button>
                        <div class="product-actions">
                            <button class="btn-link wishlist ${wishlistClass}" data-product-id="${product.id}">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button class="btn-link view-detail" data-product-id="${product.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createProductListHTML(product) {
        const isSoldOut = product.stok === 0;
        const isLowStock = product.stok > 0 && product.stok < 10;
        const stockClass = product.stok > 10 ? 'stock-available' : 
                          product.stok > 0 ? 'stock-low' : 'stock-out';
        const stockText = product.stok > 0 ? 
                         `${product.stok} tersedia` : 'Stok Habis';
        
        const isInWishlist = this.wishlist.includes(product.id);
        const wishlistClass = isInWishlist ? 'wishlist active' : 'wishlist';
        const discountPercent = product.hargaLama ? 
            Math.round(((product.hargaLama - product.harga) / product.hargaLama) * 100) : 0;

        return `
            <div class="col-12">
                <div class="product-card list-view">
                    <div class="product-image">
                        ${product.tag && product.tag.includes('terbaru') ? '<span class="product-badge badge-new">BARU</span>' : ''}
                        ${product.tag && product.tag.includes('terlaris') ? '<span class="product-badge badge-trending">TERLARIS</span>' : ''}
                        ${product.hargaLama ? `<span class="product-badge badge-discount">-${discountPercent}%</span>` : ''}
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
                        <p style="font-size: 13px; color: var(--gray); margin: 10px 0;">${product.deskripsi.substring(0, 100)}...</p>
                        <div class="product-price">
                            Rp ${product.harga.toLocaleString('id-ID')}
                            ${product.hargaLama ? `<span class="old-price">Rp ${product.hargaLama.toLocaleString('id-ID')}</span>` : ''}
                        </div>
                        <div class="d-flex gap-3 align-items-center">
                            <button class="btn-product" data-product-id="${product.id}" ${isSoldOut ? 'disabled' : ''}>
                                <i class="fas fa-cart-plus"></i> 
                                ${isSoldOut ? 'Stok Habis' : 'Tambah ke Keranjang'}
                            </button>
                            <div class="product-actions">
                                <button class="btn-link wishlist ${wishlistClass}" data-product-id="${product.id}">
                                    <i class="fas fa-heart"></i>
                                </button>
                                <button class="btn-link view-detail" data-product-id="${product.id}">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadMoreProducts() {
        this.currentPage++;
        this.displayProducts();
    }

    loadSuggestedProducts() {
        const container = document.getElementById('suggestedProducts');
        if (!container) return;

        const suggestedProducts = BARANG_DATA.getProdukTrending().slice(0, 4);
        container.innerHTML = suggestedProducts.map(product => this.createProductGridHTML(product)).join('');
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
                        <button class="quantity-btn" onclick="hasilPage.updateQuantity(${item.id}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="hasilPage.updateQuantity(${item.id}, 1)" ${product && item.quantity >= product.stok ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-price">
                        Rp ${itemTotal.toLocaleString('id-ID')}
                    </div>
                    <button class="btn btn-sm btn-danger" onclick="hasilPage.removeFromCart(${item.id})">
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
        
        document.getElementById('orderForm').reset();
        document.getElementById('transferDetails').style.display = 'none';
        
        const savedData = JSON.parse(localStorage.getItem('sentralplastik_customer')) || {};
        if (savedData.name) document.getElementById('customerName').value = savedData.name;
        if (savedData.phone) document.getElementById('customerPhone').value = savedData.phone;
        if (savedData.email) document.getElementById('customerEmail').value = savedData.email;
        if (savedData.address) document.getElementById('customerAddress').value = savedData.address;
        
        const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        if (cartModal) {
            cartModal.hide();
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

    showProductDetail(productId) {
        const product = BARANG_DATA.getProdukById(productId);
        if (!product) return;
        
        const isSoldOut = product.stok === 0;
        const isLowStock = product.stok > 0 && product.stok < 10;
        const stockClass = product.stok > 10 ? 'stock-available' : 
                          product.stok > 0 ? 'stock-low' : 'stock-out';
        const stockText = product.stok > 0 ? 
                         `${product.stok} tersedia` : 'Stok Habis';
        const isInWishlist = this.wishlist.includes(product.id);
        const wishlistClass = isInWishlist ? 'wishlist active' : 'wishlist';
        const discountPercent = product.hargaLama ? 
            Math.round(((product.hargaLama - product.harga) / product.hargaLama) * 100) : 0;

        const content = `
            <div class="row">
                <div class="col-md-6">
                    <div class="product-image" style="height: 300px;">
                        ${product.tag && product.tag.includes('terbaru') ? '<span class="product-badge badge-new">BARU</span>' : ''}
                        ${product.tag && product.tag.includes('terlaris') ? '<span class="product-badge badge-trending">TERLARIS</span>' : ''}
                        ${product.hargaLama ? `<span class="product-badge badge-discount">-${discountPercent}%</span>` : ''}
                        ${isSoldOut ? '<span class="product-badge badge-soldout">HABIS</span>' : ''}
                        <div style="padding: 40px; text-align: center;">
                            <i class="fas fa-box-open fa-4x" style="color: #666; margin-bottom: 20px;"></i>
                            <div style="font-size: 14px; color: #999;">${product.nama}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="product-info">
                        <div class="product-category">${product.kategori}</div>
                        <h4 class="mb-3">${product.nama}</h4>
                        <div class="product-stock mb-3">
                            <i class="fas fa-box${isSoldOut ? '-open' : ''}"></i>
                            <span class="${stockClass}">${stockText}</span>
                        </div>
                        ${product.rating ? `
                        <div class="product-rating mb-3">
                            <div class="stars">
                                ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                            </div>
                            <div class="rating-count">(${product.rating})</div>
                        </div>
                        ` : ''}
                        <div class="product-price mb-4" style="font-size: 24px;">
                            Rp ${product.harga.toLocaleString('id-ID')}
                            ${product.hargaLama ? `<span class="old-price" style="font-size: 18px;">Rp ${product.hargaLama.toLocaleString('id-ID')}</span>` : ''}
                        </div>
                        <p class="mb-4">${product.deskripsi}</p>
                        <div class="row mb-4">
                            <div class="col-6">
                                <small><strong><i class="fas fa-ruler"></i> Ukuran:</strong> ${product.ukuran}</small>
                            </div>
                            <div class="col-6">
                                <small><strong><i class="fas fa-layer-group"></i> Bahan:</strong> ${product.bahan}</small>
                            </div>
                            <div class="col-6">
                                <small><strong><i class="fas fa-palette"></i> Warna:</strong> ${product.warna.join(', ')}</small>
                            </div>
                            <div class="col-6">
                                <small><strong><i class="fas fa-shopping-cart"></i> Min. Beli:</strong> ${product.minimalPembelian}</small>
                            </div>
                        </div>
                        <div class="d-flex gap-3">
                            <button class="btn-product" style="flex: 1;" onclick="hasilPage.addToCart(${product.id})" ${isSoldOut ? 'disabled' : ''}>
                                <i class="fas fa-cart-plus"></i> 
                                ${isSoldOut ? 'Stok Habis' : 'Tambah ke Keranjang'}
                            </button>
                            <div class="product-actions">
                                <button class="btn-link wishlist ${wishlistClass}" onclick="hasilPage.toggleWishlist(${product.id})">
                                    <i class="fas fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('productDetailContent').innerHTML = content;
        const modal = new bootstrap.Modal(document.getElementById('productDetailModal'));
        modal.show();
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

            for (const item of orderData.items) {
                BARANG_DATA.kurangiStok(item.id, item.quantity);
            }

            this.orders.push(orderData);
            localStorage.setItem('sentralplastik_orders', JSON.stringify(this.orders));
            this.updateOrderCount();

            const response = await fetch('../simpan-order.php', {
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
                result = { success: true };
            }

            if (result.success) {
                this.showAlert('Pesanan berhasil dikirim! Konfirmasi akan dikirim via WhatsApp/Email.', 'success');
                
                this.cart = [];
                this.saveCart();
                this.updateCartCount();
                
                BARANG_DATA.simpanKeLocalStorage();
                
                const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
                if (checkoutModal) {
                    checkoutModal.hide();
                }
                
                this.sendWhatsAppNotification(orderData);
                
                form.reset();
                document.getElementById('transferDetails').style.display = 'none';
                
                setTimeout(() => {
                    window.location.href = 'pesanan.html';
                }, 1500);
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

let hasilPage;

document.addEventListener('DOMContentLoaded', () => {
    hasilPage = new HasilPencarian();
});

window.hasilPage = hasilPage;