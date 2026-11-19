"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Som ambiente — pad generativo via Web Audio (duas senoides desafinadas,
 * passa-baixa quente e LFO lento). Sem arquivo, sem licença, 0KB.
 * Mutado por padrão; liga só com clique (política de autoplay respeitada).
 * Inclui visualizador de frequência em canvas minúsculo.
 */
export function AmbientSound() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const nodesRef = useRef<{ gain: GainNode; stop: () => void } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const drawVisualizer = useCallback(() => {
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    if (!analyser || !canvas) return;

    // TypeScript narrowing workaround: use local variables with explicit types
    const analyserNode: AnalyserNode = analyser;
    const canvasEl: HTMLCanvasElement = canvas;
    const ctx2d = canvasEl.getContext("2d");
    if (!ctx2d) return;

    const freqBinCount: number = analyserNode.frequencyBinCount ?? 0;
    const dataArray = new Uint8Array(freqBinCount);
    analyser.getByteFrequencyData(dataArray);

    const bars = 8;
    const step = Math.floor(dataArray.length / bars);
    const newLevels: number[] = [];
    for (let i = 0; i < bars; i++) {
      const idx = Math.min(i * step + Math.floor(step / 2), dataArray.length - 1);
      newLevels.push((dataArray[idx] ?? 0) / 255);
    }

    const { width, height } = canvas;
    ctx2d.clearRect(0, 0, width, height);
    const barWidth = width / 8;
    const _gap = 2;
    ctx2d.fillStyle = "#efb9c4";
    newLevels.forEach((level, i) => {
      const h = level * height * 0.8;
      const x = i * (width / 8) + 1;
      const y = height - h;
      ctx2d.fillRect(x, y, barWidth - 2, h);
    });

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(drawVisualizer);
  }, []);

  useEffect(() => {
    return () => {
      nodesRef.current?.stop();
      void ctxRef.current?.close();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const initAudio = useCallback(() => {
    if (ctxRef.current) return;
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;
    filter.Q.value = 0.4;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;

    const freqs = [110, 138.59, 164.81, 246.94];
    const oscs = freqs.map((f, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f * (i === 3 ? 1.003 : 1);
      const og = ctx.createGain();
      og.gain.value = i === 0 ? 0.5 : 0.22;
      o.connect(og).connect(filter);
      o.start();
      return o;
    });

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain).connect(master.gain);
    lfo.start();

    filter.connect(analyser).connect(master).connect(ctx.destination);
    ctxRef.current = ctx;
    analyserRef.current = analyser;
    nodesRef.current = {
      gain: master,
      stop: () => {
        for (const o of oscs) o.stop();
        lfo.stop();
      },
    };
  }, []);

  const toggle = useCallback(() => {
    if (on) {
      const g = nodesRef.current?.gain;
      if (g && ctxRef.current) {
        g.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 0.9);
        window.setTimeout(() => void ctxRef.current?.suspend(), 950);
      }
      setOn(false);
      return;
    }

    initAudio();
    void ctxRef.current?.resume();
    const g = nodesRef.current?.gain;
    if (g && ctxRef.current) {
      g.gain.cancelScheduledValues(ctxRef.current.currentTime);
      g.gain.linearRampToValueAtTime(0.05, ctxRef.current.currentTime + 0.9);
    }
    setOn(true);
  }, [on]);

  // Visualizer loop
  useEffect(() => {
    if (!on) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      return;
    }
    const canvas = canvasRef.current;
    if (canvas) drawVisualizer();
  }, [on, drawVisualizer]);

  const handleClick = useCallback(() => {
    if (on) setOn(false);
    else toggle();
  }, [on, toggle]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={on}
      aria-label={on ? "Desligar som ambiente" : "Ligar som ambiente"}
      className="fixed right-4 bottom-24 z-40 hidden h-11 w-11 items-center justify-center rounded-full bg-ground/80 text-ink shadow-sm ring-1 ring-ink/10 backdrop-blur-sm transition-colors hover:bg-ground md:right-6 md:bottom-6 md:flex"
    >
      <canvas
        ref={canvasRef}
        width={32}
        height={18}
        className="absolute -top-4 left-1/2 -translate-x-1/2 rounded opacity-70 transition-opacity duration-300 pointer-events-none"
        style={{ opacity: on ? 1 : 0 }}
      />
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M6 12.5V3.5L13 2v9"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="4.5"
          cy="12.5"
          r="1.8"
          fill={on ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <circle
          cx="11.5"
          cy="11"
          r="1.8"
          fill={on ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.4"
        />
        {!on && (
          <path d="M1.5 1.5l13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}
