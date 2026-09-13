# Vortex

A fast-paced 2D arcade game built in **JavaScript** using the **CodeHS Graphics API**, inspired by the rocket ship / wave movement mechanics in *Geometry Dash*. Players control a ship navigating through a procedurally generated obstacle course by manipulating vertical momentum.

---

## Features & Gameplay

* **Physics-Based Mechanics:** Hold or tap the `Spacebar` to apply upward momentum against simulated gravity.
* **Procedural Obstacles:** Top and bottom barriers update continuously to test reaction times.
* **Dynamic Audio Engine:** Plays a randomized track from a built-in playlist at the start of each run.
* **Particle / Trail FX:** Uses an array-managed trail system to draw a visual motion trail behind the player object.

---

## Tech Stack & Architecture

* **Language:** JavaScript (ES6+)
* **Environment:** CodeHS Graphics Library / HTML Canvas Sandbox
* **Core Constants & Configuration:**
  * `DELAY` (`10ms`): Animation loop frame rate interval.
  * `MAX` (`6`): Velocity cap for vertical player movement.
  * `PLAYER_SIZE` (`30px`) & `TRAIL_SIZE` (`10`): Player render dimensions and trail length limit.
  * `BRICK_SIZE` (`50px`) & `BRICK_COLOR` (`#96e394`): Grid obstacle size and color hex styling.

---

## How to Run Locally / In Sandbox

1. Open the source project in the [CodeHS Editor](https://codehs.com/sandbox/robkahloncodehs/ics3u-culminating-aditi).
2. Click **Run** in the execution panel.
3. Click inside the canvas viewport to ensure focus.
4. Press `Spacebar` to launch the ship and start dodging obstacles!

