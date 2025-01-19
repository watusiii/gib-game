# Modular Character Game System

## File Structure
```
/
├── character.js     # Core character system (self-contained, reusable)
├── test-game.js    # Test implementation/playground
├── index.html      # Game container
├── styles.css      # Basic styling
└── sheet.png       # Sprite sheet (67x485)
```

## Sprite Sheet Specifications
- **Dimensions**: 67px × 485px
- **Grid Structure**: 
  - 6 vertical slices (exactly 10px each)
  - 1px pink grid lines (1px edges + 1px between slices)
  - Each sprite is 10x10 pixels
  - Each sprite is black and white
- **Slice Layout**:
  ```
  [Section 1: 10px] [Section 2: 10px] [Section 3: 10px] [Section 4: 10px] [Section 5: 10px] [Section 6: 10px]
         ^              ^                 ^                 ^                 ^                 ^
      1px grid       1px grid          1px grid          1px grid         1px grid         1px grid
  ```
- **Sprite Access**:
  - X coordinate calculation:
    ```javascript
    // For section n (0-5):
    x = 1 + (n * 11)  // 1px initial offset + (section * (10px sprite + 1px grid))
    ```
  - Y coordinate calculation:
    ```javascript
    // For sprite index n (0-based):
    y = 1 + (n * 11)  // 1px initial offset + (index * (10px sprite + 1px grid))
    ```

## character.js (Core System)
Self-contained module that exports the character system:
```javascript
class ModularCharacter {
  - Sprite sheet handling
  - Character assembly
  - Animation states
  - Movement physics
  - Part management
}
```

### Key Features
- **Sprite Management**
  - Single sprite sheet loading (67x485)
  - Coordinate calculation:
    ```javascript
    x = (sliceIndex * 10) + gridLineOffset
    y = (spriteIndex * height) + gridLineOffset
    ```
  - Sprite caching

- **Character Assembly**
  - [Arm] [Eye] [Mouth] [Eye] [Arm] [Item]
  - Each part independently animated
  - Relative positioning system

- **States**
  - Idle
  - Walking (Left/Right)
  - Jumping
  - Part-specific states (blinking, etc)

## test-game.js (Implementation)
Test environment to demonstrate and experiment with the character system:
- Character instance creation
- Movement controls (Left/Right/Jump)
- Debug UI for:
  - Sprite selection per part
  - Animation state testing
  - Live property adjustment

## Implementation Phases

1. **Phase 1: Core Setup**
   - Basic sprite sheet loading
   - Single character part rendering
   - Movement controls

2. **Phase 2: Character Assembly**
   - Multi-part character composition
   - Relative positioning
   - Basic animations

3. **Phase 3: Interaction**
   - Debug controls
   - Part swapping
   - State testing

4. **Phase 4: Polish**
   - Smooth animations
   - Physics refinement
   - Additional features 