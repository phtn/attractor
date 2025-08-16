import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export function Shuding() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    let width = 0;
    const onResize = () =>
      canvasRef.current && (width = canvasRef.current.offsetWidth);
    window.addEventListener("resize", onResize);
    onResize();
    if (!canvasRef.current) return;
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 1,
      width: width * 3,
      height: width * 3 * 0.4,
      phi: 0.3,
      theta: 0.5,
      dark: 1,
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 1.1,
      baseColor: [1, 1, 1],
      markerColor: [251 / 255, 100 / 255, 21 / 255],
      glowColor: [1.2, 1.2, 1.2],
      markers: [],
      scale: 2.5,
      offset: [0, width * 2 * 0.4 * 0.6],
      onRender: (state) => {
        state.width = width * 2;
        state.height = width * 2 * 0.4;
      },
    });

    if (!canvasRef.current) return;
    
    // Store timeout reference for cleanup
    timeoutRef.current = setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
      timeoutRef.current = null;
    }, 300);
    
    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
      // Cleanup timeout on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return (
    <div className="w-full h-[100lvh] aspect-[1 / 0.4] m-auto relative">
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          contain: "layout paint size",
          opacity: 1,
          transition: "opacity 1s ease",
        }}
      />
    </div>
  );
}
