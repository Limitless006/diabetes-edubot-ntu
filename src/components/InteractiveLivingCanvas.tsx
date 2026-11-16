'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  colorType: 'teal' | 'cyan' | 'emerald' | 'amber';
  pulsePhase: number;
  pulseSpeed: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export default function InteractiveLivingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates stored in ref/closure without triggering React re-renders
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isActive: false,
      radius: 175,
    };

    // Color definitions
    const colorMap = {
      teal: { r: 45, g: 212, b: 191 },     // #2dd4bf
      cyan: { r: 56, g: 189, b: 248 },     // #38bdf8
      emerald: { r: 52, g: 211, b: 153 },  // #34d399
      amber: { r: 251, g: 191, b: 36 },    // #fbbf24
    };

    // Initialize particles
    const particleCount = width < 768 ? 45 : 85;
    const particles: Particle[] = [];
    const colorKeys: ('teal' | 'cyan' | 'emerald' | 'amber')[] = ['teal', 'cyan', 'emerald', 'cyan', 'amber'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        radius: Math.random() * 2.2 + 1.8,
        baseAlpha: Math.random() * 0.5 + 0.35,
        colorType: colorKeys[Math.floor(Math.random() * colorKeys.length)],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.015,
      });
    }

    const ripples: Ripple[] = [];

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // Mouse & Touch listeners on window
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isActive = true;
    };

    const handleMouseLeave = () => {
      mouse.isActive = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.isActive = true;
      }
    };

    // Click creates interactive expanding shockwave ripple
    const handleClick = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 200,
        alpha: 0.8,
        color: 'rgba(56, 189, 248,',
      });
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 2,
        maxRadius: 130,
        alpha: 0.9,
        color: 'rgba(45, 212, 191,',
      });

      // Scatter nearby particles gently on click
      for (const p of particles) {
        const dx = p.x - e.clientX;
        const dy = p.y - e.clientY;
        const dist = Math.hypot(dx, dy);
        if (dist < 180 && dist > 0) {
          const pushForce = ((180 - dist) / 180) * 8;
          p.vx += (dx / dist) * pushForce;
          p.vy += (dy / dist) * pushForce;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('click', handleClick);

    // Main 60 FPS Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.18;
      mouse.y += (mouse.targetY - mouse.y) * 0.18;

      // 1. Draw Mouse Glowing Aura Spotlight if active
      if (mouse.isActive) {
        const mouseGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius * 1.5
        );
        mouseGlow.addColorStop(0, 'rgba(20, 184, 166, 0.28)');
        mouseGlow.addColorStop(0.35, 'rgba(6, 182, 212, 0.14)');
        mouseGlow.addColorStop(0.7, 'rgba(6, 182, 212, 0.04)');
        mouseGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.fillStyle = mouseGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Render & Update Shockwave Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 5.5;
        r.alpha *= 0.94;

        ctx.save();
        ctx.strokeStyle = `${r.color} ${r.alpha})`;
        ctx.lineWidth = 2.2;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#38bdf8';
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        if (r.alpha < 0.02 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // 3. Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Natural pulse
        p.pulsePhase += p.pulseSpeed;
        const currentRadius = p.radius + Math.sin(p.pulsePhase) * 0.6;
        const currentAlpha = Math.min(1, Math.max(0.2, p.baseAlpha + Math.sin(p.pulsePhase) * 0.25));

        // Physics: position update + friction
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Keep minimum drifting speed
        if (Math.abs(p.vx) < 0.2) p.vx += (Math.random() - 0.5) * 0.15;
        if (Math.abs(p.vy) < 0.2) p.vy += (Math.random() - 0.5) * 0.15;

        // Screen boundary wrapping
        if (p.x < -20) p.x = width + 20;
        else if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        else if (p.y > height + 20) p.y = -20;

        // Interactive mouse connection and repulsion
        if (mouse.isActive) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mDist = Math.hypot(mdx, mdy);

          if (mDist < mouse.radius && mDist > 0) {
            // Draw interactive luminous connecting laser beam from cursor to node
            const beamAlpha = (1 - mDist / mouse.radius) * 0.85;
            ctx.save();
            ctx.strokeStyle = `rgba(56, 189, 248, ${beamAlpha})`;
            ctx.lineWidth = 1.4;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#22d3ee';
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
            ctx.restore();

            // Gentle repulsive force for fluid interactivity
            const repulseForce = ((mouse.radius - mDist) / mouse.radius) * 1.8;
            p.vx += (mdx / mDist) * repulseForce * 0.45;
            p.vy += (mdy / mDist) * repulseForce * 0.45;
          }
        }

        // Draw Particle Circle with Soft Glow
        const col = colorMap[p.colorType];
        ctx.save();
        ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${currentAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${col.r}, ${col.g}, ${col.b}, 0.8)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, currentRadius), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 4. Inter-particle Constellation Connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.hypot(dx, dy);

          const maxDist = 120;
          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.32;
            ctx.strokeStyle = `rgba(45, 212, 191, ${lineAlpha})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
}
