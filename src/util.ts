export function isElementAnchorTag(node: Element): node is HTMLAnchorElement {
  return 'href' in node
}

export function urlToId(url: string) {
  return url.split('/item/')[1]?.split('/')[0]
}


export function getId() {
  return urlToId(window.location.href)
}

export function getAllAdsOnPage(): HTMLAnchorElement[] {
  return [...document.querySelectorAll('.x3ct3a4 > a')] as HTMLAnchorElement[]
}