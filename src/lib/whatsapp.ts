export async function sendWhatsAppMessage(to: string, body: string) {
  // Ensure the number has the exact format Meta requires (no '+' sign)
  const cleanTo = to.startsWith('+') ? to.slice(1) : to;
  
  console.log(`[WhatsApp API] Attempting to send message to: ${cleanTo} using Phone Number ID: ${process.env.WHATSAPP_PHONE_NUMBER_ID}`);
  
  const res = await fetch(
    `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: cleanTo,
        type: "text",
        text: { body },
      }),
    }
  );
  const data = await res.json();
  if (!res.ok) {
    console.error("WhatsApp API Error:", data);
    throw new Error(`WhatsApp API error: ${JSON.stringify(data)}`);
  }
  return data;
}
