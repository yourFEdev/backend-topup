"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoiceTemplate = void 0;
const generateInvoiceTemplate = ({ recipientName, gameName, variation, price, transactionId, payment_status, delivery_status, payment_method, date, }) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
      <h1 style="text-align: center; color: #4CAF50;">TOP-UP CENTER</h1>  
      <h2 style="text-align: center; color: #4CAF50;">Invoice Pembelian Voucher Game</h2>
        <p>Halo <strong>${recipientName}</strong>,</p>
        <p>Terima kasih telah melakukan pembelian. Berikut adalah rincian transaksi Anda:</p>
        
        <table style="width: 100%; border-collapse: collapse;">
         <tr>
            <td><strong>ID Transaksi</strong></td>
            <td>${transactionId}</td>
          </tr>
          <tr>
            <td><strong>Game</strong></td>
            <td>${gameName}</td>
          </tr>
          <tr>
            <td><strong>Variasi</strong></td>
            <td>${variation}</td>
          </tr>
          <tr>
            <td><strong>Harga</strong></td>
            <td>Rp ${price}</td>
          </tr>
         <tr>
            <td><strong>Metode Pembayaran</strong></td>
            <td>${payment_method}</td>
          </tr>
          <tr>
            <td><strong>Status Pembayaran</strong></td>
            <td>${payment_status}</td>
          </tr>
           <tr>
            <td><strong>Status Pengiriman Voucher</strong></td>
            <td>${delivery_status}</td>
          </tr>
          <tr>
            <td><strong>Tanggal</strong></td>
            <td>${date}</td>
          </tr>
        </table>
  
        <p style="margin-top: 20px;">Voucher sudah diproses oleh admin. Jika ada kendala, silakan hubungi support kami.</p>
        
        <p style="text-align: center; color: #888; margin-top: 30px;">Terima kasih telah menggunakan layanan kami.</p>
      </div>
    `;
};
exports.generateInvoiceTemplate = generateInvoiceTemplate;
