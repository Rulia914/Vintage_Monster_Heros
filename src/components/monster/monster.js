import getTemplate from "./template.js";

export default class Monster {
    constructor (data){
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
        this.dangerLevel = data.dangerLevel;
        this.year = data.year;
    }

    // Méthode de classe pour générer le HTML des options
    renderTypeOptions(currentType) {
        const monsterTypes = [
            "Giant reptile",
            "Alien insect",
            "Sea serpent",
            "Subterranean beast",
            "Mutant ape",
        ];
        const types = monsterTypes.includes(currentType) ? monsterTypes : [...monsterTypes, currentType];

        return types
          .map(type => {
            const isSelected = type === currentType ? 'selected' : '';
            return `<option value="${type}" ${isSelected}>${type}</option>`;
          })
          .join('');
    }
    render(){
      this.typeOptionsHTML = this.renderTypeOptions(this.type);
      this.skulls = '☠️'.repeat(this.dangerLevel); // Génération des skulls ici
      return getTemplate(this); 
  }
}