import { useEffect, useRef } from 'react'
import { useIsomorphicLayoutEffect } from 'usehooks-ts'

export function useInterval(
  callback: Function,
  delay: number | null,
  stop?: boolean
) {
  const savedCallback = useRef(callback)
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if ((!delay && delay !== 0) || stop) {
      return
    }
    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay, stop])
}
