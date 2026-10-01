import DB from "../../DB.js";
import Monster from "../monster/Monster.js";
import getTemplate from './template.js';

export default class MonsterList {
    constructor(data) {
      DB.setApiUrl(data.apiUrl);
      this.domEl = document.querySelector(data.el);
      this.title= data.title ?? "Archive of Monsters";
      this.monsters = [];

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
      }
  
      async store(data){
        const savedMonster = await DB.store(data);
        const monster = this.storeInArray(savedMonster);
        this.storeInDom(monster);
    }
}
