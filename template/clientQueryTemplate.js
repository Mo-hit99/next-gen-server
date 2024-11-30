export const clientQueryTemplate = (email,query) =>{
    return  `
    <p>Dear User,</p>
    <p>Thank you for contacting us through our query form. We have received your message and will get back to you as soon as possible.</p>
    <p><strong>Here are the details of your submission:</strong></p>
    <ul>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Message:</strong> ${query}</li>
    </ul>
    <p>Our team is reviewing your request and will respond within 24-48 hours. If your query is urgent, feel free to reach us at u9120307@gmail.com.</p>
    <p>We appreciate your patience and look forward to assisting you.</p>
    <p>Best regards,</p>
    <p>Your Team at NextGenClothes</p>
    <p>u9120307@gmail.com</p>
  `
}