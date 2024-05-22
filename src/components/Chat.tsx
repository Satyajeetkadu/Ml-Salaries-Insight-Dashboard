import React, { useState } from 'react';
import axios from 'axios';

interface Message {
  text: string;
  from: 'user' | 'bot';
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const newMessages = [...messages, { text: input, from: 'user' as const }];
    setMessages(newMessages);
    setInput('');

    setLoading(true);

    try {
      const response = await axios.post('/api/chat', { prompt: input });
      const botMessage = response.data.message;
      setMessages([...newMessages, { text: botMessage, from: 'bot' as const }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages([...newMessages, { text: 'Sorry, something went wrong.', from: 'bot' as const }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Chat with the AI</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.from === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something about ML salaries"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chat;
