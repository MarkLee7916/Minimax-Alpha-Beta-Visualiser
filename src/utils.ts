// Note: this function isn't recursive, so doesn't make a deep copy of nested objects
export function deepObjectCopy<T>(object: T): T {
    const copy = {};

    Array.from(Object.keys(object)).forEach(key => {
        copy[key] = object[key];
    });

    return <T> copy;
}

// Generate a random whole number between bounds
export function randomIntBetween(lower: number, upper: number) {
    return Math.floor(Math.random() * (upper - lower)) + lower;
}

// Blocking wait for timeout milliseconds, used for animations
export function wait(timeout: number) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export function vminToPx(vminVal: number) {
    return Math.min(window.innerHeight, window.innerWidth) * vminVal / 100;
}