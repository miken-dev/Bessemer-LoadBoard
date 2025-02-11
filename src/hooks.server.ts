import PocketBase from 'pocketbase';
import type { PageServerLoad } from './$types';

const pb = new PocketBase('https://bessemer-loadboard.pockethost.io')

const records = await pb.collection('Active_Loads').getFullList({});



// read cookie
