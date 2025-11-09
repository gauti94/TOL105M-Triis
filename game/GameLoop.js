import { GamePiece } from "./GamePiece.js";

export class GameLoop {
    constructor(scene, input, gameBoard) {
        this.scene = scene;
        this.input = input;
        this.gameBoard = gameBoard;
        this.currentPiece = null;
        this.landedPieces = [];
        this.totalLayersCleared = 0;
        this.scoreElement = document.getElementById('score');
        this.spawnNewPiece();
    }

    spawnNewPiece() {
        this.currentPiece = new GamePiece({x:3, y: 17, z:3 }, GamePiece.getRandomColor());
        this.currentPiece.addToScene(this.scene);
        this.input.setPiece(this.currentPiece, this.landedPieces);
    }

    updateScore() {
        if (this.scoreElement) {
            this.scoreElement.textContent = `Score: ${this.totalLayersCleared}`;
        }
    }

    checkGameOver() {
        for (let piece of this.landedPieces) {
            const bounds = piece.getBounds();
            if (bounds.max.y >= 20) {
                return true;
            }
        }
        return false;
    }

    restartGame() {
        for (let piece of this.landedPieces) {
            piece.removeFromScene(this.scene);

        }
        this.landedPieces = [];
        this.totalLayersCleared = 0;
        this.updateScore();
        this.spawnNewPiece();
    }

    update() {
        if (!this.currentPiece) return;

        if (!this.currentPiece.hasLanded(this.landedPieces)) {
            this.currentPiece.fall(0.01, this.landedPieces);
        } else {
            this.landedPieces.push(this.currentPiece);

            if (this.checkGameOver()) {
                this.restartGame();
                return;
            }
            const cleared = this.gameBoard.checkForScore(this.landedPieces, this.scene);
            if (cleared > 0) {
                this.totalLayersCleared += cleared;
                this.updateScore();
                console.log(`Cleared ${cleared} layers!`);
                
            }
            this.spawnNewPiece();
        }

    }
}
