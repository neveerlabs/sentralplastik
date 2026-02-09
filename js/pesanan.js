// pesanan.js - Halaman manajemen pesanan
class PesananPage {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('sentralplastik_orders')) || [];
        this.currentFilter = 'all';
        this.initializeEventListeners();
        this.loadOrders();
        this.updateCartCount();
        this.updateOrderCount();
    }

    initializeEventListeners() {
        // Filter tags
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.loadOrders();
            });
        });

        // Refresh button
        document.getElementById('refreshOrders')?.addEventListener('click', () => {
            this.loadOrders();
        });

        // Cancel order button
        document.getElementById('cancelOrderButton')?.addEventListener('click', () => {
            this.cancelCurrentOrder();
        });

        // Cart button
        document.getElementById('cartButton')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '../index.html';
        });
    }

    loadOrders() {
        const ordersList = document.getElementById('ordersList');
        const noOrders = document.getElementById('noOrders');
        const orderCountText = document.getElementById('orderCountText');

        let filteredOrders = [...this.orders];
        
        if (this.currentFilter !== 'all') {
            filteredOrders = filteredOrders.filter(order => order.status === this.currentFilter);
        }

        // Sort by date (newest first)
        filteredOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        // Update count
        if (orderCountText) {
            orderCountText.textContent = `${filteredOrders.length} pesanan ditemukan`;
        }

        // Display orders
        if (ordersList) {
            if (filteredOrders.length === 0) {
                ordersList.innerHTML = '';
                if (noOrders) noOrders.style.display = 'block';
            } else {
                ordersList.innerHTML = filteredOrders.map(order => this.createOrderHTML(order)).join('');
                if (noOrders) noOrders.style.display = 'none';
            }
        }

        // Add event listeners to detail buttons
        document.querySelectorAll('.view-order-detail').forEach(button => {
            button.addEventListener('click', (e) => {
                const orderId = e.target.closest('.order-card').dataset.orderId;
                this.showOrderDetail(orderId);
            });
        });
    }

    createOrderHTML(order) {
        const orderDate = new Date(order.orderDate);
        const estimateDate = new Date(order.estimateDate);
        const statusClass = this.getStatusClass(order.status);
        const statusText = this.getStatusText(order.status);
        
        return `
            <div class="order-card mb-4" data-order-id="${order.orderId}">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-0">${order.orderId}</h6>
                            <small class="text-muted">${orderDate.toLocaleDateString('id-ID')} ${orderDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</small>
                        </div>
                        <span class="badge ${statusClass}">${statusText}</span>
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
                                <button class="btn btn-outline-primary btn-sm view-order-detail">
                                    <i class="fas fa-eye"></i> Detail
                                </button>
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
                return 'bg-warning';
            case 'processing':
                return 'bg-info';
            case 'shipped':
                return 'bg-primary';
            case 'delivered':
                return 'bg-success';
            case 'cancelled':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    }

    getStatusText(status) {
        switch(status) {
            case 'pending':
                return 'Menunggu Pembayaran';
            case 'processing':
                return 'Sedang Diproses';
            case 'shipped':
                return 'Dalam Pengiriman';
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
                    <p><strong>Status:</strong> <span class="badge ${this.getStatusClass(order.status)}">${statusText}</span></p>
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
        
        // Check if order can be cancelled
        if (order.status !== 'pending' && order.status !== 'processing') {
            this.showAlert('Pesanan tidak dapat dibatalkan karena sudah dalam proses pengiriman', 'warning');
            return;
        }

        // Update order status
        order.status = 'cancelled';
        order.statusHistory = order.statusHistory || [];
        order.statusHistory.push({
            status: 'cancelled',
            timestamp: new Date().toISOString(),
            note: 'Dibatalkan oleh pelanggan'
        });

        // Restore stock
        order.items.forEach(item => {
            BARANG_DATA.tambahStok(item.id, item.quantity);
        });

        // Save changes
        localStorage.setItem('sentralplastik_orders', JSON.stringify(this.orders));
        
        // Send cancellation email to store owner
        this.sendCancellationEmail(order);

        // Reload orders
        this.loadOrders();
        this.updateOrderCount();
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('orderDetailModal')).hide();
        
        this.showAlert('Pesanan berhasil dibatalkan', 'success');
    }

    sendCancellationEmail(order) {
        // In a real application, this would send an email to the store owner
        // For now, we'll just log it
        console.log(`Pesanan ${order.orderId} dibatalkan oleh ${order.customer.name}`);
        
        // You would implement actual email sending here
        // This is a placeholder for the email sending logic
        const emailData = {
            to: CONFIG.email.to,
            subject: `PEMBATALAN PESANAN #${order.orderId} - SENTRAL PLASTIK`,
            message: `
                Pesanan #${order.orderId} telah dibatalkan oleh pelanggan.
                
                Detail Pelanggan:
                Nama: ${order.customer.name}
                Telepon: ${order.customer.phone}
                Alasan: Dibatalkan oleh pelanggan
                
                Detail Pesanan:
                Total: Rp ${order.total.toLocaleString('id-ID')}
                Jumlah Item: ${order.items.length}
                
                Harap periksa sistem untuk detail lebih lanjut.
            `
        };
        
        // In a real app, you would send this via your backend
        // fetch('send-email.php', { method: 'POST', body: JSON.stringify(emailData) })
    }

    cancelCurrentOrder() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('orderDetailModal'));
        const orderId = document.querySelector('.order-card.active')?.dataset.orderId;
        
        if (orderId) {
            this.cancelOrder(orderId);
            if (modal) modal.hide();
        }
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('sentralplastik_cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    updateOrderCount() {
        const orders = JSON.parse(localStorage.getItem('sentralplastik_orders')) || [];
        const pendingOrders = orders.filter(order => 
            order.status === 'pending' || order.status === 'processing'
        ).length;
        
        const orderCount = document.getElementById('orderCount');
        if (orderCount) {
            orderCount.textContent = pendingOrders;
            orderCount.style.display = pendingOrders > 0 ? 'flex' : 'none';
        }
        
        // Update order count text
        const orderCountText = document.getElementById('orderCountText');
        if (orderCountText && !orderCountText.id.includes('Text')) {
            const allOrders = orders.length;
            orderCountText.textContent = `${allOrders} pesanan ditemukan`;
        }
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

let pesananPage;

document.addEventListener('DOMContentLoaded', () => {
    pesananPage = new PesananPage();
});

window.pesananPage = pesananPage;