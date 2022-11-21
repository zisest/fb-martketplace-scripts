export type MessageToTM = {
  source: 'page',
  payload: {
    type: 'add_to_visited',
    value: string
  } | {
    type: 'get_visited'
  } | {
    type: 'add_to_favorites',
    value: string | string[]
  } | {
    type: 'get_favorites'
  } | {
    type: 'remove_from_favorites',
    value: string | string[]
  }
}

export type MessageToPage = {
  source: 'tm',
  payload: {
    type: 'visited',
    value: string[]
  } | {
    type: 'favorites',
    value: string[]
  }
}