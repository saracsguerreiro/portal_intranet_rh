import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';

const BASE = import.meta.env.BASE_URL;

const WELCOME = [
  {
    id: 1,
    sender: 'agent',
    text: 'Olá! Sou a Tânia, agente virtual de RH da TIS. Como posso ajudá-la hoje?',
    time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
  },
];

export default function ChatAgente({ open, onClose }) {
  const [messages, setMessages] = useState(WELCOME);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  function send(e) {
    e.preventDefault();
    const txt = input.trim();
    if (!txt) return;
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'user',
        text: txt,
        time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'agent',
          text: 'Recebi a sua mensagem! Vou verificar e responder em breve.',
          time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  }

  return (
    <div
      role="dialog"
      aria-label="Chat com a Agente RH"
      className={`fixed right-0 top-0 h-screen w-full md:w-1/2 z-50 bg-white flex flex-col
                  transition-transform duration-300 ease-in-out
                  ${open ? 'translate-x-0' : 'translate-x-full'}`}
      style={{ boxShadow: '-4px 0 32px rgba(0,0,0,0.14)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 flex-shrink-0 bg-white">
        <div className="w-12 h-12 rounded-full border-[3px] border-blue-500 overflow-hidden flex-shrink-0">
          <img
            src={`${BASE}agente.png`}
            alt="Tânia — Agente RH"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm leading-tight">Tânia</p>
          <p className="text-xs text-gray-500">Agente Virtual RH · TIS</p>
          <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Online
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Fechar chat"
          className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={19} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-gray-50">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'items-end gap-2.5'}`}
          >
            {msg.sender === 'agent' && (
              <div className="w-7 h-7 rounded-full border-2 border-blue-500 overflow-hidden flex-shrink-0">
                <img src={`${BASE}agente.png`} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="max-w-[78%] space-y-1">
              <div
                className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                  ${msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm'
                  }`}
              >
                {msg.text}
              </div>
              <p className={`text-[11px] text-gray-400 px-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={send}
        className="flex items-center gap-2.5 px-5 py-3.5 border-t border-gray-100 bg-white flex-shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escreva a sua mensagem…"
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 flex items-center justify-center text-white transition-colors flex-shrink-0"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
