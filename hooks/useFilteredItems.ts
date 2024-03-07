import { useContext, useMemo } from 'react'
import { contest, speculation } from '../constants/interface'
import { ProviderContext } from '../contexts/ProviderContext'

interface DeduplicatedSpeculationCriteria {
  (item: speculation, index: number, self: speculation[]): boolean
}

const deduplicateSpeculations: DeduplicatedSpeculationCriteria = (item, index, self) => {
  return (
    self.findIndex(
      (t) =>
        t.contestId === item.contestId &&
        t.speculationScorer === item.speculationScorer
    ) === index
  )
}

export const useFilteredItems = <T extends speculation>
  (query: string, items: T[], filterCriteria: (item: T, query: string, contests: contest[]) => boolean) => {
  const { contests } = useContext(ProviderContext)
  const deduplicatedItems = useMemo(() => items.filter(deduplicateSpeculations), [items])

  const filteredItems = useMemo(() => {
    return deduplicatedItems.filter(item => filterCriteria(item, query, contests))
  }, [query, deduplicatedItems, contests, filterCriteria])

  return filteredItems
}
