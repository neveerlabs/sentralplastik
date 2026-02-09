class TentangApp {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('sentralplastik_cart')) || [];
        this.initializeEventListeners();
        this.updateCartCount();
        this.initializeSearch();
    }

    initializeEventListeners() {
        const cartButton = document.getElementById('cartButton');
        const cartButtonMobile = document.getElementById('cartButtonMobile');

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
            }
        });
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

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.showCartModal();
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;
        
        item.quantity += change;
        
        if (item.quantity < 1) {
            this.removeFromCart(productId);
            return;
        }

        this.saveCart();
        this.updateCartCount();
        this.showCartModal();
    }

    saveCart() {
        localStorage.setItem('sentralplastik_cart', JSON.stringify(this.cart));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new TentangApp();
});