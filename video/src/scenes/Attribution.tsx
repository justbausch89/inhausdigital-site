import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {pop, progress} from '../anim';
import {AppWindow} from '../components/AppWindow';
import {Caption} from '../components/Caption';
import {Shape} from '../components/Shape';
import {CountUp, Label, Panel} from '../components/Ui';
import {BODY, brand, ui} from '../theme';

const SLICES = [
	{name: 'Google Ads', share: 0.36, color: ui.red, sales: '$41.1K', roas: '4.3x'},
	{name: 'Meta Ads', share: 0.26, color: ui.blue, sales: '$29.7K', roas: '1.6x'},
	{name: 'Organic search', share: 0.15, color: ui.emerald, sales: '$17.1K', roas: '—'},
	{name: 'Direct', share: 0.1, color: ui.grey, sales: '$11.4K', roas: '—'},
	{name: 'Email', share: 0.07, color: ui.purple, sales: '$8.0K', roas: '—'},
	{name: 'Referrals', share: 0.04, color: ui.orange, sales: '$4.6K', roas: '—'},
	{name: 'Organic social', share: 0.02, color: ui.pink, sales: '$2.3K', roas: '—'},
];

const STEPS = [
	{what: 'Saw an Instagram ad', when: 'Day 1 · Meta Ads', credit: '40%', color: ui.blue, icon: 'M'},
	{what: 'Searched on Google', when: 'Day 3 · Google Ads', credit: '25%', color: ui.red, icon: 'G'},
	{what: 'Opened an email', when: 'Day 5 · Klaviyo', credit: '35%', color: ui.purple, icon: 'E'},
	{what: 'Bought a canvas', when: 'Day 6 · $249 order', credit: '', color: brand.yellow, icon: '✓'},
];

const Donut: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const p = progress(frame, start, 60);
	const r = 120;
	const c = 2 * Math.PI * r;
	let offset = 0;
	return (
		<div style={{position: 'relative', width: 320, height: 320}}>
			<svg width={320} height={320} style={{transform: 'rotate(-90deg)'}}>
				{SLICES.map((s) => {
					const len = s.share * c;
					// each slice grows in turn as the ring sweeps round
					const visible = Math.max(0, Math.min(len, p * c - offset));
					const el = (
						<circle
							key={s.name}
							cx={160}
							cy={160}
							r={r}
							fill="none"
							stroke={s.color}
							strokeWidth={52}
							strokeDasharray={`${Math.max(0, visible - 3)} ${c}`}
							strokeDashoffset={-offset}
						/>
					);
					offset += len;
					return el;
				})}
			</svg>
			<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
				<div style={{fontSize: 30, fontWeight: 800}}>
					<CountUp value={114.2} start={start} duration={60} prefix="$" suffix="K" decimals={1} />
				</div>
				<div style={{fontSize: 14, color: ui.muted}}>sales credited</div>
			</div>
		</div>
	);
};

const Journey: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const card = pop(frame, fps, start, 16);
	// each step lights up as the voiceover says it
	const STEP_AT = [120, 141, 165, 193];
	const line = interpolate(frame, STEP_AT, [0, 1 / 3, 2 / 3, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const W = 1700;
	const xs = STEPS.map((_, i) => 170 + i * ((W - 340) / (STEPS.length - 1)));
	const dotX = interpolate(line, [0, 1], [xs[0], xs[xs.length - 1]]);
	return (
		<div
			style={{
				position: 'absolute',
				left: 110,
				top: 790,
				width: W,
				height: 230,
				borderRadius: 24,
				background: ui.panel,
				border: `1px solid ${ui.border}`,
				boxShadow: '0 -20px 80px rgba(0,0,0,0.5)',
				fontFamily: BODY,
				color: '#fff',
				opacity: Math.min(1, card * 1.4),
				transform: `translateY(${interpolate(card, [0, 1], [260, 0])}px)`,
			}}
		>
			<Label style={{position: 'absolute', left: 30, top: 22, fontSize: 15}} color={brand.yellow}>
				Customer journey · Order #4821
			</Label>
			<div style={{position: 'absolute', left: xs[0], top: 92, width: (xs[xs.length - 1] - xs[0]) * line, height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${ui.blue}, ${ui.red}, ${ui.purple}, ${brand.yellow})`}} />
			<div style={{position: 'absolute', left: dotX - 9, top: 85, width: 18, height: 18, borderRadius: 9, background: '#fff', boxShadow: '0 0 18px #fff', opacity: line < 1 ? card : 0}} />
			{STEPS.map((step, i) => {
				const reached = pop(frame, fps, STEP_AT[i] - 4, 11);
				return (
					<div key={step.what} style={{position: 'absolute', left: xs[i] - 160, top: 58, width: 320, textAlign: 'center'}}>
						<div
							style={{
								width: 68,
								height: 68,
								margin: '0 auto',
								borderRadius: '50%',
								background: step.color,
								color: i === 3 ? brand.charcoal : '#fff',
								fontFamily: BODY,
								fontWeight: 800,
								fontSize: 32,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								transform: `scale(${reached})`,
								boxShadow: `0 0 0 8px ${ui.panel}, 0 0 30px ${step.color}88`,
							}}
						>
							{step.icon}
						</div>
						<div style={{opacity: reached, marginTop: 14}}>
							<div style={{fontSize: 24, fontWeight: 800}}>{step.what}</div>
							<div style={{fontSize: 18, color: ui.muted, marginTop: 2}}>
								{step.when}
								{step.credit ? <b style={{color: step.color}}> · {step.credit} credit</b> : null}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export const Attribution: React.FC = () => (
	<AbsoluteFill style={{background: `radial-gradient(circle at 70% 30%, #333, ${brand.deep})`}}>
		<Shape kind="circle" size={90} color={brand.yellow} x={560} y={110} delay={10} />
		<Shape kind="q-bl" size={200} color={brand.pink} x={1760} y={-40} delay={6} spin={6} />
		<Caption
			eyebrow="ATTRIBUTION"
			lines={['See every step', 'to the sale.']}
			accent={1}
			sub="Our own first-party pixel tracks the whole customer journey, so you know which channels really played a part."
			y={190}
			width={560}
			size={74}
		/>
		<AppWindow x={720} y={80} width={1140} height={690} delay={4} path="/attribution" sidebar="Attribution">
			<div style={{padding: 22, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 14}}>
				<div>
					<div style={{fontSize: 26, fontWeight: 800}}>All channels</div>
					<div style={{fontSize: 15, color: ui.muted}}>Sales credited by marketing channel · last 7 days</div>
				</div>
				<Panel delay={10} style={{flex: 1, padding: '18px 22px', display: 'flex', gap: 26, alignItems: 'center'}}>
					<Donut start={20} />
					<div style={{flex: 1}}>
						<div style={{display: 'flex', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', color: ui.muted, paddingBottom: 8, borderBottom: `1px solid ${ui.border}`}}>
							<span style={{flex: 1}}>CHANNEL</span>
							<span style={{width: 110, textAlign: 'right'}}>SALES</span>
							<span style={{width: 80, textAlign: 'right'}}>ROAS</span>
						</div>
						{SLICES.map((s, i) => (
							<Row key={s.name} index={i} {...s} />
						))}
					</div>
				</Panel>
			</div>
		</AppWindow>
		<Journey start={72} />
	</AbsoluteFill>
);

const Row: React.FC<(typeof SLICES)[number] & {index: number}> = ({name, color, sales, roas, index}) => {
	const frame = useCurrentFrame();
	const p = progress(frame, 30 + index * 7, 18);
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				height: 47,
				fontSize: 18,
				fontWeight: 700,
				borderBottom: `1px solid ${ui.border}`,
				opacity: p,
				transform: `translateX(${interpolate(p, [0, 1], [40, 0])}px)`,
			}}
		>
			<span style={{flex: 1, display: 'flex', alignItems: 'center', gap: 10}}>
				<span style={{width: 12, height: 12, borderRadius: 3, background: color}} />
				{name}
			</span>
			<span style={{width: 110, textAlign: 'right'}}>{sales}</span>
			<span style={{width: 80, textAlign: 'right', color: roas === '1.6x' ? ui.red : roas === '—' ? ui.muted : ui.teal}}>{roas}</span>
		</div>
	);
};
