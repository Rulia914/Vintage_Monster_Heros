export default class DB {
  static setApiUrl(apiUrl) {
    this.apiUrl = apiUrl;
  }

  static async findAll() {
    const response = await fetch(this.apiUrl + "/monsters");
    return response.json();
  }
  
  static async store(newMonster){
    const response = await fetch(this.apiUrl + "/monsters",{
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newMonster),
    });
    return response.json();
  }

  static async update(id, changes) {
    const response = await fetch(`${this.apiUrl}/monsters/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(changes),
    });
    return await response.json();
  }
  
  static async delete(id) {
    const response = await fetch(`${this.apiUrl}/monsters/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  }
}