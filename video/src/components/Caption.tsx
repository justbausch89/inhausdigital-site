import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {pop, progress} from '../anim';
import {BODY, DISPLAY, brand} from '../theme';

// Eyebrow, big headline (words spring up one by one) and a supporting line.
export const Caption: React.FC<{
	eyebrow?: string;
	lines: string[];
	accent?: number; // index of the line drawn in the accent colour
	accentColor?: string;
	sub?: string;
	x?: number;
	y?: number;
	width?: number;
	size?: number;
	delay?: number;
	color?: string;
	align?: 'left' | 'center';
}> = ({
	eyebrow,
	lines,
	accent,
	accentColor = brand.yellow,
	sub,
	x = 110,
	y = 300,
	width = 600,
	size = 78,
	delay = 0,
	color = '#fff',
	align = 'left',
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	let wordIndex = 0;
	const lastWordAt = delay + 8 + lines.join(' ').split(' ').length * 3;
	const subIn = progress(frame, lastWordAt + 4, 20);
	const eyebrowIn = progress(frame, delay, 18);
	return (
		<div style={{position: 'absolute', left: x, top: y, width, textAlign: align}}>
			{eyebrow ? (
				<div
					style={{
						fontFamily: BODY,
						fontWeight: 800,
						fontSize: 22,
						letterSpacing: '0.16em',
						color: accentColor,
						marginBottom: 22,
						display: 'flex',
						alignItems: 'center',
						justifyContent: align === 'center' ? 'center' : 'flex-start',
						gap: 14,
						opacity: eyebrowIn,
						transform: `translateX(${interpolate(eyebrowIn, [0, 1], [-30, 0])}px)`,
					}}
				>
					<span style={{width: 14, height: 14, borderRadius: 7, background: accentColor}} />
					{eyebrow}
				</div>
			) : null}
			<div style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 1.06, color}}>
				{lines.map((line, i) => (
					<div key={i} style={{color: i === accent ? accentColor : color}}>
						{line.split(' ').map((word, k) => {
							const s = pop(frame, fps, delay + 8 + wordIndex++ * 3, 15);
							return (
								<span
									key={k}
									style={{
										display: 'inline-block',
										marginRight: '0.24em',
										opacity: Math.min(1, s * 1.4),
										transform: `translateY(${interpolate(s, [0, 1], [size * 0.55, 0])}px)`,
									}}
								>
									{word}
								</span>
							);
						})}
					</div>
				))}
			</div>
			{sub ? (
				<div
					style={{
						fontFamily: BODY,
						fontSize: 30,
						lineHeight: 1.45,
						fontWeight: 500,
						color: 'rgba(255,255,255,0.78)',
						marginTop: 30,
						opacity: subIn,
						transform: `translateY(${interpolate(subIn, [0, 1], [24, 0])}px)`,
					}}
				>
					{sub}
				</div>
			) : null}
		</div>
	);
};
