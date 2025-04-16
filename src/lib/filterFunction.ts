import type { Location } from './types';
import type { TableDataTypes } from './types';

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

interface FilterParams {
	originMilesFilter?: number;
	originStateFilter?: string;
	originCityFilter?: string;
	destMilesFilter?: number;
	destCityFilter?: string;
	destStateFilter?: string;
	trailerTypesFilter?: string;
	fromDateRange?: Date;
	toDateRange?: Date;
}
export interface SortOptions {
    field: 'originState' | 'originCity' | 'destinationState' | 'destinationCity' | 'loadDate' | 'revenue' | 'terminal';
    direction: 'asc' | 'desc';
}

export function filterAndSortTableData(
    tableData: TableDataTypes[],
    filters: FilterParams,
    locations: Location[],
    sortOption?: SortOptions
): TableDataTypes[] {
    // First apply filters
    let filteredData = tableData.filter(row => {
        // Date range filter
        const loadDate = new Date(row.loadDate);
        
        // Validate dates and convert to midnight UTC for consistent comparison
        const fromDate = filters.fromDateRange ? new Date(filters.fromDateRange.setHours(0, 0, 0, 0)) : null;
        const toDate = filters.toDateRange ? new Date(filters.toDateRange.setHours(0, 0, 0, 0)) : null;
        const compareDate = new Date(loadDate.setHours(0, 0, 0, 0));

        if (fromDate && toDate) {
            // Both dates set - show results between and including both dates
            if (compareDate < fromDate || compareDate > toDate) {
                return false;
            }
        } else if (fromDate) {
            // Only from date set - show results after and including fromDateRange
            if (compareDate < fromDate) {
                return false;
            }
        } else if (toDate) {
            // Only to date set - show results before and including toDateRange
            if (compareDate > toDate) {
                return false;
            }
        }
        // If neither date is set, continue to next filter (show all results)

        // Trailer types filter
        if (filters.trailerTypesFilter) {
            const trailerTypes = filters.trailerTypesFilter.split(', ');
	
			let filter = false 
			for (const trailerType of trailerTypes) {
				if (row.trailerTypes.includes(trailerType) && trailerType) {
					filter = true;
				}
			}
			if (!filter) {
				return false
			//if (!trailerTypes.some(type => row.trailerTypes.includes(type))) {
            }
        }

        // Origin location filter
        if (filters.originStateFilter && filters.originCityFilter && filters.originMilesFilter) {
            const originLocation = locations.find(
                loc => loc.city === filters.originCityFilter && 
                      loc.state === filters.originStateFilter
            );
            
            if (!originLocation) {
                return false;
            }

            const distance = calculateDistance(
                parseFloat(originLocation.lat),
                parseFloat(originLocation.lng),
                row.originLat,
                row.originLng
            );

            if (distance > filters.originMilesFilter) {
                return false;
            }
        }

        // Destination location filter
        if (filters.destStateFilter && filters.destCityFilter && filters.destMilesFilter) {
            const destLocation = locations.find(
                loc => loc.city === filters.destCityFilter && 
                      loc.state === filters.destStateFilter
            );
            
            if (!destLocation) {
                return false;
            }

            const distance = calculateDistance(
                parseFloat(destLocation.lat),
                parseFloat(destLocation.lng),
                row.destinationLat,
                row.destinationLng
            );

            if (distance > filters.destMilesFilter) {
                return false;
            }
        }

        return true;
    });

    // Then apply sorting if a sort option is provided
    if (sortOption) {
        filteredData.sort((a, b) => {
            switch (sortOption.field) {
                case 'originState':
                    return sortOption.direction === 'asc' 
                        ? a.originStateName.localeCompare(b.originStateName)
                        : b.originStateName.localeCompare(a.originStateName);
                
                case 'originCity':
                    const originStateCompare = sortOption.direction === 'asc'
                        ? a.originStateName.localeCompare(b.originStateName)
                        : b.originStateName.localeCompare(a.originStateName);
                    if (originStateCompare !== 0) return originStateCompare;
                    
                    const originCityCompare = sortOption.direction === 'asc'
                        ? a.originCityName.localeCompare(b.originCityName)
                        : b.originCityName.localeCompare(a.originCityName);
                    if (originCityCompare !== 0) return originCityCompare;
                    
                    const destStateCompare = sortOption.direction === 'asc'
                        ? a.destinationStateName.localeCompare(b.destinationStateName)
                        : b.destinationStateName.localeCompare(a.destinationStateName);
                    if (destStateCompare !== 0) return destStateCompare;
                    
                    return sortOption.direction === 'asc'
                        ? a.destinationCityName.localeCompare(b.destinationCityName)
                        : b.destinationCityName.localeCompare(a.destinationCityName);
                
                case 'destinationState':
                    return sortOption.direction === 'asc'
                        ? a.destinationStateName.localeCompare(b.destinationStateName)
                        : b.destinationStateName.localeCompare(a.destinationStateName);
                
                case 'destinationCity':
                    const destCityStateCompare = sortOption.direction === 'asc'
                        ? a.destinationStateName.localeCompare(b.destinationStateName)
                        : b.destinationStateName.localeCompare(a.destinationStateName);
                    if (destCityStateCompare !== 0) return destCityStateCompare;
                    
                    const destCityCityCompare = sortOption.direction === 'asc'
                        ? a.destinationCityName.localeCompare(b.destinationCityName)
                        : b.destinationCityName.localeCompare(a.destinationCityName);
                    if (destCityCityCompare !== 0) return destCityCityCompare;
                    
                    const destCityOriginStateCompare = sortOption.direction === 'asc'
                        ? a.originStateName.localeCompare(b.originStateName)
                        : b.originStateName.localeCompare(a.originStateName);
                    if (destCityOriginStateCompare !== 0) return destCityOriginStateCompare;
                    
                    return sortOption.direction === 'asc'
                        ? a.originCityName.localeCompare(b.originCityName)
                        : b.originCityName.localeCompare(a.originCityName);
                
                case 'loadDate':
                    const dateA = new Date(a.loadDate);
                    const dateB = new Date(b.loadDate);
                    const dateCompare = sortOption.direction === 'asc'
                        ? dateA.getTime() - dateB.getTime()
                        : dateB.getTime() - dateA.getTime();
                    if (dateCompare !== 0) return dateCompare;
                    
                    // Secondary sort by originStateName
                    const stateCompare = sortOption.direction === 'asc'
                        ? a.originStateName.localeCompare(b.originStateName)
                        : a.originStateName.localeCompare(b.originStateName);
                    if (stateCompare !== 0) return stateCompare;
                    
                    // Tertiary sort by originCityName
                    return sortOption.direction === 'asc'
                        ? a.originCityName.localeCompare(b.originCityName)
                        : a.originCityName.localeCompare(b.originCityName);
                
                case 'revenue':
                    return sortOption.direction === 'asc'
                        ? a.revenue - b.revenue
                        : b.revenue - a.revenue;
                
                case 'terminal':
                    return sortOption.direction === 'asc'
                        ? a.terminalName.localeCompare(b.terminalName)
                        : b.terminalName.localeCompare(a.terminalName);
                
                default:
                    return 0;
            }
        });
    }

    return filteredData;
}
