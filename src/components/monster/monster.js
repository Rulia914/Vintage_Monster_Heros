import getTemplate from "./template.js";

export default class Monster {
  // Le constructeur initialise les propriétés du monstre à partir des données reçues.
  constructor(fields) {
    this.id = fields.id;
    this.name = fields.name;
    this.type = fields.type;
    this.dangerLevel = fields.dangerLevel;
    this.year = fields.year;
  }

  // Crée la liste des options de type pour un <select>.
  // Si le type actuel n'est pas dans la liste de base, il est ajouté pour rester valide.
  renderTypeOptions(currentType) {
    const monsterTypes = [
      "Giant reptile",
      "Alien insect",
      "Sea serpent",
      "Subterranean beast",
      "Mutant ape",
    ];

    // On garde la liste standard, ou on la complète avec le type courant s'il est personnalisé.
    const types = monsterTypes.includes(currentType) ? monsterTypes : [...monsterTypes, currentType];

    return types
      .map(type => {
        // L'option actuelle est marquée comme sélectionnée si elle correspond au type du monstre.
        const isSelected = type === currentType ? 'selected' : '';
        return `<option value="${type}" ${isSelected}>${type}</option>`;
      })
      .join('');
  }

  // Prépare les données qui seront injectées dans le template HTML du monstre.
  render() {
    // On génère le HTML pour le menu déroulant des types.
    this.typeOptionsHTML = this.renderTypeOptions(this.type);

    // On convertit le niveau de danger en une chaîne de symboles d'alarme / danger.
    this.skulls = '☠️'.repeat(this.dangerLevel);

    // On envoie l'objet complet au template pour générer le rendu final.
    return getTemplate(this);
  }
}