import {visitedOnTick, visitedPageSetup, visitedTMSetup} from "./visited";

export function main(this: any) {
  'use strict';


  function TM_setup() {
    // Запуск на старте TamperMonkey
    visitedTMSetup()
  }

  TM_setup()

  function tick() {
    // Функции, которые необходимо запускать, каждые 500 мс
    visitedOnTick()

    return tick
  }

  function pageSetup() {
    // Функции для запуска при window load
    visitedPageSetup()

  }

  window.onload = pageSetup

  setInterval(tick(), 500)
}