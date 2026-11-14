import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { capturarErroProducao } from '../lib/errorMonitoring';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  constructor(props: Props) {
    super(props);
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
    capturarErroProducao(error, { componentStack: errorInfo.componentStack || '' });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f8fafc] text-stone-900 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl max-w-md w-full text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-stone-900">
              Ops! Algo inesperado aconteceu.
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Ocorreu um erro inesperado ao carregar a interface. Clique abaixo para recarregar com segurança.
            </p>

            {this.state.error && (
              <div className="p-3 bg-stone-50 rounded-xl text-left font-mono text-[11px] text-red-600 overflow-x-auto max-h-40 border border-red-200 space-y-2">
                <div className="font-bold">{this.state.error.message}</div>
                {this.state.error.stack && (
                  <details className="text-[10px] text-stone-600">
                    <summary className="cursor-pointer font-semibold text-stone-700">Ver linha e detalhes técnicos</summary>
                    <pre className="mt-1 whitespace-pre-wrap break-all">{this.state.error.stack}</pre>
                  </details>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Recarregar Aplicação</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
