import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function categorizeTask(title, description) {
  const chatCompletion = await getGroqChatCompletion(title, description);
  console.log("Response from Groq API:", chatCompletion);
  return chatCompletion.choices[0]?.message?.content || 'Uncategorized2';
}

async function getGroqChatCompletion(title, description) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Categorize this task based on its title and description:\nTitle: "${title}"\nDescription: "${description}"\n\nAvailable categories:
        \n Praca
        \n Studia
        \n Zakupy
        \n Zdrowie i Fitness
        \n Hobby
        \n Dom i Ogród
        \n Spotkania towarzyskie
        \n Projekty Osobiste
        \n Finanse
        \n Rozwój osobisty
        \nPlease respond with categories listed above not number only for the category, or 'Uncategorized' if you cannot determine the category.`,
      },
    ],
    model: "llama3-8b-8192", // Change this to the model you want to use
    temperature: 0.5,
    max_tokens: 60,
    top_p: 1,
    stream: false, // Change to true if you want streaming output
  });
}
