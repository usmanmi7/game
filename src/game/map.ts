import { GameMap, MapTile, TerrainType, TreeSize } from './types';

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

function randomTreeSize(): TreeSize {
  // Big and small tree combination - mostly large and small, some medium
  const roll = Math.random();
  if (roll < 0.4) return TreeSize.LARGE;    // 40% large trees (dominant big trees)
  if (roll < 0.65) return TreeSize.SMALL;   // 25% small trees (understory)
  return TreeSize.MEDIUM;                    // 35% medium trees
}

function generateRiver(
  tiles: MapTile[][],
  startY: number,
  horizontal: boolean
): void {
  let x = randomInt(0, MAP_WIDTH - 1);
  let y = startY;

  if (horizontal) {
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
      const drift = Math.random();
      if (drift < 0.3 && y > 2) {
        y -= 1;
      } else if (drift > 0.7 && y < MAP_HEIGHT - 6) {
        y += 1;
      }
      x++;
    }
  } else {
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

  // Place border trees (large for borders)
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
          tiles[y][x].treeSize = TreeSize.LARGE;
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
        tiles[y][x].treeSize = undefined;
      }
    }
  }

  // Scatter trees (18% of grass tiles) with big and small combination
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
        if (Math.random() < 0.18) {
          tiles[y][x].obstacle = 'tree';
          tiles[y][x].obstaclePos = { x: x * 48, y: y * 48 };
          tiles[y][x].treeSize = randomTreeSize();
        }
      }
    }
  }

  // Add tree clusters - groups of large and small trees together for natural look
  const clusterCount = randomInt(8, 14);
  for (let c = 0; c < clusterCount; c++) {
    const cx = randomInt(3, MAP_WIDTH - 4);
    const cy = randomInt(3, MAP_HEIGHT - 4);
    const clusterRadius = randomInt(2, 4);
    const isBigCluster = Math.random() < 0.6; // 60% chance of large tree cluster

    for (let dy = -clusterRadius; dy <= clusterRadius; dy++) {
      for (let dx = -clusterRadius; dx <= clusterRadius; dx++) {
        const tx = cx + dx;
        const ty = cy + dy;
        if (tx <= 0 || tx >= MAP_WIDTH - 1 || ty <= 0 || ty >= MAP_HEIGHT - 1) continue;
        if (
          tx >= centerX - clearRadius &&
          tx <= centerX + clearRadius &&
          ty >= centerY - clearRadius &&
          ty <= centerY + clearRadius
        ) continue;

        const tile = tiles[ty][tx];
        if (tile.terrain === TerrainType.GRASS && !tile.obstacle) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= clusterRadius && Math.random() < 0.7) {
            tile.obstacle = 'tree';
            tile.obstaclePos = { x: tx * 48, y: ty * 48 };
            // Big clusters have large trees, small clusters have small trees
            if (isBigCluster) {
              tile.treeSize = Math.random() < 0.7 ? TreeSize.LARGE : TreeSize.MEDIUM;
            } else {
              tile.treeSize = Math.random() < 0.6 ? TreeSize.SMALL : TreeSize.MEDIUM;
            }
          }
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
