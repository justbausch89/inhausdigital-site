import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {pop} from '../anim';
import {BODY, brand, ui} from '../theme';

const NAV = [
	'Business P&L',
	'Ecom Overview',
	'Brain',
	'Products',
	'Customers',
	'Attribution',
	'Product Creator',
	'Email Performance',
	'Creative Intelligence',
	'Fulfilment',
	'Settings',
];

const Sidebar: React.FC<{active: string}> = ({active}) => (
	<div
		style={{
			width: 230,
			flexShrink: 0,
			borderRight: `1px solid ${ui.border}`,
			padding: '22px 14px',
			fontFamily: BODY,
			background: '#080C18',
		}}
	>
		<div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 26, paddingLeft: 6}}>
			<Img src={staticFile('mark-512.png')} style={{width: 38, height: 38}} />
			<div>
				<div style={{color: ui.text, fontWeight: 800, fontSize: 16}}>InHaus Digital</div>
				<div style={{color: ui.muted, fontSize: 13}}>Ecom Growth Platform</div>
			</div>
		</div>
		<div style={{color: ui.muted, fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', margin: '0 0 8px 6px'}}>
			WORKSPACE
		</div>
		<div
			style={{
				color: ui.text,
				fontSize: 14,
				fontWeight: 600,
				padding: '9px 12px',
				borderRadius: 8,
				background: ui.panel,
				border: `1px solid ${ui.border}`,
				marginBottom: 20,
			}}
		>
			Your Store
		</div>
		{NAV.map((item) => {
			const on = item === active;
			return (
				<div
					key={item}
					style={{
						fontSize: 15,
						fontWeight: on ? 700 : 500,
						color: on ? ui.gold : '#A5B0C4',
						padding: '10px 12px',
						borderRadius: 8,
						marginBottom: 3,
						background: on ? 'rgba(229,176,42,0.13)' : 'transparent',
						borderLeft: on ? `3px solid ${ui.gold}` : '3px solid transparent',
					}}
				>
					{item}
				</div>
			);
		})}
	</div>
);

// A browser window showing the app. It swings in with a little perspective, then floats.
export const AppWindow: React.FC<{
	x: number;
	y: number;
	width: number;
	height: number;
	delay?: number;
	path?: string;
	sidebar?: string;
	tilt?: number;
	children: React.ReactNode;
}> = ({x, y, width, height, delay = 0, path = '', sidebar, tilt = -7, children}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = pop(frame, fps, delay, 18);
	const t = frame / fps;
	const rotY = interpolate(s, [0, 1], [tilt * 3, tilt]) + Math.sin(t * 0.7) * 1.2;
	const rotX = Math.sin(t * 0.5) * 0.8 + 1.5;
	return (
		<div style={{position: 'absolute', left: x, top: y, width, height, perspective: 2400}}>
			<div
				style={{
					width: '100%',
					height: '100%',
					borderRadius: 18,
					overflow: 'hidden',
					background: ui.bg,
					border: `1px solid ${ui.border}`,
					boxShadow: '0 50px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03)',
					opacity: Math.min(1, s * 1.5),
					transform: `translateY(${interpolate(s, [0, 1], [140, 0]) + Math.sin(t * 0.9) * 6}px) rotateY(${rotY}deg) rotateX(${rotX}deg)`,
					transformOrigin: '30% 50%',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<div
					style={{
						height: 46,
						flexShrink: 0,
						display: 'flex',
						alignItems: 'center',
						gap: 9,
						padding: '0 18px',
						background: '#0A101E',
						borderBottom: `1px solid ${ui.border}`,
					}}
				>
					{[brand.pink, brand.yellow, brand.green].map((c) => (
						<span key={c} style={{width: 13, height: 13, borderRadius: 7, background: c}} />
					))}
					<div
						style={{
							margin: '0 auto',
							padding: '6px 22px',
							borderRadius: 8,
							background: ui.panel,
							color: ui.muted,
							fontFamily: BODY,
							fontSize: 15,
							fontWeight: 600,
						}}
					>
						app.inhausdigital.com.au{path}
					</div>
					<span style={{width: 57}} />
				</div>
				<div style={{flex: 1, display: 'flex', minHeight: 0}}>
					{sidebar ? <Sidebar active={sidebar} /> : null}
					<div style={{flex: 1, position: 'relative', fontFamily: BODY, color: ui.text, minWidth: 0}}>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
};
