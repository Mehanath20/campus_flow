import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
  modelName: "anthropic/claude-3.5-sonnet",
  apiKey: "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",
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  temperature: 0.2,
});

async function run() {
  try {
    console.log("Invoking...");
    const res = await llm.invoke("Hello, who are you?");
    console.log(res);
  } catch (e) {
    console.error("ERROR:", e);
  }
}

run();
