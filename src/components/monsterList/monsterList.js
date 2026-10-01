import DB from "../../DB.js";
import Monster from "../monster/Monster.js";
import getTemplate from './template.js';

export default class MonsterList {
    constructor(data) {
      DB.setApiUrl(data.apiUrl);
      this.domEl = document.querySelector(data.el);
      this.title= data.title ?? "Archive of Monsters";
      this.monsters = [];

      // Écouteur d'événements global (délégation d'événements)
      this.domEl.addEventListener('click', async (event) => {
        // 1. Bouton EDIT
        const editBtn = event.target.closest('.btn-edit');
        if (editBtn) {
          const monsterRow = editBtn.closest('.monster-row');
          monsterRow.classList.add('isEditing');
          return;
        }

        // 2. Bouton CHECK (sauvegarde)
        const checkBtn = event.target.closest('.btn-check');
        if (checkBtn) {
          const monsterRow = checkBtn.closest('.monster-row');
          const id = monsterRow.dataset.id;

          const nameInput = monsterRow.querySelector('.input-name');
          const typeSelect = monsterRow.querySelector('.input-type');
          const dangerInput = monsterRow.querySelector('.input-danger');
          const yearInput = monsterRow.querySelector('.input-year');

          const updatedData = {
            name: nameInput.value,
            type: typeSelect.value,
            dangerLevel: Number(dangerInput.value),
            year: Number(yearInput.value)
          };

          // Trouver le monstre dans le tableau local
          const monster = this.monsters.find(m => m.id == id);
          if (monster) {
            // Mettre à jour l'instance JS
            Object.assign(monster, updatedData);

            // Mettre à jour en BDD si la méthode existe
            if (typeof DB.update === 'function') {
              await DB.update(id, updatedData);
            }

            // Remplacer le DOM de la ligne (quitte le mode édition et rafraîchit l'affichage)
            monsterRow.outerHTML = monster.render();
          }
        }
      });
    }

    async loadMonsters() {
        const monsters = await DB.findAll();
        this.monsters = [... monsters.map((monster) => new Monster(monster))];
      }
      async render(){
        await this.loadMonsters();
        this.domEl.innerHTML = getTemplate(this);
      }
  
      storeInArray(data){
        const monster = new Monster(data);
        this.monsters.push(monster);
        return monster;
      }
      
      storeInDom(monster){
        this.domEl.querySelector('.monsters-table tbody')
          .insertAdjacentHTML('afterbegin', monster.render());
          const countEl = this.domEl.querySelector('.data-count');
          if (countEl) {
            countEl.textContent = this.totalCount;
          }
      }
  
      async store(data){
        const savedMonster = await DB.store(data);
        const monster = this.storeInArray(savedMonster);
        this.storeInDom(monster);
    }
    get totalCount() {
      return this.monsters.length;
    }
    
}