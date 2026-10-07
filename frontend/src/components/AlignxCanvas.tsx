import React, { useEffect, useRef } from 'react';

interface AlignxCanvasProps {
  scrollProgress?: number; // 0 to 1
  interactive?: boolean;
}

export const AlignxCanvas: React.FC<AlignxCanvasProps> = ({ scrollProgress = 0, interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0.25;
    let targetRotY = 0.35;
    let currentRotX = 0.25;
    let currentRotY = 0.35;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 0.5;
      mouseY = y * 0.5;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    // 3D Polyhedron vertices (Architectural Hexagonal Geometric Crystal)
    const baseVertices = [
      // Top apex
      [0, -1.2, 0],
      // Upper ring (hexagonal)
      [-0.7, -0.4, 0.4],
      [0, -0.4, 0.8],
      [0.7, -0.4, 0.4],
      [0.7, -0.4, -0.4],
      [0, -0.4, -0.8],
      [-0.7, -0.4, -0.4],
      // Lower ring (slightly expanded)
      [-0.85, 0.6, 0.5],
      [0, 0.6, 0.95],
      [0.85, 0.6, 0.5],
      [0.85, 0.6, -0.5],
      [0, 0.6, -0.95],
      [-0.85, 0.6, -0.5],
      // Bottom apex
      [0, 1.25, 0]
    ];

    // Edges connecting vertices
    const edges = [
      // Top pyramid edges
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
      // Upper ring
      [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1],
      // Vertical pillars
      [1, 7], [2, 8], [3, 9], [4, 10], [5, 11], [6, 12],
      // Lower ring
      [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 7],
      // Bottom pyramid edges
      [13, 7], [13, 8], [13, 9], [13, 10], [13, 11], [13, 12],
      // Internal geometric refraction diagonals
      [1, 9], [3, 11], [2, 10]
    ];

    let time = 0;

    const render = () => {
      time += 0.008;

      // Smooth camera interpolation influenced by mouse and scroll
      targetRotY = time * 0.35 + mouseX + scrollProgress * Math.PI * 1.5;
      targetRotX = 0.2 + mouseY * 0.4 + Math.sin(time * 0.5) * 0.05 + scrollProgress * 0.4;

      currentRotY += (targetRotY - currentRotY) * 0.08;
      currentRotX += (targetRotX - currentRotX) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const baseScale = Math.min(width, height) * 0.32 * (1 + scrollProgress * 0.15);

      // 3D rotation matrices
      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);

      // Project vertices
      const projected = baseVertices.map(([x, y, z]) => {
        // Rotate Y
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        // Rotate X
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Perspective projection
        const fov = 3.5;
        const pz = fov / (fov + z2);
        return {
          px: cx + x1 * baseScale * pz,
          py: cy + y2 * baseScale * pz,
          z: z2
        };
      });

      // Subtle light refraction beam from left
      const lightSourceX = cx - baseScale * 1.8;
      const lightSourceY = cy - baseScale * 0.4;
      const hitPoint = projected[1] || { px: cx, py: cy };

      // Incident ray: precision obsidian dashed beam
      ctx.beginPath();
      ctx.moveTo(lightSourceX, lightSourceY);
      ctx.lineTo(hitPoint.px, hitPoint.py);
      ctx.strokeStyle = 'rgba(29, 29, 31, 0.4)';
      ctx.lineWidth = 1.3;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Internal refraction ray inside geometry
      const exitPoint1 = projected[9] || { px: cx + 40, py: cy + 40 };
      const exitPoint2 = projected[10] || { px: cx + 60, py: cy + 20 };

      ctx.beginPath();
      ctx.moveTo(hitPoint.px, hitPoint.py);
      ctx.lineTo(exitPoint1.px, exitPoint1.py);
      ctx.strokeStyle = 'rgba(45, 90, 67, 0.75)'; // Botanical pine refraction
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Refracted exit beams (Botanical Pine & subtle Slate)
      // Beam A: Deep Botanical Pine
      ctx.beginPath();
      ctx.moveTo(exitPoint1.px, exitPoint1.py);
      ctx.lineTo(cx + baseScale * 1.9, cy + baseScale * 0.3);
      ctx.strokeStyle = 'rgba(45, 90, 67, 0.9)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Beam B: Secondary Pine Accent
      ctx.beginPath();
      ctx.moveTo(exitPoint1.px, exitPoint1.py);
      ctx.lineTo(cx + baseScale * 1.85, cy + baseScale * 0.6);
      ctx.strokeStyle = 'rgba(45, 90, 67, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Beam C: Natural Slate Graphite
      ctx.beginPath();
      ctx.moveTo(exitPoint2.px, exitPoint2.py);
      ctx.lineTo(cx + baseScale * 1.75, cy - baseScale * 0.2);
      ctx.strokeStyle = 'rgba(81, 81, 84, 0.55)';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Render Facets (subtle botanical pine translucent tint)
      const renderFacet = (indices: number[], alpha: number) => {
        ctx.beginPath();
        indices.forEach((idx, i) => {
          const pt = projected[idx];
          if (i === 0) ctx.moveTo(pt.px, pt.py);
          else ctx.lineTo(pt.px, pt.py);
        });
        ctx.closePath();
        ctx.fillStyle = `rgba(45, 90, 67, ${alpha})`;
        ctx.fill();
      };

      // Shading on select architectural facets
      renderFacet([0, 1, 2], 0.05);
      renderFacet([1, 2, 8, 7], 0.07);
      renderFacet([2, 3, 9, 8], 0.04);
      renderFacet([13, 7, 8], 0.06);

      // Draw wireframe edges (crisp graphite and titanium hairlines)
      edges.forEach(([i1, i2]) => {
        const p1 = projected[i1];
        const p2 = projected[i2];
        const depthAvg = (p1.z + p2.z) / 2;

        // Front edges are dark graphite obsidian, back edges are faint slate
        const alpha = depthAvg < 0 ? 0.65 : 0.22;
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.strokeStyle = depthAvg < 0 ? `rgba(29, 29, 31, ${alpha})` : `rgba(81, 81, 84, ${alpha})`;
        ctx.lineWidth = depthAvg < 0 ? 1.2 : 0.7;
        ctx.stroke();
      });

      // Small mathematical vertex markers
      projected.forEach((p, idx) => {
        if (p.z < 0.2) {
          ctx.beginPath();
          ctx.arc(p.px, p.py, idx === 0 || idx === 13 ? 2.8 : 1.6, 0, Math.PI * 2);
          ctx.fillStyle = idx === 0 ? '#2D5A43' : 'rgba(29, 29, 31, 0.75)';
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollProgress, interactive]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
        aria-label="ALIGNX architectural light refraction geometric form"
      />
    </div>
  );
};

export { AlignxCanvas as PrismCanvas };
