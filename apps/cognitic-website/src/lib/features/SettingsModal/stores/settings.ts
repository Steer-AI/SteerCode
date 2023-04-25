import type { Settings } from '$lib/models/types/settings.type';
import { writable } from 'svelte/store';

function createSettingsStore() {
    // TODO: implement
    const settings = writable<Settings>({})

    function updateSettings(newValue: Settings) {
        settings.set(newValue)
    }
    
    return {

        subscribe: settings.subscribe,
        updateSettings,
    }
}

const settingsStore = createSettingsStore()