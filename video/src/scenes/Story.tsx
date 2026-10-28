import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {pop, progress, smoothPath} from '../anim';
import {Caption} from '../components/Caption';
import {Shape} from '../components/Shape';
import {BODY, brand, ui} from '../theme';

const POINTS = [
	{text: 'His Meta and Google ad performance skyrocketed.', color: brand.green},
	{text: 'And he understood his numbers, every single day.', color: brand.pink},
];

// An illustrative climb: no figures, just the shape of it
const CLIMB: [number, number][] = [
	[0, 150],
	[60, 140],
	[120, 146],
	[180, 120],
	[240, 112],
	[300, 80],
	[360, 62],
	[420, 26],
	[470, 8],
];

export const Story: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const photo = progress(frame, 0, 30);
	const brandIn = pop(frame, fps, 36, 14);
	const chart = pop(frame, fps, 70, 16);
	const line = progress(frame, 80, 50);
	return (
		<AbsoluteFill style={{background: brand.charcoal}}>
			<div style={{position: 'absolute', left: 900, top: 0, right: 0, bottom: 0, overflow: 'hidden', background: brand.yellow, opacity: photo}}>
				<Img
					src={staticFile('justin-studio.webp')}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						objectPosition: '58% 50%',
						filter: 'grayscale(1) contrast(1.05)',
						mixBlendMode: 'multiply',
						transform: `scale(${interpolate(frame, [0, 240], [1.12, 1.02])})`,
					}}
				/>
			</div>
			<Shape kind="q-tl" size={240} color={brand.pink} x={1700} y={860} delay={20} />
			<Shape kind="circle" size={70} color={brand.yellow} x={790} y={90} delay={26} />

			<Caption eyebrow="BUILT IN-HAUS" lines={['Justin built it', 'for his own', 'brand first.']} accent={2} y={130} width={720} size={86} />

			<div
				style={{
					position: 'absolute',
					left: 110,
					top: 530,
					display: 'flex',
					alignItems: 'center',
					gap: 18,
					padding: '14px 26px 14px 16px',
					borderRadius: 999,
					background: 'rgba(255,255,255,0.08)',
					border: '1px solid rgba(255,255,255,0.14)',
					fontFamily: BODY,
					fontSize: 30,
					fontWeight: 800,
					color: '#fff',
					transform: `scale(${brandIn})`,
					transformOrigin: 'left center',
				}}
			>
				<span style={{width: 64, height: 64, borderRadius: 32, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Img src={staticFile('style-my-wall.png')} style={{width: 44, height: 38}} />
				</span>
				Style My Wall
			</div>

			<div style={{position: 'absolute', left: 110, top: 660, width: 700, fontFamily: BODY}}>
				{POINTS.map((point, i) => {
					const p = progress(frame, 60 + i * 34, 20);
					return (
						<div
							key={point.text}
							style={{
								display: 'flex',
								gap: 20,
								alignItems: 'flex-start',
								fontSize: 36,
								lineHeight: 1.3,
								fontWeight: 700,
								color: '#fff',
								marginBottom: 26,
								opacity: p,
								transform: `translateX(${interpolate(p, [0, 1], [-40, 0])}px)`,
							}}
						>
							<span style={{width: 18, height: 18, borderRadius: 9, background: point.color, marginTop: 14, flexShrink: 0}} />
							{point.text}
						</div>
					);
				})}
			</div>

			<div
				style={{
					position: 'absolute',
					left: 1010,
					top: 720,
					width: 560,
					padding: '22px 26px 18px',
					borderRadius: 22,
					background: ui.panel,
					border: `1px solid ${ui.border}`,
					boxShadow: '0 30px 70px rgba(0,0,0,0.55)',
					fontFamily: BODY,
					color: '#fff',
					opacity: Math.min(1, chart * 1.4),
					transform: `translateY(${interpolate(chart, [0, 1], [120, 0])}px)`,
				}}
			>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
					<div style={{fontSize: 20, fontWeight: 800}}>Meta + Google ad performance</div>
					<span style={{fontSize: 28, color: ui.teal, fontWeight: 800}}>↗</span>
				</div>
				<svg width={500} height={170} style={{marginTop: 10, overflow: 'visible'}}>
					<defs>
						<linearGradient id="climb" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor={ui.teal} stopOpacity={0.35} />
							<stop offset="1" stopColor={ui.teal} stopOpacity={0} />
						</linearGradient>
						<clipPath id="climbClip">
							<rect x={0} y={-20} width={500 * line} height={200} />
						</clipPath>
					</defs>
					<path d={`${smoothPath(CLIMB)} L 470 170 L 0 170 Z`} fill="url(#climb)" clipPath="url(#climbClip)" />
					<path d={smoothPath(CLIMB)} fill="none" stroke={ui.teal} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - line} />
				</svg>
			</div>
		</AbsoluteFill>
	);
};
