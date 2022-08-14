import {writable} from 'svelte/store';

export const uiStore = writable({
    selected: [],
    selectedElement: undefined,
    entities: [],
    isExecuting: false,
    lockedEntity: undefined
});