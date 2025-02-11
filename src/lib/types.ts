export type TableDataTypes = {
	loadID: number;
	companyNumber: number;
	loadDate: string;
	deliveryDate: string;
	originAddress: string;
	originZipCodeID: number;
	originZipCode: string;
	destinationAddress: string;
	destinationZipCodeID: number;
	destinationZipCode: string;
	commodity: string;
	lengthFeet: number;
	lengthInches: number;
	widthFeet: number;
	widthInches: number;
	heightFeet: number;
	heightInches: number;
	weightInPounds: number;
	pieceCount: number;
	revenue: number;
	notes: string;
	terminalID: number;
	terminalPhone: string;
	ltl: boolean;
	isPublic: boolean;
	dateCreated: string;
	whoCreated: string;
	dateModified: any;
	whoModified: any;
	trailerTypes: string;
	miles: number;
	terminalName: string;
	originStateID: number;
	originStateName: string;
	originCityName: string;
	originLat: number;
	originLng: number;
	destinationStateID: number;
	destinationStateName: string;
	destinationCityName: string;
	destinationLat: number;
	destinationLng: number;
	manualLoad: boolean;
	areaLoadCount: number;


};


export type FormattedTypes = TableDataTypes & {
	origin: `${TableDataTypes['originCityName']}, ${TableDataTypes['originStateName']}`
}


export interface PageData {
    userId: string | null;
}

interface Locals {
    userId: string | null;
}
