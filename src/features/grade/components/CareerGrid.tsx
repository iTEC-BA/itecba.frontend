import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@components/ui/Input';
import { Search, BookOpen } from 'lucide-react';

const CAREERS = [
  { id: 'sistemas', name: 'Ing. en Sistemas de Información', status: 'available' },
  { id: 'electronica', name: 'Ingeniería Electrónica', status: 'pending' },
  { id: 'industrial', name: 'Ingeniería Industrial', status: 'pending' },
  { id: 'civil', name: 'Ingeniería Civil', status: 'pending' },
  { id: 'mecanica', name: 'Ingeniería Mecánica', status: 'pending' }
];

export const CareerGrid: React.FC = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = CAREERS.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-md flex bg-itec-box border-itec-border">
        <div className="flex items-center pointer-events-none text-itec-muted">
          <Search className="w-4 h-4" />
        </div>
        <Input
          type="text"
          placeholder="Buscar especialidad..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="p-4"
          fullWidth
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((career) => (
          <button
            key={career.id}
            onClick={() => career.status === 'available' && navigate(`/grado/${career.id}`)}
            disabled={career.status !== 'available'}
            className={`flex items-center gap-4 p-5 rounded-xl border text-left transition-all duration-200
              ${career.status === 'available' 
                ? 'bg-itec-box border-itec-border hover:border-itec-blue-skye hover:bg-itec-surface cursor-pointer' 
                : 'bg-itec-bg border-itec-border/40 opacity-60 cursor-not-allowed'}`}
          >
            <div className="p-3 bg-itec-surface rounded-lg border border-itec-border">
              <BookOpen className="w-5 h-5 text-itec-text" />
            </div>
            <div>
              <h4 className={`font-semibold text-sm ${career.status === 'available' ? 'text-white' : 'text-itec-text'}`}>
                {career.name}
              </h4>
              <span className="text-xs text-itec-muted uppercase tracking-wider mt-1 block">
                {career.status === 'available' ? 'Plan de Estudio' : 'Próximamente'}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
