export default class DB {
  // Définir l'URL de base de l'API
  static setApiUrl(apiUrl) {
    // Stocke l'URL du serveur pour la réutiliser dans toutes les requêtes
    this.apiUrl = apiUrl;
  }

  // Récupérer la liste complète des monstres
  static async findAll() {
    try {
      // Requête HTTP GET vers le point d'entrée /monsters
      const response = await fetch(`${this.apiUrl}/monsters`);
      
      // Intercepte les erreurs HTTP (ex: 404, 500) que fetch ne rejette pas par défaut
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      
      // Convertit le corps de la réponse en JSON et le retourne
      return await response.json();
    } catch (error) {
      // Affiche l'erreur en console en cas de problème réseau ou statut HTTP invalide
      console.error("Échec de la récupération des monstres :", error);
    }
  }

  // Créer un nouveau monstre en BDD
  static async store(newMonster) {
    try {
      // Requête HTTP POST envoyant le nouvel objet au serveur
      const response = await fetch(`${this.apiUrl}/monsters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Spécifie le format du payload
        body: JSON.stringify(newMonster), // Transforme l'objet JS en chaîne JSON
      });
      
      // Vérifie si la création a bien été acceptée par le serveur
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      
      // Retourne le monstre créé (avec son ID attribué par l'API)
      return await response.json();
    } catch (error) {
      // Capture les échecs lors de la création
      console.error("Échec de la création du monstre :", error);
    }
  }

  // Mettre à jour un monstre existant par son ID
  // Mettre à jour un monstre existant par son ID
  static async update(id, changes) {
    try {
      // Requête HTTP PUT vers l'URL spécifique du monstre
      const response = await fetch(`${this.apiUrl}/monsters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }, // Spécifie le format du payload
        body: JSON.stringify(changes), // Envoie les modifications formatées en JSON
      });
      
      // Vérifie le succès de la mise à jour
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      
      // Retourne le monstre mis à jour
      return await response.json();
    } catch (error) {
      // Log l'erreur en console pour le débogage
      console.error(`Échec de la mise à jour du monstre ${id} :`, error);
      
      // CRUCIAL : On relance l'erreur pour que l'appelant (MonsterList)
      // sache que l'API a échoué et N'EFFECTUE PAS la mise à jour locale.
      throw error;
    }
  }
  
  // Supprimer un monstre par son ID
  static async delete(id) {
    try {
      // Requête HTTP DELETE ciblée par ID
      const response = await fetch(`${this.apiUrl}/monsters/${id}`, {
        method: "DELETE",
      });
      
      // Vérifie la confirmation de suppression
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      
      // Retourne la réponse de confirmation du serveur
      return await response.json();
    } catch (error) {
      // Capture les échecs de suppression
      console.error(`Échec de la suppression du monstre ${id} :`, error);
    }
  }
}