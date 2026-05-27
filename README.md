
# Tetragon

A fast-paced geometric survival shooter built with a modular, data-driven architecture.

# I: Controls

The game's controls are the following:

---
* **Move**: `W`, `A`, `S`, `D` or arrow keys
* **Fire**: `Left Click` or `F`
* **Cycle Guns**: `Q` and `E`
* **Reload**: `V` (or empty magazine)
* **Pause**: `P` or `Escape` (while playing)
* **Restart**: `R` *(while paused/choosing/dead)*
* **Main Menu**: `M` *(while paused/choosing/dead)*

# II: Recent Updates (v1.12: Visual Vigor & Logical Rigor)

* **HUD Cleanup**: Removed the cluttered in-game console. Ammo depletion is now signaled via a red "OUT OF AMMO" popup directly over the player.
* **Animated Death Screen**: Implemented a smooth fade-in for the death overlay. The game world now desaturates to grayscale upon death while the UI remains vibrant red.
* **Contextual Taunts**: Added a variety of random death messages, including specific taunts if you are killed by a Boss or "Imagine" taunts for regular enemies. Albert Epstein is cannon in the Tetragon Universe.
* **Combat Logic Fixes**: 
    * Fixed a major bug where Explosions/AoE damage would only hit one enemy per frame.
    * Standardized property setters to prevent permanent upgrades from compounding incorrectly with temporary power-ups (e.g., permanent speed boosts no longer "bake in" the multiplier from Overdrive).
* **Visual Improvements**: 
    * Improved "Game Over" pulsing animation for better centering.
    * Added visual trails and homing logic to Hexagon Minions.
    * Added a "DEBUG" badge in the HUD to clearly indicate when debug mode is active.
* **UX**: Inventory and Upgrade lists are now visible by default on non-mobile devices.

---

# III: Technical Overview

## 1: Core Architecture

### a: Centralized State Management
The project utilizes a centralized `state` object (defined in `main.js`) to manage all core modules. This reduces reliance on the global scope and ensures a clean data flow.
- **Standardized Resets**: Every game module ( `player`, `guns`, `mobs`, etc.) implements a `defaults` getter and a `reset()` method. Calling `state.resetAll()` performs an `Object.assign` to restore the game to its pristine initial state.
- **Constructor Encapsulation**: All game entities (Players, Mobs, Bullets) receive the `state` reference in their constructor, allowing them to interact with other systems (like `simulation` or `upgrades`) safely.

### b: Global Leaderboard & Persistence
- **Supabase Integration**: The game communicates with a Supabase backend to store and retrieve high scores.
- **Persistent Profile**: Usernames are stored in `localStorage`, allowing for automatic identification without interruptive popups.
- **Async Feedback**: The death screen utilizes a reactive status message system to inform players of the leaderboard submission progress.
- **Property Protection**: Implemented defensive setters for `velocity`, `damageDone`, and `fireRate`. These setters automatically "un-multiply" temporary buffs before applying permanent upgrades, preventing exponential stat leakage.

### b: Rendering System
- **Context Filtering**: Utilizes `draw.filter` to apply real-time desaturation to the game world based on player health or death state without affecting the UI layer.

### c: Data-Driven Leveling
- **Timed Buff Management**: Power-up durations (like Invulnerability) are calculated against `simulation.time` rather than real-world time. This ensures that durations are preserved when the game is paused or when the player is in a choice menu.

### d: Level System
- **Threshold System**: Difficulty tiers are triggered based on the `current` level number.
- **Dynamic Formulas**: Spawn counts support both static integers and string-based formulas (e.g., `"c - 10"`) which are interpreted at runtime.

## 2: Combat & Mechanics

### a: Difficulty Scaling
The game features a difficulty slider in the Settings menu ranging from **0.2x to 5.0x**.
- **Probabilistic Spawning**: To handle fractional multipliers (e.g., spawning 0.3 mobs), the engine uses a weighted random roll. This ensures that statistically, the average number of spawns matches the selected difficulty over time.

### b: The Arsenal
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

## 5: Technical Implementation Details

- **Collision Grid**: A spatial partitioning grid (100px cells) optimizes collision checks. Includes defensive boundary checks to prevent `TypeError` during coordinate queries.
- **Visual Polish**:
  - **Geometric Background**: A low-opacity grid rendered in the simulation background to provide a frame of reference for player movement.
  - **Muzzle Flashes**: Triggered on weapon fire.
  - **Particle System**: Manages lifesteal tracers, smoke trails for missiles, particle ribbons for bouncy balls, and more.
  - **Shadow Glow**: Used on projectiles and the player for a "bullet-hell" aesthetic, with color shifting based on projectile speed.
- **Persistence**: Settings are automatically saved to `localStorage` and persist across sessions.

---

# IV: Credits and Links



- **Eliel-isCool47**: Art, Code, Game Design.

## Links

- **Project URL**: [github.com/Eliel-isCool47/Tetragon](https://github.com/Eliel-isCool47/Tetragon)
- **Feedback Link**: [https://forms.gle/xokJpH3U76hHibot7](https://forms.gle/xokJpH3U76hHibot7)

# V: Development
The game loop runs at a fixed 60 FPS. All rendering is performed on a single HTML5 Canvas context. To modify levels or balancing, edit `levels.json` or the `defaults` getters within individual JS files.

# VI: Planned Updates

- **Mobile Support**: I am planning to add support for mobile devices by July 31st.
- **Gun Sprites**: The gun sprites haven't been in the game since February 15th, so I might reädd them in the future. It's not guaranteed, nor likely, that they return.

<!-- Maintenance Note: 
When adding new modules, register them in the state object in main.js 
and implement the reset() / defaults pattern to ensure compatibility 
with the restart system. -->
