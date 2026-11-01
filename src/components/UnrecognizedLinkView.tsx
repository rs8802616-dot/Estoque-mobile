import React from 'react';
import { ShieldAlert, Link2Off } from 'lucide-react';

export const UnrecognizedLinkView: React.FC = () => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#090d16] p-4 select-none"
      style={{ zIndex: 9999999 }}
    >
      {/* Background radial sutil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 30%, #1e293b 0%, #090d16 75%)',
        }}
      />

      <div className="relative bg-[#0f172a] border border-slate-800 rounded-3xl max-w-md w-full p-8 text-center shadow-2xl space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
          <Link2Off className="w-8 h-8" />
        </div>

        <div className="space-y-2.5">
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
            Endereço Incompleto — Link de acesso não reconhecido
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            O link utilizado não contém informações de loja ou de acesso. Verifique o endereço ou utilize o link oficial fornecido pelo seu estabelecimento.
          </p>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-500">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Acesso protegido por validação de token exclusivo</span>
        </div>
      </div>
    </div>
  );
};

export default UnrecognizedLinkView;
