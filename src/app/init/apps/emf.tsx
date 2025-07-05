import React, { useCallback, useEffect, useRef, useState } from "react";

interface ElectromagneticParticle {
  id: number;
  element: HTMLElement;
  phase: number;
  frequency: number;
  amplitude: number;
  color: string;
  type: "electric" | "magnetic";
}

export const EMf = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setIsActive] = useState<boolean>(false);
  const particlesRef = useRef<ElectromagneticParticle[]>([]);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  const PARTICLE_COUNT = 24;
  const CENTER_X = 200;
  const CENTER_Y = 200;
  const BASE_AMPLITUDE = 80;
  const WAVE_SPEED = 0.02;

  const createParticle = (
    index: number,
    type: "electric" | "magnetic",
  ): HTMLElement => {
    if (!containerRef.current) throw new Error("Container not found");

    const particle = document.createElement("div");
    particle.className = `em-particle ${type}`;

    const size = type === "electric" ? 8 : 6;
    const hue = type === "electric" ? 200 + index * 15 : 300 + index * 10;

    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: hsl(${hue}, 80%, 60%);
      box-shadow: 0 0 ${size * 2}px hsl(${hue}, 80%, 60%), 0 0 ${size * 4}px hsl(${hue}, 60%, 40%);
      transform: translate(-50%, -50%);
      opacity: 0;
      z-index: ${type === "electric" ? 10 : 5};
    `;

    containerRef.current.appendChild(particle);
    return particle;
  };

  const calculateElectricField = (
    time: number,
    particleIndex: number,
  ): { x: number; y: number } => {
    const phase = (particleIndex * Math.PI * 2) / PARTICLE_COUNT;
    const frequency = 1 + particleIndex * 0.1;
    const amplitude = BASE_AMPLITUDE * (0.4 + particleIndex * 0.02);

    // Electric field oscillates perpendicular to propagation
    const x = CENTER_X + Math.cos(time * frequency + phase) * amplitude;
    const y = CENTER_Y + Math.sin(time * frequency + phase) * (amplitude * 0.3);

    return { x, y };
  };

  const calculateMagneticField = (
    time: number,
    particleIndex: number,
  ): { x: number; y: number } => {
    const phase = (particleIndex * Math.PI * 2) / PARTICLE_COUNT + Math.PI / 2;
    const frequency = 1 + particleIndex * 0.1;
    const amplitude = BASE_AMPLITUDE * (0.7 + particleIndex * 0.015);

    // Magnetic field oscillates perpendicular to both electric field and propagation
    const x = CENTER_X + Math.sin(time * frequency + phase) * (amplitude * 0.4);
    const y = CENTER_Y + Math.cos(time * frequency + phase) * amplitude;

    return { x, y };
  };

  const animateParticles = useCallback((): void => {
    timeRef.current += WAVE_SPEED;

    particlesRef.current.forEach((particle, index) => {
      const isElectric = particle.type === "electric";
      const position = isElectric
        ? calculateElectricField(timeRef.current, index)
        : calculateMagneticField(timeRef.current, index);

      // Calculate wave intensity for opacity and scale
      const waveIntensity = Math.abs(
        Math.sin(timeRef.current * (1 + index * 0.1) + particle.phase),
      );
      const opacity = 0.7 + waveIntensity * 0.1;
      const scale = 0.2 + waveIntensity * 0.1;

      // Apply smooth transitions using CSS transforms
      particle.element.style.transform = `translate(-50%, -50%) scale(${scale})`;
      particle.element.style.left = `${position.x}px`;
      particle.element.style.top = `${position.y}px`;
      particle.element.style.opacity = opacity.toString();

      // Add rotation for magnetic particles
      if (!isElectric) {
        const rotation = timeRef.current * 50 + index * 300;
        particle.element.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
      }
    });

    animationRef.current = requestAnimationFrame(animateParticles);
  }, []);

  const initializeParticles = useCallback((): void => {
    if (!containerRef.current) return;

    // Clear existing particles
    particlesRef.current.forEach((particle) => {
      particle.element.remove();
    });
    particlesRef.current = [];

    // Create electric field particles
    for (let i = 0; i < PARTICLE_COUNT / 2; i++) {
      const element = createParticle(i, "electric");
      particlesRef.current.push({
        id: i,
        element,
        phase: (i * Math.PI * 2) / (PARTICLE_COUNT / 2),
        frequency: 1 + i * 0.1,
        amplitude: BASE_AMPLITUDE * (0.4 + i * 0.02),
        color: `hsl(${20 + i * 1}, 80%, 60%)`,
        type: "electric",
      });
    }

    // Create magnetic field particles
    for (let i = 0; i < PARTICLE_COUNT / 2; i++) {
      const element = createParticle(i, "magnetic");
      particlesRef.current.push({
        id: i + PARTICLE_COUNT / 2,
        element,
        phase: (i * Math.PI * 2) / (PARTICLE_COUNT / 2) + Math.PI / 2,
        frequency: 1 + i * 0.1,
        amplitude: BASE_AMPLITUDE * (0.7 + i * 0.015),
        color: `hsl(${100 + i * 10}, 80%, 60%)`,
        type: "magnetic",
      });
    }
  }, []);

  const startAnimation = useCallback((): void => {
    setIsActive(true);

    // Animate particles entrance
    particlesRef.current.forEach((particle, index) => {
      // Initial positioning
      const position =
        particle.type === "electric"
          ? calculateElectricField(0, index)
          : calculateMagneticField(0, index);

      particle.element.style.left = `${position.x}px`;
      particle.element.style.top = `${position.y}px`;

      // Animate entrance with staggered timing
      setTimeout(() => {
        particle.element.style.transition =
          "opacity 2.8s ease-out, transform 2.8s ease-out";
        particle.element.style.opacity = "0.7";
        particle.element.style.transform = "translate(-50%, -50%) scale(1)";
      }, index * 2500);
    });

    // Start continuous animation after entrance
    setTimeout(() => {
      // Remove transitions for smooth animation
      particlesRef.current.forEach((particle) => {
        particle.element.style.transition = "none";
      });

      animateParticles();
    }, 2500);
  }, [animateParticles]);

  useEffect(() => {
    initializeParticles();

    setTimeout(() => {
      startAnimation();
    }, 5000);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      particlesRef.current.forEach((particle) => {
        particle.element.remove();
      });
    };
  }, [initializeParticles, startAnimation]);

  return (
    <div className="min-h-60 bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950 flex items-center justify-center overflow-hidden relative">
      {/* Background electromagnetic field lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent transform -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative">
        <div
          ref={containerRef}
          className="relative w-96 h-96"
          style={{
            background:
              "radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            border: "1px solid rgba(59, 130, 246, 0.2)",
          }}
        />

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-lg font-light tracking-wider text-center pointer-events-none">
          <div className="bg-black/30 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
            <div className="flex items-center space-x-2">
              {/* <div className="w-2 h-2 bg-blue-400 rounded-full" /> */}
              {/* <div className="w-2 h-2 bg-purple-400 rounded-full" /> */}
            </div>
          </div>
        </div>

        <div className="absolute transform -translate-x-1/2 text-white/70 text-sm text-center font-mono">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span>Electric Field</span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span>Magnetic Field</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
