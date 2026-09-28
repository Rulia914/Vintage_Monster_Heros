import MonsterList from "./components/monsterList/MonsterList";

  window.MonsterList = new monsterList({
    el: "#app",
    title:"Vintage Monster Heros",
    apiUrl: "https://6a4f4934f45d5352b6112e4b.mockapi.io/",
  });
  window.monsterList.render();