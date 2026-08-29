"use client";

import { useEffect, useRef } from "react";

export function InteractiveWaveField({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let width = 1;
    let height = 1;
    let visible = true;
    let pointerInside = false;
    let previousPointerX = 0;
    let lastPointerTime = performance.now();
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, velocity: 0, targetVelocity: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      pointer.x = pointer.targetX = width * 0.58;
      pointer.y = pointer.targetY = height * 0.48;
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      pointer.x += (pointer.targetX - pointer.x) * 0.085;
      pointer.y += (pointer.targetY - pointer.y) * 0.085;
      pointer.velocity += (pointer.targetVelocity - pointer.velocity) * 0.12;
      pointer.targetVelocity *= 0.88;

      const compact = width < 720;
      const lineCount = compact
        ? Math.max(46, Math.floor(width / 9))
        : Math.min(160, Math.max(76, Math.floor(width / 9.5)));
      const spacing = width / Math.max(1, lineCount - 1);
      const pointStep = compact ? 15 : 11;
      const radius = Math.min(width, height) * (compact ? 0.2 : 0.17);
      const pointerStrength = pointerInside ? 1 : 0.22;

      context.lineWidth = compact ? 0.72 : 0.82;
      context.strokeStyle = "rgba(224, 247, 197, 0.48)";

      for (let index = 0; index < lineCount; index += 1) {
        const baseX = index * spacing;
        context.beginPath();

        for (let y = -pointStep; y <= height + pointStep; y += pointStep) {
          const idle =
            Math.sin(y * 0.014 + time * 0.00042 + index * 0.13) * 5.6 +
            Math.sin(y * 0.006 - time * 0.00026 + index * 0.035) * 8.5;
          const deltaX = baseX - pointer.x;
          const deltaY = y - pointer.y;
          const distanceSquared = deltaX * deltaX + deltaY * deltaY;
          const influence = Math.exp(-distanceSquared / (radius * radius));
          const direction = deltaX / (Math.abs(deltaX) + 24);
          const cursorWarp = influence * pointerStrength * (34 * direction + pointer.velocity * 0.12);
          const x = baseX + idle + cursorWarp;

          if (y === -pointStep) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        context.stroke();
      }
    };

    const loop = (time: number) => {
      frame = 0;
      if (!active || !visible || document.hidden) return;
      draw(time);
      if (!reducedMotion.matches) frame = window.requestAnimationFrame(loop);
    };

    const requestLoop = () => {
      if (!frame && active && visible && !document.hidden) frame = window.requestAnimationFrame(loop);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!active) return;
      const rect = canvas.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        pointerInside = false;
        return;
      }
      const now = performance.now();
      const elapsed = Math.max(12, now - lastPointerTime);
      pointer.targetX = event.clientX - rect.left;
      pointer.targetY = event.clientY - rect.top;
      pointer.targetVelocity = ((event.clientX - previousPointerX) / elapsed) * 22;
      previousPointerX = event.clientX;
      lastPointerTime = now;
      pointerInside = true;
      requestLoop();
    };

    const handlePointerLeave = () => {
      pointerInside = false;
      pointer.targetX = width * 0.58;
      pointer.targetY = height * 0.48;
    };

    const handleVisibility = () => requestLoop();
    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(performance.now());
      requestLoop();
    });
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) requestLoop();
      else if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    });

    resize();
    draw(performance.now());
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibility);
    reducedMotion.addEventListener("change", requestLoop);
    requestLoop();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
      reducedMotion.removeEventListener("change", requestLoop);
    };
  }, [active]);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}
