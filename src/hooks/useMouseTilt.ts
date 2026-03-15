import { useState, useEffect, useRef } from "react";

interface UseMouseTiltOptions {
  maxTilt?: number;
  enabled?: boolean;
}

/**
 * Retorna valores de rotação 3D baseados na posição do mouse.
 * Desativar em mobile para performance e UX.
 */
export function useMouseTilt({ maxTilt = 8, enabled = true }: UseMouseTiltOptions = {}) {
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) return;

    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTransform({
        rotateY: x * maxTilt,
        rotateX: -y * maxTilt,
      });
    };

    const handleLeave = () => setTransform({ rotateX: 0, rotateY: 0 });

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [enabled, maxTilt]);

  return { ref, style: { transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)` } };
}
