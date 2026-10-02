import DB from "../../DB.js";
import Monster from "../monster/Monster.js";
import getTemplate from "./template.js";

export default class MonsterList {
  constructor(setup) {
    // Configurer l'URL de l'API
    DB.setApiUrl(setup.apiUrl);

    // Sélectionner l'élément racine dans le DOM
    this.domEl = document.querySelector(setup.el);
    this.title = setup.title ?? "Archive of Monsters";
    this.monsters = [];

    // Écouteur global pour gérer tous les clics (délégation d'événements)
    this.domEl.addEventListener("click", async (event) => {
      
      // --- 0. Bouton SORT (tri par colonne) ---
      const sortBtn = event.target.closest(".btn-sort");
      if (sortBtn) {
        const property = sortBtn.dataset.sort;
        this.sortMonsters(property); // <-- La ligne d'appel
        return;
      }
      // --- 1. Bouton EDIT (passer en mode édition) ---
      const editBtn = event.target.closest(".btn-edit");
      if (editBtn) {
        const monsterRow = editBtn.closest(".monster-row");
        monsterRow.classList.add("isEditing"); // Active le CSS d'édition
        return;
      }

      // --- 2. Bouton CHECK (sauvegarder les modifications) ---
      const checkBtn = event.target.closest(".btn-check");
      if (checkBtn) {
        const monsterRow = checkBtn.closest(".monster-row");
        const id = monsterRow.dataset.id; // Récupère l'ID sur la ligne

        // Cibler les champs de la ligne
        const nameInput = monsterRow.querySelector(".input-name");
        const typeSelect = monsterRow.querySelector(".input-type");
        const dangerInput = monsterRow.querySelector(".input-danger");
        const yearInput = monsterRow.querySelector(".input-year");

        // Préparer l'objet modifiable
        const updatedMonster = {
          name: nameInput.value,
          type: typeSelect.value,
          dangerLevel: Number(dangerInput.value),
          year: Number(yearInput.value),
        };

        // Trouver le monstre correspondant dans le tableau local
        const monster = this.monsters.find((m) => m.id === id);
        if (monster) {
          // Mettre à jour l'objet en mémoire
          Object.assign(monster, updatedMonster);

          // Mettre à jour en BDD via l'API
          if (typeof DB.update === "function") {
            await DB.update(id, updatedMonster);
          }

          // Re-rendre la ligne pour repasser en mode affichage
          monsterRow.outerHTML = monster.render();
        }
        return;
      }

      // --- 3. Bouton DELETE (suppression) ---
      const deleteBtn = event.target.closest(".btn-delete");
      if (deleteBtn) {
        // 1. Récupération du <tr> parent
        const monsterRow = deleteBtn.closest(".monster-row");
        const id = monsterRow.dataset.id;

        // 2. Suppression en Base de Données / API
        if (typeof DB.delete === "function") {
          await DB.delete(id);
        }

        // 3. Suppression du tableau JavaScript
        const index = this.monsters.findIndex((m) => m.id === id);
        if (index !== -1) {
          this.monsters.splice(index, 1);
        }
        console.log(`Monstre avec l'ID ${id} supprimé du tableau local.`);

        // 4. Suppression visuelle du DOM
        monsterRow.remove();

        // 5. Mettre à jour le compteur global
        const countEl = this.domEl.querySelector(".data-count");
        if (countEl) {
          countEl.textContent = this.totalCount;
        }

        return;
      }

      // --- 4. Bouton ADD (créer un nouveau monstre) ---
      const addBtn = event.target.closest(".btn-add");
      if (addBtn) {
        event.preventDefault(); // Bloque le rechargement de page

        // Retrouver le conteneur du formulaire
        const formEl = addBtn.closest("aside");

        // Cibler et lire la valeur de chaque champ
        const nameInput = formEl.querySelector(
          '.field-name',
        );
        const typeSelect = formEl.querySelector("select");
        const dangerInput = formEl.querySelector(
          '.field-danger',
        );
        const yearInput = formEl.querySelector(
          '.field-year',
        );

        // Nettoyage et conversion des données saisies
        const name = nameInput.value.trim();
        const type = typeSelect.value.trim();
        const dangerLevel = Number(dangerInput.value);
        const year = Number(yearInput.value);

        // Validation des données pour éviter les chaînes vides ou les NaN
        if (!name || !type || Number.isNaN(dangerLevel) || Number.isNaN(year)) {
          console.warn("Saisie invalide : au moins un champ est vide ou non numérique.");
          alert("Veuillez remplir correctement tous les champs du formulaire.");
          return; // Interrompt l'exécution si les données sont invalides
        }

        // Assembler les données du nouveau monstre validées
        const newMonsterData = {
          name,
          type,
          dangerLevel,
          year,
        };

        await this.store(newMonsterData);
        formEl.reset(); //remet les champs à leur état initial, y compris la liste déroulante.
      
      }
    });
  }

  // Activer la recherche en temps réel sur l'input
  initSearch() {
    const searchInput = this.domEl.querySelector(".input-search");

    if (searchInput) {
      searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();

        // Filtrer le tableau d'origine sans le modifier
        const filteredMonsters = this.monsters.filter((monster) => {
          const nameLower = monster.name.toLowerCase();
          const typeLower = monster.type.toLowerCase();

          return (
            nameLower.includes(searchTerm) || typeLower.includes(searchTerm)
          );
        });

        // Vider et réinjecter les monstres filtrés
        const tbody = this.domEl.querySelector(".monsters-table tbody");
        if (tbody) {
          tbody.innerHTML = "";

          filteredMonsters.forEach((monster) => {
            tbody.insertAdjacentHTML("beforeend", monster.render());
          });
        }

        // Mettre à jour le compteur d'éléments affichés
        const countEl = this.domEl.querySelector(".data-count");
        if (countEl) {
          countEl.textContent = filteredMonsters.length;
        }
      });
    }
  }

  sortMonsters(property = "name") {
    // Initialisation de l'état de tri dans l'instance si non présent
    if (!this.currentSort) {
      this.currentSort = { property: null, ascending: true };
    }
  
    // Toggle : si on clique sur la même colonne, on inverse le sens ; sinon on remet en ascendant
    if (this.currentSort.property === property) {
      this.currentSort.ascending = !this.currentSort.ascending;
    } else {
      this.currentSort.property = property;
      this.currentSort.ascending = true;
    }
  
    const ascending = this.currentSort.ascending;
  
    // 1. Créer une copie du tableau pour préserver this.monsters
    const sortedMonsters = [...this.monsters].sort((a, b) => {
      // Si c'est du texte (ex: nom, type)
      if (typeof a[property] === "string") {
        const result = a[property].localeCompare(b[property]);
        return ascending ? result : -result;
      }
  
      // Si c'est un nombre (ex: danger, année)
      const result = a[property] - b[property];
      return ascending ? result : -result;
    });
  
    // 2. Rafraîchir l'affichage du tableau avec la COPIE triée
    const tbody = this.domEl.querySelector(".monsters-table tbody");
    if (tbody) {
      tbody.innerHTML = "";
      sortedMonsters.forEach((monster) => {
        tbody.insertAdjacentHTML("beforeend", monster.render());
      });
    }
  }

  // Charger les monstres depuis le serveur
  async loadMonsters() {
    const monsters = await DB.findAll();
    this.monsters = [...monsters.map((monster) => new Monster(monster))];
  }

  // Afficher tout le composant dans le DOM
  async render() {
    await this.loadMonsters();
    this.domEl.innerHTML = getTemplate(this);
    this.initSearch(); // Initialise l'écouteur de recherche une fois le HTML dans le DOM
  }

  // Créer l'objet Monster et l'ajouter au tableau local
  storeInArray(monsterData) {
    const monster = new Monster(monsterData);
    this.monsters.push(monster);
    return monster;
  }
  // Insérer la ligne HTML du monstre au début du tableau et rafraîchir le compteur
  storeInDom(monster) {
    this.domEl
      .querySelector(".monsters-table tbody")
      .insertAdjacentHTML("afterbegin", monster.render());

    const countEl = this.domEl.querySelector(".data-count");
    if (countEl) {
      countEl.textContent = this.totalCount;
    }
  }

  // Sauvegarder en BDD puis mettre à jour le tableau et le DOM
  async store(monsterData) {
    const savedMonster = await DB.store(monsterData);
    const monster = this.storeInArray(savedMonster);
    this.storeInDom(monster);
  }

  // Getter pour calculer le nombre total de monstres
  get totalCount() {
    return this.monsters.length;
  }
}
