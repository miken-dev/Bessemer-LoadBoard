import { logger, schedules, wait } from '@trigger.dev/sdk/v3';
import PocketBase from 'pocketbase';
import type { Notifications, TableDataTypes, savedSearchesTypes } from '../src/lib/types.ts';
import locations from '../src/lib/assets/locations.json';

export const bessemerLoadboardTask = schedules.task({
	id: 'bessemer-loadboard-tasks',
	// Every hour
	cron: '0 * * * *',
	// Set an optional maxDuration to prevent tasks from running indefinitely
	maxDuration: 30, // Stop executing after 300 secs (5 mins) of compute
	run: async (payload, { ctx }) => {
		const PB = new PocketBase('https://bessemer-loadboard.pockethost.io');
		async function getActiveLoads() {
			let records = await PB.collection('Active_Loads').getFullList();
			const results: [TableDataTypes] = records.map((record) => {
				return {
					loadID: record.id,
					loadDate: record.loadDate,
					deliveryDate: record.deliveryDate,
					originAddress: record.originAddress,
					originZipCode: record.originZipCode,
					destinationAddress: record.destinationAddress,
					destinationZipCode: record.destinationZipCode,
					commodity: record.commodity,
					lengthFeet: record.lengthFeet,
					lengthInches: record.lengthInches,
					widthFeet: record.widthFeet,
					widthInches: record.widthInches,
					heightFeet: record.heightFeet,
					heightInches: record.heightInches,
					weightInPounds: record.weightInPounds,
					pieceCount: record.pieceCount,
					revenue: record.revenue,
					notes: record.notes,
					terminalID: record.terminalID,
					terminalPhone: record.terminalPhone,
					ltl: record.ltl,
					isPublic: record.isPublic,
					trailerTypes: record.trailerTypes,
					miles: record.miles,
					terminalName: record.terminalName,
					originStateName: record.originStateName,
					originCityName: record.originCityName,
					originLat: record.originLat,
					originLng: record.originLng,
					destinationStateName: record.destinationStateName,
					destinationCityName: record.destinationCityName,
					destinationLat: record.destinationLat,
					destinationLng: record.destinationLng,
					areaLoadCount: record.areaLoadCount
				};
			});
			return results;
		}
		async function getSavedSearches() {
			let records = await PB.collection('Saved_Searches').getFullList();
			const results: [savedSearchesTypes] = records.map((record) => {
				return {
					id: record.id,
					name: record.name,
					originMiles: record.originMiles,
					originState: record.originState,
					originCity: record.originCity,
					destMiles: record.destMiles,
					destState: record.destState,
					destCity: record.destCity,
					pickupDateStart: record.pickupDateStart,
					pickupDateEnd: record.pickupDateEnd,
					trailerType: record.trailerType,
					emailNotification: record.emailNotification,
					textNotification: record.textNotification,
					loadsNotified: record.LoadsNotified,
					userID: record.userID
				};
			});
			return results;
		}
		async function getUsers() {
			let records = await PB.collection('driver').getFullList();
			const results = records.map((record) => {
				return {
					id: record.id,
					phone: record.phone,
					email: record.email
				};
			});
			return results;
		}
		async function sendEmail(emailAddress: string, message: string) { }
		async function sendText(phoneNumber: string, message: string) { }
		function getDistance(lat1: string, lon1: string, lat2: number, lon2: number) {
			const R = 3958.8; // Radius of the Earth in miles
			const toRad = (angle) => (Math.PI * angle) / 180;
			let lat1n = Number(lat1);
			let lon1n = Number(lon1);
			let lat2n = Number(lat2);
			let lon2n = Number(lon2);
			const dLat = toRad(lat2n - lat1n);
			const dLon = toRad(lon2n - lon1n);

			const a =
				Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
			const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

			const distance = R * c;

			return distance;
		}
		function getLat(city: string, state: string) {
			let result = '';
			for (const location of locations) {
				if (
					location.city.toLowerCase() === city.toLowerCase() &&
					location.state.toLowerCase() === state.toLowerCase()
				) {
					result = location.lat;
				}
			}
			return result;
		}
		function getLon(city: string, state: string) {
			let result = '';
			for (const location of locations) {
				if (
					location.city.toLowerCase() === city.toLowerCase() &&
					location.state.toLowerCase() === state.toLowerCase()
				) {
					result = location.lng;
				}
			}
			return result;
		}
		function splitString(trailerType: string) {
			if (!trailerType) {
				trailerType = '';
			}
			let splitTrailer = trailerType.split(', ');
			return splitTrailer.filter((str) => str !== ',').filter((str) => str !== '');
		}

		let activeLoads = await getActiveLoads();
		let savedSearches = await getSavedSearches();
		let users = await getUsers();
		//Main loop
		for (const user of users) {
			//let loadsToNotify: [Notifications]
			for (const activeLoad of activeLoads) {
				for (const savedSearch of savedSearches) {
					let searchResults = {
						withinRangeOrigin: false,
						withinRangeDest: false,
						range: 0,
						withinDateRange: false,
						trailerTypeMatch: false,
						emailNotification: false,
						textNotification: false,
						hasBeenNotified: false,
						userId: ''
					};
					//WITHIN RANGE ORIGIN
					if (
						getDistance(
							getLat(savedSearch.originCity, savedSearch.originState),
							getLon(savedSearch.originCity, savedSearch.originState),
							activeLoad.originLat,
							activeLoad.originLng
						) < savedSearch.originMiles ||
						!savedSearch.originCity
					) {
						searchResults.withinRangeOrigin = true;
					}
					//WITHIN RANGE DESTINATION
					searchResults.range = getDistance(
							getLat(savedSearch.destCity, savedSearch.destState),
							getLon(savedSearch.destCity, savedSearch.destState),
							activeLoad.destinationLat,
							activeLoad.destinationLng
)

					if (
						getDistance(
							getLat(savedSearch.destCity, savedSearch.destState),
							getLon(savedSearch.destCity, savedSearch.destState),
							activeLoad.destinationLat,
							activeLoad.destinationLng
						) < savedSearch.destMiles ||
						savedSearch.destCity == ''
					) {
						searchResults.withinRangeDest = true;
					}
					//PICKUP DATE RANGE
					if (
						(savedSearch.pickupDateStart < activeLoad.loadDate &&
							savedSearch.pickupDateEnd > activeLoad.loadDate) ||
						(savedSearch.pickupDateStart < activeLoad.loadDate && !savedSearch.pickupDateEnd) ||
						(!savedSearch.pickupDateStart && savedSearch.pickupDateEnd > activeLoad.loadDate) ||
						(!savedSearch.pickupDateStart && !savedSearch.pickupDateEnd)
					) {
						searchResults.withinDateRange = true;
					}
					//TRAILER TYPE
					if (savedSearch.trailerType) {
						for (let type of splitString(savedSearch.trailerType)) {
							if (activeLoad.trailerTypes.includes(type)) {
								searchResults.trailerTypeMatch = true;
							}
						}
					} else {
						searchResults.trailerTypeMatch = true
					}
					if (savedSearch.emailNotification) {
						searchResults.emailNotification = true;
					}
					if (savedSearch.textNotification) {
						searchResults.textNotification = true;
					}
					let loadsNotifiedArray = splitString(savedSearch.loadsNotified);
					for (const notified in loadsNotifiedArray) {
						if (notified === String(activeLoad.loadID)) {
							searchResults.hasBeenNotified = true;
						}
					}
					//		 console.log(
					//				  `Final Check: searchName: ${savedSearch.name} userId: ${savedSearch.userID}, email: ${savedSearch.emailNotification}, text: ${savedSearch.textNotification} loadsNotified: ${savedSearch.loadsNotified}... ${savedSearch.originCity}, ${savedSearch.originState} ${searchResults.withinRange ? "is" : "is not"} within ${savedSearch.originMiles} of ${activeLoad.originCityName}, ${activeLoad.originStateName}... activeLoadTrailer: ${activeLoad.trailerTypes}, savedTrailer: ${savedSearch.trailerType} withinRange: ${searchResults.withinRange}, withinDateRange: ${searchResults.withinDateRange}, trailerTypeMatch: ${searchResults.trailerTypeMatch}, hasBeenNotified: ${searchResults.hasBeenNotified}`,
					//					 );
					if (
						searchResults.withinRangeOrigin &&
						searchResults.withinRangeDest &&
						searchResults.withinDateRange &&
						searchResults.trailerTypeMatch &&
						!searchResults.hasBeenNotified
					) {
						if (savedSearch.emailNotification) {
							console.log(
								`email sent: searchName: ${savedSearch.name} userId: ${savedSearch.userID}, email: ${savedSearch.emailNotification}, text: ${savedSearch.textNotification} loadsNotified: ${savedSearch.loadsNotified}... ${savedSearch.originCity}, ${savedSearch.originState} ${searchResults.withinRangeOrigin ? 'is' : 'is not'} within ${savedSearch.originMiles} of ${activeLoad.originCityName}, ${activeLoad.originStateName}... activeLoadTrailer: ${activeLoad.trailerTypes}, savedTrailer: ${savedSearch.trailerType}`
							);
						}
					} else {
						console.log(` ❌❌❌❌❌ NOT ADDED: searchName: ${savedSearch.name} userId: ${savedSearch.userID},withinRangeOrigin ${searchResults.withinRangeOrigin}: result is ${searchResults.range} miles,withinRangeDest: ${searchResults.withinRangeDest}, withinDateRange: ${searchResults.withinDateRange}, trailerTypeMatch: ${searchResults.trailerTypeMatch} ,hasbeenNotified: ${searchResults}`)
					}

				}
			}
		}
	}
});
