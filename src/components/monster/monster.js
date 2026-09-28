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