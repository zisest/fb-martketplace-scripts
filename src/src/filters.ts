import {MessageToPage, MessageToTM} from "../types";
import {getAllAdsOnPage, isElementAnchorTag, urlToId} from "../util";


function assertIsSpan(el: Element): asserts el is HTMLSpanElement {
  if (el.tagName.toLowerCase() !== 'span') throw new Error('Not a span: ' + el.tagName)
}

/**
 * RED
 */
const redWords = [
  'oroklini', 'ορόκλινη',
  'oroklinh', 'office', 'tersefanou', 'alethriko',
  'aradippou',
  'ground floor',
  "lefkara pano",
  "agios theodoros",
  "alaminos",
  "pervolia",
  "maroni",
  "mazotos",
  "meneou",
  "choirokoitia",
  "anafotida",
  "skarinou",
  "anglisides",
  "vavla",
  "psematismenos",
  "kalavasos",
  "zygi",
  "tochni",
  "anafotida",
  'dekelia',
  "dhekelia",
  "pyla",
  "ormideia",
  "xylofagou",
  "troulloi",
  "mosfiloti",
  "psevdas",
  "drys kato",
  "vavatsinia",
  "ora",
  "kalo chorio",
  "kornos",
  'dromolaxia'

]

/**
 * YELLOW
 */
const yellowWords: string[] = ['livadia']

/**
 * GREEN
 */
const greenWords = ['center', 'centre', 'sea', 'faneromenis', 'kamares', 'drosia', 'nikolaos', 'skala', 'sotiros']

/** ON TICK */
export function filtersOnTick() {
  applyFilters();
}

/** PAGE SETUP */
export function filtersPageSetup() {
  injectStyles()
}


function injectStyles() {
  const styles = document.createElement('style')
  styles.innerHTML = `
  .filter-red {
    color: red;
  }
  .filter-green {
    color: mediumseagreen;
  }
  .filter-yellow {
    color: orange;
  }
  `
  document.head.appendChild(styles)
}

function applyFilters() {

  getAllAdsOnPage().forEach((node) => {
    const caption = node.querySelector(('.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6'))
    if (!caption) return;
    assertIsSpan(caption)
    if (caption.childElementCount) return;
    for (const word of greenWords) {
      const text = caption.innerText;
      const wordIndex = text.toLocaleLowerCase().indexOf(word)
      if (wordIndex !== -1) {
        caption.innerHTML = `${text.slice(0, wordIndex)}<em class="filter-green">${text.slice(wordIndex, wordIndex + word.length)}</em>${text.slice(wordIndex + word.length)}`
      }
    }
    for (const word of yellowWords) {
      const text = caption.innerText;
      const wordIndex = text.toLocaleLowerCase().indexOf(word)
      if (wordIndex !== -1) {
        caption.innerHTML = `${text.slice(0, wordIndex)}<em class="filter-yellow">${text.slice(wordIndex, wordIndex + word.length)}</em>${text.slice(wordIndex + word.length)}`
      }
    }
    for (const word of redWords) {
      const text = caption.innerText;
      const wordIndex = text.toLocaleLowerCase().indexOf(word)
      if (wordIndex !== -1) {
        caption.innerHTML = `${text.slice(0, wordIndex)}<em class="filter-red">${text.slice(wordIndex, wordIndex + word.length)}</em>${text.slice(wordIndex + word.length)}`
      }
    }

  })

}
