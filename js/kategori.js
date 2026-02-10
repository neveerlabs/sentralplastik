// kategori.js - JavaScript untuk halaman kategori SENTRAL PLASTIK
class KategoriPage {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('sentralplastik_cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('sentralplastik_wishlist')) || [];
        this.orders = JSON.parse(localStorage.getItem('sentralplastik_orders')) || [];
        this.currentFilter = 'all';
        this.currentSort = 'default';
        this.currentCategory = null;
        this.displayedProducts = 12;
        this.allProducts = [];
        this.filteredProducts = [];
        this.isCartLoading = false;
        this.isMobileMenuOpen = false;
        this.isLoading = false;
        this.notificationQueue = [];
        this.recentPurchases = JSON.parse(localStorage.getItem('recent_purchases')) || [];
        
        this.initializeEventListeners();
        this.initializeMobileMenu();
        this.loadCategoryCounts();
        this.loadAllProducts();
        this.updateCartCount();
        this.updateOrderCount();
        this.updateWishlistCount();
        this.initializeSearch();
        this.checkURLParameters();
        this.updateTotalStats();
        this.startNotificationCycle();
        this.initializePurchaseNotifications();
    }

    initializeEventListeners() {
        this.setupCartEventListeners();
        this.setupOrderEventListeners();
        this.setupCheckoutEventListeners();
        this.setupFilterEventListeners();
        this.setupSortEventListeners();
        this.setupProductEventListeners();
        this.setupModalEventListeners();
        this.setupWishlistEventListeners();
        this.setupLoadMoreEventListener();
        this.setupSearchEventListeners();
    }

    setupCartEventListeners() {
        const cartButtons = ['cartButton', 'cartButtonMobile'];
        cartButtons.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showCartModal();
                });
            }
        });
    }

    setupOrderEventListeners() {
        const orderButtons = ['orderButton', 'orderButtonMobile'];
        orderButtons.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = 'pesanan.html';
                });
            }
        });
    }

    setupCheckoutEventListeners() {
        const checkoutButton = document.getElementById('checkoutButton');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                if (this.cart.length === 0) {
                    this.showAlert('Keranjang belanja kosong', 'warning');
                    return;
                }
                this.showCheckoutModal();
            });
        }

        const submitOrderButton = document.getElementById('submitOrderButton');
        if (submitOrderButton) {
            submitOrderButton.addEventListener('click', () => {
                this.submitOrder();
            });
        }

        const paymentMethodSelect = document.getElementById('paymentMethod');
        if (paymentMethodSelect) {
            paymentMethodSelect.addEventListener('change', () => {
                this.togglePaymentDetails();
            });
        }
    }

    setupFilterEventListeners() {
        const resetFilterButton = document.getElementById('resetFilter');
        if (resetFilterButton) {
            resetFilterButton.addEventListener('click', () => {
                this.resetFilters();
            });
        }

        const filterTags = document.querySelectorAll('.filter-tag');
        filterTags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                this.handleFilterTagClick(e);
            });
        });

        const kategoriCards = document.querySelectorAll('.kategori-card');
        kategoriCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.category-link')) {
                    const category = card.dataset.category;
                    this.filterByCategory(category);
                }
            });
        });
    }

    setupSortEventListeners() {
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applyFiltersAndSort();
            });
        }
    }

    setupProductEventListeners() {
        document.addEventListener('click', (e) => {
            const addToCartButton = e.target.closest('.btn-product');
            if (addToCartButton && addToCartButton.onclick && addToCartButton.onclick.toString().includes('addToCart')) {
                return;
            }
        });
    }

    setupModalEventListeners() {
        const closeButtons = document.querySelectorAll('.modal .btn-close, .btn-secondary');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = bootstrap.Modal.getInstance(btn.closest('.modal'));
                if (modal) {
                    modal.hide();
                }
            });
        });
    }

    setupWishlistEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-link.wishlist')) {
                const btn = e.target.closest('.btn-link.wishlist');
                const productId = parseInt(btn.dataset.productId);
                this.toggleWishlist(productId);
            }
        });
    }

    setupLoadMoreEventListener() {
        const loadMoreButton = document.getElementById('loadMore');
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', () => {
                this.loadMoreProducts();
            });
        }
    }

    setupSearchEventListeners() {
        const searchInputs = [
            { id: 'searchInput', resultsId: 'desktopSearchResults' },
            { id: 'searchInputMobile', resultsId: 'mobileSearchResults' }
        ];

        const mobileSearchInput = document.getElementById('searchInputMobile');
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
        this.setupSearchEventListeners();
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

    checkURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('cat');
        const filterParam = urlParams.get('filter');

        if (categoryParam) {
            this.filterByCategoryParam(categoryParam);
        } else if (filterParam) {
            this.applyFilterParam(filterParam);
        }
    }

    filterByCategoryParam(categoryParam) {
        let categoryName = '';

        switch(categoryParam) {
            case 'dapur':
                categoryName = 'PERLENGKAPAN DAPUR';
                break;
            case 'kemasan':
                categoryName = 'KEMASAN MAKANAN';
                break;
            case 'rumahtangga':
                categoryName = 'PERLENGKAPAN RUMAH TANGGA';
                break;
            case 'usaha':
                categoryName = 'KEBUTUHAN USAHA';
                break;
            case 'cup':
                categoryName = 'CUP PLASTIK';
                break;
            case 'alatmakan':
                categoryName = 'ALAT MAKAN PLASTIK';
                break;
            case 'aluminium':
                categoryName = 'ALUMINIUM FOIL';
                break;
            case 'baking':
                categoryName = 'PERLENGKAPAN DAPUR';
                break;
            case 'wadah':
                categoryName = 'WADAH PLASTIK';
                break;
            default:
                categoryName = categoryParam.toUpperCase();
        }

        this.filterByCategory(categoryName);
    }

    applyFilterParam(filterParam) {
        let filterTag = document.querySelector(`.filter-tag[data-filter="${filterParam}"]`);
        if (filterTag) {
            document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
            filterTag.classList.add('active');
            this.currentFilter = filterParam;
            this.applyFiltersAndSort();
        }
    }

    loadCategoryCounts() {
        const categories = BARANG_DATA.getAllKategori();

        categories.forEach(category => {
            const countElement = document.getElementById(`count-${category.nama.toLowerCase().replace(/\s+/g, '-')}`);
            if (countElement) {
                countElement.textContent = `${category.jumlah} Produk`;
            }
        });
    }

    updateTotalStats() {
        const totalProducts = BARANG_DATA.produk.length;
        document.getElementById('totalProducts').textContent = totalProducts.toLocaleString('id-ID');

        const totalCategories = BARANG_DATA.getAllKategori().length;
        document.getElementById('totalCategories').textContent = totalCategories;
    }

    loadAllProducts() {
        this.isLoading = true;
        const loadingElement = document.getElementById('loadingProducts');
        if (loadingElement) {
            loadingElement.classList.add('active');
        }

        setTimeout(() => {
            this.allProducts = BARANG_DATA.produk;
            this.isLoading = false;
            
            if (loadingElement) {
                loadingElement.classList.remove('active');
            }
            
            this.applyFiltersAndSort();
        }, 500);
    }

    applyFiltersAndSort() {
        if (this.currentCategory) {
            this.filteredProducts = this.allProducts.filter(product => 
                product.kategori === this.currentCategory
            );
        } else {
            this.filteredProducts = [...this.allProducts];
        }

        switch (this.currentFilter) {
            case 'new':
                this.filteredProducts = this.filteredProducts.filter(p => 
                    p.tag && p.tag.includes("terbaru")
                );
                break;
            case 'discount':
                this.filteredProducts = this.filteredProducts.filter(p => 
                    p.hargaLama && p.hargaLama > 0
                );
                break;
            case 'best':
                this.filteredProducts = this.filteredProducts.filter(p => 
                    p.tag && p.tag.includes("terlaris")
                );
                break;
            case 'available':
                this.filteredProducts = this.filteredProducts.filter(p => 
                    p.stok > 0
                );
                break;
            case 'soldout':
                this.filteredProducts = this.filteredProducts.filter(p => 
                    p.stok === 0
                );
                break;
        }

        switch (this.currentSort) {
            case 'name':
                this.filteredProducts.sort((a, b) => a.nama.localeCompare(b.nama));
                break;
            case 'name-desc':
                this.filteredProducts.sort((a, b) => b.nama.localeCompare(a.nama));
                break;
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.harga - b.harga);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.harga - a.harga);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'sales':
                this.filteredProducts.sort((a, b) => (b.totalPenjualan || 0) - (a.totalPenjualan || 0));
                break;
            case 'stock':
                this.filteredProducts.sort((a, b) => b.stok - a.stok);
                break;
        }

        this.displayProducts();
        this.updateProductCountDisplay();
    }

    displayProducts() {
        const container = document.getElementById('productsGrid');
        if (!container) return;

        const productsToShow = this.filteredProducts.slice(0, this.displayedProducts);

        if (productsToShow.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="empty-state">
                        <i class="fas fa-box-open fa-3x"></i>
                        <h4>Tidak ada produk ditemukan</h4>
                        <p>Coba gunakan filter yang berbeda atau reset filter</p>
                        <button class="btn-filter" onclick="kategoriPage.resetFilters()">
                            <i class="fas fa-redo"></i> Reset Filter
                        </button>
                    </div>
                </div>
            `;
            document.getElementById('loadMoreContainer').style.display = 'none';
            return;
        }

        container.innerHTML = productsToShow.map(product => this.createProductHTML(product)).join('');

        const loadMoreButton = document.getElementById('loadMore');
        const loadMoreContainer = document.getElementById('loadMoreContainer');
        
        if (loadMoreButton && loadMoreContainer) {
            if (this.displayedProducts < this.filteredProducts.length) {
                loadMoreContainer.style.display = 'block';
                loadMoreButton.disabled = false;
                loadMoreButton.querySelector('span').textContent = 'Muat Lebih Banyak';
                loadMoreButton.querySelector('i').classList.add('d-none');
            } else {
                loadMoreContainer.style.display = 'none';
            }
        }
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

        const rating = product.rating || 0;
        const ratingStars = Math.floor(rating);
        const ratingFraction = rating - ratingStars;

        let ratingHTML = '';
        if (rating > 0) {
            ratingHTML = `
                <div class="product-rating">
                    <div class="stars">
                        ${'<i class="fas fa-star"></i>'.repeat(ratingStars)}
                        ${ratingFraction >= 0.5 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                        ${'<i class="far fa-star"></i>'.repeat(5 - ratingStars - (ratingFraction >= 0.5 ? 1 : 0))}
                    </div>
                    <div class="rating-count">${rating.toFixed(1)}</div>
                </div>
            `;
        }

        return `
            <div class="col-lg-3 col-md-4 col-sm-6">
                <div class="product-card">
                    <div class="product-image">
                        ${product.tag && product.tag.includes('terbaru') ? '<span class="product-badge badge-new">BARU</span>' : ''}
                        ${product.tag && product.tag.includes('terlaris') ? '<span class="product-badge badge-trending">TERLARIS</span>' : ''}
                        ${product.hargaLama ? '<span class="product-badge badge-discount">DISKON</span>' : ''}
                        ${isSoldOut ? '<span class="product-badge badge-soldout">HABIS</span>' : ''}
                        <div class="product-image-placeholder">
                            <i class="fas fa-box-open fa-3x"></i>
                            <div class="product-image-text">${product.nama}</div>
                        </div>
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.kategori}</div>
                        <div class="product-name">${product.nama}</div>
                        <div class="product-stock">
                            <i class="fas fa-box${isSoldOut ? '-open' : ''}"></i>
                            <span class="${stockClass}">${stockText}</span>
                        </div>
                        ${ratingHTML}
                        <div class="product-price">
                            <span class="current-price">Rp ${product.harga.toLocaleString('id-ID')}</span>
                            ${product.hargaLama ? `<span class="old-price">Rp ${product.hargaLama.toLocaleString('id-ID')}</span>` : ''}
                        </div>
                        <button class="btn-product" onclick="kategoriPage.addToCart(${product.id})" 
                                ${isSoldOut ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus"></i> 
                            ${isSoldOut ? 'Stok Habis' : 'Tambah ke Keranjang'}
                        </button>
                        <div class="product-actions">
                            <button class="btn-link wishlist ${wishlistClass}" data-product-id="${product.id}">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button class="btn-link" onclick="kategoriPage.showProductDetail(${product.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-link" onclick="kategoriPage.shareProduct(${product.id})">
                                <i class="fas fa-share-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadMoreProducts() {
        const loadMoreButton = document.getElementById('loadMore');
        if (loadMoreButton) {
            loadMoreButton.disabled = true;
            loadMoreButton.querySelector('span').textContent = 'Memuat...';
            loadMoreButton.querySelector('i').classList.remove('d-none');
        }

        setTimeout(() => {
            this.displayedProducts += 12;
            this.displayProducts();
        }, 800);
    }

    updateProductCountDisplay() {
        const productCountDisplay = document.getElementById('productCountDisplay');
        const categoryIndicator = document.getElementById('categoryIndicator');
        const sectionTitle = document.getElementById('sectionTitle');

        if (productCountDisplay) {
            productCountDisplay.textContent = `${this.filteredProducts.length} produk`;
        }

        if (categoryIndicator) {
            if (this.currentCategory) {
                categoryIndicator.textContent = this.currentCategory;
                categoryIndicator.style.display = 'inline-block';
            } else {
                categoryIndicator.style.display = 'none';
            }
        }

        if (sectionTitle) {
            if (this.currentCategory) {
                sectionTitle.innerHTML = `${this.currentCategory} <span class="filter-active">${this.filteredProducts.length} produk</span>`;
            } else {
                sectionTitle.innerHTML = 'SEMUA PRODUK <span class="filter-active">' + this.filteredProducts.length + ' produk</span>';
            }
        }
    }

    handleFilterTagClick(e) {
        document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.currentCategory = null;
        this.displayedProducts = 12;
        this.applyFiltersAndSort();
    }

    filterByCategory(categoryName) {
        this.currentCategory = categoryName;
        this.currentFilter = 'all';

        document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
        document.querySelector('.filter-tag[data-filter="all"]').classList.add('active');

        document.getElementById('sortSelect').value = 'default';
        this.currentSort = 'default';

        this.displayedProducts = 12;
        this.applyFiltersAndSort();

        document.getElementById('produkSection').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });

        this.showAlert(`Menampilkan produk kategori: ${categoryName}`, 'info');
    }

    showAllCategories() {
        this.currentCategory = null;
        this.currentFilter = 'all';
        this.currentSort = 'default';
        this.displayedProducts = 12;

        document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
        document.querySelector('.filter-tag[data-filter="all"]').classList.add('active');

        document.getElementById('sortSelect').value = 'default';

        this.applyFiltersAndSort();
        this.showAlert('Menampilkan semua kategori', 'info');
    }

    resetFilters() {
        this.currentFilter = 'all';
        this.currentCategory = null;
        this.currentSort = 'default';
        this.displayedProducts = 12;

        document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
        document.querySelector('.filter-tag[data-filter="all"]').classList.add('active');

        document.getElementById('sortSelect').value = 'default';

        this.applyFiltersAndSort();
        this.showAlert('Filter telah direset', 'success');
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
        if (!cartItems) {
            alert('Fitur keranjang lengkap tersedia di halaman utama');
            window.location.href = '../index.html';
            return;
        }

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart fa-3x"></i>
                    <h4>Keranjang Belanja Kosong</h4>
                    <p>Tambahkan produk ke keranjang untuk mulai berbelanja</p>
                    <button class="btn-filter" onclick="kategoriPage.toggleMobileMenu(false)" data-bs-dismiss="modal">
                        <i class="fas fa-shopping-bag"></i> Lanjut Belanja
                    </button>
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
                        <div class="cart-item-price-unit">
                            Rp ${item.harga.toLocaleString('id-ID')} / item
                        </div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="kategoriPage.updateQuantity(${item.id}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-number">${item.quantity}</span>
                        <button class="quantity-btn" onclick="kategoriPage.updateQuantity(${item.id}, 1)" ${product && item.quantity >= product.stok ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-price">
                        Rp ${itemTotal.toLocaleString('id-ID')}
                    </div>
                    <button class="btn btn-sm btn-danger" onclick="kategoriPage.removeFromCart(${item.id})">
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

            const purchaseRecord = {
                buyer: orderData.customer.name,
                item: this.cart.length > 0 ? this.cart[0].nama : 'Barang',
                timestamp: Date.now()
            };

            this.recentPurchases.push(purchaseRecord);
            localStorage.setItem('recent_purchases', JSON.stringify(this.recentPurchases));

            this.notificationQueue.push({
                buyer: purchaseRecord.buyer,
                item: purchaseRecord.item,
                time: 'Baru saja'
            });

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
                                <div class="product-tags" style="margin-top: 15px;">
                                    ${product.tag && product.tag.includes('terbaru') ? '<span class="badge bg-primary me-1">BARU</span>' : ''}
                                    ${product.tag && product.tag.includes('terlaris') ? '<span class="badge bg-danger me-1">TERLARIS</span>' : ''}
                                    ${product.hargaLama ? '<span class="badge bg-success me-1">DISKON</span>' : ''}
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
                                <button class="btn-product" onclick="kategoriPage.addToCart(${product.id})" style="margin-top: 20px; width: 100%;" ${product.stok === 0 ? 'disabled' : ''}>
                                    <i class="fas fa-cart-plus"></i> 
                                    ${product.stok === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                                </button>
                                <div class="product-actions mt-3">
                                    <button class="btn-link wishlist ${this.wishlist.includes(product.id) ? 'active' : ''}" onclick="kategoriPage.toggleWishlist(${product.id})" style="width: 48%;">
                                        <i class="fas fa-heart"></i> Wishlist
                                    </button>
                                    <button class="btn-link" onclick="kategoriPage.shareProduct(${product.id})" style="width: 48%;">
                                        <i class="fas fa-share-alt"></i> Bagikan
                                    </button>
                                </div>
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

    shareProduct(productId) {
        const product = BARANG_DATA.getProdukById(productId);
        if (!product) return;

        const shareText = `Lihat produk ${product.nama} dari SENTRAL PLASTIK - Rp ${product.harga.toLocaleString('id-ID')}`;
        const shareUrl = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: product.nama,
                text: shareText,
                url: shareUrl
            }).catch(console.error);
        } else {
            const tempInput = document.createElement('input');
            tempInput.value = `${shareText} ${shareUrl}`;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            this.showAlert('Link produk berhasil disalin', 'success');
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

        setTimeout(showNextNotification, 3000);
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

let kategoriPage;

document.addEventListener('DOMContentLoaded', () => {
    kategoriPage = new KategoriPage();
});

window.kategoriPage = kategoriPage;