import * as THREE from "three";

const FIELD_W = 6; // X
const FIELD_D = 6; // Z
const FIELD_H = 20; // Y

const halfW = FIELD_W * 0.5;
const halfD = FIELD_D * 0.5;
const halfH = FIELD_H * 0.5;

const BOX_CENTER = new THREE.Vector3(halfW, halfH, halfD);

export class GameBoard {
  constructor() {
    this.group = new THREE.Group();
    this.createBoard();
  }

  createBoard() {
    const geometry = new THREE.BoxGeometry(FIELD_W, FIELD_H, FIELD_D);
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);

    wireframe.position.set(halfW, halfH, halfD);

    this.group.add(wireframe);
  }

isLayerFull(y, landedPieces) {
        const cubesInLayer = [];
        
        for (let piece of landedPieces) {
            piece.group.updateMatrixWorld(true);
            
            piece.pivot.children.forEach(cube => {
                const worldPos = new THREE.Vector3();
                cube.getWorldPosition(worldPos);
                
                if (Math.abs(worldPos.y - y) < 0.5) {
                    cubesInLayer.push({ x: worldPos.x, z: worldPos.z });
                }
            });
        }
        
        
        const occupied = new Set();
        for (let cube of cubesInLayer) {
            const gridX = Math.round(cube.x);
            const gridZ = Math.round(cube.z);
            occupied.add(`${gridX},${gridZ}`);
        }
        
        
        const gridSize = FIELD_W * FIELD_D; // 36 staðsetningar
        
        if (occupied.size === gridSize) {
            return true;
        }
        
        return false;
    }

  clearLayer(y, landedPieces, scene) {
    const piecesToRemove = [];
    for (let piece of landedPieces) {
      piece.group.updateMatrixWorld(true);
      const cubesToRemove = [];
      piece.pivot.children.forEach((cube) => {
        const worldPos = new THREE.Vector3();
        cube.getWorldPosition(worldPos);
        if (Math.abs(worldPos.y - y) < 0.5) {
          cubesToRemove.push(cube);
        }
      });

      cubesToRemove.forEach((cube) => piece.pivot.remove(cube));

      if (piece.pivot.children.length === 0) {
        piecesToRemove.push(piece);
      }
    }
    for (let piece of piecesToRemove) {
      piece.removeFromScene(scene);
      const index = landedPieces.indexOf(piece);
      if (index > -1) {
        landedPieces.splice(index, 1);
      }
    }

    for (let piece of landedPieces) {
      piece.group.updateMatrixWorld(true);

      let lowestY = Infinity;
      piece.pivot.children.forEach((cube) => {
        const worldPos = new THREE.Vector3();
        cube.getWorldPosition(worldPos);
        lowestY = Math.min(lowestY, worldPos.y);
      });
      if (lowestY > y) {
        piece.group.position.y -= 1;
      }
    }
  }

  checkForScore(landedPieces, scene) {
        let clearedLayers = 0;
        
        
        for (let y = 0.5; y < FIELD_H; y += 1) {
            if (this.isLayerFull(y, landedPieces)) {
                this.clearLayer(y, landedPieces, scene);
                clearedLayers++;
                y -= 1;
            }
        }
        
        return clearedLayers;
    }

  addToScene(scene) {
    scene.add(this.group);
  }
}
