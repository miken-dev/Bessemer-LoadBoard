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
        if (filters.fromDateRange || filters.toDateRange) {
            const loadDate = new Date(row.loadDate);
            
            if (filters.fromDateRange && loadDate < filters.fromDateRange) {
                return false;
            }
            
            if (filters.toDateRange && loadDate > filters.toDateRange) {
                return false;
            }
        }

        // Trailer types filter
        if (filters.trailerTypesFilter) {
            const trailerTypes = filters.trailerTypesFilter.split(', ');
            if (!trailerTypes.some(type => row.trailerTypes.includes(type))) {
                return false;
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
                    return sortOption.direction === 'asc'
                        ? a.originCityName.localeCompare(b.originCityName)
                        : b.originCityName.localeCompare(a.originCityName);
                
                case 'destinationState':
                    return sortOption.direction === 'asc'
                        ? a.destinationStateName.localeCompare(b.destinationStateName)
                        : b.destinationStateName.localeCompare(a.destinationStateName);
                
                case 'destinationCity':
                    return sortOption.direction === 'asc'
                        ? a.destinationCityName.localeCompare(b.destinationCityName)
                        : b.destinationCityName.localeCompare(a.destinationCityName);
                
                case 'loadDate':
                    const dateA = new Date(a.loadDate);
                    const dateB = new Date(b.loadDate);
                    return sortOption.direction === 'asc'
                        ? dateA.getTime() - dateB.getTime()
                        : dateB.getTime() - dateA.getTime();
                
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
