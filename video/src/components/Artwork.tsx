import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {pop} from '../anim';
import {brand} from '../theme';

// A made-up Bauhaus print, used as the product image and as ad thumbnails.
const LAYOUTS = [
	{bg: brand.cream, shapes: [['circle', 0.18, 0.12, 0.62, brand.yellow], ['half-b', 0.1, 0.56, 0.8, brand.orange], ['q-tl', 0.52, 0.66, 0.4, brand.charcoal]]},
	{bg: '#F3D9C9', shapes: [['q-br', 0.08, 0.1, 0.55, brand.pink], ['circle', 0.5, 0.42, 0.38, brand.charcoal], ['half-t', 0.2, 0.7, 0.5, brand.yellow]]},
	{bg: '#DCEBDD', shapes: [['half-l', 0.14, 0.14, 0.6, brand.green], ['circle', 0.46, 0.2, 0.3, brand.yellow], ['q-tr', 0.36, 0.56, 0.5, brand.pink]]},
	{bg: brand.charcoal, shapes: [['circle', 0.24, 0.2, 0.52, brand.yellow], ['q-bl', 0.5, 0.52, 0.42, brand.cream], ['half-b', 0.06, 0.66, 0.44, brand.pink]]},
] as const;

const radius = (kind: string, s: number) =>
	({
		circle: '50%',
		'q-tl': `${s}px 0 0 0`,
		'q-tr': `0 ${s}px 0 0`,
		'q-br': `0 0 ${s}px 0`,
		'q-bl': `0 0 0 ${s}px`,
		'half-t': `${s / 2}px ${s / 2}px 0 0`,
		'half-b': `0 0 ${s / 2}px ${s / 2}px`,
		'half-l': `${s / 2}px 0 0 ${s / 2}px`,
	})[kind] ?? '0';

export const Artwork: React.FC<{variant?: number; width: number; height: number; delay?: number; style?: React.CSSProperties}> = ({
	variant = 0,
	width,
	height,
	delay = 0,
	style,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const layout = LAYOUTS[variant % LAYOUTS.length];
	const unit = Math.min(width, height);
	return (
		<div style={{position: 'relative', width, height, background: layout.bg, overflow: 'hidden', ...style}}>
			{layout.shapes.map(([kind, x, y, size, color], i) => {
				const s = unit * size;
				const half = kind.startsWith('half-');
				const w = kind === 'half-l' ? s / 2 : s;
				const h = half && kind !== 'half-l' ? s / 2 : s;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x * width,
							top: y * height,
							width: w,
							height: h,
							background: color,
							borderRadius: radius(kind, s),
							transform: `scale(${pop(frame, fps, delay + i * 5, 13)})`,
						}}
					/>
				);
			})}
		</div>
	);
};
