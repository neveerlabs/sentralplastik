<?php
// simpan-order.php - Backend untuk menyimpan pesanan

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Konfigurasi
$config = [
    'email' => [
        'from' => 'order@sentralplastik.com',
        'to' => 'pemiliktoko@sentralplastik.com',
        'subject_prefix' => '[SENTRAL PLASTIK] '
    ]
];

// Fungsi untuk mengirim email
function sendEmail($to, $subject, $message, $headers = '') {
    if (empty($headers)) {
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: SENTRAL PLASTIK <order@sentralplastik.com>\r\n";
        $headers .= "Reply-To: no-reply@sentralplastik.com\r\n";
    }
    
    // Simulasi pengiriman email
    // Di production, gunakan SMTP atau service seperti SendGrid/Mailgun
    $logFile = 'email_logs.txt';
    $logEntry = date('Y-m-d H:i:s') . " - To: $to - Subject: $subject\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND);
    
    // Untuk development, selalu return true
    return true;
    
    // Untuk production, uncomment baris berikut:
    // return mail($to, $subject, $message, $headers);
}

// Fungsi untuk update stock di barang.json
function updateStock($items) {
    $barangFile = 'data/barang.json';
    
    if (!file_exists($barangFile)) {
        return false;
    }
    
    $barangData = json_decode(file_get_contents($barangFile), true);
    
    foreach ($items as $item) {
        foreach ($barangData['produk'] as &$produk) {
            if ($produk['id'] == $item['id']) {
                if ($produk['stok'] >= $item['quantity']) {
                    $produk['stok'] -= $item['quantity'];
                    $produk['totalPenjualan'] += $item['quantity'];
                }
                break;
            }
        }
    }
    
    return file_put_contents($barangFile, json_encode($barangData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Fungsi untuk menyimpan pesanan
function saveOrder($orderData) {
    $ordersFile = 'data/orders.json';
    
    if (!file_exists($ordersFile)) {
        file_put_contents($ordersFile, json_encode([]));
    }
    
    $orders = json_decode(file_get_contents($ordersFile), true);
    
    // Tambahkan status history
    $orderData['status_history'] = [[
        'status' => 'pending',
        'timestamp' => date('c'),
        'note' => 'Pesanan dibuat'
    ]];
    
    $orders[] = $orderData;
    
    return file_put_contents($ordersFile, json_encode($orders, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Main execution
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

try {
    // Validasi data
    $requiredFields = ['customer', 'payment', 'items', 'total', 'orderId'];
    foreach ($requiredFields as $field) {
        if (!isset($input[$field])) {
            throw new Exception("Field $field is required");
        }
    }
    
    // Update stock
    if (!updateStock($input['items'])) {
        throw new Exception('Failed to update stock');
    }
    
    // Simpan pesanan
    $orderData = [
        'order_id' => $input['orderId'],
        'customer_name' => $input['customer']['name'],
        'customer_phone' => $input['customer']['phone'],
        'customer_email' => $input['customer']['email'] ?? '',
        'customer_address' => $input['customer']['address'],
        'customer_note' => $input['customer']['note'] ?? '',
        'payment_method' => $input['payment'],
        'items' => $input['items'],
        'total_amount' => $input['total'],
        'order_date' => date('Y-m-d H:i:s'),
        'estimate_date' => date('Y-m-d H:i:s', strtotime('+3 days')),
        'status' => 'pending'
    ];
    
    if (!saveOrder($orderData)) {
        throw new Exception('Failed to save order');
    }
    
    // Kirim email ke pemilik toko
    $toOwner = $config['email']['to'];
    $subjectOwner = $config['email']['subject_prefix'] . "Pesanan Baru #" . $input['orderId'];
    
    $messageOwner = "
    <html>
    <body style='font-family: Arial, sans-serif;'>
        <h2>PESANAN BARU - SENTRAL PLASTIK</h2>
        <hr>
        <p><strong>ID Pesanan:</strong> {$input['orderId']}</p>
        <p><strong>Tanggal:</strong> " . date('d/m/Y H:i') . "</p>
        <p><strong>Nama:</strong> {$input['customer']['name']}</p>
        <p><strong>Telepon:</strong> {$input['customer']['phone']}</p>
        <p><strong>Email:</strong> " . ($input['customer']['email'] ?? '-') . "</p>
        <p><strong>Alamat:</strong> {$input['customer']['address']}</p>
        <p><strong>Metode Pembayaran:</strong> " . ($input['payment'] == 'cod' ? 'COD' : 'Transfer') . "</p>
        
        <h3>Detail Pesanan:</h3>
        <table border='1' cellpadding='8' style='border-collapse: collapse; width: 100%;'>
            <tr>
                <th>Produk</th>
                <th>Qty</th>
                <th>Harga</th>
                <th>Subtotal</th>
            </tr>
    ";
    
    foreach ($input['items'] as $item) {
        $subtotal = $item['harga'] * $item['quantity'];
        $messageOwner .= "
            <tr>
                <td>{$item['nama']}</td>
                <td>{$item['quantity']}</td>
                <td>Rp " . number_format($item['harga'], 0, ',', '.') . "</td>
                <td>Rp " . number_format($subtotal, 0, ',', '.') . "</td>
            </tr>
        ";
    }
    
    $messageOwner .= "
        </table>
        <h3>Total: Rp " . number_format($input['total'], 0, ',', '.') . "</h3>
        <p><strong>Catatan:</strong> " . ($input['customer']['note'] ?? '-') . "</p>
        <hr>
        <p><strong>Untuk mengupdate status pesanan:</strong></p>
        <p>Balas email ini dengan format: UPDATE_STATUS#{$input['orderId']}#STATUS#CATATAN</p>
        <p>Contoh: UPDATE_STATUS#{$input['orderId']}#processing#Sedang diproses</p>
        <p>Status yang tersedia: processing, shipped, delivered, cancelled</p>
    </body>
    </html>
    ";
    
    $emailSentOwner = sendEmail($toOwner, $subjectOwner, $messageOwner);
    
    // Kirim email konfirmasi ke customer jika email tersedia
    $emailSentCustomer = false;
    if (!empty($input['customer']['email'])) {
        $toCustomer = $input['customer']['email'];
        $subjectCustomer = $config['email']['subject_prefix'] . "Konfirmasi Pesanan #" . $input['orderId'];
        
        $messageCustomer = "
        <html>
        <body style='font-family: Arial, sans-serif;'>
            <h2>TERIMA KASIH TELAH BERBELANJA DI SENTRAL PLASTIK</h2>
            <hr>
            <p>Pesanan Anda telah kami terima dengan detail sebagai berikut:</p>
            <p><strong>ID Pesanan:</strong> {$input['orderId']}</p>
            <p><strong>Tanggal:</strong> " . date('d/m/Y H:i') . "</p>
            <p><strong>Status:</strong> Menunggu konfirmasi</p>
            <p><strong>Estimasi Sampai:</strong> " . date('d/m/Y', strtotime('+3 days')) . "</p>
            <hr>
            <p>Kami akan segera memproses pesanan Anda. Untuk pertanyaan, hubungi:</p>
            <p>WhatsApp: 0812-3456-7890</p>
            <p>Email: info@sentralplastik.com</p>
        </body>
        </html>
        ";
        
        $emailSentCustomer = sendEmail($toCustomer, $subjectCustomer, $messageCustomer);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Order saved successfully',
        'orderId' => $input['orderId'],
        'emailSent' => [
            'owner' => $emailSentOwner,
            'customer' => $emailSentCustomer
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>