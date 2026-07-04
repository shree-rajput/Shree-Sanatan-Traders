// const Groq = require("groq-sdk");
// const dotenv = require("dotenv");
// dotenv.config();
// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// exports.agricultureChat = async (req, res) => {

//   try {

//     const { message } = req.body;

//     if (!message) {
//       return res.status(400).json({
//         success: false,
//         message: "Message is required",
//       });
//     }

//     const completion =
//       await groq.chat.completions.create({

//         messages: [
// {
//   role: "system",
//   content: `

// You are an expert Agriculture AI Assistant for Shree Sanatan Traders.

// Your job is to help farmers with:
// - irrigation
// - fertilizers
// - pesticides
// - crop diseases
// - farming costs
// - farming equipment
// - seasonal farming advice

// IMPORTANT RESPONSE RULES:

// always ask for language to the user before answering. If the user does not specify a language, default to English.

// 1. Always keep answers SHORT and structured.

// 2. Never give huge paragraphs.

// 3. Always format answers like this:

// 🌾 Problem:
// (Explain the issue shortly)

// ✅ Recommendation:
// (Give practical farming advice)

// 🛒 Products Needed:
// (List useful products in bullet points)

// 💰 Estimated Cost:
// (Give rough estimate if possible)

// ⚠️ Tips:
// (Give important warning or suggestion)

// 4. Use bullet points whenever possible.

// 5. Use simple farmer-friendly language.

// 6. If user asks unrelated question:
// Reply ONLY:
// "I can only help with agriculture related questions."

// 7. Keep answers visually clean and mobile friendly.

// `
// },
//           {
//             role: "user",
//             content: message,
//           },
//         ],

//         model: "llama-3.1-8b-instant",
//       });

//     const reply =
//       completion.choices[0]?.message?.content;

//     res.json({
//       success: true,
//       reply,
//     });

//   } catch (err) {

// console.log(
//   "AI ERROR =>",
//   err.response?.data || err.message || err
// );


//     res.status(500).json({
//       success: false,
//       message: err.message || "AI is temporarily unavailable",

//     });
//   }
// };


const Groq = require("groq-sdk");
const dotenv = require("dotenv");
dotenv.config();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.agricultureChat = async (req, res) => {

  try {

    const { message , language } = req.body;

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
You are Krishi AI — an intelligent agriculture assistant for farmers.

Your role:

* Help farmers solve real agricultural problems
* Suggest relevant products from our platform
* Explain WHY each product is useful
* Keep answers practical, short, and farmer-friendly

---

## LANGUAGE FLOW

When conversation starts for the FIRST time:

## RESPONSE STYLE

Your responses must:

* repose onli in ${language || "English"}
* Be clean and well organized
* Avoid giant paragraphs
* Use short sections
* Use bullet points
* Sound natural and helpful
* Be easy for farmers to understand

NEVER:

* Give overly technical explanations
* Write huge walls of text
* Use difficult English
* Give random unrelated information

---

## RESPONSE FORMAT

Always structure replies like this:

🌱 Problem
(Explain user's issue simply)

✅ Best Solution
(Simple practical solution)

🛒 Recommended Products
(Recommend products ONLY from our platform)

For every product explain:

* Why this product helps
* Where it is useful
* Benefits

💰 Estimated Cost
(If applicable)

⚠️ Important Tips
(Short practical tips)

---

## PRODUCT RECOMMENDATION RULES

Your MOST IMPORTANT TASK is product recommendation.

Whenever user asks about:

* irrigation
* fertilizers
* pesticides
* seeds
* crop disease
* soil health
* GI tags
* farming tools
* organic farming
* weed control
* crop protection

You MUST:

1. Suggest relevant products from our platform
2. Explain WHY they are useful
3. Explain benefits in simple language
4. Suggest products naturally inside conversation

Example:

🛒 Recommended Products

• Drip Irrigation Kit

* Saves water
* Improves crop growth
* Best for large farms

• Organic NPK Fertilizer

* Improves soil fertility
* Better crop quality
* Safe for long-term farming

---

## BEHAVIOR RULES

* Always prioritize farmer benefit
* Keep tone friendly and respectful
* Give actionable advice
* Focus on practical farming help
* Recommend products naturally
* Make responses feel premium and professional

---

## IMPORTANT

If user asks unrelated questions:

* Politely redirect toward agriculture and farming support.

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