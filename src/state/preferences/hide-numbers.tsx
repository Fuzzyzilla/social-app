import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = persisted.Schema['hideNumbers']
type SetContext = (v: persisted.Schema['hideNumbers']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.hideNumbers,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['hideNumbers']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(persisted.get('hideNumbers'))

  const setStateWrapped = React.useCallback(
    (hideNumbers: persisted.Schema['hideNumbers']) => {
      setState(hideNumbers)
      persisted.write('hideNumbers', hideNumbers)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('hideNumbers', nextHideNumbers => {
      setState(nextHideNumbers)
    })
  }, [setStateWrapped])

  return (
    <stateContext.Provider value={state}>
      <setContext.Provider value={setStateWrapped}>
        {children}
      </setContext.Provider>
    </stateContext.Provider>
  )
}

export function useHideNumbers() {
  return React.useContext(stateContext)
}

export function useSetHideNumbers() {
  return React.useContext(setContext)
}
