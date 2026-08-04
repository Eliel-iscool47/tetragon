
# Tetragon

A fast-paced geometric survival shooter built with a modular, data-driven architecture.

# Controls

The game's controls are the following:

---
* **Move**: `W` (up), `A` (left), `S` (down), `D` (right) or arrow keys
* **Fire**: `Left Click` or `F`
* **Switch Equipped Gun**: `Q`for previous gun and `E` for next gun
* **Reload**: `V` (or empty magazine)
* **Pause**: `P` or `Escape` (while playing)
* **Toggle Gamemode**: `H` *(while paused or in main menu)*
* **Restart**: `R` 
* **Main Menu**: `M` 

# Recent Updates (v1.15: Fixing the Broken)
## 1: Bug Fixes
* Laser beam ends could be seen if shot from a corner
* Couldn't switch equipped gun on mobile
* Ammo power-ups only gave 1 ammo
## 2: Additions
* **Custom Player Color**: The player can now choose his color 
---

# Technical Overview

## 1: Core Architecture

### 𐑐 (p): Centralized State Management
The project utilizes a centralized `state` object (defined in `main.js`) to manage all core modules. This reduces reliance on the global scope and ensures a clean data flow.
- **Standardized Resets**: Every game module ( `player`, `guns`, `mobs`, etc.) implements a `defaults` getter and a `reset()` method. Calling `state.resetAll()` performs an `Object.assign` to restore the game to its pristine initial state.
- **Constructor Encapsulation**: All game entities (Players, Mobs, Bullets) receive the `state` reference in their constructor, allowing them to interact with other systems (like `simulation` or `upgrades`) safely.

### 𐑚 (b): Delta-Time Implementation
The simulation now calculates `dt` using high-resolution timestamps from `requestAnimationFrame`. This `dt` is normalized into a `timeScale` factor (target 1.0 @ 60fps) that is passed to every `update()` call in the game. This ensures that a projectile moving at speed `X` covers the same physical distance per second, whether the game is rendering 30 or 300 frames per second.

### 𐑑 (t): Global Leaderboard & Persistence
- **Supabase Integration**: The game communicates with a Supabase backend to store and retrieve high scores.
- **Persistent Profile**: Usernames are stored in `localStorage`.
- **Async Feedback**: The death screen utilizes a reactive status message system to inform players of the leaderboard submission progress.
- **Property Protection**: Implemented defensive setters for `velocity`, `damageDone`, and `fireRate`. These setters automatically "un-multiply" temporary buffs before applying permanent upgrades, preventing exponential stat leakage.

### 𐑛 (d): Rendering System
- **Context Filtering**: Utilizes `draw.filter` to apply real-time desaturation to the game world based on player health or death state without affecting the UI layer.

### 𐑒 (k): Data-Driven Leveling
- **Timed Buff Management**: Power-up durations (like Invulnerability) are calculated against `simulation.time` rather than real-world time. This ensures that durations are preserved when the game is paused or when the player is in a choice menu.

### 𐑜 (g): Level System
- **Threshold System**: Difficulty tiers are triggered based on the `current` level number.
- **Dynamic Formulas**: Spawn counts support both static integers and string-based formulas (e.g., `"c - 10"`) which are interpreted at runtime.

## 2: Combat & Mechanics

### 𐑐 (p): Difficulty Scaling
The game features a difficulty slider in the Settings menu ranging from **0.2x to 5.0x**.
- **Probabilistic Spawning**: To handle fractional multipliers (e.g., spawning 0.3 mobs), the engine uses a weighted random roll. This ensures that statistically, the average number of spawns matches the selected difficulty over time.

### 𐑚 (b): The Arsenal
- **Melee (Knife)**: A high-damage sweeping attack with a visual fade-out slash.
- **Ballistics**: A wide variety of weapons including Rifles, Snipers, Shotguns, and Miniguns.
- **Specialty**: Homing Missiles that accelerate towards their target, Balls 😋, Flamethrowers, and instant-hit Lasers.
  - **Steering Guidance**: Homing projectiles use a steering-force algorithm rather than direct angle assignment, allowing for natural arc-based movement.

## 3: Advanced Upgrades
The upgrade system supports prerequisites via a `requirements` property. Notable mechanics include:
- **Vampirism**: Heal a percentage of damage dealt to enemies.
- **Napalm**: Flamethrower projectiles leave lingering AOE fire pools.
- **Cluster Bombs**: Explosive weapons trigger secondary sub-explosions.
- **Incendiary Munitions**: Standard bullets gain explosive properties upon contact.
- **Iron Will**: Multiplies the base duration of invulnerability power-ups.
- **Reinforced Shields**: Increases the effectiveness/magnitude of shield power-ups.

## 4: Enemy Types

- **Default**: Standard melee units.
- **Sentry**: Stationary turrets that fire glowing red projectiles with trail effects.
- **Tank**: High health, high damage, but slow movement.
- **Archer/Grenadier**: Ranged units that use predictive aiming.
- **Bosses**: Unique entities like the **Pentagon Boss** (laser telegraphs) and **Void Boss** (gravitational pull).
- **Ghost Boss**: A spectral entity that phases between states, becoming invulnerable to damage.
- **And more!**

## 5: Technical Implementation Details

- **Collision Grid**: A spatial partitioning grid (100px cells) optimizes collision checks. Includes defensive boundary checks to prevent `TypeError` during coordinate queries.
- **Performance Optimization**: Beyond the grid, the engine utilizes **Squared Distance** checks (`dx*dx + dy*dy <= r*r`) for most proximity logic, avoiding the computational cost of `Math.sqrt()` millions of times per minute.
- **Visual Polish**:
  - **Geometric Background**: A low-opacity grid rendered in the simulation background to provide a frame of reference for player movement.
  - **Muzzle Flashes**: Triggered on weapon fire.
  - **Particle System**: Manages lifesteal tracers, smoke trails for missiles, particle ribbons for bouncy balls, and more.
  - **Shadow Glow**: Used on projectiles and the player for a "bullet-hell" aesthetic, with color shifting based on projectile speed.
- **Persistence**: Settings are automatically saved to `localStorage` and persist across sessions.

---

# Credits and Links

## 1: Credits

- **Eliel-isCool47**: Art, Code, Game Design.

## 2: Links

- **Project URL**: [github.com/Eliel-isCool47/Tetragon](https://github.com/Eliel-isCool47/Tetragon)
- **Feedback Link**: [https://forms.gle/xokJpH3U76hHibot7](https://forms.gle/xokJpH3U76hHibot7)

# Development
The game loop runs at a fixed 60 FPS. All rendering is performed on a single HTML5 Canvas context. To modify levels or balancing, edit `levels.json` or the `defaults` getters within individual JS files.

<!-- Maintenance Note: 
When adding new modules, register them in the state object in main.js 
and implement the reset() / defaults pattern to ensure compatibility 
with the restart system. -->
