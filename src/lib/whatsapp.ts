export async function sendWhatsAppMessage(to: string, body: string) {
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
        to,
        type: "text",
        text: { body },
      }),
    }
  );
  
  const data = await res.json();
  if (!res.ok) {
    console.error("WhatsApp API Error:", JSON.stringify(data, null, 2));
  } else {
    console.log("WhatsApp message sent successfully!", data);
  }
  
  return data;
}
