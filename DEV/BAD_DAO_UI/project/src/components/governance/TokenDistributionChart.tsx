import React, { useRef, useEffect } from 'react';

interface TokenDistribution {
  category: string;
  percentage: number;
}

interface TokenDistributionChartProps {
  distribution: TokenDistribution[];
  size?: number;
}

const TokenDistributionChart: React.FC<TokenDistributionChartProps> = ({ 
  distribution, 
  size = 120 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Color palette for the chart
  const colors = [
    '#10B981', // emerald-500
    '#3B82F6', // blue-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#F59E0B', // amber-500
    '#6366F1', // indigo-500
    '#EF4444', // red-500
    '#06B6D4'  // cyan-500
  ];

  useEffect(() => {
    if (!canvasRef.current || !distribution.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate total to normalize percentages
    const total = distribution.reduce((sum, item) => sum + item.percentage, 0);
    
    // Center of the chart
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 2;
    
    // Starting angle
    let startAngle = -0.5 * Math.PI; // Start at 12 o'clock
    
    // Draw slices
    distribution.forEach((item, index) => {
      const sliceAngle = (item.percentage / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      // Fill with color
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      
      // Update starting angle for next slice
      startAngle = endAngle;
    });
    
    // Draw center circle to create donut chart
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1b25'; // Dark background
    ctx.fill();
  }, [distribution]);

  return (
    <div className="flex flex-col items-center">
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size} 
        className="mb-2"
      />
      <div className="flex flex-wrap gap-2 justify-center mt-1">
        {distribution.map((item, index) => (
          <div key={index} className="flex items-center text-xs">
            <div 
              className="w-2 h-2 rounded-full mr-1"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-white/70">
              {item.category} ({item.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenDistributionChart; 