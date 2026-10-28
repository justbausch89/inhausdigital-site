import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {pop} from '../anim';

export type ShapeKind = 'circle' | 'q-tl' | 'q-tr' | 'q-br' | 'q-bl' | 'half-t' | 'half-b' | 'half-l' | 'half-r';

// The Bauhaus shapes from the InHaus brand: quarter circles, half circles and circles.
// They pop in, then turn and bob slowly so the frame never sits still.
export const Shape: React.FC<{
	kind: ShapeKind;
	size: number;
	color: string;
	x: number;
	y: number;
	delay?: number;
	spin?: number; // degrees per second
	bob?: number; // px
	opacity?: number;
}> = ({kind, size, color, x, y, delay = 0, spin = 0, bob = 10, opacity = 1}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = pop(frame, fps, delay, 12);
	const t = frame / fps;
	const half = size / 2;
	const box: Record<ShapeKind, [number, number, string]> = {
		circle: [size, size, '50%'],
		'q-tl': [size, size, `${size}px 0 0 0`],
		'q-tr': [size, size, `0 ${size}px 0 0`],
		'q-br': [size, size, `0 0 ${size}px 0`],
		'q-bl': [size, size, `0 0 0 ${size}px`],
		'half-t': [size, half, `${half}px ${half}px 0 0`],
		'half-b': [size, half, `0 0 ${half}px ${half}px`],
		'half-l': [half, size, `${half}px 0 0 ${half}px`],
		'half-r': [half, size, `0 ${half}px ${half}px 0`],
	};
	const [w, h, radius] = box[kind];
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: w,
				height: h,
				background: color,
				borderRadius: radius,
				opacity,
				transform: `translateY(${Math.sin(t * 1.3 + x * 0.01) * bob}px) rotate(${spin * t}deg) scale(${s})`,
			}}
		/>
	);
};
