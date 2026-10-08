document.addEventListener('DOMContentLoaded', () => {
    // Check if running via file:// instead of http://
    if (window.location.protocol === 'file:') {
        alert('CRITICAL ERROR: You opened index.html directly by double-clicking it.\n\nYou MUST run "python app.py" and visit http://127.0.0.1:5000 in your browser for the AI features to work.');
    }

    // --- Tab Navigation ---
    const navLinks = document.querySelectorAll('.nav-links li');
    const tabContents = document.querySelectorAll('.tab-content');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active class from all
            navLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add to clicked
            link.classList.add('active');
            const targetTab = link.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // --- Initialize AI App Functionality ---
    function initApp() {
        console.log("App ready!");

        // Chatbot Logic
        const chatInput = document.getElementById('chat-input');
        const chatSendBtn = document.getElementById('chat-send');
        const chatMessages = document.getElementById('chat-messages');

        function appendMessage(text, isUser) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;

            if (isUser) {
                msgDiv.textContent = text;
            } else {
                // Parse markdown for AI responses if marked is available
                if (typeof marked !== 'undefined') {
                    msgDiv.innerHTML = marked.parse(text);
                } else {
                    msgDiv.textContent = text;
                }
            }

            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Auto-expand textarea
        chatInput.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });

        async function handleChat() {
            const text = chatInput.value.trim();
            if (!text) return;

            appendMessage(text, true);
            chatInput.value = '';
            chatInput.style.height = 'auto'; // Reset height

            const typingDiv = document.createElement('div');
            typingDiv.className = 'message ai-message';
            typingDiv.textContent = 'Typing...';
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text })
                });
                const data = await response.json();
                chatMessages.removeChild(typingDiv);

                if (data.error) {
                    appendMessage('Error: ' + data.error, false);
                } else {
                    appendMessage(data.response, false);
                }
            } catch (e) {
                if (chatMessages.contains(typingDiv)) {
                    chatMessages.removeChild(typingDiv);
                }
                appendMessage('Error communicating with backend.', false);
                console.error(e);
            }
        }

        chatSendBtn.addEventListener('click', handleChat);
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleChat();
            }
        });


        // Essay Logic
        const essayGenerateBtn = document.getElementById('essay-generate');
        const essayTopic = document.getElementById('essay-topic');
        const essayLength = document.getElementById('essay-length');
        const essayTone = document.getElementById('essay-tone');
        const essayOutput = document.getElementById('essay-output');
        const essayLoading = document.getElementById('essay-loading');

        essayGenerateBtn.addEventListener('click', async () => {
            const topic = essayTopic.value.trim();
            if (!topic) return;

            essayLoading.classList.remove('hidden');
            essayOutput.value = '';

            try {
                const response = await fetch('/api/essay', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        topic: topic,
                        length: essayLength.value,
                        tone: essayTone.value
                    })
                });
                const data = await response.json();

                if (data.error) {
                    essayOutput.value = 'Error: ' + data.error;
                } else {
                    essayOutput.value = data.response;
                }
            } catch (e) {
                essayOutput.value = 'Failed to generate essay.';
            } finally {
                essayLoading.classList.add('hidden');
            }
        });


        // Q&A Logic
        const qaAskBtn = document.getElementById('qa-ask');
        const qaInput = document.getElementById('qa-input');
        const qaOutput = document.getElementById('qa-output');
        const qaLoading = document.getElementById('qa-loading');

        qaAskBtn.addEventListener('click', async () => {
            const question = qaInput.value.trim();
            if (!question) return;

            qaLoading.classList.remove('hidden');
            qaOutput.innerHTML = '';

            try {
                const response = await fetch('/api/qa', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question: question })
                });
                const data = await response.json();

                if (data.error) {
                    qaOutput.textContent = 'Error: ' + data.error;
                } else {
                    const answer = data.response;
                    if (typeof marked !== 'undefined') {
                        qaOutput.innerHTML = marked.parse(answer);
                    } else {
                        qaOutput.textContent = answer;
                    }
                }
            } catch (e) {
                qaOutput.textContent = 'Failed to get answer.';
            } finally {
                qaLoading.classList.add('hidden');
            }
        });

        // Image Lab Logic
        const imageGenerateBtn = document.getElementById('image-generate');
        const imagePrompt = document.getElementById('image-prompt');
        const imageResult = document.getElementById('image-result');
        const generatedImg = document.getElementById('generated-img');
        const imageLoading = document.getElementById('image-loading');
        const imageDownload = document.getElementById('image-download');

        imageGenerateBtn.addEventListener('click', async () => {
            const prompt = imagePrompt.value.trim();
            if (!prompt) return;

            imageLoading.classList.remove('hidden');
            imageResult.classList.add('hidden');

            try {
                const response = await fetch('/api/generate-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: prompt })
                });

                const data = await response.json();

                if (data.image_url) {
                    generatedImg.src = data.image_url;
                    imageDownload.href = data.image_url;

                    generatedImg.onload = () => {
                        imageLoading.classList.add('hidden');
                        imageResult.classList.remove('hidden');
                        if (typeof lucide !== 'undefined') lucide.createIcons();
                    };
                } else {
                    alert('Error: ' + (data.error || 'Failed to generate image'));
                    imageLoading.classList.add('hidden');
                }
            } catch (e) {
                console.error(e);
                alert('Image Lab Error: ' + e.message);
                imageLoading.classList.add('hidden');
            }
        });
    }

    // Start the app directly
    initApp();
});
