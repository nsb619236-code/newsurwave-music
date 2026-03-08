// 1. Start Generation
async function generateSong(prompt) {
  const response = await fetch('https://your-api-endpoint.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: prompt, make_instrumental: false })
  });
  const data = await response.json();
  return data.id; // Task ID
}

// 2. Check Status and Get MP3 URL
async function getMp3Url(taskId) {
  const response = await fetch(`https://your-api-endpoint.com{taskId}`);
  const data = await response.json();
  if (data.status === 'SUCCESS') {
    return data.clips[0].audio_url; // Direct link to MP3
  }
}
