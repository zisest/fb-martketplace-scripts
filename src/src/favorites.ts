import {MessageToPage, MessageToTM} from "../types";
import {getAllAdsOnPage, getId, isElementAnchorTag, urlToId} from "../util";


function getFavoritesFromStorage() {
  let favorites: string[]
  const favoritesString = GM_getValue('favorites')
  if (favoritesString) {
    try {
      favorites = JSON.parse(favoritesString)
    } catch (e) {
      favorites = []
    }
    if (!Array.isArray(favorites)) favorites = []
  } else favorites = []

  return favorites
}

// page fn
function addToFavorites(value: string | string[]) {
  const message: MessageToTM = {
    source: 'page',
    payload: {
      value, type: 'add_to_favorites'
    }
  }
  window.postMessage(message, '*')
}

function removeFromFavorites(value: string) {
  const message: MessageToTM = {
    source: 'page',
    payload: {
      value, type: 'remove_from_favorites'
    }
  }
  window.postMessage(message, '*')
}


/** ON TICK */
export function favoritesOnTick() {
  saveFaveStatusFromCurrentAd();
  saveStatusFromFavesPage();
  requestFavorites();
}

// Если открыта страница объявления, смотрит на статус кнопки "Сохранить в избранное" и добавляет/удаляет из избранного
function saveFaveStatusFromCurrentAd() {
  const advId = getId()
  if (!advId) return
  const favoriteBtn = document.querySelector('div[aria-label="Save"]')
  const pressed = favoriteBtn?.getAttribute('aria-pressed')
  if (!pressed) return;
  try {
    const value: boolean = JSON.parse(pressed)
    value ? addToFavorites(advId) : removeFromFavorites(advId)
  } catch (e) {
    console.error(e)
  }
}

function saveStatusFromFavesPage() {
  if (!window.location.href.includes('marketplace/you/saved')) return;
  const newFaves = getAllAdsOnPage().map(ad =>
      urlToId(ad.href)
  )

  addToFavorites(newFaves)
}

function requestFavorites() {
  const msg: MessageToTM = {
    source: 'page',
    payload: {
      type: 'get_favorites'
    }
  }
  window.postMessage(msg, '*')
}


/** PAGE SETUP */
export function favoritesPageSetup() {
  injectStyles()

  function handleMessageFromTM(msg: MessageToPage) {
    if (msg.payload.type === 'favorites') {
      paintFavorites(msg.payload.value)
    }
  }

  if (window.top === window.self) {
    window.addEventListener('message', (e) => {
      if (e.data.source === 'tm') handleMessageFromTM(e.data)
    })
  }
}


function injectStyles() {
  const styles = document.createElement('style')
  styles.innerHTML = `
  .item-favorite {
    position: relative;
  }
  .item-favorite::after {
    content: '';
    background-image: url(https://static.xx.fbcdn.net/rsrc.php/v3/yg/r/ZI-NYiQK28_.png);
    background-position: 0 -1266px;
    background-size: 26px 1582px;
    width: 16px;
    height: 16px;
    background-repeat: no-repeat;
    display: inline-block;
    position: absolute;
    top: 4px;
    left: 8px;
    filter: invert(40%) sepia(52%) saturate(200%) saturate(200%) saturate(200%) saturate(189%) hue-rotate(191deg) brightness(103%) contrast(102%);
    scale: 2;
    
  }
  `
  console.log('styles', styles)
  document.head.appendChild(styles)
}

function paintFavorites(favorites: string[]) {
  const favoritesSet = new Set(favorites)
  getAllAdsOnPage().forEach((node) => {
    if (!isElementAnchorTag(node)) return
    const id = urlToId(node.href)
    if (favoritesSet.has(id)) {
      if (!node.classList.contains('item-favorite')) node.classList.add('item-favorite')
    } else {
      node.classList.remove('item-favorite')
    }
  })

}

/** TM SETUP */
export function favoritesTMSetup() {
  function handle(msg: MessageToTM) {
    // runs on TM
    switch (msg.payload.type) {
      case 'add_to_favorites': {
        let favorites = getFavoritesFromStorage()
        const favoritesSet = new Set(favorites);
        (Array.isArray(msg.payload.value) ? msg.payload.value : [msg.payload.value]).forEach(value => {
          favoritesSet.add(value)
        })
        favorites = [...favoritesSet]
        GM_setValue('favorites', JSON.stringify(favorites))
        const toPage: MessageToPage = {
          source: 'tm',
          payload: {
            type: 'favorites',
            value: favorites
          }
        }
        window.postMessage(toPage, '*')
        break;
      }

      case 'remove_from_favorites': {
        let favorites = getFavoritesFromStorage()
        const favoritesSet = new Set(favorites);
        (Array.isArray(msg.payload.value) ? msg.payload.value : [msg.payload.value]).forEach(value => {
          favoritesSet.delete(value)
        })
        favorites = [...favoritesSet]
        GM_setValue('favorites', JSON.stringify(favorites))
        const toPage: MessageToPage = {
          source: 'tm',
          payload: {
            type: 'favorites',
            value: favorites
          }
        }
        window.postMessage(toPage, '*')
        break;
      }
      case 'get_favorites' : {
        const favorites = getFavoritesFromStorage()
        const toPage: MessageToPage = {
          source: 'tm',
          payload: {
            type: 'favorites',
            value: favorites
          }
        }
        window.postMessage(toPage, '*')
        break
      }
    }
  }

  window.addEventListener('message', e => {
    console.log(e.data)
    if (e.data.source === 'page') handle(e.data)
  })
}
