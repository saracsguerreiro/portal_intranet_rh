import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import ChatAgente from './ChatAgente';

export default function Layout() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onChatOpen={() => setChatOpen(true)} />
      <main className="pt-20">
        <Outlet />
      </main>
      <ChatAgente open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
