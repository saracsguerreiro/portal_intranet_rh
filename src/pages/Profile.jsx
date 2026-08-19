import { useAuth } from '../contexts/AuthContext';
import { Mail, Phone, Briefcase, Building2, Calendar, Award } from 'lucide-react';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-PT', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

function yearsOf(dateStr) {
  const diff = new Date() - new Date(dateStr);
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
}

const ROLE_LABELS = {
  admin:    { label: 'Administrador RH', color: 'bg-purple-100 text-purple-700' },
  manager:  { label: 'Responsável de Departamento', color: 'bg-blue-100 text-blue-700' },
  employee: { label: 'Colaborador TIS', color: 'bg-green-100 text-green-700' },
};

export default function Profile() {
  const { user } = useAuth();
  const role = ROLE_LABELS[user?.role] ?? { label: '', color: '' };
  const tenure = yearsOf(user?.hireDate);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-tis-700 to-tis-500 h-28" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-tis-800 border-4 border-white flex items-center justify-center text-2xl font-bold text-white shadow-lg flex-shrink-0">
              {user?.avatar}
            </div>
            <div className="pb-2">
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.position}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${role.color}`}>
              {role.label}
            </span>
            <span className="text-xs px-3 py-1 rounded-full font-medium bg-tis-50 text-tis-700">
              {user?.department}
            </span>
            {tenure >= 1 && (
              <span className="text-xs px-3 py-1 rounded-full font-medium bg-amber-50 text-amber-700">
                🏅 {tenure} {tenure === 1 ? 'ano' : 'anos'} na TIS
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4 text-sm">Informação de Contacto</h3>
          <div className="space-y-3">
            <InfoRow icon={<Mail size={16} className="text-gray-400" />} label="Email" value={user?.email} />
            <InfoRow icon={<Phone size={16} className="text-gray-400" />} label="Telefone" value={user?.phone} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4 text-sm">Informação Profissional</h3>
          <div className="space-y-3">
            <InfoRow icon={<Briefcase size={16} className="text-gray-400" />} label="Cargo" value={user?.position} />
            <InfoRow icon={<Building2 size={16} className="text-gray-400" />} label="Departamento" value={user?.department} />
            <InfoRow icon={<Calendar size={16} className="text-gray-400" />} label="Data de Entrada" value={formatDate(user?.hireDate)} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-4 text-sm">Resumo</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Anos na TIS', value: tenure, icon: '🏅' },
            { label: 'Departamento', value: user?.department?.split(' ')[0], icon: '🏢' },
            { label: 'Perfil', value: role.label?.split(' ')[0], icon: '👤' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="text-center bg-gray-50 rounded-xl p-4">
              <div className="text-2xl mb-1">{icon}</div>
              <p className="text-lg font-bold text-gray-800">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-tis-50 border border-tis-100 rounded-2xl p-4 text-sm text-tis-700">
        <div className="flex items-center gap-2">
          <Award size={16} />
          <span className="font-medium">Preferências de notificação</span>
        </div>
        <p className="mt-1 text-tis-600 text-xs">
          As preferências de notificação serão configuráveis na próxima versão do portal.
        </p>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value || '—'}</p>
      </div>
    </div>
  );
}
