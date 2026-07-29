const run = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/battle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        problem: "which city is best to live",
        model_1: "deepseek",
        model_2: "cohere",
        judge_model: "gemini"
      })
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response Body:', text);
  } catch (err) {
    console.error('Error:', err);
  }
};
run();
