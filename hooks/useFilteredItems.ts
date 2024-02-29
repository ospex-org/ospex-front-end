import { useContext, useMemo } from 'react'
import { contest } from '../constants/interface'
import { ProviderContext } from '../contexts/ProviderContext'

interface FilterCriteria<T> {
  (item: T, query: string, contests: contest[]): boolean
}

export const useFilteredItems = <T>(query: string, items: T[], filterCriteria: FilterCriteria<T>) => {
  const { contests } = useContext(ProviderContext)

  const filteredItems = useMemo(() => {
    return items.filter(item => filterCriteria(item, query, contests))
  }, [query, items, contests, filterCriteria])

  return filteredItems
}
