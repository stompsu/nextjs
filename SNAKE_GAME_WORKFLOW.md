# Snake Game - Implementation Workflow

## Quick Start Guide

### For Developers

#### Step 1: Create File Structure
```bash
# Create component directory
mkdir -p src/components/SnakeGame

# Create files
touch src/components/SnakeGame.tsx
touch src/components/SnakeGame/types.ts
touch src/components/SnakeGame/useSnakeGame.ts
touch src/components/SnakeGame/SnakeGameBoard.tsx
touch src/components/SnakeGame/SnakeGameControls.tsx
touch src/components/SnakeGame/styles.module.css

# Create Sitecore definition
touch sitecore/definitions/components/SnakeGame.sitecore.ts

# Create default content
mkdir -p data/component-content/SnakeGame
touch data/component-content/SnakeGame/en.yml
```

#### Step 2: Implementation Order
1. **types.ts** - Define all types and constants
2. **useSnakeGame.ts** - Implement game logic hook
3. **SnakeGameBoard.tsx** - Create board rendering component
4. **SnakeGameControls.tsx** - Create controls UI component
5. **styles.module.css** - Add styling
6. **SnakeGame.tsx** - Create main component
7. **SnakeGame.sitecore.ts** - Add Sitecore manifest
8. **en.yml** - Add default content

#### Step 3: Build and Test
```bash
# Bootstrap the application (generates component mappings)
npm run bootstrap

# Start development server
npm start

# Application runs at http://localhost:3000
```

#### Step 4: Verify Integration
1. Check that component appears in Sitecore component list
2. Add component to a page in disconnected mode
3. Verify all fields are editable
4. Test game functionality

### For Content Editors

#### Adding the Snake Game to a Page
1. Open Sitecore Experience Editor
2. Navigate to the page where you want to add the game
3. Click on a placeholder to add a component
4. Search for "SnakeGame" in the component list
5. Click to add the component

#### Configuring the Game
1. **Game Title** (`heading` field):
   - Enter a title like "Classic Snake Game" or "Challenge Yourself!"
   
2. **Difficulty Level** (`difficulty` field):
   - Enter one of: `Easy`, `Medium`, or `Hard`
   - Case-sensitive, must match exactly
   - Default: `Medium`
   
3. **Maximum Points to Win** (`maxPoints` field):
   - Enter a number between 1 and 1000
   - Recommended: 50 for Easy, 100 for Medium, 150 for Hard
   - Default: 50
   
4. **Game Instructions** (`instructions` field):
   - Rich text field - can include formatting
   - Explain controls and rules
   - Keep it concise

#### Example Configurations

**Easy Challenge**:
- Heading: "Beginner Snake Game"
- Difficulty: "Easy"
- Max Points: 30
- Instructions: "Perfect for first-time players!"

**Medium Challenge**:
- Heading: "Classic Snake Game"
- Difficulty: "Medium"
- Max Points: 50
- Instructions: "The original challenge!"

**Hard Challenge**:
- Heading: "Expert Snake Challenge"
- Difficulty: "Hard"
- Max Points: 100
- Instructions: "Only for the best players!"

## Component Interaction Flow

```
┌─────────────────────────────────────────────────────────┐
│                     SnakeGame.tsx                        │
│  (Main Component - Sitecore Integration)                │
│                                                          │
│  - Receives Sitecore fields                             │
│  - Validates and parses difficulty & maxPoints          │
│  - Initializes useSnakeGame hook                        │
│  - Renders heading, instructions, and game area         │
└─────────────────┬──────────────────┬────────────────────┘
                  │                  │
                  ▼                  ▼
    ┌──────────────────────┐   ┌──────────────────────┐
    │  SnakeGameControls   │   │   SnakeGameBoard     │
    │  - Display stats     │   │   - Render grid      │
    │  - Start/Pause/Reset │   │   - Show snake       │
    │  - Game status       │   │   - Show food        │
    └──────────┬───────────┘   └──────────┬───────────┘
               │                          │
               └──────────┬───────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │   useSnakeGame Hook    │
              │                        │
              │  Game State:           │
              │  - snake position      │
              │  - food position       │
              │  - direction           │
              │  - score               │
              │  - gameStatus          │
              │                        │
              │  Game Logic:           │
              │  - moveSnake()         │
              │  - changeDirection()   │
              │  - checkCollision()    │
              │  - generateFood()      │
              │  - startGame()         │
              │  - pauseGame()         │
              │  - resetGame()         │
              └────────────────────────┘
```

## Game State Machine

```
┌──────────┐
│   IDLE   │  ← Initial state when page loads
└────┬─────┘
     │
     │ [User clicks "Start Game"]
     │
     ▼
┌──────────┐
│ PLAYING  │  ← Snake moves automatically
└─┬──┬──┬──┘    User controls direction
  │  │  │
  │  │  │ [User clicks "Pause"]
  │  │  │
  │  │  ▼
  │  │  ┌──────────┐
  │  │  │  PAUSED  │  ← Game frozen, can resume or reset
  │  │  └────┬─────┘
  │  │       │
  │  │       │ [User clicks "Resume"]
  │  │       │
  │  │       └────────────┐
  │  │                    │
  │  │ [Collision detected]  [User clicks "Start Game"]
  │  │                    │
  │  ▼                    │
  │  ┌──────────┐        │
  │  │   LOST   │  ← Game over, show score
  │  └────┬─────┘        │
  │       │              │
  │       │ [User clicks "Reset"]
  │       │              │
  │       └──────┬───────┘
  │              │
  │ [Score >= maxPoints]
  │              │
  ▼              │
┌──────────┐    │
│   WON    │  ← Victory! Show celebration
└────┬─────┘    │
     │          │
     │ [User clicks "Reset"]
     │          │
     └──────────┘
         │
         ▼
    [Back to IDLE]
```

## Game Loop Flow

```
┌─────────────────────────────────────────────┐
│  Every {speed}ms while gameStatus='playing' │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Calculate new head   │
        │  position based on    │
        │  current direction    │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Check collision     │
        │   with walls or       │
        │   self                │
        └───────┬───────────────┘
                │
        ┌───────┴────────┐
        │                │
    [Collision]      [No Collision]
        │                │
        ▼                ▼
  ┌──────────┐    ┌──────────────┐
  │   LOST   │    │ Check if new │
  └──────────┘    │ head is on   │
                  │ food         │
                  └───────┬──────┘
                          │
                  ┌───────┴────────┐
                  │                │
              [On Food]      [Not on Food]
                  │                │
                  ▼                ▼
        ┌────────────────┐   ┌─────────────┐
        │ Grow snake     │   │ Move snake  │
        │ Increment score│   │ (remove tail)│
        │ Generate new   │   └─────────────┘
        │ food           │
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │ Check if score │
        │ >= maxPoints   │
        └────────┬───────┘
                 │
         ┌───────┴────────┐
         │                │
    [Reached]        [Not Reached]
         │                │
         ▼                │
   ┌──────────┐           │
   │   WON    │           │
   └──────────┘           │
                          │
                          ▼
                   [Continue Game]
```

## Keyboard Input Processing

```
┌─────────────────────────────┐
│  User presses key           │
└───────────────┬─────────────┘
                │
                ▼
    ┌───────────────────────┐
    │ Is gameStatus         │
    │ 'playing'?            │
    └───────┬───────────────┘
            │
    ┌───────┴────────┐
    │                │
  [No]             [Yes]
    │                │
    ▼                ▼
[Ignore]   ┌────────────────┐
           │ Map key to     │
           │ direction:     │
           │ ↑/W → UP      │
           │ ↓/S → DOWN    │
           │ ←/A → LEFT    │
           │ →/D → RIGHT   │
           └────────┬───────┘
                    │
                    ▼
           ┌────────────────┐
           │ Is new direction│
           │ opposite to     │
           │ current?        │
           └────────┬────────┘
                    │
            ┌───────┴────────┐
            │                │
          [Yes]            [No]
            │                │
            ▼                ▼
        [Ignore]    ┌────────────────┐
                    │ Update direction│
                    │ in state        │
                    └────────────────┘
```

## Component Lifecycle

### 1. Component Mount
```
Component Mounts
    │
    ▼
useSnakeGame hook initializes
    │
    ├─ Initialize game state (idle)
    ├─ Place snake at center
    ├─ Generate initial food
    └─ Set up event listeners
    │
    ▼
Render initial UI
    │
    ├─ Show controls (Start button)
    ├─ Show empty board
    └─ Show instructions
```

### 2. Game Start
```
User clicks "Start Game"
    │
    ▼
startGame() called
    │
    ├─ Set gameStatus to 'playing'
    │
    ▼
useEffect detects gameStatus change
    │
    ├─ Start interval timer
    │   └─ Calls moveSnake() every {speed}ms
    │
    ▼
Component re-renders
    │
    ├─ Show "Pause" button
    └─ Begin game loop
```

### 3. Game Play
```
Game Loop Running
    │
    ├─ moveSnake() called at intervals
    │   ├─ Update snake position
    │   ├─ Check collisions
    │   └─ Update score if food eaten
    │
    ├─ Keyboard events trigger changeDirection()
    │   └─ Update direction in state
    │
    └─ Component re-renders on each state change
        └─ Board shows updated positions
```

### 4. Component Unmount
```
Component Unmounts
    │
    ├─ useEffect cleanup runs
    │   ├─ Clear interval timer
    │   └─ Remove keyboard event listeners
    │
    └─ Prevent memory leaks
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Sitecore CMS                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │  heading   │  │ difficulty │  │ maxPoints  │       │
│  │   field    │  │   field    │  │   field    │       │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘       │
└────────┼────────────────┼────────────────┼──────────────┘
         │                │                │
         └────────────────┴────────────────┘
                          │
                          ▼
         ┌─────────────────────────────────┐
         │      SnakeGame Component        │
         │   (Receives props from Sitecore)│
         └─────────────┬───────────────────┘
                       │
                       │ Parse and validate
                       │
                       ▼
         ┌─────────────────────────────────┐
         │      useSnakeGame Hook          │
         │   (Initialize with difficulty   │
         │    and maxPoints)               │
         └─────────────┬───────────────────┘
                       │
                       │ Return game state
                       │ and control functions
                       │
         ┌─────────────┴───────────────┐
         │                             │
         ▼                             ▼
┌─────────────────┐         ┌─────────────────┐
│ SnakeGameBoard  │         │SnakeGameControls│
│  - snake: []    │         │  - score: 0     │
│  - food: {}     │         │  - gameStatus   │
│  - gridSize     │         │  - buttons      │
└─────────────────┘         └─────────────────┘
```

## Performance Optimization Points

### 1. Render Optimization
```typescript
// Use useMemo for expensive grid generation
const grid = useMemo(() => {
  // Generate grid cells
}, [snake, food, gridSize]);

// Use useCallback for stable function references
const changeDirection = useCallback((dir) => {
  // Change direction logic
}, []);
```

### 2. State Update Optimization
```typescript
// Batch multiple state updates
setGameState(prev => ({
  ...prev,
  snake: newSnake,
  food: newFood,
  score: newScore,
  // All updated at once
}));
```

### 3. Event Listener Optimization
```typescript
// Add listener once, clean up on unmount
useEffect(() => {
  const handler = (e) => { /* ... */ };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, [dependencies]);
```

## Troubleshooting Guide

### Issue: Component doesn't appear in Sitecore
**Solution**: Run `npm run bootstrap` to regenerate component mappings

### Issue: Game doesn't start
**Check**:
1. Is difficulty value valid? (Easy/Medium/Hard)
2. Is maxPoints a valid number?
3. Check browser console for errors

### Issue: Snake moves too fast/slow
**Check**:
1. Verify difficulty setting
2. Check DIFFICULTY_SETTINGS in types.ts
3. Ensure speed value is in milliseconds

### Issue: Keyboard controls don't work
**Check**:
1. Is gameStatus 'playing'?
2. Are event listeners attached? (check useEffect)
3. Is browser window focused?

### Issue: Grid doesn't display correctly
**Check**:
1. CSS Grid is supported in browser
2. gridSize value is valid
3. Styles are loaded correctly

## Browser DevTools Tips

### React Developer Tools
1. Find "SnakeGame" component
2. Inspect props and state
3. Monitor state changes during gameplay

### Performance Profiling
1. Open Performance tab
2. Start recording
3. Play game for 30 seconds
4. Check for performance issues
5. Look for expensive re-renders

### Console Commands
```javascript
// Get current game state (if exposed for debugging)
window.__SNAKE_GAME_STATE

// Check if component is mounted
document.querySelector('[class*="snakeGameContainer"]')

// Monitor keyboard events
window.addEventListener('keydown', (e) => console.log(e.key))
```

## Version Control Workflow

### Branch Strategy
```bash
# Create feature branch
git checkout -b feature/snake-game

# Implement and commit incrementally
git add src/components/SnakeGame/types.ts
git commit -m "Add Snake Game type definitions"

git add src/components/SnakeGame/useSnakeGame.ts
git commit -m "Implement game logic hook"

# Continue for each file...
```

### Commit Message Convention
- `feat: Add Snake Game component`
- `feat: Implement game controls`
- `style: Add Snake Game styling`
- `docs: Add Snake Game documentation`
- `fix: Fix collision detection bug`
- `refactor: Optimize grid rendering`

## Deployment Checklist

Before pushing to production:

- [ ] All files created and in correct locations
- [ ] Code follows repository conventions
- [ ] No console errors or warnings
- [ ] Component works in disconnected mode
- [ ] Component works in connected mode (if applicable)
- [ ] All difficulty levels tested
- [ ] Max points setting tested with various values
- [ ] Win and loss conditions work correctly
- [ ] Keyboard controls responsive
- [ ] Visual appearance matches design
- [ ] Responsive on mobile, tablet, desktop
- [ ] Accessibility features work
- [ ] Performance is acceptable (60fps gameplay)
- [ ] Browser compatibility verified
- [ ] Documentation is complete
- [ ] Code reviewed by team member

## Post-Implementation Monitoring

### Metrics to Track
1. **Usage**: How often is the component added to pages?
2. **Engagement**: Average game duration
3. **Completion**: Win rate by difficulty level
4. **Performance**: Client-side performance metrics
5. **Errors**: Any JavaScript errors in production

### User Feedback Collection
1. Is the game fun and engaging?
2. Are the difficulty levels appropriate?
3. Are the controls intuitive?
4. Is the visual design appealing?
5. Any suggestions for improvement?

## Summary

This workflow document provides a comprehensive guide for implementing, testing, deploying, and maintaining the Snake Game component. Follow the steps in order, use the diagrams for reference, and consult the troubleshooting guide when issues arise.

The implementation is designed to be:
- **Modular**: Each component has a single responsibility
- **Maintainable**: Clear structure and documentation
- **Performant**: Optimized with React best practices
- **Accessible**: Keyboard controls and ARIA support
- **Integrated**: Seamlessly works with Sitecore JSS

Good luck with the implementation! 🐍🎮
