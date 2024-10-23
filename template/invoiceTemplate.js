export function invoiceTemplate(customerName,customerAddress,PaymentId,ProductName,TotalQuantity,productPrice,SubProductPrice,subQuantity){
    return ` <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            color: #333;
            background-color: #f8f8f8;
            margin: 0;
            padding: 20px;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #eee;
          }
          .header h1 {
            color: #4CAF50;
            font-size: 28px;
          }
          .invoice-details {
            padding: 20px 0;
            border-bottom: 2px solid #eee;
          }
          .invoice-details h2 {
            font-size: 22px;
            color: #4CAF50;
            margin-bottom: 10px;
          }
          .invoice-details p {
            margin: 0;
            font-size: 16px;
          }
          .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .invoice-table th, .invoice-table td {
            padding: 10px;
            border: 1px solid #eee;
            text-align: left;
          }
          .invoice-table th {
            background-color: #f4f4f4;
            font-size: 14px;
          }
          .invoice-table td {
            font-size: 14px;
          }
          .total-row td {
            font-weight: bold;
            font-size: 16px;
            background-color: #f4f4f4;
          }
          .footer {
            text-align: center;
            padding-top: 20px;
            font-size: 14px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- Header -->
          <div class="header">
            <h1>Next Gen Clothings</h1>
            <p>Your Invoice</p>
          </div>

          <!-- Customer and Invoice Details -->
          <div class="invoice-details">
            <h2>Invoice Details</h2>
            <p><strong>Customer Name:</strong> ${customerName}</p>
            <p><strong>Address:</strong> ${customerAddress}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Payment ID:</strong> ${PaymentId}</p>
          </div>

          <!-- Invoice Table -->
          <table class="invoice-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Sub Quantity</th>
                <th>Total Quantity</th>
                <th>Price (₹)</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${ProductName}</td>
                <td>${subQuantity}</td>
                <td>${TotalQuantity}</td>
                <td>₹ ${SubProductPrice}</td>
                <td>₹ ${(productPrice).toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3"><strong>Subtotal</strong></td>
                <td>₹ ${SubProductPrice}</td>
              </tr>
            </tbody>
          </table>

          <!-- Total Amount -->
          <table class="invoice-table">
            <tbody>
              <tr class="total-row">
                <td colspan="3">Total Amount</td>
                <td>₹ ${productPrice}</td>
              </tr>
            </tbody>
          </table>

          <!-- Footer -->
          <div class="footer">
            <p>Thank you for shopping with Next Gen Clothings!</p>
            <p>If you have any questions, contact us at support@nextgenclothings.com</p>
          </div>
        </div>
      </body>
    </html>
  `
}