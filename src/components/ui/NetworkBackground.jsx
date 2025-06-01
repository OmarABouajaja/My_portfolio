import { useEffect, useRef } from 'react';
import { useTheme } from '@/providers/theme';

const NetworkBackground = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const nodes = [];
    const nodeCount = 50;
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw nodes
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Draw node with different colors based on theme
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = theme === 'dark' 
          ? 'rgba(255, 255, 255, 0.9)'  // White with higher opacity for dark mode
          : 'rgba(0, 191, 255, 0.6)';   // Original color for light mode
        ctx.fill();
        
        // Draw connections with theme-aware colors
        nodes.slice(i + 1).forEach(otherNode => {
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            
            // Different line colors based on theme with higher opacity
            const opacity = theme === 'dark' 
              ? 0.6 * (1 - distance / 150) // Higher base opacity for dark mode
              : 0.3 * (1 - distance / 150);
              
            ctx.strokeStyle = theme === 'dark'
              ? `rgba(255, 255, 255, ${opacity})` // White lines with higher opacity for dark mode
              : `rgba(0, 191, 255, ${opacity})`;  // Original color for light mode
            
            ctx.lineWidth = theme === 'dark' ? 1.5 : 1; // Thicker lines in dark mode
            ctx.stroke();
          }
        });
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [theme]); // Add theme as dependency to re-render when theme changes

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${theme === 'dark' ? 'opacity-60' : 'opacity-30'}`}
      style={{ mixBlendMode: theme === 'dark' ? 'normal' : 'multiply' }}
    />
  );
};

export default NetworkBackground;
