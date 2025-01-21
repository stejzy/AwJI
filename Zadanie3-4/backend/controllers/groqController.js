import { Groq } from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateSeoDescription(product) {
    try {
        return await getGroqChatCompletion(product.name, product.description, product.unitPrice, product.unitWeight, product.category);
    } catch (err) {
        console.error('Error generating SEO description:', err);
        throw new Error('Failed to generate SEO description');
    }
}


async function getGroqChatCompletion(name, description, price, weight, category) {
    const prompt = `
        Create an SEO-optimized HTML description for the following product:
        Name: ${name}
        Description: ${description}
        Price: ${price}
        Weight: ${weight}
        Category: ${category}
        
        The description should be HTML formatted, containing:
        - A clear and concise product introduction
        - Features and benefits
        - Relevant keywords for SEO optimization
        - A call-to-action (e.g., Buy Now)

        The description should be professional, informative, and persuasive. Don't write additional text, only using html and dont use html, head, body tags.
        Treat this as the message you will say will be displayed in description of this product on some website so don't write additional information besides description.
        Don't include informations about price or category. Use polish language.
    `;
  
    const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 300,
        top_p: 1,
        stream: false
    });
    
    return response.choices[0]?.message?.content || '';
}