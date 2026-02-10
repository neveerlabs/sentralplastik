const CONFIG = {
    email: {
        from: "userlinuxorg@gmail.com",
        to: "sentralplastiko@gmail.com",
        smtp: {
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "userlinuxorg@gmail.com",
                pass: ""
            }
        }
    },
    
    transfer: {
        dana: {
            number: "08561765372",
            name: "SENTRAL PLASTIK"
        },
        bca: {
            number: "123-456-7890",
            name: "SENTRAL PLASTIK"
        },
        bri: {
            number: "987-654-3210",
            name: "SENTRAL PLASTIK"
        },
        mandiri: {
            number: "555-123-4567",
            name: "SENTRAL PLASTIK"
        }
    },
    
    whatsapp: {
        number: "628561765372",
        business: true
    },
    
    store: {
        name: "SENTRAL PLASTIK",
        address: "Jln. Suryakencana Cibadak Km. 2, Sukabumi, Jawa Barat",
        phone: "0856-1765-372",
        email: "userlinuxorg@gmail.com",
        workingHours: "Senin - Sabtu: 08.00 - 17.00"
    },
    
    shipping: {
        estimateDays: 3,
        codAvailable: true,
        freeShippingThreshold: 500000
    },
    
    notifications: {
        purchaseNotifications: true,
        stockNotifications: true,
        orderStatusNotifications: true
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}