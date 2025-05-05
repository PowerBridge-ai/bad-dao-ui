import React, { useEffect, useRef } from 'react';

interface Distribution {
  category: string;
  percentage: number;
  color?: string;
}

interface TokenDistributionChartProps {
  distribution: Distribution[];
  size?: number;
}

// Default colors for the chart segments
const defaultColors = [
  '#3b82f6', // blue
  '#10b981', // green
  '#ec4899', // pink
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#fbbf24', // yellow
  '#06b6d4', // cyan
  '#f87171'  // red
];

const TokenDistributionChart: React.FC<TokenDistributionChartProps> = ({ 
  distribution, 
  size = 150 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Prepare data with colors
  const data = distribution.map((item, index) => ({
    ...item,
    color: item.color || defaultColors[index % defaultColors.length]
  }));
  
  // Draw the pie chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate total (should be 100, but just in case)
    const total = data.reduce((sum, item) => sum + item.percentage, 0);
    
    // Set up drawing parameters
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    // Starting angle
    let startAngle = -Math.PI / 2; // Start from top
    
    // Draw each segment
    data.forEach(item => {
      const segmentAngle = (item.percentage / total) * 2 * Math.PI;
      const endAngle = startAngle + segmentAngle;
      
      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      // Fill with color
      ctx.fillStyle = item.color!;
      ctx.fill();
      
      // Stroke
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#262639';
      ctx.stroke();
      
      // Update start angle for next segment
      startAngle = endAngle;
    });
    
    // Draw center circle for donut effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = '#1E1E2E';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#262639';
    ctx.stroke();
  }, [data, size]);
  
  return (
    <div className="flex flex-col items-center">
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size}
        className="mb-2"
      />
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-1" 
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate">
              {item.category}: {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenDistributionChart; 