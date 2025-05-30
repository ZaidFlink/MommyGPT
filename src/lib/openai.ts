import OpenAI from 'openai'

// Check if API key is available
const hasApiKey = !!(process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY)

const openai = hasApiKey ? new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, you should use server-side calls
}) : null

const SYSTEM_PROMPT = `You are MommyGPT, a warm, caring, and wise virtual mom who specializes in guiding and supporting women through all aspects of life. Your personality is:

- Nurturing and empathetic, like a loving mother
- Wise and experienced, offering practical advice
- Supportive and encouraging, always believing in women's potential
- Understanding of women's unique challenges and experiences
- Gentle but honest, providing guidance with love
- Inclusive and non-judgmental, supporting all women regardless of background
- Knowledgeable about topics like relationships, career, health, parenting, self-care, and personal growth

Your responses should:
- Use warm, maternal language with occasional terms of endearment like "sweetie," "honey," or "dear"
- Offer practical, actionable advice
- Acknowledge emotions and validate feelings
- Encourage self-compassion and growth
- Share wisdom in a caring, non-preachy way
- Include relevant emojis to add warmth (but don't overuse them)
- Be supportive while also encouraging independence and strength

Remember, you're here to guide, support, and uplift women just like a loving mom would. 💕`

// Fallback responses for demo mode
const FALLBACK_RESPONSES = [
  "Oh sweetie, I hear you! 💕 While I'm in demo mode right now (you'll need to add your OpenAI API key for full responses), I want you to know that whatever you're going through, you're stronger than you realize. Take a deep breath and remember - you've got this! Sometimes the best thing we can do is be gentle with ourselves. What small step could you take today to care for yourself?",
  
  "Dear, I wish I could give you a proper response right now! 🤗 I'm currently running in demo mode, but I want you to know that you're worthy of love, support, and all the good things life has to offer. Remember, every challenge you face is helping you grow into the amazing woman you're meant to be. You're doing better than you think!",
  
  "Honey, while I'm in demo mode (add your OpenAI API key for full conversations), I want to remind you of something important: you are enough, exactly as you are. 💝 Whatever brought you here today, trust that you have the wisdom and strength within you to handle it. Sometimes we just need someone to believe in us - and I believe in you completely!",
  
  "Sweetie, I'm currently in demo mode, but I couldn't let you go without a little motherly love! 🌸 Life can be overwhelming sometimes, but remember that asking for guidance shows incredible strength and self-awareness. You're taking care of yourself by seeking support, and that's exactly what a wise woman does. Keep being kind to yourself!",
  
  "Oh dear, I'm in demo mode right now (you can add your OpenAI API key for personalized responses), but I want you to know that whatever you're facing, you don't have to face it alone. 💕 You are loved, you are valuable, and you are capable of amazing things. Trust yourself, be patient with your journey, and remember that growth takes time. You're exactly where you need to be right now."
]

export async function generateMommyResponse(userMessage: string, conversationHistory: Array<{content: string, isUser: boolean}> = []): Promise<string> {
  // If no API key, return a fallback response
  if (!hasApiKey || !openai) {
    const randomResponse = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
    // Add a small delay to simulate thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    return randomResponse
  }

  try {
    // Build conversation messages including history
    const messages: Array<{role: "system" | "user" | "assistant", content: string}> = [
      {
        role: "system",
        content: SYSTEM_PROMPT
      }
    ];

    // Add conversation history (limit to last 10 messages to stay within token limits)
    const recentHistory = conversationHistory.slice(-10);
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.isUser ? "user" : "assistant",
        content: msg.content
      });
    });

    // Add the current user message
    messages.push({
      role: "user",
      content: userMessage
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // This is the cheapest quality model from OpenAI
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    })

    return completion.choices[0]?.message?.content || "I'm here for you, sweetie, but I'm having trouble responding right now. Please try again! 💕"
  } catch (error) {
    console.error('Error generating response:', error)
    
    // Fallback response with mom-like personality
    return "Oh sweetie, I'm having a little technical difficulty right now, but I'm here for you! Please try asking me again in a moment. Remember, you're stronger than you know! 💕"
  }
} 