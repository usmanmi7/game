import { GameMap, MapTile, TerrainType } from './types';

const MAP_WIDTH = 80;
const MAP_HEIGHT = 60;

function createEmptyMap(): MapTile[][] {
  const tiles: MapTile[][] = [];
  for (let y = 0; y < MAP_HEIGHT; y++) {
    tiles[y] = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      tiles[y][x] = {
        terrain: TerrainType.GRASS,
        obstacle: null,
        obstaclePos: null,
      };
    }
  }
  return tiles;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRiver(
  tiles: MapTile[][],
  startY: number,
  horizontal: boolean
): void {
  let x = randomInt(0, MAP_WIDTH - 1);
  let y = startY;

  if (horizontal) {
    // River flows left to right
    x = 0;
    for (let step = 0; step < MAP_WIDTH; step++) {
      const width = randomInt(2, 4);
      for (let dy = 0; dy < width; dy++) {
        const cy = y + dy;
        if (cy >= 0 && cy < MAP_HEIGHT) {
          tiles[cy][x] = {
            terrain: TerrainType.WATER,
            obstacle: null,
            obstaclePos: null,
          };
        }
      }
      // Add dirt banks
      for (let dy = -1; dy <= width; dy++) {
        const cy = y + dy;
        if (cy >= 0 && cy < MAP_HEIGHT && tiles[cy][x].terrain !== TerrainType.WATER) {
          tiles[cy][x] = {
            terrain: TerrainType.DIRT,
            obstacle: null,
            obstaclePos: null,
          };
        }
      }
      // Random walk for river direction
      const drift = Math.random();
      if (drift < 0.3 && y > 2) {
        y -= 1;
      } else if (drift > 0.7 && y < MAP_HEIGHT - 6) {
        y += 1;
      }
      x++;
    }
  } else {
    // River flows top to bottom
    for (let step = 0; step < MAP_HEIGHT; step++) {
      const width = randomInt(2, 3);
      for (let dx = 0; dx < width; dx++) {
        const cx = x + dx;
        if (cx >= 0 && cx < MAP_WIDTH) {
          tiles[y][cx] = {
            terrain: TerrainType.WATER,
            obstacle: null,
            obstaclePos: null,
          };
        }
      }
      // Add dirt banks
      for (let dx = -1; dx <= width; dx++) {
        const cx = x + dx;
        if (cx >= 0 && cx < MAP_WIDTH && tiles[y][cx].terrain !== TerrainType.WATER) {
          tiles[y][cx] = {
            terrain: TerrainType.DIRT,
            obstacle: null,
            obstaclePos: null,
          };
        }
      }
      // Random walk
      const drift = Math.random();
      if (drift < 0.3 && x > 2) {
        x -= 1;
      } else if (drift > 0.7 && x < MAP_WIDTH - 6) {
        x += 1;
      }
      y++;
    }
  }
}

export function generateMap(): GameMap {
  const tiles = createEmptyMap();

  // Generate 2-3 rivers
  const riverCount = randomInt(2, 3);
  for (let i = 0; i < riverCount; i++) {
    const horizontal = Math.random() > 0.4;
    if (horizontal) {
      generateRiver(tiles, randomInt(10, MAP_HEIGHT - 15), true);
    } else {
      generateRiver(tiles, 0, false);
    }
  }

  // Place border trees
  for (let x = 0; x < MAP_WIDTH; x++) {
    for (let y = 0; y < MAP_HEIGHT; y++) {
      if (
        x === 0 ||
        x === MAP_WIDTH - 1 ||
        y === 0 ||
        y === MAP_HEIGHT - 1
      ) {
        if (tiles[y][x].terrain !== TerrainType.WATER) {
          tiles[y][x].obstacle = 'tree';
          tiles[y][x].obstaclePos = { x: x * 48, y: y * 48 };
        }
      }
    }
  }

  // Clear area around center for starting position
  const centerX = Math.floor(MAP_WIDTH / 2);
  const centerY = Math.floor(MAP_HEIGHT / 2);
  const clearRadius = 5;

  for (let y = centerY - clearRadius; y <= centerY + clearRadius; y++) {
    for (let x = centerX - clearRadius; x <= centerX + clearRadius; x++) {
      if (x > 0 && x < MAP_WIDTH - 1 && y > 0 && y < MAP_HEIGHT - 1) {
        tiles[y][x].terrain = TerrainType.GRASS;
        tiles[y][x].obstacle = null;
        tiles[y][x].obstaclePos = null;
      }
    }
  }

  // Scatter trees (15% of grass tiles)
  for (let y = 1; y < MAP_HEIGHT - 1; y++) {
    for (let x = 1; x < MAP_WIDTH - 1; x++) {
      // Skip center clearing
      if (
        x >= centerX - clearRadius &&
        x <= centerX + clearRadius &&
        y >= centerY - clearRadius &&
        y <= centerY + clearRadius
      ) {
        continue;
      }

      if (tiles[y][x].terrain === TerrainType.GRASS && !tiles[y][x].obstacle) {
        if (Math.random() < 0.15) {
          tiles[y][x].obstacle = 'tree';
          tiles[y][x].obstaclePos = { x: x * 48, y: y * 48 };
        }
      }
    }
  }

  // Scatter rocks (5% density on grass and dirt)
  for (let y = 1; y < MAP_HEIGHT - 1; y++) {
    for (let x = 1; x < MAP_WIDTH - 1; x++) {
      if (
        x >= centerX - clearRadius &&
        x <= centerX + clearRadius &&
        y >= centerY - clearRadius &&
        y <= centerY + clearRadius
      ) {
        continue;
      }

      if (
        (tiles[y][x].terrain === TerrainType.GRASS ||
          tiles[y][x].terrain === TerrainType.DIRT) &&
        !tiles[y][x].obstacle
      ) {
        if (Math.random() < 0.05) {
          tiles[y][x].obstacle = 'rock';
          tiles[y][x].obstaclePos = { x: x * 48, y: y * 48 };
        }
      }
    }
  }

  // Scatter bushes (8% density on grass)
  for (let y = 1; y < MAP_HEIGHT - 1; y++) {
    for (let x = 1; x < MAP_WIDTH - 1; x++) {
      if (
        x >= centerX - clearRadius &&
        x <= centerX + clearRadius &&
        y >= centerY - clearRadius &&
        y <= centerY + clearRadius
      ) {
        continue;
      }

      if (tiles[y][x].terrain === TerrainType.GRASS && !tiles[y][x].obstacle) {
        if (Math.random() < 0.08) {
          tiles[y][x].obstacle = 'bush';
          tiles[y][x].obstaclePos = { x: x * 48, y: y * 48 };
        }
      }
    }
  }

  return {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    tiles,
  };
}

export function isTileWalkable(map: GameMap, tileX: number, tileY: number): boolean {
  if (tileX < 0 || tileX >= map.width || tileY < 0 || tileY >= map.height) {
    return false;
  }
  const tile = map.tiles[tileY][tileX];
  if (tile.terrain === TerrainType.WATER) {
    return false;
  }
  if (tile.obstacle === 'tree' || tile.obstacle === 'rock') {
    return false;
  }
  return true;
}

export function isTileWalkableForAnimal(
  map: GameMap,
  tileX: number,
  tileY: number,
  canSwim: boolean
): boolean {
  if (tileX < 0 || tileX >= map.width || tileY < 0 || tileY >= map.height) {
    return false;
  }
  const tile = map.tiles[tileY][tileX];
  if (tile.terrain === TerrainType.WATER && !canSwim) {
    return false;
  }
  if (tile.obstacle === 'tree' || tile.obstacle === 'rock') {
    return false;
  }
  return true;
}

export { MAP_WIDTH, MAP_HEIGHT };
