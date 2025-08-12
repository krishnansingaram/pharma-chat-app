import React, { useState, useRef, useEffect } from 'react';
import './index.css';

function ChatInterface({ ocrText }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (ocrText) {
      setIsLoading(true);
      setMessages([{ sender: 'ai', text: 'Analyzing your prescription, one moment...' }]);
      
      fetch('http://localhost:3001/api/process-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: ocrText }),
      })
      .then(res => res.json())
      .then(data => {
        setMessages([{ sender: 'ai', text: data.analysis }]);
      })
      .catch(() => {
        setMessages([{ sender: 'ai', text: 'Error: Could not analyze the prescription.' }]);
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  }, [ocrText]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const history = newMessages.map(msg => ({
      role: msg.sender === 'ai' ? 'assistant' : 'user',
      content: msg.text
    }));
    
    try {
      const response = await fetch('http://localhost:3001/api/process-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, history: history.slice(0, -1) }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.analysis }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Error: Could not get a response.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-interface">
      <div className="chat-messages p-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message chat-message-${msg.sender}`}>{msg.text}</div>
        ))}
        {isLoading && <div className="chat-message chat-message-ai">...</div>}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-input-area d-flex border-top">
        <input
          className="form-control border-0"
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button className="btn btn-primary" onClick={handleSend} disabled={!input.trim() || isLoading}>Send</button>
      </div>
    </div>
  );
}

export default ChatInterface; 