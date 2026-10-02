import getTemplate from "./template.js";

export default class Monster {
  constructor(fields) {
    this.id = fields.id;
    this.name = fields.name;
    this.type = fields.type;
    this.dangerLevel = fields.dangerLevel;
    this.year = fields.year;
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