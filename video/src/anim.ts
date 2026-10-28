import {Easing, interpolate, spring} from 'remotion';

export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// 0 → 1 between `start` and `start + duration` frames
export const progress = (frame: number, start: number, duration: number, easing = easeOut) =>
	interpolate(frame, [start, start + duration], [0, 1], {...clamp, easing});

export const mix = (t: number, from: number, to: number) => from + (to - from) * t;

// A springy 0 → 1 that starts at `delay`
export const pop = (frame: number, fps: number, delay = 0, damping = 14) =>
	spring({frame: frame - delay, fps, config: {damping, mass: 0.7, stiffness: 120}});

// Format a number the way the dashboard does: $128.6K, 4.12x, 1,092
export const fmt = (value: number, {prefix = '', suffix = '', decimals = 0} = {}) =>
	prefix +
	value.toLocaleString('en-US', {minimumFractionDigits: decimals, maximumFractionDigits: decimals}) +
	suffix;

// Smooth SVG path through points (Catmull-Rom turned into cubic curves)
export const smoothPath = (pts: [number, number][]) => {
	let d = `M ${pts[0][0]} ${pts[0][1]}`;
	for (let i = 0; i < pts.length - 1; i++) {
		const p0 = pts[i - 1] ?? pts[i];
		const p1 = pts[i];
		const p2 = pts[i + 1];
		const p3 = pts[i + 2] ?? p2;
		const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
		const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
		d += ` C ${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
	}
	return d;
};

// Show the first part of a string, for typing effects
export const typed = (text: string, frame: number, start: number, charsPerFrame = 1.6) =>
	text.slice(0, Math.max(0, Math.floor((frame - start) * charsPerFrame)));
