process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function testKey() {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "anthropic/claude-3.5-sonnet",
      messages: [{ role: "user", content: "hello" }]
    })
  });
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

testKey();
