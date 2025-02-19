export type TableDataTypes = {
	loadID: number;
	loadDate: Date;
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
	origin: `${TableDataTypes['originCityName']}, ${TableDataTypes['originStateName']}`;
};

export interface PageData {
	userId: string | null;
}

interface Locals {
	userId: string | null;
}

export type savedSearchesTypes = {
	id: string;
	name: string;
	originMiles: number;
	originState: string;
	originCity: string;
	destMiles: number;
	destState: string;
	destCity: string;
	pickupDateStart: Date;
	pickupDateEnd: Date;
	trailerType: string;
	emailNotification: boolean;
	textNotification: boolean;
	loadsNotified: string;
	userID: string;
};

export type Notifications = {
	userID: string,
	textNotification: boolean,
	emailNotification: boolean,
	message: string
}
