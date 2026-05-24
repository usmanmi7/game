'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from '@/game/engine';
import { loadSprites } from '@/game/sprites';
import { TimeOfDay } from '@/game/types';

type GameState = 'title' | 'loading' | 'playing';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState>('title');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(TimeOfDay.DAY);

  const startGame = useCallback(async () => {
    setGameState('loading');

    try {
      const sprites = await loadSprites();

      if (canvasRef.current) {
        const engine = new GameEngine(canvasRef.current, sprites);
        engineRef.current = engine;
        engine.onTimeChange = (time) => setTimeOfDay(time);
        engine.init();
        engine.start();
        setGameState('playing');
      }
    } catch (err) {
      console.error('Failed to start game:', err);
      setGameState('title');
    }
  }, []);

  const toggleTime = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.toggleTimeOfDay();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.cleanup();
        engineRef.current = null;
      }
    };
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#000',
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: gameState === 'playing' ? 'block' : 'none',
          width: '100vw',
          height: '100vh',
        }}
      />

      {/* Night/Day Toggle Button */}
      {gameState === 'playing' && (
        <button
          onClick={toggleTime}
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '20px',
            padding: '10px 20px',
            fontSize: '14px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            color: '#ffffff',
            background: timeOfDay === TimeOfDay.DAY
              ? 'rgba(30, 30, 80, 0.7)'
              : 'rgba(80, 60, 20, 0.7)',
            border: timeOfDay === TimeOfDay.DAY
              ? '2px solid #6688cc'
              : '2px solid #d4a44a',
            borderRadius: '8px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.3s ease',
            zIndex: 100,
            userSelect: 'none',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
          }}
        >
          {timeOfDay === TimeOfDay.DAY ? '🌙 Night Mode' : '☀ Day Mode'}
        </button>
      )}

      {gameState === 'title' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, #0a1a0a 0%, #1a3a1a 40%, #0d2d0d 100%)',
            fontFamily: 'monospace',
          }}
        >
          {/* Forest background decorations */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            {/* Animated tree silhouettes */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  bottom: `${Math.random() * 30}%`,
                  left: `${(i / 20) * 100 + Math.random() * 5}%`,
                  width: '30px',
                  height: `${60 + Math.random() * 80}px`,
                  background:
                    'linear-gradient(180deg, #1a4a1a 0%, #0d2d0d 100%)',
                  clipPath:
                    'polygon(50% 0%, 20% 40%, 30% 40%, 10% 70%, 25% 70%, 0% 100%, 100% 100%, 75% 70%, 90% 70%, 70% 40%, 80% 40%)',
                  opacity: 0.3 + Math.random() * 0.4,
                }}
              />
            ))}
          </div>

          {/* Title */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(2rem, 6vw, 4.5rem)',
                fontWeight: 'bold',
                color: '#d4a44a',
                textShadow:
                  '0 0 20px rgba(212, 164, 74, 0.5), 0 4px 8px rgba(0, 0, 0, 0.8), 2px 2px 0 #1a0a00',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem',
                lineHeight: 1.2,
              }}
            >
              WILD FOREST
            </h1>
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                fontWeight: 'bold',
                color: '#8ab44a',
                textShadow:
                  '0 0 15px rgba(138, 180, 74, 0.4), 0 3px 6px rgba(0, 0, 0, 0.8)',
                letterSpacing: '0.1em',
                marginBottom: '2rem',
              }}
            >
              HUNTER
            </h2>

            <div
              style={{
                width: '200px',
                height: '2px',
                background:
                  'linear-gradient(90deg, transparent, #d4a44a, transparent)',
                margin: '0 auto 2rem',
              }}
            />

            <p
              style={{
                color: '#7a9a5a',
                fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
                marginBottom: '0.5rem',
                letterSpacing: '0.05em',
              }}
            >
              Hunt animals. Survive the wild. Earn your glory.
            </p>
            <p
              style={{
                color: '#5a7a3a',
                fontSize: 'clamp(0.6rem, 1.2vw, 0.8rem)',
                marginBottom: '2rem',
                letterSpacing: '0.03em',
              }}
            >
              Beware of wolves and bears!
            </p>

            <button
              onClick={startGame}
              style={{
                padding: '14px 48px',
                fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                letterSpacing: '0.15em',
                color: '#1a0a00',
                background: 'linear-gradient(180deg, #d4a44a 0%, #b8842a 100%)',
                border: '2px solid #8a6a2a',
                borderRadius: '4px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                boxShadow:
                  '0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background =
                  'linear-gradient(180deg, #e4b45a 0%, #c8943a 100%)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 6px 16px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 20px rgba(212, 164, 74, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background =
                  'linear-gradient(180deg, #d4a44a 0%, #b8842a 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
              }}
            >
              Start Game
            </button>
          </div>

          {/* Controls info */}
          <div
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {[
                { key: 'Arrow Keys', action: 'Move' },
                { key: 'Space', action: 'Attack' },
                { key: 'P', action: 'Pause' },
                { key: 'N', action: 'Night/Day' },
              ].map((ctrl) => (
                <div
                  key={ctrl.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      padding: '4px 10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px',
                      color: '#d4a44a',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                    }}
                  >
                    {ctrl.key}
                  </span>
                  <span
                    style={{
                      color: '#7a9a5a',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                    }}
                  >
                    {ctrl.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {gameState === 'loading' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a1a0a',
            fontFamily: 'monospace',
          }}
        >
          <div
            style={{
              fontSize: '1.5rem',
              color: '#d4a44a',
              marginBottom: '1.5rem',
              letterSpacing: '0.1em',
            }}
          >
            Loading Forest...
          </div>
          <div
            style={{
              width: '200px',
              height: '4px',
              background: '#1a3a1a',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '60%',
                height: '100%',
                background: 'linear-gradient(90deg, #8ab44a, #d4a44a)',
                borderRadius: '2px',
                animation: 'pulse 1s ease-in-out infinite',
              }}
            />
          </div>
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 0.5; width: 40%; }
              50% { opacity: 1; width: 80%; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
