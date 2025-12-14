# Snake Game - Technical Specifications

## Component Code Structure

### 1. Main Component Implementation

**File**: `/src/components/SnakeGame.tsx`

```typescript
import { JSX } from 'react';
import { Text, RichText, Field, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import SnakeGameBoard from './SnakeGame/SnakeGameBoard';
import SnakeGameControls from './SnakeGame/SnakeGameControls';
import { useSnakeGame } from './SnakeGame/useSnakeGame';
import styles from './SnakeGame/styles.module.css';

type SnakeGameProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    difficulty: Field<string>;
    maxPoints: Field<number>;
    instructions: Field<string>;
  };
};

const SnakeGame = ({ fields }: SnakeGameProps): JSX.Element => {
  const difficulty = fields.difficulty?.value || 'Medium';
  const maxPoints = parseInt(fields.maxPoints?.value?.toString() || '50', 10);
  
  const gameState = useSnakeGame(difficulty, maxPoints);

  return (
    <div className={styles.snakeGameContainer}>
      <Text tag="h2" className={styles.heading} field={fields.heading} />
      <RichText className={styles.instructions} field={fields.instructions} />
      
      <div className={styles.gameArea}>
        <SnakeGameControls gameState={gameState} />
        <SnakeGameBoard gameState={gameState} />
      </div>
    </div>
  );
};

export default withDatasourceCheck()<SnakeGameProps>(SnakeGame);
```

### 2. Custom Hook Implementation

**File**: `/src/components/SnakeGame/useSnakeGame.ts`

```typescript
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Direction, Position, GameState, DifficultyLevel, DIFFICULTY_SETTINGS } from './types';

export const useSnakeGame = (difficulty: string, maxPoints: number) => {
  const difficultyConfig = useMemo(() => {
    return DIFFICULTY_SETTINGS[difficulty as DifficultyLevel] || DIFFICULTY_SETTINGS.Medium;
  }, [difficulty]);

  const [gameState, setGameState] = useState<GameState>(() => ({
    snake: [{ x: 7, y: 7 }],
    food: { x: 10, y: 10 },
    direction: 'RIGHT',
    score: 0,
    gameStatus: 'idle',
    speed: difficultyConfig.speed,
  }));

  // Game logic functions
  const generateFood = useCallback((snake: Position[]): Position => {
    const gridSize = difficultyConfig.gridSize;
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [difficultyConfig.gridSize]);

  const checkCollision = useCallback((head: Position, snake: Position[]): boolean => {
    const gridSize = difficultyConfig.gridSize;
    // Wall collision
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      return true;
    }
    // Self collision
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
  }, [difficultyConfig.gridSize]);

  const moveSnake = useCallback(() => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing') return prev;
      if (!prev.snake.length) return prev; // Safety check for empty snake

      const head = prev.snake[0];
      let newHead: Position;

      switch (prev.direction) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y };
          break;
        default:
          return prev; // Handle unexpected direction
      }

      // Check collision
      if (checkCollision(newHead, prev.snake)) {
        return { ...prev, gameStatus: 'lost' };
      }

      const newSnake = [newHead, ...prev.snake];
      
      // Check food collision
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        const newScore = prev.score + 1;
        
        // Check win condition
        if (newScore >= maxPoints) {
          return { ...prev, snake: newSnake, score: newScore, gameStatus: 'won' };
        }
        
        return {
          ...prev,
          snake: newSnake,
          food: generateFood(newSnake),
          score: newScore,
        };
      }

      // Remove tail if no food eaten
      newSnake.pop();
      return { ...prev, snake: newSnake };
    });
  }, [checkCollision, generateFood, maxPoints]);

  const changeDirection = useCallback((newDirection: Direction) => {
    setGameState(prev => {
      // Prevent 180-degree turns
      const opposites: Record<Direction, Direction> = {
        UP: 'DOWN',
        DOWN: 'UP',
        LEFT: 'RIGHT',
        RIGHT: 'LEFT',
      };
      
      if (opposites[prev.direction] === newDirection) {
        return prev;
      }
      
      return { ...prev, direction: newDirection };
    });
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStatus: 'paused' }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      snake: [{ x: 7, y: 7 }],
      food: generateFood([{ x: 7, y: 7 }]),
      direction: 'RIGHT',
      score: 0,
      gameStatus: 'idle',
      speed: difficultyConfig.speed,
    });
  }, [generateFood, difficultyConfig.speed]);

  // Game loop
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    const interval = setInterval(moveSnake, gameState.speed);
    return () => clearInterval(interval);
  }, [gameState.gameStatus, gameState.speed, moveSnake]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.gameStatus !== 'playing') return;

      const keyMap: Record<string, Direction> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
        w: 'UP',
        s: 'DOWN',
        a: 'LEFT',
        d: 'RIGHT',
        W: 'UP',
        S: 'DOWN',
        A: 'LEFT',
        D: 'RIGHT',
      };

      const direction = keyMap[e.key];
      if (direction) {
        e.preventDefault();
        changeDirection(direction);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameStatus, changeDirection]);

  return {
    ...gameState,
    gridSize: difficultyConfig.gridSize,
    difficulty,
    maxPoints,
    startGame,
    pauseGame,
    resetGame,
    changeDirection,
  };
};
```

### 3. Type Definitions

**File**: `/src/components/SnakeGame/types.ts`

```typescript
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'won' | 'lost';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface DifficultyConfig {
  speed: number; // milliseconds per game tick
  gridSize: number;
}

export const DIFFICULTY_SETTINGS: Record<DifficultyLevel, DifficultyConfig> = {
  Easy: { speed: 200, gridSize: 15 },
  Medium: { speed: 120, gridSize: 20 },
  Hard: { speed: 80, gridSize: 25 },
};

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  score: number;
  gameStatus: GameStatus;
  speed: number;
}

export interface GameControls {
  startGame: () => void;
  pauseGame: () => void;
  resetGame: () => void;
  changeDirection: (direction: Direction) => void;
}

export type SnakeGameState = GameState & GameControls & {
  gridSize: number;
  difficulty: string;
  maxPoints: number;
};
```

### 4. Game Board Component

**File**: `/src/components/SnakeGame/SnakeGameBoard.tsx`

```typescript
import { JSX, useMemo } from 'react';
import { SnakeGameState } from './types';
import styles from './styles.module.css';

interface SnakeGameBoardProps {
  gameState: SnakeGameState;
}

const SnakeGameBoard = ({ gameState }: SnakeGameBoardProps): JSX.Element => {
  const { snake, food, gridSize, gameStatus } = gameState;

  const grid = useMemo(() => {
    const cells = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
        const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;

        let cellClass = styles.cell;
        if (isSnakeHead) cellClass += ` ${styles.snakeHead}`;
        else if (isSnakeBody) cellClass += ` ${styles.snakeBody}`;
        else if (isFood) cellClass += ` ${styles.food}`;

        cells.push(<div key={`${x}-${y}`} className={cellClass} />);
      }
    }
    return cells;
  }, [snake, food, gridSize]);

  return (
    <div className={styles.boardContainer}>
      <div 
        className={styles.board}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {grid}
      </div>
      
      {gameStatus === 'won' && (
        <div className={styles.overlay}>
          <div className={styles.message}>
            <h3>🎉 You Won!</h3>
            <p>You reached {gameState.maxPoints} points!</p>
          </div>
        </div>
      )}
      
      {gameStatus === 'lost' && (
        <div className={styles.overlay}>
          <div className={styles.message}>
            <h3>💀 Game Over!</h3>
            <p>Final Score: {gameState.score}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGameBoard;
```

### 5. Game Controls Component

**File**: `/src/components/SnakeGame/SnakeGameControls.tsx`

```typescript
import { JSX } from 'react';
import { SnakeGameState } from './types';
import styles from './styles.module.css';

interface SnakeGameControlsProps {
  gameState: SnakeGameState;
}

const SnakeGameControls = ({ gameState }: SnakeGameControlsProps): JSX.Element => {
  const { gameStatus, score, maxPoints, difficulty, startGame, pauseGame, resetGame } = gameState;

  return (
    <div className={styles.controls}>
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Score:</span>
          <span className={styles.statValue}>{score} / {maxPoints}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Difficulty:</span>
          <span className={styles.statValue}>{difficulty}</span>
        </div>
      </div>

      <div className={styles.buttons}>
        {gameStatus === 'idle' && (
          <button onClick={startGame} className={styles.startButton}>
            Start Game
          </button>
        )}
        
        {gameStatus === 'playing' && (
          <button onClick={pauseGame} className={styles.pauseButton}>
            Pause
          </button>
        )}
        
        {gameStatus === 'paused' && (
          <button onClick={startGame} className={styles.resumeButton}>
            Resume
          </button>
        )}
        
        {(gameStatus === 'won' || gameStatus === 'lost' || gameStatus === 'paused') && (
          <button onClick={resetGame} className={styles.resetButton}>
            Reset
          </button>
        )}
      </div>
      
      {gameStatus === 'idle' && (
        <div className={styles.hint}>
          Use Arrow Keys or WASD to control the snake
        </div>
      )}
    </div>
  );
};

export default SnakeGameControls;
```

### 6. CSS Styling

**File**: `/src/components/SnakeGame/styles.module.css`

```css
.snakeGameContainer {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.heading {
  text-align: center;
  color: #333;
  margin-bottom: 10px;
}

.instructions {
  text-align: center;
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
}

.gameArea {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.controls {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.stats {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.statItem {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.statLabel {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.statValue {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.buttons button {
  padding: 10px 24px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
}

.startButton,
.resumeButton {
  background-color: #4CAF50;
  color: white;
}

.startButton:hover,
.resumeButton:hover {
  background-color: #45a049;
}

.pauseButton {
  background-color: #FF9800;
  color: white;
}

.pauseButton:hover {
  background-color: #e68900;
}

.resetButton {
  background-color: #f44336;
  color: white;
}

.resetButton:hover {
  background-color: #da190b;
}

.hint {
  text-align: center;
  font-size: 12px;
  color: #999;
}

.boardContainer {
  position: relative;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 1;
}

.board {
  width: 100%;
  height: 100%;
  display: grid;
  gap: 1px;
  background-color: #ddd;
  border: 2px solid #333;
  border-radius: 4px;
  overflow: hidden;
}

.cell {
  background-color: #f9f9f9;
}

.snakeHead {
  background-color: #2E7D32;
  border-radius: 20%;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
}

.snakeBody {
  background-color: #4CAF50;
  border-radius: 10%;
}

.food {
  background-color: #f44336;
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(244, 67, 54, 0.5);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.message {
  text-align: center;
  color: white;
  padding: 30px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
}

.message h3 {
  font-size: 32px;
  margin-bottom: 10px;
}

.message p {
  font-size: 18px;
}

/* Responsive design */
@media (max-width: 768px) {
  .snakeGameContainer {
    padding: 10px;
  }

  .boardContainer {
    max-width: 90vw;
  }

  .stats {
    flex-direction: column;
    gap: 10px;
  }

  .buttons button {
    padding: 8px 16px;
    font-size: 14px;
  }
}

/* Accessibility - High contrast mode */
@media (prefers-contrast: high) {
  .snakeHead {
    background-color: #000;
  }

  .snakeBody {
    background-color: #333;
  }

  .food {
    background-color: #f00;
  }
}
```

## Sitecore Configuration

### Component Manifest

**File**: `/sitecore/definitions/components/SnakeGame.sitecore.ts`

```typescript
import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the SnakeGame component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when 'jss manifest' is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function SnakeGame(manifest: Manifest): void {
  manifest.addComponent({
    name: 'SnakeGame',
    templateName: 'SnakeGame',
    icon: SitecoreIcon.Games,
    fields: [
      { 
        name: 'heading', 
        type: CommonFieldTypes.SingleLineText,
        displayName: 'Game Title',
      },
      { 
        name: 'difficulty', 
        type: CommonFieldTypes.SingleLineText,
        displayName: 'Difficulty Level',
        standardValue: 'Medium',
      },
      { 
        name: 'maxPoints', 
        type: CommonFieldTypes.Number,
        displayName: 'Maximum Points to Win',
        standardValue: '50',
      },
      { 
        name: 'instructions', 
        type: CommonFieldTypes.RichText,
        displayName: 'Game Instructions',
      },
    ],
  });
}
```

### Default Content Data

**File**: `/data/component-content/SnakeGame/en.yml`

```yaml
id: snake-game-default
name: Snake Game Default
template: SnakeGame
fields:
  heading:
    value: "Classic Snake Game"
  difficulty:
    value: "Medium"
  maxPoints:
    value: 50
  instructions:
    value: |
      <div>
        <h3>How to Play</h3>
        <ul>
          <li>Use Arrow Keys or WASD to control the snake</li>
          <li>Eat the red food to grow and score points</li>
          <li>Avoid hitting the walls or yourself</li>
          <li>Reach the maximum points to win!</li>
        </ul>
        <p><strong>Difficulty Levels:</strong></p>
        <ul>
          <li><strong>Easy:</strong> Slower speed, smaller grid (15x15)</li>
          <li><strong>Medium:</strong> Normal speed, medium grid (20x20)</li>
          <li><strong>Hard:</strong> Fast speed, larger grid (25x25)</li>
        </ul>
      </div>
```

## Build and Development Commands

### Bootstrap and Generate Components
```bash
npm run bootstrap
```
This will:
1. Generate the component builder
2. Register SnakeGame component automatically
3. Create temp files for component mapping

### Development Mode
```bash
npm start
```
Runs in disconnected mode with hot reload

### Production Build
```bash
npm run build
npm run start:production
```

## Performance Optimization Notes

### 1. Memoization Strategy
```typescript
// In SnakeGameBoard.tsx
const grid = useMemo(() => {
  // Grid generation logic
}, [snake, food, gridSize]);
```

### 2. Event Handler Optimization
```typescript
// In useSnakeGame.ts
const changeDirection = useCallback((newDirection: Direction) => {
  // Direction change logic
}, []); // Empty deps - function is stable
```

### 3. State Update Batching
```typescript
// Multiple state updates in one setGameState call
setGameState(prev => ({
  ...prev,
  snake: newSnake,
  food: newFood,
  score: newScore,
}));
```

### 4. Efficient Grid Rendering
- Use CSS Grid for layout (GPU-accelerated)
- Minimize DOM updates with key props
- Use transform for animations if added

## Security Considerations

1. **Input Validation**: Validate Sitecore field values
   ```typescript
   let maxPoints = parseInt(fields.maxPoints?.value?.toString() || '50', 10);
   if (isNaN(maxPoints) || maxPoints < 1) {
     maxPoints = 50; // Fallback
   }
   ```

2. **XSS Prevention**: Use Sitecore's built-in field rendering
   ```typescript
   <RichText field={fields.instructions} /> // Sanitized by Sitecore
   ```

3. **Event Listener Cleanup**: Always cleanup in useEffect
   ```typescript
   useEffect(() => {
     window.addEventListener('keydown', handleKeyPress);
     return () => window.removeEventListener('keydown', handleKeyPress);
   }, []);
   ```

## Testing Checklist

### Unit Testing (if tests are added)
- [ ] `useSnakeGame` hook state management
- [ ] Direction change logic
- [ ] Collision detection
- [ ] Food generation
- [ ] Score calculation
- [ ] Win/loss conditions

### Integration Testing
- [ ] Component renders with valid props
- [ ] Component renders with invalid props
- [ ] Keyboard controls work
- [ ] Game state transitions
- [ ] Sitecore field integration

### Manual Testing
- [ ] All difficulty levels work
- [ ] Max points setting respected
- [ ] Game controls functional
- [ ] Visual appearance correct
- [ ] Responsive on different screen sizes
- [ ] Keyboard accessibility
- [ ] Browser compatibility

## Deployment Checklist

- [ ] Code reviewed and approved
- [ ] All files created in correct locations
- [ ] Component registered in Sitecore manifest
- [ ] Default content data provided
- [ ] Styles responsive and accessible
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] Tested in disconnected mode
- [ ] Tested in connected mode (if applicable)
- [ ] Browser compatibility verified
- [ ] Accessibility verified

## Known Limitations

1. **No Server-Side State**: Game state is client-side only
2. **No Persistence**: Scores don't persist across page refreshes (could add localStorage)
3. **Single Player Only**: No multiplayer support
4. **Fixed Grid**: Grid size determined by difficulty, not adjustable during play
5. **Keyboard Only**: No touch controls for mobile (could be added)

## Future Enhancement Ideas

1. **Local Storage**: Save high scores
2. **Power-ups**: Speed boost, invincibility, etc.
3. **Obstacles**: Add walls and barriers on the grid
4. **Themes**: Different visual themes/skins
5. **Sound Effects**: Add audio feedback
6. **Mobile Support**: Touch controls for mobile devices
7. **Leaderboard**: Global high scores (requires backend)
8. **Progressive Difficulty**: Speed increases over time
9. **Custom Grid Size**: Allow content editors to set grid size
10. **Multiplayer**: Two-player competitive mode
