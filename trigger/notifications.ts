import { logger, schedules, wait } from '@trigger.dev/sdk/v3';
import PocketBase from 'pocketbase';
import type { Notifications, TableDataTypes, savedSearchesTypes } from '../src/lib/types.ts';
import locations from '../src/lib/assets/locations.json';

export const bessemerLoadboardTask = schedules.task({
	id: 'bessemer-loadboard-tasks',
	// Every hour
	cron: {
		pattern: '0 8-18 * * *',
		timezone: "America/New_York"
	},
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
		async function markLoadAsNotified(userID: string, loadID: string) {
			const oldRecord = await PB.collection('driver').getOne(`${userID}`);
			const loadsNotified = oldRecord.loadsNotified || '';
			const newRecord = await PB.collection('driver').update(`${userID}`, {
				loadsNotified: `${loadsNotified}|${loadID}`,
			});
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
					email: record.email,
					loadsNotified: record.loadsNotified

				};
			});
			return results;
		}
		async function sendEmail(emailAddress: string, message: string) {
			await fetch('https://bessemer-loadboard.pockethost.io/api/notificationsender/email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					toAddress: emailAddress,
					message: message
				})
			});
		}
		async function sendText(phoneNumber: string, message: string) { 
			
			await fetch('https://bessemer-loadboard.pockethost.io/api/notificationsender/text', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					toAddress: phoneNumber,
					message: message
				})
			});
		}
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

		// Create a map to store notifications per user
		const userNotifications = new Map();

		// Main loop
		for (const user of users) {
			for (const activeLoad of activeLoads) {
				for (const savedSearch of savedSearches) {
					if (savedSearch.userID !== user.id) continue; // Skip if not user's saved search
					
					let searchResults = {
						withinRangeOrigin: false,
						withinRangeDest: false,
						range: 0,
						withinDateRange: false,
						trailerTypeMatch: false,
						emailNotification: savedSearch.emailNotification,
						textNotification: savedSearch.textNotification,
						hasBeenNotified: false
					};

					// Check if load has been notified at the start
					const loadsNotifiedArray = (user.loadsNotified || '').split('|').filter(id => id !== '');
					if (loadsNotifiedArray.includes(String(activeLoad.loadID))) {
						searchResults.hasBeenNotified = true;
						continue; // Skip this load if already notified
					}

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

					// If all conditions match and hasn't been notified
					if (
						searchResults.withinRangeOrigin &&
						searchResults.withinRangeDest &&
						searchResults.withinDateRange &&
						searchResults.trailerTypeMatch &&
						!searchResults.hasBeenNotified
					) {
						// Initialize user's notification collection if it doesn't exist
						if (!userNotifications.has(user.id)) {
							userNotifications.set(user.id, {
								user,
								loads: new Set(),
								shouldEmail: false,
								shouldText: false
							});
						}

						const userNotif = userNotifications.get(user.id);
						userNotif.loads.add(activeLoad);
						userNotif.shouldEmail = userNotif.shouldEmail || searchResults.emailNotification;
						userNotif.shouldText = userNotif.shouldText || searchResults.textNotification;
					}
				}
			}
		}

		// Send consolidated notifications
		for (const [userId, notification] of userNotifications) {
			if (notification.loads.size === 0) continue;

			const loadsArray = Array.from(notification.loads) as TableDataTypes[];
			
			type LoadAccumulator = {
				[key: string]: { load: TableDataTypes; count: number };
			};

			const titleCase = (str: string) => 
				str.toLowerCase().split(' ').map(word => 
					word.charAt(0).toUpperCase() + word.slice(1)
				).join(' ');

			// Group identical loads
			const groupedLoads = loadsArray.reduce<LoadAccumulator>((acc, load: TableDataTypes) => {
				const key = `${titleCase(load.originCityName)}|${load.originStateName}|${titleCase(load.destinationCityName)}|${load.destinationStateName}`;
				if (!acc[key]) {
					acc[key] = { 
						load: {
							...load,
							originCityName: titleCase(load.originCityName),
							destinationCityName: titleCase(load.destinationCityName)
						}, 
						count: 0 
					};
				}
				acc[key].count++;
				return acc;
			}, {});

			const message = `New matching loads found:\n${Object.values(groupedLoads)
				.map(({ load, count }) => 
					count > 1 
						? `- ${count} loads from ${titleCase(load.originCityName)}, ${load.originStateName} to ${titleCase(load.destinationCityName)}, ${load.destinationStateName}`
						: `- 1 load from ${titleCase(load.originCityName)}, ${load.originStateName} to ${titleCase(load.destinationCityName)}, ${load.destinationStateName}`
				)
				.join('\n')}\n\nView your saved searches at test-loadboard.dds-express.com`.replace(/\n/g, '\n');

			// If either notification type is sent, mark all loads as notified
			if (notification.shouldEmail || notification.shouldText) {
				// Mark each load as notified
				for (const load of loadsArray) {
					await markLoadAsNotified(userId, String(load.loadID));
				}

				if (notification.shouldEmail) {
					console.log(`Sending email to ${notification.user.email}:\n${message}`);
					await sendEmail(notification.user.email, message);
				}

				if (notification.shouldText) {
					console.log(`Sending text to ${notification.user.phone}:\n${message}`);
					await sendText(notification.user.phone, message);
				}
			}
		}
	}
});
