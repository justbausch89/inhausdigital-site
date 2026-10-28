import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

loadFont({family: 'Righteous', url: staticFile('righteous-latin.woff2'), weight: '400'});
loadFont({family: 'Plus Jakarta Sans', url: staticFile('plus-jakarta-sans-latin.woff2'), weight: '200 800'});

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const DISPLAY = 'Righteous, sans-serif';
export const BODY = '"Plus Jakarta Sans", sans-serif';

// InHaus brand colours (from the brand deck)
export const brand = {
	charcoal: '#2F2F2F',
	deep: '#252525',
	yellow: '#FCB404',
	pink: '#FD3773',
	green: '#86C98F',
	orange: '#F85D28',
	cream: '#F5F3F1',
};

// The app's dark dashboard, sampled from the screenshots
export const ui = {
	bg: '#070A15',
	panel: '#0E1728',
	panel2: '#121D33',
	border: '#1C2840',
	text: '#E8EEF8',
	muted: '#8291AB',
	gold: '#E5B02A',
	slate: '#6276A6',
	teal: '#34D399',
	emerald: '#10B982',
	red: '#E94335',
	blue: '#1778F2',
	purple: '#8D5DF4',
	orange: '#F69E0E',
	grey: '#6C7282',
	pink: '#EC4899',
};
