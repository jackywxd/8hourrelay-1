'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'

export function useQueryString() {
  const searchParams = useSearchParams()

  const qs = React.useCallback(
    <T extends Record<string, any>>(object: T): string => {
      const params = new URLSearchParams(searchParams.toString())

      if (object) {
        Object.keys(object).forEach((k: string) => {
          if (object[k] === null || object[k] === undefined) {
            params.delete(k)
            return
          }
          params.set(k, object[k])
        })
      }

      return params.toString()
    },
    [searchParams]
  )

  return { qs }
}
