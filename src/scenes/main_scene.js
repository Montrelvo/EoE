import { CombatManager } from '../systems/combat_manager.js';
import { ARCHETYPES, PASSIVE_SKILLS, ACTIVE_SKILLS } from '../config/constants.js';
import { updateCombatLog, initializeCombatLogElement } from '../utils/ui_logger.js';

export const mainScene = {
    preload: function() {
      // Load assets - We'll use graphics for now, no assets needed yet
      console.log("Preloading assets...");
    },

    create: function() {
      console.log("Creating game scene...");

      // Initialize the combat log element and store it
      initializeCombatLogElement();
      this.combatLogElement = document.getElementById('combat-log');
      if (!this.combatLogElement) {
          console.warn("Combat log element 'combat-log' not found in main_scene.js create function.");
      }

      // --- Archetype Selection Logic ---
      const archetypeScreen = document.getElementById('archetype-selection-screen');
      const archetypeOptionsContainer = document.getElementById('archetype-options');
      const gameContainer = document.querySelector('.container'); // Main game container

      console.log("Archetype Screen Element:", archetypeScreen);
      console.log("Archetype Options Container Element:", archetypeOptionsContainer);
      console.log("Game Container Element:", gameContainer);


      if (!archetypeScreen || !archetypeOptionsContainer || !gameContainer) {
          console.error("Archetype UI elements not found! Cannot initialize archetype selection.");
          return;
      }

      const initializeGame = (selectedArchetypeId) => {
          console.log(`Initializing game with archetype: ${selectedArchetypeId}`);
          archetypeScreen.style.display = 'none';
          gameContainer.style.display = 'grid';

          console.log("Archetype Screen Display after setting:", archetypeScreen.style.display);
          console.log("Game Container Display after setting:", gameContainer.style.display);
          console.log("Archetype Screen Computed Display:", window.getComputedStyle(archetypeScreen).display);
          console.log("Game Container Computed Display:", window.getComputedStyle(gameContainer).display);


          this.selectedArchetype = selectedArchetypeId;
          this.combatManager = new CombatManager(this, this.selectedArchetype, this.combatLogElement);

          // Placeholder graphics - these will be replaced with actual sprites later
          this.heroSprite = this.add.graphics();
          this.heroSprite.fillStyle(0x00ff00, 1); // Green rectangle for hero
          this.heroSprite.fillRect(-25, -50, 50, 100);
          this.heroSprite.setPosition(200, 300);

          this.enemySprite = null; // Enemy sprite will be created when an enemy spawns

          // Placeholder text for health - will be updated in the update loop
          this.heroHealthText = this.add.text(150, 420, '', { font: '16px Arial', fill: '#ffffff' });
          this.enemyHealthText = this.add.text(550, 420, '', { font: '16px Arial', fill: '#ffffff' });

          // Event listeners for attribute spending buttons
          document.getElementById('spend-str').addEventListener('click', () => {
            console.log("Spend STR button clicked");
            if(this.combatManager && this.combatManager.hero) this.combatManager.hero.spendAttributePoint('str');
          });
          document.getElementById('spend-int').addEventListener('click', () => {
            console.log("Spend INT button clicked");
            if(this.combatManager && this.combatManager.hero) this.combatManager.hero.spendAttributePoint('int');
          });
          document.getElementById('spend-agi').addEventListener('click', () => {
            console.log("Spend AGI button clicked");
            if(this.combatManager && this.combatManager.hero) this.combatManager.hero.spendAttributePoint('agi');
          });

          // Populate skill tree UI (buttons will be disabled initially)
          this.populateSkillTreeUI('passive-skills', PASSIVE_SKILLS);
          this.populateSkillTreeUI('active-skills', ACTIVE_SKILLS);

          // Start the auto-combat loop
          if(this.combatManager) this.combatManager.startAutoCombat();

          // Manually call update once to populate initial UI
          if (typeof this.update === 'function') {
             this.update(performance.now(), 0);
          }
      };
      // Bind initializeGame to the scene context so 'this' refers to the scene inside it
      this.initializeGame = initializeGame.bind(this);

      // Populate archetype selection buttons
      archetypeOptionsContainer.innerHTML = ''; // Clear existing content
      console.log("Populating archetype buttons...");
      for (const archetypeId in ARCHETYPES) {
          const archetype = ARCHETYPES[archetypeId];
          console.log(`Creating button for archetype: ${archetype.name} (${archetypeId})`);
          const button = document.createElement('button');
          button.classList.add('archetype-button');
          button.dataset.archetypeId = archetypeId; // Store archetype ID in data attribute
          button.innerHTML = `<h3>${archetype.name}</h3><p>${archetype.description}</p>`;
          button.addEventListener('click', () => {
              console.log(`Archetype button clicked: ${archetypeId}`);
              this.initializeGame(archetypeId); // Call initializeGame with the selected archetype ID
          });
          archetypeOptionsContainer.appendChild(button); // Add button to the container
      }
      console.log("Finished populating archetype buttons.");
    },

    populateSkillTreeUI: function(elementId, skillData) {
        const container = document.getElementById(elementId);
        if (!container) return;
        container.innerHTML = `<h4>${elementId.replace('-', ' ').toUpperCase()}</h4>`;

        for (const skillId in skillData) {
            const skill = skillData[skillId];
            const button = document.createElement('button');
            button.id = `learn-${skillId}`;
            button.textContent = `${skill.name} (Cost: ${skill.cost})`;
            button.title = skill.description;
            button.disabled = true;

            const skillType = elementId.includes('passive') ? 'passive' : 'active';
            button.addEventListener('click', () => {
                if(this.combatManager && this.combatManager.hero) {
                    this.combatManager.hero.learnSkill(skill.id, skillType);
                }
            });
            container.appendChild(button);
        }
    },

    update: function(time, delta) {
      if (!this.combatManager || !this.combatManager.hero) {
        return;
      }

      const hero = this.combatManager.hero;
      const enemy = this.combatManager.currentEnemy;

      if (hero.stats.stamina < hero.stats.maxStamina) {
        hero.stats.stamina += hero.stats.staminaRegen * (delta / 1000);
        hero.stats.stamina = Math.min(hero.stats.stamina, hero.stats.maxStamina);
      }

      const statsElement = document.getElementById('hero-stats');
      if (statsElement) {
          statsElement.innerHTML = `
              Level: ${hero.level}<br>
              XP: ${Math.floor(hero.xp)} / ${hero.xpToNextLevel}<br>
              Attribute Points: ${hero.attributePoints}<br>
              Skill Points: ${hero.skillPoints}<br>
              <hr>
              HP: ${Math.max(0, Math.ceil(hero.stats.health))}/${hero.stats.maxHealth}<br>
              Stamina: ${Math.ceil(hero.stats.stamina)}/${hero.stats.maxStamina}<br>
              STR: ${hero.stats.str} | INT: ${hero.stats.int} | AGI: ${hero.stats.agi}<br>
              Defense: ${hero.stats.defense}
          `;
      }

      const canSpendAttribPoints = hero.attributePoints > 0;
      const spendStrButton = document.getElementById('spend-str');
      if(spendStrButton) spendStrButton.disabled = !canSpendAttribPoints;
      const spendIntButton = document.getElementById('spend-int');
      if(spendIntButton) spendIntButton.disabled = !canSpendAttribPoints;
      const spendAgiButton = document.getElementById('spend-agi');
      if(spendAgiButton) spendAgiButton.disabled = !canSpendAttribPoints;

      const skillButtonUpdater = (skillCollection, type) => {
        for (const skillId in skillCollection) {
          const skill = skillCollection[skillId];
          const button = document.getElementById(`learn-${skillId}`);
          if (button) {
            const alreadyLearned = (type === 'passive' ? hero.learnedPassiveSkills.has(skillId) : hero.learnedActiveSkills.has(skillId));
            const canAfford = hero.skillPoints >= skill.cost;
            // TODO: Add prerequisite check here
            // const prereqsMet = checkPrerequisites(hero, skill.prereqs);

            if (alreadyLearned) {
              button.disabled = true;
              button.textContent = `${skill.name} (Learned)`;
            } else if (!canAfford /* || !prereqsMet */) {
              button.disabled = true;
              button.textContent = `${skill.name} (Cost: ${skill.cost})`;
            } else {
              button.disabled = false;
              button.textContent = `${skill.name} (Cost: ${skill.cost})`;
            }
          }
        }
      };

      skillButtonUpdater(PASSIVE_SKILLS, 'passive');
      skillButtonUpdater(ACTIVE_SKILLS, 'active');

      if (this.heroHealthText) {
        this.heroHealthText.setText(`Hero HP: ${Math.max(0, Math.ceil(hero.stats.health))}/${hero.stats.maxHealth}`);
      }
      if (this.enemyHealthText) {
        if (enemy && this.enemySprite) {
          this.enemyHealthText.setText(`Enemy HP: ${Math.max(0, Math.ceil(enemy.stats.health))}/${enemy.stats.maxHealth}`);
          this.enemyHealthText.setVisible(true);
        } else {
          this.enemyHealthText.setVisible(false);
        }
      }
    }
};