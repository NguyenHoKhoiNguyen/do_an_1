import React from 'react';

export default function FieldView({ players, team }) {
  // Fixed positions on the court for each player position
  const positionCoordinates = {
    'Point Guard': { x: 50, y: 25, label: 'PG', abbreviation: 'PG' },     // Top center
    'Shooting Guard': { x: 28, y: 45, label: 'SG', abbreviation: 'SG' },   // Left side
    'Small Forward': { x: 72, y: 45, label: 'SF', abbreviation: 'SF' },    // Right side
    'Power Forward': { x: 32, y: 75, label: 'PF', abbreviation: 'PF' },    // Bottom left
    'Center': { x: 68, y: 75, label: 'C', abbreviation: 'C' }             // Bottom right
  };

  // Create position map for players
  const playersByPosition = {};
  players.forEach(player => {
    const pos = player.position || 'Unknown';
    if (!playersByPosition[pos]) {
      playersByPosition[pos] = [];
    }
    playersByPosition[pos].push(player);
  });

  return (
    <div className="field-view">
      <svg 
        viewBox="0 0 100 150" 
        preserveAspectRatio="xMidYMid meet"
        className="basketball-court"
      >
        {/* Court background */}
        <rect x="5" y="5" width="90" height="140" fill="#2d5016" stroke="white" strokeWidth="0.5"/>
        
        {/* Court lines */}
        {/* Center line */}
        <line x1="5" y1="75" x2="95" y2="75" stroke="white" strokeWidth="0.3"/>
        
        {/* Center circle */}
        <circle cx="50" cy="75" r="12" fill="none" stroke="white" strokeWidth="0.3"/>
        
        {/* Free throw areas */}
        <rect x="18" y="45" width="18" height="60" fill="none" stroke="white" strokeWidth="0.3"/>
        <rect x="64" y="45" width="18" height="60" fill="none" stroke="white" strokeWidth="0.3"/>
        
        {/* Free throw circles */}
        <circle cx="27" cy="45" r="6" fill="none" stroke="white" strokeWidth="0.3"/>
        <circle cx="73" cy="45" r="6" fill="none" stroke="white" strokeWidth="0.3"/>
        
        {/* Basket areas (closer to court edges) */}
        <rect x="20" y="8" width="14" height="8" fill="none" stroke="white" strokeWidth="0.3"/>
        <rect x="66" y="8" width="14" height="8" fill="none" stroke="white" strokeWidth="0.3"/>
        
        {/* Render players */}
        {Object.entries(positionCoordinates).map(([position, coords]) => {
          const player = playersByPosition[position]?.[0];
          if (!player) {
            // Show empty position
            return (
              <g key={`empty-${position}`}>
                <circle 
                  cx={coords.x} 
                  cy={coords.y} 
                  r="2.5" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.3)" 
                  strokeWidth="0.2"
                  strokeDasharray="0.5,0.5"
                />
                <text 
                  x={coords.x} 
                  y={coords.y + 5} 
                  textAnchor="middle" 
                  fontSize="1.5" 
                  fill="rgba(255,255,255,0.2)"
                  fontWeight="bold"
                >
                  -
                </text>
              </g>
            );
          }

          // Determine color based on position
          const positionColors = {
            'Point Guard': '#FF6B6B',
            'Shooting Guard': '#4ECDC4',
            'Small Forward': '#45B7D1',
            'Power Forward': '#FFA502',
            'Center': '#95E1D3'
          };

          const color = positionColors[position] || '#667eea';

          return (
            <g key={player._id}>
              {/* Player circle */}
              <circle 
                cx={coords.x} 
                cy={coords.y} 
                r="3.5" 
                fill={color}
                stroke="white"
                strokeWidth="0.3"
              />
              {/* Jersey number */}
              <text 
                x={coords.x} 
                y={coords.y + 1} 
                textAnchor="middle" 
                fontSize="2" 
                fill="white"
                fontWeight="bold"
              >
                {player.jerseyNumber}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="field-legend">
        <div className="legend-title">Chú Thích</div>
        {Object.entries(positionCoordinates).map(([position, coords]) => {
          const colors = {
            'Point Guard': '#FF6B6B',
            'Shooting Guard': '#4ECDC4',
            'Small Forward': '#45B7D1',
            'Power Forward': '#FFA502',
            'Center': '#95E1D3'
          };
          const player = playersByPosition[position]?.[0];
          
          return (
            <div key={position} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: colors[position] }}
              />
              <div className="legend-text">
                <strong>{coords.label}</strong>
                <span>{player?.name || 'Trống'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
