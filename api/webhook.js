import fetch from 'node-fetch';

const TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('Use POST');
  }

  try {
    const body = req.body;
    console.log('Incoming update:', JSON.stringify(body, null, 2));

    const chatId = body.message?.chat?.id;
    const text = body.message?.text;

    if (chatId && text) {
      const resp = await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `Вы написали: ${text}`
        }),
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error('Telegram API error:', errorText);
      }
    } else {
      console.log('No message text or chat ID found in update.');
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(200).send('Error handled');
  }
}
