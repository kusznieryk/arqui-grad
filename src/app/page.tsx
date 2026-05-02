'use client';
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <section className="bg-[#0e0e0e] py-[72px] px-[32px] pb-[80px] relative overflow-hidden">
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} suppressHydrationWarning>
          <div className="inline-flex items-center gap-[6px] font-[var(--font-mono)] text-[11px] text-[var(--color-accent)] border border-[rgba(61,255,160,0.3)] rounded-[20px] px-[12px] py-[4px] mb-[28px] tracking-wide">
            Plataforma de Assembly — UNLP
          </div>

          <h1 className="text-[52px] font-medium text-white leading-[1.1] tracking-[-1.5px] mb-[20px] max-w-[520px]">
            Aprendé Assembly.<br />Con <em className="not-italic text-[var(--color-accent)]">feedback real</em><br />de IA.
          </h1>

          <p className="text-[16px] text-[#888] leading-[1.6] max-w-[420px] mb-[40px]">
            32 ejercicios de Arquitectura de Computadores, evaluados automáticamente con retroalimentación detallada.
          </p>

          <div className="flex items-center gap-[12px] mb-[56px]">
            {status === 'loading' ? (
              <div className="flex items-center gap-2 px-[22px] py-[10px] bg-[var(--color-surface)] rounded-[4px] border border-[var(--color-border)]">
                <div className="animate-spin h-5 w-5 border-2 border-[var(--color-accent)] border-t-transparent rounded-full"></div>
                <span className="text-[var(--color-text-secondary)] text-[13px]">Cargando...</span>
              </div>
            ) : session ? (
              <Link
                href="/exercises"
                className="bg-[var(--color-accent)] text-[#0e0e0e] border-none rounded-[4px] text-[13px] font-medium px-[22px] py-[10px] cursor-pointer transition-opacity duration-150 hover:opacity-88"
              >
                Continuar Aprendiendo
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="bg-[var(--color-accent)] text-[#0e0e0e] border-none rounded-[4px] text-[13px] font-medium px-[22px] py-[10px] cursor-pointer transition-opacity duration-150 hover:opacity-88"
                >
                  Empezar gratis
                </Link>
                <Link
                  href="/exercises"
                  className="bg-transparent text-[#888] border border-[#2a2a2a] rounded-[4px] text-[13px] px-[22px] py-[10px] cursor-pointer transition-all duration-150 hover:border-[#444] hover:text-[#ccc]"
                >
                  Ver ejercicios →
                </Link>
              </>
            )}
          </div>

          <div className="bg-[#141414] border border-[#1e1e1e] rounded-[8px] max-w-[480px] overflow-hidden">
            <div className="bg-[#1a1a1a] px-[16px] py-[10px] flex items-center gap-[6px] border-b border-[#1e1e1e]">
              <div className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]"></div>
              <div className="w-[10px] h-[10px] rounded-full bg-[#febc2e]"></div>
              <div className="w-[10px] h-[10px] rounded-full bg-[#28c840]"></div>
              <span className="text-[#555] text-[11px] font-[var(--font-mono)] ml-[8px]">solucion.asm</span>
            </div>
            <div className="px-[20px] py-[20px] font-[var(--font-mono)] text-[12px] leading-[1.8]">
              <div><span className="text-[#333] mr-[12px] select-none">1</span><span className="text-[#555]">; Mostrar A-Z en pantalla (Práctica 1)</span></div>
              <div><span className="text-[#333] mr-[12px] select-none">2</span><span className="text-[#8be9fd]">ORG</span> <span className="text-[#bd93f9]">1000H</span></div>
              <div><span className="text-[#333] mr-[12px] select-none">3</span><span className="text-[#50fa7b]">INICIO:</span> <span className="text-[#ff79c6]">MOV</span> <span className="text-[#8be9fd]">AL</span>, <span className="text-[#f1fa8c]">'A'</span></div>
              <div><span className="text-[#333] mr-[12px] select-none">4</span><span className="text-[#50fa7b]">LOOP:</span> <span className="text-[#ff79c6]">INT</span> <span className="text-[#bd93f9]">7</span></div>
              <div><span className="text-[#333] mr-[12px] select-none">5</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#ff79c6]">INC</span> <span className="text-[#8be9fd]">AL</span></div>
              <div><span className="text-[#333] mr-[12px] select-none">6</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#ff79c6]">CMP</span> <span className="text-[#8be9fd]">AL</span>, <span className="text-[#f1fa8c]">'Z'</span></div>
              <div><span className="text-[#333] mr-[12px] select-none">7</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#ff79c6]">JBE</span> <span className="text-[#50fa7b]">LOOP</span></div>
              <div><span className="text-[#333] mr-[12px] select-none">8</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#ff79c6]">HLT</span></div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-none border-t border-[var(--color-border-tertiary)] m-0" />

      <section className="py-[64px] px-[32px] bg-[var(--color-bg)]">
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} suppressHydrationWarning>
          <div className="font-[var(--font-mono)] text-[11px] text-[var(--color-accent)] tracking-wide uppercase mb-[12px]">
            // por qué Arqui ASM
          </div>
          <h2 className="text-[28px] font-medium tracking-[-0.5px] mb-[8px] text-[var(--color-text-primary)]">
            Todo lo que necesitás para dominar Assembly
          </h2>
          <p className="text-[15px] text-[var(--color-text-secondary)] max-w-[400px] mb-[40px] leading-[1.5]">
            Diseñado específicamente para la cursada de Arquitectura de Computadores.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[var(--color-border-tertiary)] border border-[var(--color-border-tertiary)] rounded-[8px] overflow-hidden">
            <div className="bg-[var(--color-bg)] px-[24px] py-[28px] transition-background duration-150 hover:bg-[var(--color-background-secondary)]">
              <div className="w-[32px] h-[32px] mb-[16px] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] stroke-[var(--color-accent)] fill-none stroke-[1.5] stroke-linecap-round stroke-linejoin-round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <div className="text-[14px] font-medium mb-[8px] text-[var(--color-text-primary)]">
                32 ejercicios prácticos
              </div>
              <div className="text-[13px] text-[var(--color-text-secondary)] leading-[1.6]">
                Organizados en 3 prácticas, cubriendo desde subrutinas hasta interrupciones con PIO y timer.
              </div>
            </div>

            <div className="bg-[var(--color-bg)] px-[24px] py-[28px] transition-background duration-150 hover:bg-[var(--color-background-secondary)]">
              <div className="w-[32px] h-[32px] mb-[16px] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] stroke-[var(--color-accent)] fill-none stroke-[1.5] stroke-linecap-round stroke-linejoin-round">
                  <path d="M12 2a10 10 0 1 0 10 10" />
                  <path d="M12 6v6l4 2" />
                  <circle cx="18" cy="6" r="3" />
                </svg>
              </div>
              <div className="text-[14px] font-medium mb-[8px] text-[var(--color-text-primary)]">
                Evaluación instantánea con IA
              </div>
              <div className="text-[13px] text-[var(--color-text-secondary)] leading-[1.6]">
                Tu código es analizado por Gemini 2.5 Flash con retroalimentación detallada sobre errores y mejoras.
              </div>
            </div>

            <div className="bg-[var(--color-bg)] px-[24px] py-[28px] transition-background duration-150 hover:bg-[var(--color-background-secondary)]">
              <div className="w-[32px] h-[32px] mb-[16px] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] stroke-[var(--color-accent)] fill-none stroke-[1.5] stroke-linecap-round stroke-linejoin-round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div className="text-[14px] font-medium mb-[8px] text-[var(--color-text-primary)]">
                Progreso detallado
              </div>
              <div className="text-[13px] text-[var(--color-text-secondary)] leading-[1.6]">
                Puntajes por ejercicio, historial de intentos e identificación de patrones de error recurrentes.
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-none border-t border-[var(--color-border-tertiary)] m-0" />

      <section className="py-[64px] px-[32px] bg-[var(--color-background-secondary)]">
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} suppressHydrationWarning>
          <div className="flex items-end justify-between mb-[32px]">
            <div>
              <div className="font-[var(--font-mono)] text-[11px] text-[var(--color-accent)] tracking-wide uppercase mb-[12px]">
                // ejercicios
              </div>
              <h2 className="text-[28px] font-medium tracking-[-0.5px] text-[var(--color-text-primary)]">
                Navegá el contenido
              </h2>
            </div>
            <Link href="/exercises" className="text-[12px] text-[var(--color-accent)] font-[var(--font-mono)] no-underline hover:underline">
              Ver todos los 32 ejercicios →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
            <div className="bg-[var(--color-bg)] border border-[var(--color-border-tertiary)] rounded-[6px] px-[20px] py-[16px] flex items-center justify-between transition-border-color duration-150 hover:border-[var(--color-border-secondary)] cursor-pointer">
              <div className="flex items-center gap-[12px]">
                <span className="font-[var(--font-mono)] text-[11px] text-[#555] min-w-[24px]">01</span>
                <div>
                  <div className="text-[13px] font-medium text-[var(--color-text-primary)] mb-[4px]">
                    Mostrar A–Z en pantalla
                  </div>
                  <div className="flex gap-[4px] flex-wrap">
                    <span className="text-[10px] font-[var(--font-mono)] text-[var(--color-text-tertiary)] bg-[var(--color-background-secondary)] border border-[var(--color-border-tertiary)] rounded-[3px] px-[6px] py-[1px]">loop</span>
                    <span className="text-[10px] font-[var(--font-mono)] text-[var(--color-text-tertiary)] bg-[var(--color-background-secondary)] border border-[var(--color-border-tertiary)] rounded-[3px] px-[6px] py-[1px]">ascii</span>
                    <span className="text-[10px] font-[var(--font-mono)] text-[var(--color-text-tertiary)] bg-[var(--color-background-secondary)] border border-[var(--color-border-tertiary)] rounded-[3px] px-[6px] py-[1px]">int7</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-[var(--font-mono)] px-[8px] py-[3px] rounded-[3px] bg-[rgba(59,139,212,0.12)] text-[#378ADD] border border-[rgba(59,139,212,0.2)]">P1</span>
            </div>

            <div className="bg-[var(--color-bg)] border border-[var(--color-border-tertiary)] rounded-[6px] px-[20px] py-[16px] flex items-center justify-between transition-border-color duration-150 hover:border-[var(--color-border-secondary)] cursor-pointer">
              <div className="flex items-center gap-[12px]">
                <span className="font-[var(--font-mono)] text-[11px] text-[#555] min-w-[24px]">02</span>
                <div>
                  <div className="text-[13px] font-medium text-[var(--color-text-primary)] mb-[4px]">
                    Subrutina CONTAR_CAR
                  </div>
                  <div className="flex gap-[4px] flex-wrap">
                    <span className="text-[10px] font-[var(--font-mono)] text-[var(--color-text-tertiary)] bg-[var(--color-background-secondary)] border border-[var(--color-border-tertiary)] rounded-[3px] px-[6px] py-[1px]">subrutina</span>
                    <span className="text-[10px] font-[var(--font-mono)] text-[var(--color-text-tertiary)] bg-[var(--color-background-secondary)] border border-[var(--color-border-tertiary)] rounded-[3px] px-[6px] py-[1px]">registro</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-[var(--font-mono)] px-[8px] py-[3px] rounded-[3px] bg-[rgba(59,139,212,0.12)] text-[#378ADD] border border-[rgba(59,139,212,0.2)]">P1</span>
            </div>

            <div className="bg-[var(--color-bg)] border border-[var(--color-border-tertiary)] rounded-[6px] px-[20px] py-[16px] flex items-center justify-between transition-border-color duration-150 hover:border-[var(--color-border-secondary)] cursor-pointer">
              <div className="flex items-center gap-[12px]">
                <span className="font-[var(--font-mono)] text-[11px] text-[#555] min-w-[24px]">08</span>
                <div>
                  <div className="text-[13px] font-medium text-[var(--color-text-primary)] mb-[4px]">
                    Handshake — Imprimir mensaje
                  </div>
                  <div className="flex gap-[4px] flex-wrap">
                    <span className="text-[10px] font-[var(--font-mono)] text-[var(--color-text-tertiary)] bg-[var(--color-background-secondary)] border border-[var(--color-border-tertiary)] rounded-[3px] px-[6px] py-[1px]">handshake</span>
                    <span className="text-[10px] font-[var(--font-mono)] text-[var(--color-text-tertiary)] bg-[var(--color-background-secondary)] border border-[var(--color-border-tertiary)] rounded-[3px] px-[6px] py-[1px]">polling</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-[var(--font-mono)] px-[8px] py-[3px] rounded-[3px] bg-[rgba(99,153,34,0.12)] text-[#639922] border border-[rgba(99,153,34,0.2)]">P2</span>
            </div>

            <div className="bg-[var(--color-bg)] border border-[var(--color-border-tertiary)] rounded-[6px] px-[20px] py-[16px] flex items-center justify-between transition-border-color duration-150 hover:border-[var(--color-border-secondary)] cursor-pointer">
              <div className="flex items-center gap-[12px]">
                <span className="font-[var(--font-mono)] text-[11px] text-[#555] min-w-[24px]">21</span>
                <div>
                  <div className="text-[13px] font-medium text-[var(--color-text-primary)] mb-[4px]">
                    Timer periódico cada 2 segundos
                  </div>
                  <div className="flex gap-[4px] flex-wrap">
                    <span className="text-[10px] font-[var(--font-mono)] text-[var(--color-text-tertiary)] bg-[var(--color-background-secondary)] border border-[var(--color-border-tertiary)] rounded-[3px] px-[6px] py-[1px]">timer</span>
                    <span className="text-[10px] font-[var(--font-mono)] text-[var(--color-text-tertiary)] bg-[var(--color-background-secondary)] border border-[var(--color-border-tertiary)] rounded-[3px] px-[6px] py-[1px]">interrupciones</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-[var(--font-mono)] px-[8px] py-[3px] rounded-[3px] bg-[rgba(130,74,183,0.12)] text-[#824AB7] border border-[rgba(130,74,183,0.2)]">P3</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-[64px] px-[32px] bg-[var(--color-bg)] border-t border-[var(--color-border-tertiary)] flex items-center justify-between gap-[32px]">
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} suppressHydrationWarning>
          <h2 className="text-[22px] font-medium tracking-[-0.3px] mb-[8px]">
            Listo para empezar?
          </h2>
          <p className="text-[14px] text-[var(--color-text-secondary)] max-w-[360px] leading-[1.5]">
            Creá tu cuenta en segundos y empezá con la Práctica 1. Es gratis.
          </p>
        </div>
        <div className={`flex gap-[8px] flex-shrink-0 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} suppressHydrationWarning>
          <Link
            href="/login"
            className="bg-transparent text-[#888] border border-[#2a2a2a] rounded-[4px] text-[13px] px-[22px] py-[10px] cursor-pointer transition-all duration-150 hover:border-[#444] hover:text-[#ccc]"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="bg-[var(--color-accent)] text-[#0e0e0e] border-none rounded-[4px] text-[13px] font-medium px-[22px] py-[10px] cursor-pointer transition-opacity duration-150 hover:opacity-88"
          >
            Crear cuenta
          </Link>
        </div>
      </section>
    </div>
  );
}
