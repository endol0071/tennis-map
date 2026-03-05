import { useMemo } from 'react'
import type { Amenity, Court } from '../types'

type IndoorFilter = 'all' | 'indoor' | 'outdoor'
type SortOption = 'popular' | 'priceAsc' | 'priceDesc' | 'courts'

export interface Filters {
  search: string
  regionSido: string
  regionSigungu: string
  indoor: IndoorFilter
  amenity: Amenity | 'all'
  sort: SortOption
}

const matchesText = (value: string, keyword: string) =>
  value.toLowerCase().includes(keyword.trim().toLowerCase())

export function useFilteredCourts(courts: Court[], filters: Filters) {
  const filtered = useMemo(() => {
    let list = [...courts]

    if (filters.search) {
      list = list.filter(
        (court) =>
          matchesText(court.name, filters.search) ||
          matchesText(court.addressRoad, filters.search) ||
          matchesText(court.regionSigungu, filters.search),
      )
    }

    if (filters.regionSido) {
      list = list.filter((court) => court.regionSido === filters.regionSido)
    }

    if (filters.regionSigungu) {
      list = list.filter((court) => court.regionSigungu === filters.regionSigungu)
    }

    if (filters.indoor === 'indoor') {
      list = list.filter((court) => court.isIndoorAvailable)
    }

    if (filters.indoor === 'outdoor') {
      list = list.filter((court) => court.isOutdoorAvailable)
    }

    if (filters.amenity !== 'all') {
      const amenity = filters.amenity
      list = list.filter((court) => court.amenities.includes(amenity))
    }

    switch (filters.sort) {
      case 'priceAsc':
        list.sort((a, b) => (a.priceMin ?? Infinity) - (b.priceMin ?? Infinity))
        break;
      case 'priceDesc':
        list.sort((a, b) => (b.priceMin ?? 0) - (a.priceMin ?? 0))
        break;
      case 'courts':
        list.sort((a, b) => (b.courtsTotal ?? 0) - (a.courtsTotal ?? 0))
        break;
      default:
        list.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    }

    return list
  }, [courts, filters])

  return { filtered }
}
