export function createEmbedding(value) {
  fetch("https://api.openai.com/v1/models", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": process.env.OPENAI_API_KEY, 
    },
    body: JSON.stringify({
      prompt: value,
      max_tokens: 32,
      temperature: 0.8,
      top_p: 1.0,
      n: 1,
      stop: "\n",
      echo: false,
      return_prompt: false,
      model: process.env.OPENAI_MODEL,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Embedding:", data.choices[0].embedding);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
