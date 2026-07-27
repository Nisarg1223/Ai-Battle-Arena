const run = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/battle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        problem: "write the code for C++",
        model_1: "openai",
        model_2: "deepseek",
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
