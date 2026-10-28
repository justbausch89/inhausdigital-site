import React from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInOut, pop, progress} from '../anim';
import {Caption} from '../components/Caption';
import {Shape} from '../components/Shape';
import {Sparkline} from '../components/Ui';
import {BODY, brand, ui} from '../theme';

const FEATURES = [
	'Business P&L',
	'Ecom overview',
	'AI brain',
	'Attribution',
	'Products',
	'Customers',
	'Product creator',
	'Email performance',
	'Creative intelligence',
	'Fulfilment',
	'Customer service',
	'Wholesale',
];
const COLOURS = [brand.yellow, brand.pink, brand.green, brand.orange];

const PHONE = {x: 1120, y: 120, w: 400, h: 820};

const Phone: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const rise = pop(frame, fps, start, 16);
	const note = pop(frame, fps, start + 50, 14);
	const t = frame / fps;
	return (
		<div
			style={{
				position: 'absolute',
				left: PHONE.x,
				top: PHONE.y,
				width: PHONE.w,
				height: PHONE.h,
				borderRadius: 64,
				background: '#0B0B0D',
				padding: 14,
				boxSizing: 'border-box',
				boxShadow: '0 60px 120px rgba(0,0,0,0.6), inset 0 0 0 2px #3a3a3e',
				transform: `translateY(${interpolate(rise, [0, 1], [1100, 0]) + Math.sin(t * 1.1) * 8}px) rotate(${interpolate(rise, [0, 1], [8, -3])}deg)`,
				fontFamily: BODY,
				color: '#fff',
			}}
		>
			<div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 52, background: ui.bg, overflow: 'hidden', padding: '64px 26px 26px', boxSizing: 'border-box'}}>
				<div style={{position: 'absolute', left: '50%', top: 16, width: 110, height: 30, marginLeft: -55, borderRadius: 15, background: '#000'}} />
				<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
					<Img src={staticFile('mark-512.png')} style={{width: 40, height: 40}} />
					<div>
						<div style={{fontSize: 14, color: ui.muted}}>Good morning</div>
						<div style={{fontSize: 20, fontWeight: 800}}>Yesterday at a glance</div>
					</div>
				</div>
				<div style={{marginTop: 26, padding: 20, borderRadius: 20, background: 'linear-gradient(135deg, #0F2A26, #0E1728)', border: '1px solid #1D4A3F', display: 'flex', alignItems: 'center', gap: 18}}>
					<div style={{width: 84, height: 84, borderRadius: 42, border: `9px solid ${ui.emerald}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 800, color: ui.teal, boxSizing: 'border-box'}}>
						A+
					</div>
					<div>
						<div style={{fontSize: 14, color: ui.muted, fontWeight: 700}}>NET PROFIT</div>
						<div style={{fontSize: 34, fontWeight: 800}}>$4,127</div>
						<div style={{fontSize: 14, color: ui.teal, fontWeight: 700}}>▲ 18% on last Tuesday</div>
					</div>
				</div>
				<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14}}>
					{[
						['Revenue', '$18.4K'],
						['ROAS', '3.5x'],
						['Orders', '71'],
						['CAC', '$58.10'],
					].map(([l, v]) => (
						<div key={l} style={{padding: '14px 16px', borderRadius: 16, background: ui.panel, border: `1px solid ${ui.border}`}}>
							<div style={{fontSize: 13, color: ui.muted, fontWeight: 700}}>{l.toUpperCase()}</div>
							<div style={{fontSize: 24, fontWeight: 800, marginTop: 2}}>{v}</div>
						</div>
					))}
				</div>
				<div style={{marginTop: 14, padding: '16px 16px 10px', borderRadius: 16, background: ui.panel, border: `1px solid ${ui.border}`}}>
					<div style={{fontSize: 13, color: ui.muted, fontWeight: 700, marginBottom: 8}}>PROFIT · LAST 14 DAYS</div>
					<Sparkline points={[2, 2.6, 2.2, 3.1, 2.8, 3.6, 3.3, 4, 3.7, 4.4, 4.1, 4.9, 4.6, 5.3]} width={300} height={90} start={start + 20} color={ui.teal} strokeWidth={3.5} />
				</div>
				<div
					style={{
						position: 'absolute',
						left: 12,
						right: 12,
						top: 12,
						padding: '14px 16px',
						borderRadius: 22,
						background: 'rgba(245,243,241,0.97)',
						color: brand.charcoal,
						display: 'flex',
						gap: 12,
						boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
						transform: `translateY(${interpolate(note, [0, 1], [-170, 0])}px)`,
					}}
				>
					<Img src={staticFile('mark-512.png')} style={{width: 40, height: 40, flexShrink: 0}} />
					<div style={{fontSize: 15, lineHeight: 1.35}}>
						<b>InHaus Brain</b> <span style={{color: '#777'}}>· now</span>
						<br />
						Your daily brief is ready. A+ day, and Google is your top channel.
					</div>
				</div>
			</div>
		</div>
	);
};

export const Pocket: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const gather = progress(frame, 96, 30, easeInOut);
	const firstOut = progress(frame, 98, 14);
	return (
		<AbsoluteFill style={{background: `radial-gradient(circle at 65% 45%, #3a3a3a, ${brand.deep} 70%)`}}>
			<Shape kind="q-tl" size={220} color={brand.yellow} x={1740} y={900} delay={6} />
			<Shape kind="half-r" size={180} color={brand.pink} x={-10} y={120} delay={12} bob={6} />
			<div style={{opacity: 1 - firstOut}}>
				<Caption
					eyebrow="EVERYTHING IN ONE PLACE"
					lines={['One stop shop', 'for all things', 'marketing and', 'business.']}
					accent={3}
					y={300}
					width={640}
					size={76}
				/>
			</div>
			<Sequence from={110} layout="none">
				<Caption
					eyebrow="ALWAYS ON"
					lines={['An AI brain', 'in your pocket.']}
					accent={1}
					sub="Your numbers, your daily brief and alerts that matter, wherever you are."
					y={340}
					width={720}
					size={84}
				/>
			</Sequence>
			{FEATURES.map((name, i) => {
				const col = i % 3;
				const row = Math.floor(i / 3);
				const s = pop(frame, fps, 8 + i * 4, 13);
				const x0 = 800 + col * 345;
				const y0 = 230 + row * 150;
				const x = interpolate(gather, [0, 1], [x0, PHONE.x + PHONE.w / 2 - 150]);
				const y = interpolate(gather, [0, 1], [y0, PHONE.y + PHONE.h / 2 - 40]);
				const colour = COLOURS[i % COLOURS.length];
				return (
					<div
						key={name}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: 310,
							height: 100,
							borderRadius: 20,
							background: ui.panel,
							border: `1px solid ${ui.border}`,
							display: 'flex',
							alignItems: 'center',
							gap: 16,
							padding: '0 22px',
							boxSizing: 'border-box',
							fontFamily: BODY,
							fontSize: 24,
							fontWeight: 800,
							color: '#fff',
							opacity: Math.min(1, s * 1.4) * (1 - gather),
							transform: `scale(${s * interpolate(gather, [0, 1], [1, 0.2])}) rotate(${gather * (col - 1) * 20}deg)`,
						}}
					>
						<span
							style={{
								width: 40,
								height: 40,
								flexShrink: 0,
								background: colour,
								borderRadius: ['50%', '40px 0 0 0', '0 40px 40px 0', '0 0 40px 40px'][i % 4],
							}}
						/>
						{name}
					</div>
				);
			})}
			<Phone start={108} />
		</AbsoluteFill>
	);
};
