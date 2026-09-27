import * as React from "react";

interface BeehivePatternProps {
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
  opacity?: number;
}

/**
 * Clean geometric honeycomb / beehive pattern inspired by natural hive cells.
 * Perfectly seamlessly connected regular hexagons.
 */
export function BeehiveCluster({
  className = "",
  strokeColor = "#D97706",
  strokeWidth = 1.5,
  opacity = 0.22,
}: BeehivePatternProps) {
  return (
    <svg
      className={`pointer-events-none select-none ${className}`}
      viewBox="0 0 320 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity }}
    >
      <g stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {/* Hexagon 1: Center Top */}
        <polygon points="160,20 205,46 205,98 160,124 115,98 115,46" />
        
        {/* Hexagon 2: Top Right */}
        <polygon points="250,72 295,98 295,150 250,176 205,150 205,98" />
        
        {/* Hexagon 3: Right Upper */}
        <polygon points="250,176 295,202 295,254 250,280 205,254 205,202" />
        
        {/* Hexagon 4: Center Bottom */}
        <polygon points="160,124 205,150 205,202 160,228 115,202 115,150" />
        
        {/* Hexagon 5: Top Left */}
        <polygon points="70,72 115,98 115,150 70,176 25,150 25,98" />
        
        {/* Hexagon 6: Left Bottom */}
        <polygon points="70,176 115,202 115,254 70,280 25,254 25,202" />
        
        {/* Hexagon 7: Very Top Right outer extension */}
        <polygon points="250,-32 295,-6 295,46 250,72 205,46 205,-6" />
      </g>
    </svg>
  );
}

/**
 * Large ambient honeycomb field for section backgrounds
 */
export function BeehiveBackground({
  className = "",
  strokeColor = "#D97706",
  strokeWidth = 1.2,
  opacity = 0.14,
}: BeehivePatternProps) {
  return (
    <svg
      className={`pointer-events-none select-none absolute ${className}`}
      viewBox="0 0 500 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity }}
    >
      <g stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {/* Row 1 */}
        <polygon points="90,15 130,38 130,84 90,107 50,84 50,38" />
        <polygon points="170,15 210,38 210,84 170,107 130,84 130,38" />
        <polygon points="250,15 290,38 290,84 250,107 210,84 210,38" />
        <polygon points="330,15 370,38 370,84 330,107 290,84 290,38" />
        <polygon points="410,15 450,38 450,84 410,107 370,84 370,38" />

        {/* Row 2 (offset) */}
        <polygon points="130,84 170,107 170,153 130,176 90,153 90,107" />
        <polygon points="210,84 250,107 250,153 210,176 170,153 170,107" />
        <polygon points="290,84 330,107 330,153 290,176 250,153 250,107" />
        <polygon points="370,84 410,107 410,153 370,176 330,153 330,107" />

        {/* Row 3 */}
        <polygon points="90,153 130,176 130,222 90,245 50,222 50,176" />
        <polygon points="170,153 210,176 210,222 170,245 130,222 130,176" />
        <polygon points="250,153 290,176 290,222 250,245 210,222 210,176" />
        <polygon points="330,153 370,176 370,222 330,245 290,222 290,176" />
        <polygon points="410,153 450,176 450,222 410,245 370,222 370,176" />

        {/* Row 4 (offset) */}
        <polygon points="130,222 170,245 170,291 130,314 90,291 90,222" />
        <polygon points="210,222 250,245 250,291 210,314 170,291 170,222" />
        <polygon points="290,222 330,245 330,291 290,314 250,291 250,222" />
        <polygon points="370,222 410,245 410,291 370,314 330,291 330,222" />
      </g>
    </svg>
  );
}
