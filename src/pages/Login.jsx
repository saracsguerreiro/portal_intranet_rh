import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  }

  function fillDemo(role) {
    const credentials = {
      admin:    { email: 'admin@tis.co.ao',        password: 'admin123' },
      manager:  { email: 'gestor@tis.co.ao',       password: 'gestor123' },
      employee: { email: 'colaborador@tis.co.ao',  password: 'colab123' },
    };
    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
    setError('');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tis-950 via-tis-900 to-tis-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-tis-700 font-bold text-xl">TIS</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Portal Intranet RH</h1>
          <p className="text-tis-300 text-sm mt-1">Acesso exclusivo a colaboradores TIS</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-gray-800 text-lg font-semibold mb-1">Bem-vindo/a de volta</h2>
          <p className="text-gray-500 text-sm mb-6">Inicie sessão com as suas credenciais corporativas</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email corporativo
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nome@tis.co.ao"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tis-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tis-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-tis-700 hover:bg-tis-800 disabled:bg-tis-400 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
            >
              {loading ? 'A iniciar sessão…' : 'Iniciar Sessão'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center mb-3">Acesso de demonstração</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { role: 'admin',    label: 'Admin RH',   color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
                { role: 'manager',  label: 'Responsável', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
                { role: 'employee', label: 'Colaborador', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
              ].map(({ role, label, color }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => fillDemo(role)}
                  className={`${color} text-xs font-medium py-1.5 px-2 rounded-lg transition-colors`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Ligação encriptada (HTTPS) · Sessão segura
          </p>
        </div>
      </div>
    </div>
  );
}
