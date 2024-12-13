import { Groq } from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateSeoDescription(product) {
    try {
        const description = await getGroqChatCompletion(product.name, product.description, product.unitPrice, product.unitWeight, product.category);
        return description;
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

        The description should be professional, informative, and persuasive.
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