import React, { useState, useRef, useEffect } from 'react';
import './index.css';

function ChatInterface() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! How can I assist you with your prescription today?' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      setMessages(msgs => [...msgs, { sender: 'ai', text: 'This is a demo AI response.' }]);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-interface card mt-4 mb-4 mx-auto">
      <div className="card-body p-0">
        <div className="chat-messages p-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message chat-message-${msg.sender}`}>{msg.text}</div>
          ))}
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
          />
          <button className="btn btn-primary" onClick={handleSend} disabled={!input.trim()}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface; 