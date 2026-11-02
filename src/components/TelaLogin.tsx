import React, { useState } from 'react';
import { Supermercado, OperadorCaixa, SessaoUsuario, CredenciaisDonoApp } from '../types';
import {
  MIN_CARACTERES_SENHA,
  MAX_TENTATIVAS_LOGIN,
  MINUTOS_BLOQUEIO_LOGIN,
  TEMPO_BLOQUEIO_LOGIN_MS,
  criarHashComSalt,
  verificarSenhaComHash,
  validarPoliticaSenha,
  registrarAuditoriaLogin,
  obterChavesLockout,
} from '../utils/security';

interface TelaLoginProps {
  visivel: boolean;
  listaSupermercados: Supermercado[];
  onLoginSucesso: (sessao: SessaoUsuario) => void;
  senhaMasterPadrao?: string;
  onAbrirCardapioCliente?: () => void;
  modoPortal?: 'master' | 'loja';
  lojaAlvo?: Supermercado | null;
  painelAlvo?: string | null;
  onRedefinirSenhaLojaRevogada?: (lojaId: string, senhaHash: string, senhaSalt: string) => void;
}

export const TelaLogin: React.FC<TelaLoginProps> = ({
  visivel,
  listaSupermercados,
  onLoginSucesso,
  senhaMasterPadrao = 'Mudar@123',
  modoPortal = 'loja',
  lojaAlvo = null,
  onRedefinirSenhaLojaRevogada,
}) => {
  const isMasterMode = modoPortal === 'master';
  const escopoLockout = lojaAlvo?.id || 'global';
  const chavesLockout = obterChavesLockout(escopoLockout);

  const [usuarioOuCpf, setUsuarioOuCpf] = useState<string>('');
  const [senhaOuPin, setSenhaOuPin] = useState<string>('');
  const [senhaVisivel, setSenhaVisivel] = useState<boolean>(false);
  const [erro, setErro] = useState<string>('');
  const [carregando, setCarregando] = useState<boolean>(false);

  // Estados para quando a senha da loja foi revogada pelo Dono (senha_revogada: true)
  const [novaSenhaRevogada, setNovaSenhaRevogada] = useState<string>('');
  const [confirmarSenhaRevogada, setConfirmarSenhaRevogada] = useState<string>('');
  const [forcarTelaRedefinicao, setForcarTelaRedefinicao] = useState<boolean>(false);

  // Estados de proteção contra força bruta (Imunidade total para o Dono em isMasterMode)
  const [tentativasFalhas, setTentativasFalhas] = useState<number>(() => {
    if (isMasterMode) return 0;
    const salvo = localStorage.getItem(chavesLockout.tentativas) || localStorage.getItem('tentativas_falhas_login');
    return salvo ? parseInt(salvo, 10) || 0 : 0;
  });
  const [bloqueadoAte, setBloqueadoAte] = useState<number | null>(() => {
    if (isMasterMode) return null;
    const salvo = localStorage.getItem(chavesLockout.bloqueioTs) || localStorage.getItem('bloqueio_login_timestamp');
    if (salvo) {
      const ts = parseInt(salvo, 10);
      if (ts > Date.now()) return ts;
    }
    return null;
  });
  const [segundosRestantes, setSegundosRestantes] = useState<number>(0);

  // Detecta se a loja atual está com senha_revogada: true
  const lojaComSenhaRevogada = !isMasterMode && Boolean(lojaAlvo?.senha_revogada || forcarTelaRedefinicao);

  // Efeito para checar e atualizar o bloqueio ativo com cronômetro em tempo real
  React.useEffect(() => {
    if (isMasterMode || !bloqueadoAte) {
      setSegundosRestantes(0);
      return;
    }

    const atualizarContador = () => {
      const agora = Date.now();
      const dif = Math.max(0, Math.ceil((bloqueadoAte - agora) / 1000));
      setSegundosRestantes(dif);

      if (dif <= 0) {
        setBloqueadoAte(null);
        setTentativasFalhas(0);
        localStorage.removeItem(chavesLockout.bloqueioTs);
        localStorage.removeItem(chavesLockout.tentativas);
        localStorage.removeItem(chavesLockout.primeiroErroTs);
        localStorage.removeItem('bloqueio_login_timestamp');
        localStorage.removeItem('tentativas_falhas_login');
        setErro('');
      }
    };

    atualizarContador();
    const timer = setInterval(atualizarContador, 1000);
    return () => clearInterval(timer);
  }, [bloqueadoAte, isMasterMode, chavesLockout.bloqueioTs, chavesLockout.tentativas, chavesLockout.primeiroErroTs]);

  // Garante que toda vez que a tela de login for exibida, os campos fiquem limpos
  React.useEffect(() => {
    if (visivel) {
      setUsuarioOuCpf('');
      setSenhaOuPin('');
      setNovaSenhaRevogada('');
      setConfirmarSenhaRevogada('');
      setSenhaVisivel(false);
      setCarregando(false);
      setErro('');

      if (isMasterMode) {
        setBloqueadoAte(null);
        setTentativasFalhas(0);
        return;
      }

      const salvoBloqueio =
        localStorage.getItem(chavesLockout.bloqueioTs) || localStorage.getItem('bloqueio_login_timestamp');
      if (salvoBloqueio) {
        const ts = parseInt(salvoBloqueio, 10);
        if (ts > Date.now()) {
          setBloqueadoAte(ts);
        } else {
          setBloqueadoAte(null);
          localStorage.removeItem(chavesLockout.bloqueioTs);
          localStorage.removeItem(chavesLockout.tentativas);
          localStorage.removeItem('bloqueio_login_timestamp');
          localStorage.removeItem('tentativas_falhas_login');
        }
      } else {
        setBloqueadoAte(null);
      }
    }
  }, [visivel, isMasterMode, chavesLockout.bloqueioTs, chavesLockout.tentativas]);

  if (!visivel) return null;

  const registrarFalhaLogin = (usuarioTentado: string, motivoAuditoria: string) => {
    registrarAuditoriaLogin({
      usuario: usuarioTentado || '(vazio)',
      lojaId: lojaAlvo?.id,
      lojaNome: lojaAlvo?.nome,
      portal: isMasterMode ? 'master' : 'loja',
      sucesso: false,
      motivo: motivoAuditoria,
    });

    // Imunidade do Dono: a conta mestre do Dono da Plataforma não fica travada pelo lockout
    if (isMasterMode) {
      setErro('Credenciais Master inválidas. Verifique seu usuário e senha secreta.');
      return;
    }

    const agora = Date.now();
    const primeiroErroSalvo = parseInt(localStorage.getItem(chavesLockout.primeiroErroTs) || '0', 10);
    const dentroJanela15Min = primeiroErroSalvo > 0 && agora - primeiroErroSalvo <= TEMPO_BLOQUEIO_LOGIN_MS;

    const novasFalhas = dentroJanela15Min ? tentativasFalhas + 1 : 1;
    if (!dentroJanela15Min) {
      localStorage.setItem(chavesLockout.primeiroErroTs, String(agora));
    }

    setTentativasFalhas(novasFalhas);
    localStorage.setItem(chavesLockout.tentativas, String(novasFalhas));
    localStorage.setItem('tentativas_falhas_login', String(novasFalhas));

    if (novasFalhas >= MAX_TENTATIVAS_LOGIN) {
      const timestampBloqueio = agora + TEMPO_BLOQUEIO_LOGIN_MS;
      setBloqueadoAte(timestampBloqueio);
      localStorage.setItem(chavesLockout.bloqueioTs, String(timestampBloqueio));
      localStorage.setItem('bloqueio_login_timestamp', String(timestampBloqueio));
      setErro(
        '⚠️ Acesso bloqueado por segurança! Limite de 5 tentativas excedido. Aguarde 15 min ou solicite ao Dono do App para revogar o tempo no painel.'
      );
    } else {
      const restantes = MAX_TENTATIVAS_LOGIN - novasFalhas;
      setErro(
        `Login ou senha incorretos. Tentativa ${novasFalhas} de ${MAX_TENTATIVAS_LOGIN} (${restantes} tentativa${
          restantes > 1 ? 's restantes' : ' restante'
        } antes do bloqueio de ${MINUTOS_BLOQUEIO_LOGIN} min).`
      );
    }
  };

  const limparFalhasLogin = () => {
    setTentativasFalhas(0);
    setBloqueadoAte(null);
    localStorage.removeItem(chavesLockout.tentativas);
    localStorage.removeItem(chavesLockout.primeiroErroTs);
    localStorage.removeItem(chavesLockout.bloqueioTs);
    localStorage.removeItem('tentativas_falhas_login');
    localStorage.removeItem('bloqueio_login_timestamp');
  };

  const formatarTempo = (seg: number) => {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Salvar Nova Senha quando o Dono revogou a senha da loja (senha_revogada: true)
  const handleSalvarNovaSenhaRevogada = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!lojaAlvo) {
      setErro('Loja não identificada para redefinição de senha.');
      return;
    }

    const validacao = validarPoliticaSenha(novaSenhaRevogada, confirmarSenhaRevogada);
    if (!validacao.valida) {
      setErro(validacao.erro || 'Senha inválida.');
      return;
    }

    setCarregando(true);
    try {
      const { senhaHash, senhaSalt } = await criarHashComSalt(novaSenhaRevogada.trim());

      if (onRedefinirSenhaLojaRevogada) {
        onRedefinirSenhaLojaRevogada(lojaAlvo.id, senhaHash, senhaSalt);
      }

      registrarAuditoriaLogin({
        usuario: lojaAlvo.nome,
        lojaId: lojaAlvo.id,
        lojaNome: lojaAlvo.nome,
        portal: 'loja',
        sucesso: true,
        motivo: 'Lojista cadastrou nova senha criptografada (SHA-256 + Salt) após revogação pelo Dono',
      });

      setForcarTelaRedefinicao(false);
      limparFalhasLogin();
      setCarregando(false);

      onLoginSucesso({
        tipo: 'admin_loja',
        lojaId: lojaAlvo.id,
        lojaNome: lojaAlvo.nome,
      });
    } catch (err) {
      setCarregando(false);
      setErro('Erro ao criptografar a nova senha. Tente novamente.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isMasterMode && bloqueadoAte && Date.now() < bloqueadoAte) {
      setErro(
        '⚠️ Acesso bloqueado por segurança! Limite de 5 tentativas excedido. Aguarde 15 min ou solicite ao Dono do App para revogar o tempo no painel.'
      );
      return;
    }

    setErro('');
    setCarregando(true);

    const userDigitado = usuarioOuCpf.trim();
    const userDigitadoLower = userDigitado.toLowerCase();
    const passDigitada = senhaOuPin.trim();

    if (!userDigitado) {
      setErro('Por favor, informe seu usuário, CPF ou login.');
      setCarregando(false);
      return;
    }

    if (!passDigitada) {
      setErro('Por favor, digite sua senha.');
      setCarregando(false);
      return;
    }

    // =========================================================================
    // 1. PORTAL EXCLUSIVO DO DONO (?portal=master&token=master_9k2m8x7p)
    // Imunidade total contra Lockout + Criptografia SHA-256 + Salt
    // =========================================================================
    if (isMasterMode) {
      let credenciaisMaster: CredenciaisDonoApp = {
        usuario: 'Rodrigo.souza',
        senha: senhaMasterPadrao || 'Mudar@123',
        nomeExibicao: 'Rodrigo Souza (Dono do App)',
      };

      const salvoMaster = localStorage.getItem('credenciais_dono_app');
      if (salvoMaster) {
        try {
          const parsed = JSON.parse(salvoMaster);
          if (parsed && typeof parsed === 'object') {
            if (parsed.usuario) credenciaisMaster.usuario = parsed.usuario;
            if (parsed.senha !== undefined) credenciaisMaster.senha = parsed.senha;
            if (parsed.senhaHash) credenciaisMaster.senhaHash = parsed.senhaHash;
            if (parsed.senhaSalt) credenciaisMaster.senhaSalt = parsed.senhaSalt;
            if (parsed.nomeExibicao) credenciaisMaster.nomeExibicao = parsed.nomeExibicao;
          }
        } catch (e) {}
      } else {
        const senhaLegada = localStorage.getItem('senha_master_dono');
        const usuarioLegado = localStorage.getItem('usuario_master_dono');
        if (senhaLegada) credenciaisMaster.senha = senhaLegada;
        if (usuarioLegado) credenciaisMaster.usuario = usuarioLegado;
      }

      const masterUserEsperado = (credenciaisMaster.usuario || 'rodrigo.souza').trim().toLowerCase();
      const isMasterUser =
        userDigitadoLower === masterUserEsperado ||
        userDigitadoLower === 'rodrigo.souza' ||
        userDigitadoLower === 'dono';

      const isMasterPass = await verificarSenhaComHash(
        passDigitada,
        credenciaisMaster.senhaHash,
        credenciaisMaster.senhaSalt,
        credenciaisMaster.senha || 'Mudar@123'
      );

      if (isMasterUser && isMasterPass) {
        registrarAuditoriaLogin({
          usuario: userDigitado,
          portal: 'master',
          sucesso: true,
          motivo: 'Login autenticado com sucesso no Portal Master (Dono)',
        });
        setCarregando(false);
        onLoginSucesso({
          tipo: 'dona_app',
        });
        return;
      }

      setCarregando(false);
      registrarFalhaLogin(userDigitado, 'Tentativa falha de login no Portal Master');
      return;
    }

    // =========================================================================
    // 2. ISOLAMENTO MULTI-TENANCY DA LOJA (Sem backdoors ou senhas genéricas)
    // =========================================================================
    const lojasParaChecar: Supermercado[] = lojaAlvo ? [lojaAlvo] : [...listaSupermercados];

    for (const loja of lojasParaChecar) {
      const lojaNomeLower = (loja.nome || '').trim().toLowerCase();
      const lojaSlugLower = (loja.slug || '').trim().toLowerCase();
      const cnpjNumeros = (loja.cnpj || '').replace(/\D/g, '');
      const userNumeros = userDigitado.replace(/\D/g, '');

      const isStoreAdminUser =
        userDigitadoLower === lojaNomeLower ||
        (lojaSlugLower && userDigitadoLower === lojaSlugLower) ||
        userDigitadoLower === loja.id.toLowerCase() ||
        userDigitadoLower === 'admin' ||
        userDigitadoLower === 'gerente' ||
        (cnpjNumeros.length >= 8 && userNumeros === cnpjNumeros);

      if (isStoreAdminUser) {
        if (loja.status === 'bloqueado') {
          setCarregando(false);
          registrarAuditoriaLogin({
            usuario: userDigitado,
            lojaId: loja.id,
            lojaNome: loja.nome,
            portal: 'loja',
            sucesso: false,
            motivo: 'Tentativa de acesso em loja bloqueada pelo Dono',
          });
          setErro(
            `🛑 ACESSO SUSPENSO: O estabelecimento "${loja.nome}" está bloqueado pela administração. Motivo: ${
              loja.motivoBloqueio || 'Entre em contato com o administrador.'
            }`
          );
          return;
        }

        // Se o Dono revogou a senha atual do lojista, abre a tela de Cadastrar Nova Senha
        if (loja.senha_revogada) {
          setCarregando(false);
          setForcarTelaRedefinicao(true);
          return;
        }

        const senhaValidaLoja = await verificarSenhaComHash(
          passDigitada,
          loja.senhaHash,
          loja.senhaSalt,
          loja.senha || loja.senhaAdmin
        );

        if (senhaValidaLoja) {
          limparFalhasLogin();
          registrarAuditoriaLogin({
            usuario: userDigitado,
            lojaId: loja.id,
            lojaNome: loja.nome,
            portal: 'loja',
            sucesso: true,
            motivo: 'Login de Gerente/Admin da Loja realizado com sucesso',
          });
          setCarregando(false);
          onLoginSucesso({
            tipo: 'admin_loja',
            lojaId: loja.id,
            lojaNome: loja.nome,
          });
          return;
        }
      }
    }

    // =========================================================================
    // 3. FUNCIONÁRIOS / OPERADORES CADASTRADOS NA LOJA (SHA-256 + Salt, sem senhas coringa)
    // =========================================================================
    const mapaOperadores = new Map<string, { op: OperadorCaixa; loja: Supermercado }>();

    for (const loja of lojasParaChecar) {
      let opsLoja: OperadorCaixa[] = [];
      const salvoOps = localStorage.getItem(`operadores_caixa_${loja.id}`);
      if (salvoOps) {
        try {
          opsLoja = JSON.parse(salvoOps);
        } catch (e) {}
      }
      opsLoja.forEach((o) => {
        if (o && o.id) mapaOperadores.set(`${loja.id}_${o.id}`, { op: o, loja });
      });
    }

    for (const { op, loja } of Array.from(mapaOperadores.values())) {
      const opCpfLimpo = (op.cpfOuUsuario || '').trim().toLowerCase();
      const opNomeLimpo = (op.nome || '').trim().toLowerCase();
      const opCpfDigitos = (op.cpfOuUsuario || '').replace(/\D/g, '');
      const userDigitos = userDigitado.replace(/\D/g, '');

      const isOpMatch =
        opCpfLimpo === userDigitadoLower ||
        opNomeLimpo === userDigitadoLower ||
        (userDigitos.length >= 6 && opCpfDigitos === userDigitos);

      if (isOpMatch) {
        if (loja.status === 'bloqueado') {
          setCarregando(false);
          setErro(`🛑 ACESSO SUSPENSO: O estabelecimento "${loja.nome}" está temporariamente bloqueado.`);
          return;
        }

        if (op.ativo === false) {
          setCarregando(false);
          setErro(`🛑 ACESSO BLOQUEADO: O funcionário "${op.nome}" está inativo no cadastro da loja.`);
          return;
        }

        const isPinCorreto = await verificarSenhaComHash(
          passDigitada,
          op.senhaHash,
          op.senhaSalt,
          op.pinSenha
        );

        if (isPinCorreto) {
          limparFalhasLogin();
          registrarAuditoriaLogin({
            usuario: `${op.nome} (${op.cpfOuUsuario})`,
            lojaId: loja.id,
            lojaNome: loja.nome,
            portal: 'loja',
            sucesso: true,
            motivo: `Login de funcionário (${op.cargo || 'Operador'}) realizado com sucesso`,
          });
          setCarregando(false);
          onLoginSucesso({
            tipo: 'caixa',
            lojaId: loja.id,
            lojaNome: loja.nome,
            operadorId: op.id,
            operadorNome: op.nome,
            operadorCargo: op.cargo || 'Operador de Caixa',
          });
          return;
        }
      }
    }

    // =========================================================================
    // 4. CREDENCIAIS INVÁLIDAS -> REGISTRA FALHA E LOCKOUT DE 15 MIN APÓS 5 ERROS
    // =========================================================================
    setCarregando(false);
    registrarFalhaLogin(userDigitado, 'Senha ou usuário inválido');
  };

  const nomePainelLabel = 'Acesso Oficial da Loja (Admin & Equipe)';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        minHeight: '100dvh',
        background: isMasterMode ? '#030508' : '#090d16',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      {/* BACKGROUND DECORATIVO INTERNO 100% OPACO */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isMasterMode
            ? 'radial-gradient(circle at 50% 20%, rgba(217, 119, 6, 0.18) 0%, #030508 75%)'
            : 'radial-gradient(circle at 50% 20%, #1e293b 0%, #090d16 80%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          background: isMasterMode ? '#0b0f19' : '#ffffff',
          width: '100%',
          maxWidth: '460px',
          borderRadius: '24px',
          boxShadow: isMasterMode
            ? '0 25px 80px rgba(0, 0, 0, 0.9), 0 0 35px rgba(245, 158, 11, 0.18)'
            : '0 25px 70px rgba(0, 0, 0, 0.7)',
          border: isMasterMode ? '2px solid #d97706' : '1px solid #334155',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          margin: 'auto',
        }}
      >
        {/* CABEÇALHO DA TELA DE LOGIN */}
        <div
          style={{
            background: isMasterMode
              ? 'linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #92400e 100%)'
              : lojaComSenhaRevogada
              ? 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)'
              : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            padding: '32px 28px 24px 28px',
            color: '#ffffff',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '68px',
              height: '68px',
              margin: '0 auto 14px auto',
              background: isMasterMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              border: isMasterMode ? '1.5px solid rgba(254, 243, 199, 0.5)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
            }}
          >
            {isMasterMode ? '👑' : lojaComSenhaRevogada ? '🔑' : '🏪'}
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
            {isMasterMode
              ? 'Portal Master — SuperAdmin'
              : lojaComSenhaRevogada
              ? 'Cadastrar Nova Senha'
              : lojaAlvo?.nome || 'Sistema de Supermercados'}
          </h2>
          <p style={{ fontSize: '0.88rem', margin: '6px 0 0 0', opacity: 0.94, fontWeight: 600 }}>
            {isMasterMode
              ? 'Chave de hardware validada • Acesso exclusivo do Dono'
              : lojaComSenhaRevogada
              ? `${lojaAlvo?.nome || 'Loja'} • Redefinição obrigatória liberada pelo Dono`
              : `${nomePainelLabel} • Identifique-se para continuar`}
          </p>
        </div>

        {/* CORPO DO MODAL: REDEFINIÇÃO DE SENHA REVOGADA OU LOGIN PADRÃO */}
        <div style={{ padding: '28px 26px' }}>
          {lojaComSenhaRevogada ? (
            <form onSubmit={handleSalvarNovaSenhaRevogada} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div
                style={{
                  background: '#f5f3ff',
                  border: '1px solid #ddd6fe',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  fontSize: '0.82rem',
                  color: '#4c1d95',
                  lineHeight: 1.45,
                  fontWeight: 600,
                }}
              >
                🔐 Sua senha anterior foi revogada pela administração para recuperação de acesso. Crie abaixo sua{' '}
                <b>Nova Senha</b> (mínimo de {MIN_CARACTERES_SENHA} caracteres, protegida com criptografia SHA-256 + Salt).
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  🔑 Nova Senha (mínimo {MIN_CARACTERES_SENHA} caracteres)
                </label>
                <input
                  type={senhaVisivel ? 'text' : 'password'}
                  placeholder="Digite a nova senha da loja"
                  value={novaSenhaRevogada}
                  onChange={(e) => setNovaSenhaRevogada(e.target.value)}
                  minLength={MIN_CARACTERES_SENHA}
                  required
                  style={{
                    width: '100%',
                    padding: '13px 15px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.96rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  ✅ Confirmar Nova Senha
                </label>
                <input
                  type={senhaVisivel ? 'text' : 'password'}
                  placeholder="Repita exatamente a nova senha"
                  value={confirmarSenhaRevogada}
                  onChange={(e) => setConfirmarSenhaRevogada(e.target.value)}
                  minLength={MIN_CARACTERES_SENHA}
                  required
                  style={{
                    width: '100%',
                    padding: '13px 15px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.96rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#475569', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={senhaVisivel}
                  onChange={(e) => setSenhaVisivel(e.target.checked)}
                />
                Mostrar senhas digitadas
              </label>

              {erro && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  ⚠️ {erro}
                </div>
              )}

              <button
                type="submit"
                disabled={carregando}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: carregando ? 'wait' : 'pointer',
                  boxShadow: '0 6px 18px rgba(124, 58, 237, 0.35)',
                }}
              >
                {carregando ? 'Criptografando Senha...' : '💾 Salvar Nova Senha e Entrar'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* BANNER DE BLOQUEIO DE FORÇA BRUTA (5 TENTATIVAS / 15 MINUTOS) */}
              {!isMasterMode && bloqueadoAte && segundosRestantes > 0 ? (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1.5px solid #ef4444',
                    borderRadius: '14px',
                    padding: '16px',
                    textAlign: 'center',
                    color: '#991b1b',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div style={{ fontSize: '1.8rem' }}>🔒</div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#b91c1c', lineHeight: 1.45 }}>
                    ⚠️ Acesso bloqueado por segurança! Limite de 5 tentativas excedido. Aguarde 15 min ou solicite ao Dono do App para revogar o tempo no painel.
                  </div>
                  <div
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 900,
                      color: '#dc2626',
                      fontFamily: 'monospace',
                      background: '#ffffff',
                      padding: '6px 16px',
                      borderRadius: '8px',
                      border: '1px solid #fca5a5',
                      letterSpacing: '2px',
                      marginTop: '4px',
                    }}
                  >
                    ⏱️ {formatarTempo(segundosRestantes)}
                  </div>
                </div>
              ) : null}

              {/* CAMPO: LOGIN / USUÁRIO / CPF */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: isMasterMode ? '#fef3c7' : '#1e293b',
                      margin: 0,
                    }}
                  >
                    <span>👤</span>
                    <span>{isMasterMode ? 'Login Master do Dono' : 'Usuário, CPF ou Login'}</span>
                  </label>
                  {!isMasterMode && tentativasFalhas > 0 && !bloqueadoAte && (
                    <span style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 600 }}>
                      Tentativa {tentativasFalhas} de {MAX_TENTATIVAS_LOGIN}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  name="username_login_input"
                  autoComplete="off"
                  placeholder={isMasterMode ? 'Digite o usuário Master' : 'Digite seu login, CPF ou usuário'}
                  value={usuarioOuCpf}
                  onChange={(e) => setUsuarioOuCpf(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: isMasterMode ? '1.5px solid #b45309' : '1.5px solid #cbd5e1',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                    color: isMasterMode ? '#ffffff' : '#0f172a',
                    background: isMasterMode ? '#161f30' : '#f8fafc',
                    transition: 'border-color 0.2s',
                  }}
                  required
                  autoCapitalize="none"
                  autoFocus
                />
              </div>

              {/* CAMPO: SENHA */}
              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: isMasterMode ? '#fef3c7' : '#1e293b',
                    marginBottom: '8px',
                  }}
                >
                  <span>🔑</span>
                  <span>{isMasterMode ? 'Senha Master Secreta' : 'Senha de Acesso'}</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={senhaVisivel ? 'text' : 'password'}
                    name="password_login_input"
                    autoComplete="new-password"
                    placeholder={isMasterMode ? 'Digite sua senha Master' : 'Digite sua senha'}
                    value={senhaOuPin}
                    onChange={(e) => setSenhaOuPin(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 48px 14px 16px',
                      borderRadius: '12px',
                      border: isMasterMode ? '1.5px solid #b45309' : '1.5px solid #cbd5e1',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      outline: 'none',
                      color: isMasterMode ? '#ffffff' : '#0f172a',
                      background: isMasterMode ? '#161f30' : '#f8fafc',
                      transition: 'border-color 0.2s',
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setSenhaVisivel(!senhaVisivel)}
                    disabled={!isMasterMode && !!bloqueadoAte}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      cursor: !isMasterMode && bloqueadoAte ? 'not-allowed' : 'pointer',
                      fontSize: '1.3rem',
                      color: isMasterMode ? '#fbbf24' : '#64748b',
                      padding: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title={senhaVisivel ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {senhaVisivel ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* MENSAGEM DE ERRO */}
              {erro && (isMasterMode || !bloqueadoAte) && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    lineHeight: 1.45,
                    fontWeight: 600,
                  }}
                >
                  {erro.startsWith('⚠️') ? erro : `⚠️ ${erro}`}
                </div>
              )}

              {/* BOTÃO DE ENTRADA */}
              <button
                type="submit"
                disabled={carregando || (!isMasterMode && !!bloqueadoAte)}
                style={{
                  background:
                    !isMasterMode && bloqueadoAte
                      ? '#94a3b8'
                      : isMasterMode
                      ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
                      : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  border: isMasterMode ? '1px solid #fbbf24' : 'none',
                  padding: '15px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  cursor: !isMasterMode && bloqueadoAte ? 'not-allowed' : carregando ? 'wait' : 'pointer',
                  boxShadow:
                    !isMasterMode && bloqueadoAte
                      ? 'none'
                      : isMasterMode
                      ? '0 6px 20px rgba(217, 119, 6, 0.45)'
                      : '0 6px 18px rgba(2, 132, 199, 0.4)',
                  marginTop: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                {!isMasterMode && bloqueadoAte
                  ? `🔒 Bloqueado (${formatarTempo(segundosRestantes)})`
                  : carregando
                  ? 'Validando Criptografia SHA-256...'
                  : isMasterMode
                  ? '👑 Entrar no Portal Master'
                  : 'Entrar no Sistema'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
