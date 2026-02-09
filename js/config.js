// config.js - Konfigurasi sistem SENTRAL PLASTIK
const CONFIG = {
    // Konfigurasi email
    email: {
        from: "noreply@sentralplastik.com",
        to: "pemiliktoko@sentralplastik.com",
        smtp: {
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "order@sentralplastik.com",
                pass: ""
            }
        }
    },
    
    // Konfigurasi transfer
    transfer: {
        dana: {
            number: "0812-3456-7890",
            name: "PT SENTRAL PLASTIK INDONESIA"
        },
        bca: {
            number: "123-456-7890",
            name: "PT SENTRAL PLASTIK INDONESIA"
        },
        bri: {
            number: "987-654-3210",
            name: "PT SENTRAL PLASTIK INDONESIA"
        },
        mandiri: {
            number: "555-123-4567",
            name: "PT SENTRAL PLASTIK INDONESIA"
        }
    },
    
    // Konfigurasi WhatsApp
    whatsapp: {
        number: "6281234567890",
        business: true
    },
    
    // Konfigurasi toko
    store: {
        name: "SENTRAL PLASTIK",
        address: "Jl. Raya Plastik No. 123, Jakarta",
        phone: "0812-3456-7890",
        email: "info@sentralplastik.com",
        workingHours: "Senin - Sabtu: 08.00 - 17.00"
    },
    
    // Konfigurasi pengiriman
    shipping: {
        estimateDays: 3,
        codAvailable: true,
        freeShippingThreshold: 500000
    },
    
    // Konfigurasi notifikasi
    notifications: {
        purchaseNotifications: true,
        stockNotifications: true,
        orderStatusNotifications: true
    }
};

// Ekspor konfigurasi
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}