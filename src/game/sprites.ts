import { Direction, SpriteMap } from './types';

const SPRITE_PATHS: Record<string, string> = {
  hunter: '/sprites/hunter.png',
  deer: '/sprites/deer.png',
  wolf: '/sprites/wolf.png',
  bear: '/sprites/bear.png',
  rabbit: '/sprites/rabbit.png',
  boar: '/sprites/boar.png',
  tree_large: '/sprites/tree_large.png',
  tree_medium: '/sprites/tree_medium.png',
  tree_small: '/sprites/tree_small.png',
  rock: '/sprites/rock.png',
  bush: '/sprites/bush.png',
  grass_tile: '/sprites/grass_tile.png',
  water_tile: '/sprites/water_tile.png',
  dirt_tile: '/sprites/dirt_tile.png',
};

export function loadSprites(): Promise<SpriteMap> {
  return new Promise((resolve) => {
    const sprites: SpriteMap = {};
    const keys = Object.keys(SPRITE_PATHS);
    let loaded = 0;
    const total = keys.length;

    keys.forEach((key) => {
      const img = new Image();
      img.onload = () => {
        sprites[key] = img;
        loaded++;
        if (loaded >= total) {
          resolve(sprites);
        }
      };
      img.onerror = () => {
        // Create a placeholder colored rectangle
        const canvas = document.createElement('canvas');
        canvas.width = 48;
        canvas.height = 48;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D | null;
        if (!ctx) return;
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(0, 0, 48, 48);
        const placeholder = new Image();
        placeholder.src = canvas.toDataURL();
        placeholder.onload = () => {
          sprites[key] = placeholder;
          loaded++;
          if (loaded >= total) {
            resolve(sprites);
          }
        };
      };
      img.src = SPRITE_PATHS[key];
    });
  });
}

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  direction?: Direction
): void {
  ctx.save();

  const centerX = x + width / 2;
  const centerY = y + height / 2;

  if (direction === Direction.LEFT) {
    ctx.translate(centerX, centerY);
    ctx.scale(-1, 1);
    ctx.translate(-centerX, -centerY);
  }

  if (direction === Direction.UP) {
    ctx.translate(centerX, centerY);
    ctx.scale(1, -1);
    ctx.translate(-centerX, -centerY);
  }

  ctx.drawImage(sprite, x, y, width, height);
  ctx.restore();
}
