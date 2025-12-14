# Snake Game - Quick Reference Guide

## 📋 Overview
Classic snake game component for Sitecore JSS Next.js with 3 difficulty levels and configurable maximum points.

## 🎯 Key Features
- ✅ Three difficulty levels (Easy, Medium, Hard)
- ✅ Configurable maximum points for winning
- ✅ Keyboard controls (Arrow keys + WASD)
- ✅ Full Sitecore CMS integration
- ✅ Responsive design
- ✅ Accessible gameplay

## 📁 File Structure
```
src/components/
├── SnakeGame.tsx                      # Main component (Sitecore integration)
└── SnakeGame/
    ├── types.ts                       # Type definitions & constants
    ├── useSnakeGame.ts               # Game logic hook
    ├── SnakeGameBoard.tsx            # Board rendering
    ├── SnakeGameControls.tsx         # Controls UI
    └── styles.module.css             # Styling

sitecore/definitions/components/
└── SnakeGame.sitecore.ts             # Manifest definition

data/component-content/SnakeGame/
└── en.yml                             # Default content
```

## 🎮 Game Mechanics

### Controls
- **Arrow Keys**: ↑ ↓ ← → for movement
- **WASD Keys**: W A S D for movement
- **Buttons**: Start, Pause, Resume, Reset

### Difficulty Levels
| Level  | Speed | Grid Size | Recommended Max Points |
|--------|-------|-----------|----------------------|
| Easy   | 200ms | 15×15     | 30-50                |
| Medium | 120ms | 20×20     | 50-100               |
| Hard   | 80ms  | 25×25     | 100-150              |

### Win/Loss Conditions
- **Win**: Score reaches or exceeds maxPoints
- **Lose**: Snake hits wall or itself

## 🔧 Configuration

### Sitecore Fields
| Field Name   | Type       | Default    | Description                |
|--------------|------------|------------|----------------------------|
| heading      | Text       | -          | Game title                 |
| difficulty   | Text       | "Medium"   | Easy/Medium/Hard           |
| maxPoints    | Number     | 50         | Points needed to win       |
| instructions | Rich Text  | -          | Game instructions          |

### Field Validation
```typescript
// Difficulty must be one of:
"Easy" | "Medium" | "Hard"

// MaxPoints should be:
1 <= maxPoints <= 1000

// Invalid values fall back to defaults
```

## 💻 Implementation Steps

### Quick Setup (5 steps)
1. **Create files** (see file structure above)
2. **Copy code** from SNAKE_GAME_TECHNICAL_SPECS.md
3. **Run bootstrap**: `npm run bootstrap`
4. **Start dev server**: `npm start`
5. **Test game** in browser

### Detailed Implementation
See SNAKE_GAME_IMPLEMENTATION_PLAN.md for full plan

## 🧪 Testing Checklist

### Core Functionality
- [ ] Game starts and stops correctly
- [ ] Snake moves in all 4 directions
- [ ] Food spawns and snake grows
- [ ] Collision detection works
- [ ] Score increments correctly
- [ ] Win condition triggers at maxPoints
- [ ] Loss condition triggers on collision

### Difficulty Levels
- [ ] Easy: 200ms speed, 15×15 grid
- [ ] Medium: 120ms speed, 20×20 grid
- [ ] Hard: 80ms speed, 25×25 grid

### UI/UX
- [ ] Controls are responsive
- [ ] Visual design is clear
- [ ] Game status messages display
- [ ] Responsive on all screen sizes

### Integration
- [ ] Component appears in Sitecore
- [ ] Fields are editable
- [ ] Default values work
- [ ] Invalid values handled gracefully

## 🐛 Common Issues & Solutions

### Component Not Showing
```bash
# Regenerate component mappings
npm run bootstrap
```

### Keyboard Not Working
- Check gameStatus is 'playing'
- Ensure browser window has focus
- Verify event listeners are attached

### Performance Issues
- Check grid size (smaller is better)
- Verify useMemo is used for grid
- Profile with React DevTools

### Visual Bugs
- Clear browser cache
- Check CSS modules are loading
- Verify styles.module.css exists

## 📊 Code Metrics

### Component Size
- Main component: ~100 lines
- Game hook: ~250 lines
- Board component: ~80 lines
- Controls component: ~80 lines
- Types: ~60 lines
- Styles: ~200 lines
- **Total**: ~770 lines of code

### Dependencies
- **External**: None (uses React + Sitecore JSS)
- **React hooks**: useState, useEffect, useCallback, useMemo
- **Sitecore**: Field, Text, RichText, withDatasourceCheck

### Performance
- **Target FPS**: 60fps during gameplay
- **Re-renders**: Minimized with memoization
- **Memory**: ~1-2MB for game state

## 🎨 Styling Guide

### Color Scheme
```css
/* Snake */
.snakeHead: #2E7D32 (dark green)
.snakeBody: #4CAF50 (green)

/* Food */
.food: #f44336 (red)

/* Board */
.board: #f9f9f9 (light gray cells)
.border: #333 (dark border)

/* Buttons */
.start: #4CAF50 (green)
.pause: #FF9800 (orange)
.reset: #f44336 (red)
```

### Responsive Breakpoints
```css
@media (max-width: 768px) {
  /* Mobile adjustments */
}
```

## 🔐 Security Notes

### Input Validation
```typescript
// Always validate Sitecore field values
const maxPoints = parseInt(value?.toString() || '50', 10);
if (isNaN(maxPoints) || maxPoints < 1) {
  maxPoints = 50; // Safe fallback
}
```

### XSS Prevention
```typescript
// Use Sitecore field components (auto-sanitized)
<RichText field={fields.instructions} />
// Never use dangerouslySetInnerHTML
```

### Event Cleanup
```typescript
// Always cleanup event listeners
useEffect(() => {
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, []);
```

## ♿ Accessibility

### Keyboard Support
- Full keyboard navigation
- No mouse required for gameplay
- Focus management on buttons

### Screen Readers
- ARIA labels on buttons
- Game status announcements
- Score updates announced

### Visual
- High contrast mode support
- Clear visual indicators
- Sufficient color contrast

## 📈 Future Enhancements

### Priority 1 (Easy wins)
- [ ] Local storage for high scores
- [ ] Sound effects toggle
- [ ] Touch controls for mobile

### Priority 2 (Medium effort)
- [ ] Power-ups system
- [ ] Obstacles on grid
- [ ] Multiple visual themes

### Priority 3 (Complex)
- [ ] Multiplayer mode
- [ ] Global leaderboard
- [ ] Progressive difficulty

## 📚 Documentation Links

### Full Documentation
- **SNAKE_GAME_IMPLEMENTATION_PLAN.md** - Complete implementation plan
- **SNAKE_GAME_TECHNICAL_SPECS.md** - Detailed code specifications
- **SNAKE_GAME_WORKFLOW.md** - Workflow diagrams and guides
- **SNAKE_GAME_QUICK_REFERENCE.md** - This document

### External Resources
- [Sitecore JSS Documentation](https://jss.sitecore.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Hooks Documentation](https://react.dev/reference/react)

## 🚀 Quick Commands

```bash
# Development
npm run bootstrap          # Generate component mappings
npm start                  # Start dev server (disconnected)
npm run start:connected    # Start dev server (connected)

# Build
npm run build              # Production build
npm run start:production   # Start production server

# Code Quality
npm run lint               # Run ESLint

# Component Scaffolding (if needed later)
npm run scaffold           # Interactive component generator
```

## 📝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/snake-game

# Stage and commit
git add src/components/SnakeGame*
git commit -m "feat: Add Snake Game component"

git add sitecore/definitions/components/SnakeGame.sitecore.ts
git commit -m "feat: Add Snake Game Sitecore manifest"

git add data/component-content/SnakeGame/
git commit -m "feat: Add Snake Game default content"

# Push to remote
git push origin feature/snake-game
```

## 👥 Team Contacts

### For Development Questions
- Check code comments
- Review technical specs document
- Search for similar patterns in existing components

### For Sitecore Questions
- Review Sitecore JSS documentation
- Check existing component manifests
- Test in disconnected mode first

### For Design Questions
- Review styles.module.css
- Check responsive breakpoints
- Test on various screen sizes

## 🎓 Learning Resources

### Understanding the Hook Pattern
The `useSnakeGame` hook encapsulates all game logic:
- State management
- Game loop timing
- Keyboard input handling
- Collision detection
- Score calculation

### Understanding Component Composition
```
SnakeGame (parent)
  ├─ SnakeGameControls (UI)
  └─ SnakeGameBoard (Canvas)
```

### Understanding Sitecore Integration
1. Component definition (*.sitecore.ts)
2. Component implementation (*.tsx)
3. Default content (en.yml)
4. Component registration (automatic)

## ✅ Success Criteria

A successful implementation includes:
- ✅ All 3 difficulty levels working
- ✅ MaxPoints setting respected
- ✅ Sitecore fields editable
- ✅ Responsive design
- ✅ No console errors
- ✅ Smooth gameplay (60fps)
- ✅ Keyboard accessible
- ✅ Cross-browser compatible

## 📞 Support

### Issues During Implementation
1. Check this quick reference first
2. Review detailed technical specs
3. Check existing similar components
4. Test with default values
5. Check browser console for errors

### Common Gotchas
- Remember to run `npm run bootstrap` after adding files
- Difficulty values are case-sensitive
- MaxPoints must be a valid number
- Component name must match manifest name
- File naming follows conventions (*.tsx, *.sitecore.ts)

## 🏁 Conclusion

This quick reference provides essential information for implementing and maintaining the Snake Game component. For detailed information, refer to the full documentation files.

**Estimated Implementation Time**: 15-20 hours
**Skill Level Required**: Intermediate React + Basic Sitecore JSS knowledge
**External Dependencies**: None

Happy coding! 🐍🎮✨
