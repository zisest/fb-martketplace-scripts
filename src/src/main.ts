import {visitedOnTick, visitedPageSetup, visitedTMSetup} from "./visited";
import {favoritesOnTick, favoritesPageSetup, favoritesTMSetup} from "./favorites";
import {filtersOnTick, filtersPageSetup} from "./filters";

export function main(this: any) {
  'use strict';


  function TM_setup() {
    // Запуск на старте TamperMonkey
    visitedTMSetup()
    favoritesTMSetup()
  }

  TM_setup()

  function tick() {
    // Функции, которые необходимо запускать, каждые 500 мс
    visitedOnTick()
    favoritesOnTick()
    filtersOnTick()

    return tick
  }

  function pageSetup() {
    // Функции для запуска при window load
    visitedPageSetup()
    favoritesPageSetup()
    filtersPageSetup()

  }

  window.onload = pageSetup

  setInterval(tick(), 500)
}