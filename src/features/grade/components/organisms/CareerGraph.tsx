import React from 'react';
import { ReactFlow, Background, Controls, Handle, Position, useNodesState, useEdgesState, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CATEGORY_STYLES, type PlanDeEstudio } from '../../types/correlativas';

interface MateriaNodeData {
  title: string;
  level: number;
  codigo: string;
  category: keyof typeof CATEGORY_STYLES;
  cursada: string;
  aprobada: string;
}

// 1. EL DISEÑO DEL NODO (Inspirado en la imagen de requisitos)
const CustomMateriaNode = ({ data }: { data: MateriaNodeData }) => {
  const style = CATEGORY_STYLES[data.category as keyof typeof CATEGORY_STYLES];

  return (
    <div className={`bg-[#0a0a0a] border-[1px] ${style.border} rounded-lg w-64 shadow-2xl hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 relative group overflow-hidden`}>
      <Handle type="target" position={Position.Left} className="w-2 h-6 bg-[#333] border-none rounded-r-md -ml-1" />
      
      {/* HEADER DEL NODO */}
      <div className={`${style.header} p-2.5 text-center border-b border-inherit`}>
        <h3 className="font-bold text-[13px] leading-tight drop-shadow-md">{data.title}</h3>
        <p className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-80">
          NIVEL {data.level} • {data.codigo}
        </p>
        <span className="text-[10px] font-bold text-gray-300 text-right">Cursada: {data.cursada}</span>
        <br />
        <span className="text-[10px] font-bold text-gray-300 text-right">Aprobada: {data.aprobada}</span>
      </div>

      <Handle type="source" position={Position.Right} className="w-2 h-6 bg-[#333] border-none rounded-l-md -mr-1" />
    </div>
  );
};

const nodeTypes = { materia: CustomMateriaNode };

interface CareerGraphProps {
  planData: PlanDeEstudio;
}

export const CareerGraph: React.FC<CareerGraphProps> = ({ planData }) => {
  // Aplicamos puntas de flecha a todas las aristas dinámicamente
  const initialEdges = planData.edges.map(edge => ({
    ...edge,
    markerEnd: { type: MarkerType.ArrowClosed, color: edge.style?.stroke },
  }));

  const [nodes, , onNodesChange] = useNodesState(planData.nodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-full bg-[#0C1014] rounded-2xl overflow-hidden border border-itec-gray relative shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
      
      {/* LEYENDA FLOTANTE */}
      <div className="absolute bottom-6 right-6 z-20 bg-itec-surface border border-itec-gray p-4 rounded-xl shadow-2xl flex flex-col gap-2">
        <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-widest">Leyenda</h4>
        <div className="flex items-center gap-2">
           <div className="w-6 h-0.5 bg-blue-500"></div><span className="text-[10px] text-gray-400">Regularizar (Cursar)</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-6 h-0.5 bg-red-500 border border-dashed border-transparent" style={{borderTopStyle: 'dashed'}}></div><span className="text-[10px] text-gray-400">Aprobar (Final)</span>
        </div>
      </div>

      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h2 className="text-2xl font-bold text-white drop-shadow-md">{planData.name}</h2>
        <p className="text-gray-400 text-sm">Mapa de correlatividades. Arrastra el lienzo o haz scroll para hacer Zoom.</p>
      </div>

      <ReactFlow
        nodes={nodes} edges={edges} nodeTypes={nodeTypes}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        fitView fitViewOptions={{ padding: 0.1 }} minZoom={0.1}
      >
        <Background color="#2b2b2b" gap={24} size={2} />
        <Controls className="bg-itec-surface border border-itec-gray fill-white" showInteractive={false} />
      </ReactFlow>
    </div>
  );
};