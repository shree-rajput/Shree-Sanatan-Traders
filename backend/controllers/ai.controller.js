const Groq = require("groq-sdk");
const dotenv = require("dotenv");
dotenv.config();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.agricultureChat = async (req, res) => {

  try {

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const completion =
      await groq.chat.completions.create({

        messages: [
{
  role: "system",
  content: `

You are an expert Agriculture AI Assistant for Shree Sanatan Traders.

Your job is to help farmers with:
- irrigation
- fertilizers
- pesticides
- crop diseases
- farming costs
- farming equipment
- seasonal farming advice

IMPORTANT RESPONSE RULES:

1. Always keep answers SHORT and structured.

2. Never give huge paragraphs.

3. Always format answers like this:

🌾 Problem:
(Explain the issue shortly)

✅ Recommendation:
(Give practical farming advice)

🛒 Products Needed:
(List useful products in bullet points)

💰 Estimated Cost:
(Give rough estimate if possible)

⚠️ Tips:
(Give important warning or suggestion)

4. Use bullet points whenever possible.

5. Use simple farmer-friendly language.

6. If user asks unrelated question:
Reply ONLY:
"I can only help with agriculture related questions."

7. Keep answers visually clean and mobile friendly.

`
},
          {
            role: "user",
            content: message,
          },
        ],

        model: "llama-3.1-8b-instant",
      });

    const reply =
      completion.choices[0]?.message?.content;

    res.json({
      success: true,
      reply,
    });

  } catch (err) {

console.log(
  "AI ERROR =>",
  err.response?.data || err.message || err
);


    res.status(500).json({
      success: false,
      message: err.message || "AI is temporarily unavailable",

    });
  }
};