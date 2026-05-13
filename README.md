
# Tetragon

A fast-paced geometric survival shooter built with a modular, data-driven architecture.

## 1: Controls

The game's controls are the following:

---
* **Move**: `W`, `A`, `S`, `D` or arrow keys
* **Fire**: `Left Click` or `F`
* **Cycle Guns**: `Q` and `E`
* **Reload**: `V` (or empty magazine)
* **Pause**: `P` or `Escape` (while playing)
* **Restart**: `R` (while paused/choosing/dead)
* **Main Menu**: `M`

## 2: Recent Updates (v1.07)

* **Mechanics**: MIRV missiles now shoot 1 at a time. They also now accelerate towards their target instead of instantly being fast.

---

## 3: Feedback

[Submit your feedback here](https://docs.google.com/forms/d/1iQ4DOSDVXXOdok1HwxPqQm1_M0hk6KeB30nidJq4nxw/edit)

---

## 4: Technical Overview

### 1: Core Architecture

#### a: Centralized State Management
The project utilizes a centralized `state` object (defined in `main.js`) to manage all core modules. This reduces reliance on the global scope and ensures a clean data flow.
- **Standardized Resets**: Every game module ( `player`, `guns`, `mobs`, etc.) implements a `defaults` getter and a `reset()` method. Calling `state.resetAll()` performs an `Object.assign` to restore the game to its pristine initial state.
- **Constructor Encapsulation**: All game entities (Players, Mobs, Bullets) receive the `state` reference in their constructor, allowing them to interact with other systems (like `simulation` or `upgrades`) safely.

#### b: Data-Driven Leveling
- **Threshold System**: Difficulty tiers are triggered based on the `current` level number.
- **Dynamic Formulas**: Spawn counts support both static integers and string-based formulas (e.g., `"c - 10"`) which are interpreted at runtime.

### 2: Combat & Mechanics

#### a: Difficulty Scaling
The game features a difficulty slider in the Settings menu ranging from **0.2x to 5.0x**.
- **Probabilistic Spawning**: To handle fractional multipliers (e.g., spawning 0.3 mobs), the engine uses a weighted random roll. This ensures that statistically, the average number of spawns matches the selected difficulty over time.

#### b: The Arsenal
- **Melee (Knife)**: A high-damage sweeping attack with a visual fade-out slash.
- **Ballistics**: A wide variety of weapons including Rifles, Snipers, Shotguns, and Miniguns.
- **Specialty**: Homing Missiles that accelerate towards their target, <!--Edwin's juicy -->Balls 😋, Flamethrowers, and instant-hit Lasers.

#### Advanced Upgrades
The upgrade system supports prerequisites via a `requirements` property. Notable mechanics include:
- **Vampirism**: Heal a percentage of damage dealt to enemies.
- **Napalm**: Flamethrower projectiles leave lingering AOE fire pools.
- **Cluster Bombs**: Explosive weapons trigger secondary sub-explosions.
- **Incendiary Munitions**: Standard bullets gain explosive properties upon contact.

### Enemy Types

- **Default**: Standard melee units.
- **Sentry**: Stationary turrets that fire glowing red projectiles with trail effects.
- **Tank**: High health, high damage, but slow movement.
- **Archer/Grenadier**: Ranged units that use predictive aiming.
- **Bosses**: Unique entities like the **Pentagon Boss** (laser telegraphs) and **Void Boss** (gravitational pull).

### Technical Implementation Details

- **Collision Grid**: A spatial partitioning grid (150px cells) optimizes collision checks between hundreds of bullets and mobs. (could be a lie)
- **Visual Polish**:
  - **Muzzle Flashes**: Triggered on weapon fire.
  - **Particle System**: Manages lifesteal tracers and blood/vampire effects.
  - **Shadow Glow**: Used on projectiles for a "bullet-hell" aesthetic.
- **Persistence**: Player keybinds are automatically saved to `localStorage` and persist across sessions.

---

#### Credits
- **Eliel-isCool47**: Art, Code, Game Design.
- **Project URL**: GitHub Repo

#### Development
The game loop runs at a fixed 60 FPS. All rendering is performed on a single HTML5 Canvas context. <!-- To modify levels or balancing, edit `levels.json` or the `defaults` getters within individual JS files.-->

<!-- Maintenance Note: 
When adding new modules, register them in the state object in main.js 
and implement the reset() / defaults pattern to ensure compatibility 
with the restart system. -->