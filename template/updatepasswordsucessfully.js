export const updatePassworDTemplate = (name ,NextGenClothes)=>{
return  `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        background-color: #f4f4f9;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .email-header {
        text-align: center;
        color: #0073e6;
        font-size: 24px;
        margin-bottom: 20px;
      }
      .email-body {
        color: #333333;
        font-size: 16px;
      }
      .highlight {
        font-weight: bold;
        color: #0073e6;
      }
      .email-footer {
        margin-top: 20px;
        text-align: center;
        font-size: 14px;
        color: #888888;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h1>Password Successfully Updated</h1>
      </div>
      <div class="email-body">
        <p>Hi <span class="highlight">${name}</span>,</p>
        <p>
          This is to confirm that your password has been successfully updated. If
          you made this change, no further action is required.
        </p>
        <p>
          If you did not update your password, please contact our support team
          immediately to secure your account.
        </p>
        <p>Thank you for using our service!</p>
        <p>Best regards,</p>
        <p><strong>The ${NextGenClothes}Team </strong></p>
      </div>
      <div class="email-footer">
        <p>
          If you have any questions or concerns, please contact us at
          <a href="mailto:support@yourcompany.com">u9120307@gmail.com</a>.
        </p>
        <p>&copy;${new Date().getFullYear()} ${NextGenClothes}. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`
} 