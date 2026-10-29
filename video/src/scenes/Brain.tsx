import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {pop, progress, typed} from '../anim';
import {Caption} from '../components/Caption';
import {Shape} from '../components/Shape';
import {BODY, brand, ui} from '../theme';

const AGENTS = [
	{name: 'Ads analyst', color: ui.blue},
	{name: 'Profit watchdog', color: ui.teal},
	{name: 'Attribution', color: ui.orange},
	{name: 'Product analyst', color: brand.yellow},
	{name: 'Creative scout', color: brand.pink},
	{name: 'Support copilot', color: ui.purple},
];

const BRIEF = [
	{color: ui.teal, text: 'Grade A+. 21.9% margin on a 3.5x site-wide ROAS.'},
	{color: ui.teal, text: 'Google Ads is your strongest channel at 3.9x. Add 15% budget.'},
	{color: ui.red, text: 'Meta Ads is under breakeven at 1.6x. Two ad sets flagged.'},
	{color: brand.yellow, text: 'Golden Hour Set is trending. Feature it in tomorrow’s ads.'},
];

const CX = 1300;
const CY = 430;

export const Brain: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const core = pop(frame, fps, 4, 12);
	const settle = progress(frame, 104, 30);
	const briefIn = pop(frame, fps, 108, 16);
	return (
		<AbsoluteFill style={{background: `radial-gradient(circle at 68% 40%, #3a3a3a, ${brand.deep} 70%)`}}>
			<Shape kind="q-bl" size={200} color={brand.yellow} x={1740} y={-30} delay={6} bob={6} />
			<Shape kind="half-r" size={200} color={brand.orange} x={-20} y={820} delay={12} />
			<Caption
				eyebrow="THE INHAUS BRAIN"
				lines={['An AI brain', 'and agents', 'on your ads.']}
				accent={2}
				sub="They watch your ads, profit and products every day, then tell you where to scale and what to fix."
				y={290}
				width={560}
			/>

			<div
				style={{
					position: 'absolute',
					inset: 0,
					opacity: interpolate(settle, [0, 1], [1, 0.4]),
					transform: `translateY(${interpolate(settle, [0, 1], [0, -110])}px) scale(${interpolate(settle, [0, 1], [1, 0.8])})`,
					transformOrigin: `${CX}px ${CY}px`,
				}}
			>
				<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
					{AGENTS.map((a, i) => {
						const angle = (i / AGENTS.length) * Math.PI * 2 - Math.PI / 2 + frame * 0.002;
						const x = CX + Math.cos(angle) * 400;
						const y = CY + Math.sin(angle) * 260;
						const draw = progress(frame, 18 + i * 6, 24);
						return (
							<g key={a.name}>
								<line x1={CX} y1={CY} x2={CX + (x - CX) * draw} y2={CY + (y - CY) * draw} stroke={a.color} strokeOpacity={0.45} strokeWidth={2} strokeDasharray="6 8" />
								{[0, 0.5].map((offset) => {
									// pulses travel from each agent back to the brain
									const t = ((frame / 45 + offset + i * 0.17) % 1) * draw;
									return <circle key={offset} cx={x + (CX - x) * t} cy={y + (CY - y) * t} r={6} fill={a.color} opacity={draw * (1 - t * 0.6)} />;
								})}
							</g>
						);
					})}
				</svg>
				{[0, 1, 2].map((k) => {
					const t = ((frame + k * 30) % 90) / 90;
					return (
						<div
							key={k}
							style={{
								position: 'absolute',
								left: CX - 120,
								top: CY - 120,
								width: 240,
								height: 240,
								borderRadius: '50%',
								border: `3px solid ${brand.yellow}`,
								opacity: (1 - t) * 0.5 * core,
								transform: `scale(${0.8 + t * 1.1})`,
							}}
						/>
					);
				})}
				<div
					style={{
						position: 'absolute',
						left: CX - 120,
						top: CY - 120,
						width: 240,
						height: 240,
						borderRadius: '50%',
						background: brand.charcoal,
						boxShadow: `0 0 80px ${brand.yellow}66`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						transform: `scale(${core * (1 + Math.sin(frame / 8) * 0.025)})`,
					}}
				>
					<Img src={staticFile('mark-512.png')} style={{width: 200, height: 200}} />
				</div>
				{AGENTS.map((a, i) => {
					const angle = (i / AGENTS.length) * Math.PI * 2 - Math.PI / 2 + frame * 0.002;
					const x = CX + Math.cos(angle) * 400;
					const y = CY + Math.sin(angle) * 260;
					const s = pop(frame, fps, 30 + i * 6, 12);
					return (
						<div
							key={a.name}
							style={{
								position: 'absolute',
								left: x,
								top: y,
								transform: `translate(-50%, -50%) scale(${s})`,
								display: 'flex',
								alignItems: 'center',
								gap: 12,
								padding: '14px 22px',
								borderRadius: 999,
								background: ui.panel,
								border: `2px solid ${a.color}`,
								boxShadow: `0 10px 30px rgba(0,0,0,0.4), 0 0 24px ${a.color}33`,
								fontFamily: BODY,
								fontSize: 24,
								fontWeight: 800,
								color: '#fff',
								whiteSpace: 'nowrap',
							}}
						>
							<span style={{width: 14, height: 14, borderRadius: 7, background: a.color}} />
							{a.name}
						</div>
					);
				})}
			</div>

			<div
				style={{
					position: 'absolute',
					left: 830,
					top: 560,
					width: 960,
					padding: '26px 32px',
					borderRadius: 22,
					background: ui.panel,
					border: `1px solid ${ui.border}`,
					boxShadow: '0 40px 90px rgba(0,0,0,0.6)',
					fontFamily: BODY,
					opacity: Math.min(1, briefIn * 1.4),
					transform: `translateY(${interpolate(briefIn, [0, 1], [200, 0])}px)`,
				}}
			>
				<div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16}}>
					<Img src={staticFile('mark-512.png')} style={{width: 40, height: 40}} />
					<div style={{fontSize: 24, fontWeight: 800, color: '#fff'}}>Your daily brief</div>
					<div style={{fontSize: 18, color: ui.muted, marginLeft: 'auto'}}>Today, 7:00am</div>
				</div>
				{BRIEF.map((line, i) => {
					const start = 122 + i * 22;
					const text = typed(line.text, frame, start, 3);
					return (
						<div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, fontWeight: 600, color: '#DDE4F0', height: 44, opacity: frame >= start ? 1 : 0}}>
							<span style={{width: 12, height: 12, borderRadius: 6, background: line.color, flexShrink: 0}} />
							{text}
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
