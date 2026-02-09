class DetailKategoriPage {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('sentralplastik_cart')) || [];
        this.products = this.initializeProducts();
        this.currentSort = 'default';
        this.displayedProducts = 8;
        this.initializeEventListeners();
        this.updateCartCount();
        this.initializeSearch();
    }

    initializeProducts() {
        return [
            {
                id: 1,
                name: "Gelas Plastik 14oz 50pcs",
                category: "PERLENGKAPAN DAPUR",
                price: 48000,
                oldPrice: 55000,
                stock: 60,
                isNew: false,
                isTrending: false,
                isDiscount: true,
                isBest: false,
                image: "../../images/gelas-14oz.jpg"
            },
            {
                id: 2,
                name: "Sendok Plastik Premium 100pcs",
                category: "PERLENGKAPAN DAPUR",
                price: 35000,
                oldPrice: 40000,
                stock: 80,
                isNew: false,
                isTrending: false,
                isDiscount: true,
                isBest: true,
                image: "../../images/sendok-premium.jpg"
            },
            {
                id: 3,
                name: "Pisau Plastik 24pcs",
                category: "PERLENGKAPAN DAPUR",
                price: 28000,
                oldPrice: 32000,
                stock: 45,
                isNew: true,
                isTrending: true,
                isDiscount: false,
                isBest: false,
                image: "../../images/pisau-plastik.jpg"
            },
            {
                id: 4,
                name: "Garpu Plastik 50pcs",
                category: "PERLENGKAPAN DAPUR",
                price: 25000,
                oldPrice: 30000,
                stock: 70,
                isNew: false,
                isTrending: false,
                isDiscount: true,
                isBest: false,
                image: "../../images/garpu-plastik.jpg"
            },
            {
                id: 5,
                name: "Mangkuk Plastik 6pcs",
                category: "PERLENGKAPAN DAPUR",
                price: 45000,
                oldPrice: 50000,
                stock: 35,
                isNew: false,
                isTrending: false,
                isDiscount: true,
                isBest: true,
                image: "../../images/mangkuk-plastik.jpg"
            },
            {
                id: 6,
                name: "Tatakan Gelas Plastik 10pcs",
                category: "PERLENGKAPAN DAPUR",
                price: 18000,
                oldPrice: 22000,
                stock: 90,
                isNew: true,
                isTrending: false,
                isDiscount: true,
                isBest: false,
                image: "../../images/tatakan-gelas.jpg"
            },
            {
                id: 7,
                name: "Sendok Nasi Plastik 20pcs",
                category: "PERLENGKAPAN DAPUR",
                price: 32000,
                oldPrice: 38000,
                stock: 55,
                isNew: false,
                isTrending: true,
                isDiscount: true,
                isBest: false,
                image: "../../images/sendok-nasi.jpg"
            },
            {
                id: 8,
                name: "Piring Plastik 8pcs",
                category: "PERLENGKAPAN DAPUR",
                price: 40000,
                oldPrice: 45000,
                stock: 40,
                isNew: false,
                isTrending: false,
                isDiscount: false,
                isBest: true,
                image: "../../images/piring-plastik.jpg"
            },
            {
                id: 9,
                name: "Sumpit Plastik 50pcs",
                category: "PERLENGKAPAN DAPUR",
                price: 22000,
                oldPrice: 25000,
                stock: 65,
                isNew: false,
                isTrending: false,
                isDiscount: true,
                isBest: false,
                image: "../../images/sumpit-plastik.jpg"
            },
            {
                id: 10,
                name: "Spatula Plastik 3pcs",
                category: "PERLENGKAPAN DAPUR",
                price: 35000,
                oldPrice: 40000,
                stock: 30,
                isNew: true,
                isTrending: true,
                isDiscount: false,
                isBest: false,
                image: "../../images/spatula-plastik.jpg"
            },
            {
                id: 11,
                name: "Centong Nasi Plastik 2pcs",
                category: "PERLENGKAPAN DAPUR",
                price: 18000,
                oldPrice: 20000,
                stock: 50,
                isNew: false,
                isTrending: false,
                isDiscount: true,
                isBest: true,
                image: "../../images/centong-nasi.jpg"
            },
            {
                id: 12,
                name: "Sendok Sayur Plastik 3pcs",
                category: "PERLENGKAPAN DAPUR",
                price: 15000,
                oldPrice: 18000,
                stock: 45,
                isNew: false,
                isTrending: true,
                isDiscount: true,
                isBest: false,
                image: "../../images/sendok-sayur.jpg"
            },
            {
                id: 13,
                name: "Mangkuk Salad Plastik 4pcs",
                category: "PERLENGKAPAN DAPUR",
                price: 38000,
                oldPrice: 42000,
                stock: 25,
                isNew: true,
                isTrending: false,
                isDiscount: true,
                isBest: false,
                image: "../../images/mangkuk-salad.jpg"
            },
            {
                id: 14,
                name: "Sendok Teh Plastik 100pcs",
                category: "PERLENGKAPAN DAPUR",
                price: 28000,
                oldPrice: 32000,
                stock: 85,
                isNew: false,
                isTrending: false,
                isDiscount: false,
                isBest: true,
                image: "../../images/sendok-teh.jpg"
            },
            {
                id: 15,
                name: "Gelas Ukur Plastik Set 5pcs",
                category: "PERLENGKAPAN DAPUR",
                price: 55000,
                oldPrice: 60000,
                stock: 20,
                isNew: true,
                isTrending: true,
                isDiscount: true,
                isBest: false,
                image: "../../images/gelas-ukur.jpg"
            }
        ];
    }

    initializeEventListeners() {
        document.getElementById('cartButton').addEventListener('click', (e) => {
            e.preventDefault();
            this.showCartModal();
        });

        document.getElementById('checkoutButton')?.addEventListener('click', () => {
            if (this.cart.length === 0) {
                this.showAlert('Keranjang belanja kosong', 'warning');
                return;
            }
            this.showCheckoutModal();
        });

        document.getElementById('loadMore').addEventListener('click', () => {
            this.loadMoreProducts();
        });

        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.loadProducts();
        });
    }

    initializeSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value);
                }
            });
        }
    }

    performSearch(query) {
        if (query.trim() === '') return;
        
        const filteredProducts = this.products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        
        this.showSearchResults(filteredProducts, query);
    }

    showSearchResults(products, query) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'searchModal';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Hasil Pencarian: "${query}"</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row" id="searchResults">
                            ${products.length === 0 ? 
                                '<div class="col-12 text-center py-5"><p>Tidak ada produk yang ditemukan</p></div>' : 
                                products.map(product => this.createProductHTML(product)).join('')
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const searchModal = new bootstrap.Modal(modal);
        searchModal.show();
        
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    loadProducts() {
        let filteredProducts = [...this.products];

        switch (this.currentSort) {
            case 'name':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'popular':
                filteredProducts.sort((a, b) => {
                    const aScore = (a.isNew ? 2 : 0) + (a.isTrending ? 1 : 0) + (a.isBest ? 3 : 0);
                    const bScore = (b.isNew ? 2 : 0) + (b.isTrending ? 1 : 0) + (b.isBest ? 3 : 0);
                    return bScore - aScore;
                });
                break;
        }

        this.displayProducts(filteredProducts.slice(0, this.displayedProducts));
    }

    loadMoreProducts() {
        this.displayedProducts += 4;
        this.loadProducts();
        
        if (this.displayedProducts >= this.products.length) {
            document.getElementById('loadMore').style.display = 'none';
        }
    }

    displayProducts(products) {
        const container = document.getElementById('productsGrid');
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                    <p>Tidak ada produk yang ditemukan</p>
                </div>
            `;
            document.getElementById('loadMore').style.display = 'none';
            return;
        }

        container.innerHTML = products.map(product => this.createProductHTML(product)).join('');
        
        document.getElementById('loadMore').style.display = 
            this.displayedProducts < this.products.length ? 'block' : 'none';
    }

    createProductHTML(product) {
        return `
            <div class="col-lg-3 col-md-4 col-sm-6">
                <div class="product-card">
                    <div class="product-image">
                        ${product.isNew ? '<span class="product-badge">BARU</span>' : ''}
                        ${product.isDiscount ? '<span class="product-badge" style="background-color: var(--blue);">DISKON</span>' : ''}
                        ${product.isBest ? '<span class="product-badge" style="background-color: #28a745;">TERLARIS</span>' : ''}
                        ${product.name}
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <div class="product-name">${product.name}</div>
                        <div class="product-price">
                            Rp ${product.price.toLocaleString('id-ID')}
                            ${product.oldPrice ? `<span class="old-price">Rp ${product.oldPrice.toLocaleString('id-ID')}</span>` : ''}
                        </div>
                        <button class="btn-product" onclick="detailKategori.addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                        </button>
                    </div>
                </div>
            </div>
        `;
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
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    showCartModal() {
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) {
            alert('Fitur keranjang lengkap tersedia di halaman utama');
            window.location.href = '../../index.html';
            return;
        }

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <p>Keranjang belanja kosong</p>
                </div>
            `;
            document.getElementById('cartTotal').textContent = 'Rp 0';
            
            const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
            cartModal.show();
            return;
        }

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
                        <button class="quantity-btn" onclick="detailKategori.updateQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="detailKategori.updateQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-price">
                        Rp ${itemTotal.toLocaleString('id-ID')}
                    </div>
                    <button class="btn btn-sm btn-danger" onclick="detailKategori.removeFromCart(${item.id})">
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
        alert('Fitur checkout lengkap tersedia di halaman utama');
        window.location.href = '../../index.html';
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

let detailKategori;

document.addEventListener('DOMContentLoaded', () => {
    detailKategori = new DetailKategoriPage();
    detailKategori.loadProducts();
});

window.detailKategori = detailKategori;