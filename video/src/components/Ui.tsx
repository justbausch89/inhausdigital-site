import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fmt, pop, progress, smoothPath} from '../anim';
import {ui} from '../theme';

export const Panel: React.FC<{style?: React.CSSProperties; children?: React.ReactNode; delay?: number}> = ({
	style,
	children,
	delay,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = delay === undefined ? 1 : pop(frame, fps, delay, 16);
	return (
		<div
			style={{
				background: ui.panel,
				border: `1px solid ${ui.border}`,
				borderRadius: 14,
				opacity: Math.min(1, s * 1.4),
				transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
				...style,
			}}
		>
			{children}
		</div>
	);
};

export const Label: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({
	children,
	color = ui.muted,
	style,
}) => (
	<div style={{fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color, ...style}}>
		{children}
	</div>
);

export const Pill: React.FC<{children: React.ReactNode; color: string; style?: React.CSSProperties}> = ({
	children,
	color,
	style,
}) => (
	<span
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: 6,
			padding: '4px 11px',
			borderRadius: 999,
			fontSize: 14,
			fontWeight: 700,
			color,
			background: `${color}22`,
			border: `1px solid ${color}44`,
			whiteSpace: 'nowrap',
			...style,
		}}
	>
		{children}
	</span>
);

// Counts up to `value` once the card has landed
export const CountUp: React.FC<{
	value: number;
	start: number;
	duration?: number;
	prefix?: string;
	suffix?: string;
	decimals?: number;
}> = ({value, start, duration = 36, prefix, suffix, decimals}) => {
	const frame = useCurrentFrame();
	const p = progress(frame, start, duration);
	return <>{fmt(value * p, {prefix, suffix, decimals})}</>;
};

export const Sparkline: React.FC<{
	points: number[];
	width: number;
	height: number;
	start: number;
	color?: string;
	duration?: number;
	strokeWidth?: number;
	fill?: boolean;
}> = ({points, width, height, start, color = ui.slate, duration = 40, strokeWidth = 2.5, fill = true}) => {
	const frame = useCurrentFrame();
	const p = progress(frame, start, duration);
	const max = Math.max(...points);
	const min = Math.min(...points);
	const pts = points.map(
		(v, i) =>
			[(i / (points.length - 1)) * width, height - 4 - ((v - min) / (max - min || 1)) * (height - 8)] as [
				number,
				number,
			],
	);
	const d = smoothPath(pts);
	const id = `sp${points.join('')}${width}`.replace(/\./g, '');
	return (
		<svg width={width} height={height} style={{overflow: 'visible'}}>
			<defs>
				<linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={color} stopOpacity={0.35} />
					<stop offset="1" stopColor={color} stopOpacity={0} />
				</linearGradient>
				<clipPath id={`${id}c`}>
					<rect x={0} y={-10} width={width * p} height={height + 20} />
				</clipPath>
			</defs>
			{fill ? (
				<path d={`${d} L ${width} ${height} L 0 ${height} Z`} fill={`url(#${id})`} clipPath={`url(#${id}c)`} />
			) : null}
			<path
				d={d}
				fill="none"
				stroke={color}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				pathLength={1}
				strokeDasharray={1}
				strokeDashoffset={1 - p}
			/>
		</svg>
	);
};

export const KpiCard: React.FC<{
	label: string;
	value: number;
	prefix?: string;
	suffix?: string;
	decimals?: number;
	note?: string;
	delta: string;
	good?: boolean;
	sub: string;
	spark: number[];
	delay: number;
	accent?: string;
}> = ({label, value, prefix, suffix, decimals, note, delta, good = true, sub, spark, delay, accent}) => (
	<Panel delay={delay} style={{padding: '16px 18px', position: 'relative', overflow: 'hidden', height: '100%'}}>
		<Label>{label}</Label>
		<div style={{display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8}}>
			<span style={{fontSize: 38, fontWeight: 800, color: accent ?? ui.text, letterSpacing: '-0.01em'}}>
				<CountUp value={value} start={delay + 6} prefix={prefix} suffix={suffix} decimals={decimals} />
			</span>
			{note ? <span style={{fontSize: 15, fontWeight: 600, color: ui.muted}}>{note}</span> : null}
		</div>
		<div style={{display: 'flex', gap: 8, marginTop: 8}}>
			<Pill color={good ? ui.teal : ui.red}>{delta}</Pill>
			<Pill color={ui.muted}>Shopify</Pill>
		</div>
		<div style={{fontSize: 14, color: ui.muted, marginTop: 10, maxWidth: 190}}>{sub}</div>
		<div style={{position: 'absolute', right: 0, bottom: 10}}>
			<Sparkline points={spark} width={150} height={52} start={delay + 16} />
		</div>
	</Panel>
);

export const Cursor: React.FC<{x: number; y: number; pressed?: boolean}> = ({x, y, pressed}) => (
	<svg
		width={44}
		height={44}
		viewBox="0 0 24 24"
		style={{
			position: 'absolute',
			left: x,
			top: y,
			transform: `scale(${pressed ? 0.85 : 1})`,
			filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.5))',
			zIndex: 10,
		}}
	>
		<path d="M4 2 L4 19 L8.5 14.8 L11.6 21.6 L14.6 20.3 L11.6 13.7 L17.6 13.7 Z" fill="#fff" stroke="#111" strokeWidth={1.3} />
	</svg>
);
