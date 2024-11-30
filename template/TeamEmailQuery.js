export const TeamEmailQuery = (email,query)=>{
    return `
      <p><strong>A new client query has been submitted:</strong></p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${query}</p>
      <p>Please follow up with the client as soon as possible.</p>
    `
}