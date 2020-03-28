import {writable} from 'svelte/store';
// state:
//     settings
//     work
//     relax
//     pause
//     end
export const state = writable('settings');
