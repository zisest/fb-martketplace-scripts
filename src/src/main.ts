import {visitedOnTick, visitedPageSetup, visitedTMSetup} from "./visited";

export function main(this: any) {
  'use strict';


  function TM_setup() {
    visitedTMSetup()
  }

  TM_setup()

  function tick() {
    visitedOnTick()

    return tick
  }

  window.onload = function () {
    visitedPageSetup()
  }

  setInterval(tick(), 500)
}