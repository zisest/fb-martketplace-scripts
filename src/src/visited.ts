type MessageToTM = {
  source: 'page',
  payload: {
    type: 'add_to_visited',
    value: string
  } | { type: 'get_visited' }
}

type MessageToPage = {
  source: 'tm',
  payload: {
    type: 'visited',
    value: string[]
  }
}

function isElementAnchorTag(node: Element): node is HTMLAnchorElement {
  return 'href' in node
}

function urlToId(url: string) {
  return url.split('/item/')[1]?.split('/')[0]
}

function getVisitedFromStorage() {
  let visited: string[]
  const visitedString = GM_getValue('visited')
  if (visitedString) {
    try {
      visited = JSON.parse(visitedString)
    } catch (e) {
      visited = []
    }
    if (!Array.isArray(visited)) visited = []
  } else visited = []

  return visited
}


/** ON TICK */
export function visitedOnTick() {
  saveIdToVisited();
  requestVisited()
}

function saveIdToVisited() {
  const advId = urlToId(window.location.href)
  if (!advId) return
  const message: MessageToTM = {
    source: 'page',
    payload: {
      value: advId, type: 'add_to_visited'
    }
  }
  window.postMessage(message, '*')
}

function requestVisited() {
  const msg: MessageToTM = {
    source: 'page',
    payload: {
      type: 'get_visited'
    }
  }
  window.postMessage(msg, '*')
}



/** PAGE SETUP */
export function visitedPageSetup() {
  injectStyles()

  function handleMessageFromTM(msg: MessageToPage) {
    if (msg.payload.type === 'visited') {
      paintVisited(msg.payload.value)
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
  .item-visited {
    position: relative;
    opacity: 0.7;
  }
  .item-visited::after {
    content: 'visited';
    background: #ffffffb0;
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 3px 7px;
    font-size: 1.2rem;
    border-radius: 4px;
  }
  `
  console.log('styles', styles)
  document.head.appendChild(styles)
}

function paintVisited(visited: string[]) {
  const visitedSet = new Set(visited)
  document.querySelectorAll('.x3ct3a4 > a').forEach((node) => {
    if (!isElementAnchorTag(node)) return
    const id = urlToId(node.href)
    if (visitedSet.has(id)) {
      if (!node.classList.contains('item-visited')) node.classList.add('item-visited')
    } else {
      node.classList.remove('item-visited')
    }
  })

}

/** TM SETUP */
export function visitedTMSetup() {
  function handle(msg: MessageToTM) {
    // runs on TM
    if (msg.payload.type === 'add_to_visited') {
      let visited = getVisitedFromStorage()
      visited = [...(new Set(visited).add(msg.payload.value))]
      GM_setValue('visited', JSON.stringify(visited))
      const toPage: MessageToPage = {
        source: 'tm',
        payload: {
          type: 'visited',
          value: visited
        }
      }
      window.postMessage(toPage, '*')
    } else if (msg.payload.type === 'get_visited') {
      const visited = getVisitedFromStorage()
      const toPage: MessageToPage = {
        source: 'tm',
        payload: {
          type: 'visited',
          value: visited
        }
      }
      window.postMessage(toPage, '*')
    }

  }

  window.addEventListener('message', e => {
    console.log(e.data)
    if (e.data.source === 'page') handle(e.data)
  })
}
