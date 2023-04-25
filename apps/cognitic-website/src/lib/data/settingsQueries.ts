import { Log } from '$lib/core/services/logging';
import type { Settings } from '$lib/models/types/settings.type';

export function updateSettings(newValue: Settings): Promise<boolean> {
    // TODO: implement server request
    Log.WARNING('updateSettings', 'Not implemented');
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, 1000)
    })
}