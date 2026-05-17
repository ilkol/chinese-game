import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const PuzzleMap = ({ userProgress = {} }) => {
  const S = 80; const N = 5; const h = 30; const s1 = 28; const ew = 24;
  
  // URL твоей фоновой картинки (карты)
  const mapImage = "https://freepik.com";

  const unlockedCount = 12; // Для теста

  const grid = useMemo(() => {
    const verticalEdges = [[-1, -1, -1, -1], [1, -1, 1, -1], [-1, 1, 1, -1], [1, -1, 1, 1]];
    const horizontalEdges = [[1, -1, 1, -1, 1], [-1, 1, -1, -1, 1], [1, -1, 1, -1, 1]];
    const tiles = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 5; c++) {
        tiles.push({
          id: r * 5 + c, r, c,
          t: r === 0 ? 0 : -horizontalEdges[r - 1][c],
          re: c === 4 ? 0 : verticalEdges[r][c],
          b: r === 3 ? 0 : horizontalEdges[r][c],
          l: c === 0 ? 0 : -verticalEdges[r][c - 1],
        });
      }
    }
    return tiles;
  }, []);

  const getPath = (t) => {
    const top = t.t === 0 ? `h ${S}` : `h ${s1} c ${-N},${-t.t * h} ${ew + N},${-t.t * h} ${ew},0 h ${s1}`;
    const right = t.re === 0 ? `v ${S}` : `v ${s1} c ${t.re * h},${-N} ${t.re * h},${ew + N} 0,${ew} v ${s1}`;
    const bottom = t.b === 0 ? `h ${-S}` : `h ${-s1} c ${N},${t.b * h} ${-(ew + N)},${t.b * h} ${-ew},0 h ${-s1}`;
    const left = t.l === 0 ? `v ${-S}` : `v ${-s1} c ${-t.l * h},${N} ${-t.l * h},${-(ew + N)} 0,${-ew} v ${-s1}`;
    return `M ${t.c * S},${t.r * S} ${top} ${right} ${bottom} ${left} Z`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#0a1033' }}>
      <div className="w-full max-w-[600px] relative">
        <svg viewBox={`-20 -20 ${5 * S + 40} ${4 * S + 40}`} className="w-full h-auto overflow-visible">
          <defs>
            {/* Создаем паттерн для каждого кусочка, чтобы картинка была цельной */}
            {grid.map((tile) => (
              <pattern 
                key={`pattern-${tile.id}`}
                id={`pic-${tile.id}`} 
                patternUnits="userSpaceOnUse" 
                width={5 * S} height={4 * S}
                x={0} y={0}
              >
                <image 
                  href={mapImage} 
                  width={5 * S} height={4 * S} 
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>
            ))}
          </defs>

          {grid.map((tile, i) => {
            const isUnlocked = i < unlockedCount;
            return (
              <motion.path
                key={i}
                d={getPath(tile)}
                initial={false}
                animate={{
                  // Если открыт — показываем фрагмент картинки, если нет — синий "туман"
                  fill: isUnlocked ? `url(#pic-${tile.id})` : 'rgba(30, 58, 138, 0.4)',
                  stroke: isUnlocked ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)',
                }}
                strokeWidth="0.5"
                className="transition-all duration-1000"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default PuzzleMap;
