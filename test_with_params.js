const run = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/battle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        problem: "top 5 richest person in the world",
        model_1: "groq",
        model_2: "openai",
        judge_model: "gpt-judge"
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
