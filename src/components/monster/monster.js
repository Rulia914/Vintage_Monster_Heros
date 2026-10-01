import getTemplate from "./template";
  export default class Monster{
    constructor (data){
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
        this.dangerLevel = data.dangerLevel;
        this.year = data.year;
    }
    render(){
        return getTemplate(this); 
    }
}

function renderTypeOptions(currentType) {
    const MONSTER_TYPES = [
        "Giant reptile",
        "Alien insect",
        "Sea serpent",
        "Subterranean beast",
        "Mutant ape",
      ];
    // S'assurer que si le monstre a un type personnalisé non présent dans la liste de base,
    // on l'ajoute au tableau temporaire sans créer de doublon (grâce à Set ou includes)
    const types = MONSTER_TYPES.includes(currentType) 
      ? MONSTER_TYPES 
      : [...MONSTER_TYPES, currentType];
  
    return types
      .map(type => {
        const isSelected = type === currentType ? 'selected' : '';
        return `<option value="${type}" ${isSelected}>${type}</option>`;
      })
      .join('');
  }