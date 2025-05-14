# Revised Integration Plan: Archetype Selection, Hero Stats, and Leveling

This plan outlines the steps to integrate the archetype selection screen, hero stats display, attribute spending functionality, and the basic leveling system from the previous code attempt into the current Phaser 3 project.

**Objective:** To replace the basic `Start` scene with a new `main_scene` that allows the user to select an archetype, view hero stats (including level and XP), spend attribute points, and incorporates a basic leveling system where XP required increases with level.

**Files to be Integrated/Modified:**

*   [`Past Vibe Code Attempt/src/config/constants.js`](Past%20Vibe%20Code%20Attempt/src/config/constants.js): Contains archetype definitions, skill placeholders, and UI constants.
*   [`Past Vibe Code Attempt/src/entities/hero.js`](Past%20Vibe%20Code%20Attempt/src/entities/hero.js): Defines the `Hero` class with stats, archetype bonuses, leveling, and attribute spending logic. **Will be modified to implement the new leveling formula.**
*   [`Past Vibe Code Attempt/src/utils/ui_logger.js`](Past%20Vibe%20Code%20Attempt/src/utils/ui_logger.js): Provides utility functions for updating a combat log UI element.
*   [`Past Vibe Code Attempt/src/systems/combat_manager.js`](Past%20Vibe%20Code%20Attempt/src/systems/combat_manager.js): Manages the combat loop, including spawning enemies and resolving combat rounds. Calls `hero.gainXP()`.
*   [`Past Vibe Code Attempt/src/scenes/main_scene.js`](Past%20Vibe%20Code%20Attempt/src/scenes/main_scene.js): The Phaser scene that handles the archetype selection UI, initializes the `CombatManager`, and updates the hero stats display. **Will need to ensure it displays Level and XP.**
*   [`Past Vibe Code Attempt/index.html`](Past%20Vibe%20Code%20Attempt/index.html): Contains the HTML structure for the archetype selection screen, main game UI, hero stats, attribute buttons, and combat log. **Will need to include elements for displaying Level and XP.**
*   [`Past Vibe Code Attempt/style.css`](Past%20Vibe%20Code%20Attempt/style.css): Contains the CSS for styling the UI elements.

**Plan Steps:**

1.  **Copy Source Files:**
    *   Create new directories `src/config/`, `src/entities/`, `src/systems/`, and `src/utils/` in the main workspace.
    *   Copy [`Past Vibe Code Attempt/src/config/constants.js`](Past%20Vibe%20Code%20Attempt/src/config/constants.js) to [`src/config/constants.js`](src/config/constants.js).
    *   Copy [`Past Vibe Code Attempt/src/entities/hero.js`](Past%20Vibe%20Code%20Attempt/src/entities/hero.js) to [`src/entities/hero.js`](src/entities/hero.js).
    *   Copy [`Past Vibe Code Attempt/src/utils/ui_logger.js`](Past%20Vibe%20Code%20Attempt/src/utils/ui_logger.js) to [`src/utils/ui_logger.js`](src/utils/ui_logger.js).
    *   Copy [`Past Vibe Code Attempt/src/systems/combat_manager.js`](Past%20Vibe%20Code%20Attempt/src/systems/combat_manager.js) to [`src/systems/combat_manager.js`](src/systems/combat_manager.js).
    *   Copy [`Past Vibe Code Attempt/src/scenes/main_scene.js`](Past%20Vibe%20Code%20Attempt/src/scenes/main_scene.js) to [`src/scenes/main_scene.js`](src/scenes/main_scene.js).

2.  **Implement Leveling System Logic in Hero:**
    *   Modify the `gainXP` and `levelUp` methods in the copied [`src/entities/hero.js`](src/entities/hero.js).
    *   In the `constructor`, ensure `this.level` is initialized to 1 and `this.xpToNextLevel` is initialized to 100.
    *   In the `levelUp` method, change the calculation for `this.xpToNextLevel` to `this.xpToNextLevel = this.level * 100;` after incrementing the level.

3.  **Update `index.html`:**
    *   Read the content of [`Past Vibe Code Attempt/index.html`](Past%20Vibe%20Code%20Attempt/index.html) and [`Past Vibe Code Attempt/style.css`](Past%20Vibe%20Code%20Attempt/style.css).
    *   Extract the HTML structure for the archetype selection screen (`id="archetype-selection-screen"`), the main game container (`class="container"`), the hero stats display (`id="hero-stats"`), the attribute spending buttons (`id="spend-str"`, `id="spend-int"`, `id="spend-agi"`), the skill tree containers (`id="passive-skills"`, `id="active-skills"`), and the combat log (`id="combat-log"`).
    *   Extract the CSS rules from [`Past Vibe Code Attempt/style.css`](Past%20Vibe%20Code%20Attempt/style.css).
    *   Modify the main [`index.html`](index.html) to include these HTML structures within the `<body>` tag. Ensure the `hero-stats` section includes elements or structure to display the hero's current level and XP.
    *   Add the extracted CSS rules within the existing `<style>` tag in the `<head>` of the main [`index.html`](index.html). Ensure the initial display properties in the CSS hide the main game container and show the archetype selection screen.

4.  **Update `src/main.js`:**
    *   Modify [`src/main.js`](src/main.js) to import `mainScene` from [`./scenes/main_scene.js`](src/scenes/main_scene.js) and `initializeCombatLogElement` from [`./utils/ui_logger.js`](src/utils/ui_logger.js).
    *   Change the `scene` configuration in the Phaser `config` object to use `mainScene`.
    *   Wrap the Phaser game initialization in a `window.onload` event listener to ensure the DOM is ready before the game starts and `initializeCombatLogElement()` is called.

5.  **Adjust `src/scenes/main_scene.js`:**
    *   Review the copied [`src/scenes/main_scene.js`](src/scenes/main_scene.js) to confirm that the DOM element IDs it references match the IDs added to the main [`index.html`](index.html).
    *   Ensure the `update` function correctly retrieves and displays the hero's `level`, `xp`, and `xpToNextLevel` in the `hero-stats` element.

**File Dependencies (after integration):**

```mermaid
graph TD
    A[index.html] --> B(src/main.js)
    B --> C(src/scenes/main_scene.js)
    C --> D(src/systems/combat_manager.js)
    C --> E(src/config/constants.js)
    C --> F(src/utils/ui_logger.js)
    D --> G(src/entities/hero.js)
    D --> H(src/entities/enemy.js)
    D --> I(src/systems/loot_table.js)
    G --> E
    G --> F
    H --> F
    I --> E
    C --> A
    F --> A