import { Injectable } from '@angular/core';

// Default theme for Coordinate
export const defaultLightTheme = {
    'primary': '#212121',
    'primary-light': '#484848',
    'primary-dark': '#000000',

    'primary-hover': '#424242',
    'primary-active': '#616161',

    'on-primary': '#FFFFFF',
    'on-primary-inactive': '#9E9E9E',

    'accent': '#FFEB3B',
    'accent-hover': '#FDD835',
    'accent-active': '#FBC02D',

    'on-accent': '#212121',
    'on-accent-hover': '#FFFFFF',

    'background': '#FAFAFA',
    'background-dark': '#E0E0E0',
    'on-background': '#616161',

    'surface': '#FAFAFA',
    'surface-dark': '#BDBDBD',
    'surface-darker': '#888888',
    'surface-hover': '#E0E0E0',
    'surface-active': '#BDBDBD',

    'surface-card': '#FDFDFD',
    'on-surface-card': '#FFC519',

    'on-surface': '#616161',
    'on-surface-hover': '#444444',
    'on-surface-active': '#212121',
    'on-surface-inactive': '#9E9E9E',

    'error': '#B00020',
    'on-error': '#FFFFFF',

    'warning': '#B00020',
    'on-warning': '#FFFFFF',

    'action': '#FFEB3B',
    'action-hover': '#212121',
    'action-active': '#424242',
    'action-disabled': '#CECECE',

    'on-action': '#212121',
    'on-action-hover': '#FFFFFF'
}

export const defaultDarkTheme = {
    'primary': '',
    'on-primary': '',
    'accent': '',
    'on-accent': '',
    'background': '',
    'on-background': '',
    'surface': '',
    'on-surface': '',
    'error': '',
    'on-error': '',
    'warning': '',
    'on-warning': ''
}

// The following are custom themes that admins can set for the university
export const greenDarkTheme = {
    'primary': '',
    'on-primary': '',
    'accent': '',
    'on-accent': '',
    'background': '',
    'on-background': '',
    'surface': '',
    'on-surface': '',
    'error': '',
    'on-error': '',
    'warning': '',
    'on-warning': ''
}
export const greenLightTheme = {
    'primary': '',
    'on-primary': '',
    'accent': '',
    'on-accent': '',
    'background': '',
    'on-background': '',
    'surface': '',
    'on-surface': '',
    'error': '',
    'on-error': '',
    'warning': '',
    'on-warning': ''
}

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    constructor() { }

    toggleDark() {
        this.setTheme(defaultDarkTheme);
    }
    toggleLight() {
        this.setTheme(defaultLightTheme);
    }

    private setTheme(theme: {}) {
        Object.keys(theme).forEach(k => document.documentElement.style.setProperty(`--${k}`, theme[k]))
    }
}
