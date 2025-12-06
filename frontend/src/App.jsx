import React, { useEffect, useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMessages() {
      try {
        const response = await fetch('/api/messages');
        if (!response.ok) {
          throw new Error('Failed to load messages');
        }
        const data = await response.json();
        setMessages(data.messages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Fullstack Starter</h1>
        <p>React + Express + Prisma + Postgres</p>
      </header>
      {loading && <p className="info">Loading messages...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <ul className="messages">
          {messages.map((message) => (
            <li key={message.id}>
              <span className="created">{new Date(message.createdAt).toLocaleString()}</span>
              <p>{message.text}</p>
            </li>
          ))}
          {messages.length === 0 && <li>No messages found. Run the seed script!</li>}
        </ul>
      )}
    </div>
  );
}

export default App;
