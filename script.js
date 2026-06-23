const sendBtn = document.getElementById('send-btn');
const questionInput = document.getElementById('question-input');
const chatBox = document.getElementById('chat-box');

sendBtn.addEventListener('click', async function() {
  const question = questionInput.value.trim();
  const subject = document.getElementById('subject-select').value;

  if (question === '') return;

  // User ka message dikhao
  const userMsg = document.createElement('div');
  userMsg.className = 'message user-message';
  userMsg.textContent = question;
  chatBox.appendChild(userMsg);
  questionInput.value = '';
  chatBox.scrollTop = chatBox.scrollHeight;

  // "Thinking..." bubble dikhao
  const thinkingMsg = document.createElement('div');
  thinkingMsg.className = 'message ai-message';
  thinkingMsg.textContent = 'Thinking...';
  chatBox.appendChild(thinkingMsg);


try {
    const response = await fetch('https://jee-solver-agent.onrender.com/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_query: question,
        subject: subject
      })
    });

    const data = await response.json();

    // "Thinking..." replace karo real answer se
    thinkingMsg.innerHTML = marked.parse(data.answer);
    renderMathInElement(thinkingMsg, {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
    ]
    });
    // Feedback buttons banana
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'feedback-btns';
    feedbackDiv.innerHTML = `
    <span style="font-size:12px; color:#888;">Was this helpful?</span>
    <button class="fb-btn" data-status="Correct">👍</button>
    <button class="fb-btn" data-status="Incorrect">👎</button>
    `;
    thinkingMsg.appendChild(feedbackDiv);

    // Button click pe feedback bhejo
    feedbackDiv.querySelectorAll('.fb-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
    const status = this.dataset.status;

    // Buttons disable karo — ek baar hi click ho
    feedbackDiv.querySelectorAll('.fb-btn').forEach(b => b.disabled = true);
    feedbackDiv.querySelector('span').textContent = status === 'Correct' ? '✅ Thanks!' : '❌ Got it!';

    // Backend ko bhejo
    await fetch('https://jee-solver-agent.onrender.com/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_query: question,
        ai_answer: data.answer,
        status: status
      })
    });
  });
});

  } catch (error) {
    thinkingMsg.textContent = 'Something went wrong. Try again!';
  }

  chatBox.scrollTop = chatBox.scrollHeight;
});
questionInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});
