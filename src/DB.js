export default class DB {
  static setApiUrl(apiUrl) {
    this.apiUrl = apiUrl;
  }

  static async findAll() {
    const response = await fetch(this.apiUrl + "/monsters");
    return response.json();
  }
  
  static async store(data){
    const response = await fetch(this.apiUrl + "/monsters",{
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    });
    return response.json();
  }

  static async update(id, data) {
    const response = await fetch(`${this.apiUrl}/monsters/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }
}