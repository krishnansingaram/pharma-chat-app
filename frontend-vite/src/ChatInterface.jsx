import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.min.css';

function ChatInterface({ ocrText }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

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

  // Highlight code blocks after messages update
  useEffect(() => {
    hljs.highlightAll();
  }, [messages]);

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
        body: JSON.stringify({ text: userMessage.text, history: history.slice(0, -1) }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.analysis }] );
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Error: Could not get a response.' }] );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const autoResizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const maxHeight = 160; // px
    el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px';
  };

  useEffect(() => { autoResizeTextarea(); }, [input]);

  const toHtml = (text) => {
    const md = String(text ?? '');
    const rawHtml = marked.parse(md, { breaks: true, gfm: true, headerIds: false, mangle: false });
    const clean = DOMPurify.sanitize(rawHtml, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['img', 'iframe', 'video', 'audio', 'style', 'script']
    });
    return clean.replace(/<a\s/gi, '<a target="_blank" rel="noopener noreferrer" ');
  };

  return (
    <div className="chat-interface">
      <div className="chat-messages p-3">
        {messages.map((msg, idx) => {
          const isAi = msg.sender === 'ai';
          return (
            <div key={idx} className={`chat-message chat-message-${msg.sender}`}>
              <div className="chat-avatar" aria-hidden="true">{isAi ? 'AI' : 'You'}</div>
              <div className="chat-message-bubble">
                <div
                  className="chat-message-content"
                  dangerouslySetInnerHTML={{ __html: toHtml(msg.text) }}
                />
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="chat-message chat-message-ai">
            <div className="chat-avatar" aria-hidden="true">AI</div>
            <div className="chat-message-bubble">...</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-input-area d-flex border-top">
        <textarea
          ref={textareaRef}
          className="form-control border-0 chat-textarea"
          rows={1}
          placeholder="Type a message (Shift+Enter for newline)"
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