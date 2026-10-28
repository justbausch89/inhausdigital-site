import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {fmt, pop, progress} from '../anim';
import {AppWindow} from '../components/AppWindow';
import {Caption} from '../components/Caption';
import {Shape} from '../components/Shape';
import {CountUp, Label, Panel, Pill} from '../components/Ui';
import {brand, ui} from '../theme';

const TILES = [
	{label: 'Net profit', value: 4.1, decimals: 1, prefix: '$', suffix: 'K', sub: '21.9% margin', color: ui.teal},
	{label: 'Gross profit', value: 11.6, decimals: 1, prefix: '$', suffix: 'K', sub: '62.8% GP margin', color: '#7DD3FC'},
	{label: 'Revenue', value: 18.4, decimals: 1, prefix: '$', suffix: 'K', sub: '71 orders', color: ui.gold},
	{label: 'Ad spend', value: 5.2, decimals: 1, prefix: '$', suffix: 'K', sub: '28.1% of revenue', color: '#60A5FA'},
];

const CHANNELS = [
	{name: 'Meta Ads', mark: ui.blue, claimed: 2.4, real: 1.6, verdict: 'Below breakeven', good: false},
	{name: 'Google Ads', mark: ui.emerald, claimed: 4.6, real: 3.9, verdict: 'Profitable · scale it', good: true},
];

const GradeRing: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = progress(frame, start, 50);
	const r = 58;
	const c = 2 * Math.PI * r;
	const letter = pop(frame, fps, start + 40, 10);
	return (
		<div style={{position: 'relative', width: 140, height: 140, flexShrink: 0}}>
			<svg width={140} height={140} style={{transform: 'rotate(-90deg)'}}>
				<circle cx={70} cy={70} r={r} fill="none" stroke="#123128" strokeWidth={12} />
				<circle
					cx={70}
					cy={70}
					r={r}
					fill="none"
					stroke={ui.emerald}
					strokeWidth={12}
					strokeLinecap="round"
					strokeDasharray={c}
					strokeDashoffset={c * (1 - 0.94 * p)}
					style={{filter: `drop-shadow(0 0 8px ${ui.emerald})`}}
				/>
			</svg>
			<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
				<div style={{fontSize: 46, fontWeight: 800, color: ui.teal, transform: `scale(${letter})`, lineHeight: 1}}>A+</div>
				<div style={{fontSize: 14, color: ui.muted, fontWeight: 700, marginTop: 4}}>{Math.round(94 * p)}/100</div>
			</div>
		</div>
	);
};

const Compare: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const BAR = 420; // px for 5x ROAS
	const NAME = 150;
	const scale = (x: number) => (x / 5) * BAR;
	const breakeven = progress(frame, start + 60, 20);
	return (
		<div style={{position: 'relative', marginTop: 18}}>
			<div
				style={{
					position: 'absolute',
					left: NAME + scale(1.7),
					top: -6,
					bottom: -6,
					borderLeft: `2px dashed ${brand.yellow}`,
					opacity: breakeven,
					transform: `scaleY(${breakeven})`,
					transformOrigin: 'top',
				}}
			>
				<span style={{position: 'absolute', top: -26, left: -60, width: 120, textAlign: 'center', fontSize: 13, fontWeight: 800, color: brand.yellow}}>
					BREAKEVEN 1.7x
				</span>
			</div>
			{CHANNELS.map((ch, i) => {
				const b = progress(frame, start + 10 + i * 12, 34);
				const verdict = pop(frame, fps, start + 84 + i * 10, 11);
				return (
					<div key={ch.name} style={{display: 'flex', alignItems: 'center', marginBottom: i === 0 ? 34 : 0}}>
						<div style={{width: NAME, fontSize: 19, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10}}>
							<span style={{width: 5, height: 24, borderRadius: 3, background: ch.mark}} />
							{ch.name}
						</div>
						<div style={{width: BAR + 70}}>
							{[
								{v: ch.claimed, color: ui.slate, text: 'Platform says'},
								{v: ch.real, color: ch.good ? ui.emerald : ui.red, text: 'InHaus pixel'},
							].map((row) => (
								<div key={row.text} style={{display: 'flex', alignItems: 'center', gap: 10, height: 40}}>
									<div style={{width: scale(row.v) * b, height: 26, borderRadius: 6, background: row.color}} />
									<span style={{fontSize: 17, fontWeight: 800, color: row.color === ui.slate ? '#A9B8DA' : row.color, opacity: b}}>
										{fmt(row.v * b, {decimals: 1, suffix: 'x'})}
									</span>
								</div>
							))}
						</div>
						<div style={{transform: `scale(${verdict})`, transformOrigin: 'left center'}}>
							<Pill color={ch.good ? ui.teal : ui.red} style={{fontSize: 16, padding: '7px 14px'}}>
								{ch.verdict}
							</Pill>
						</div>
					</div>
				);
			})}
		</div>
	);
};

const Advice: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const p = progress(frame, start, 18);
	return (
		<div
			style={{
				marginTop: 30,
				padding: '13px 16px',
				borderRadius: 12,
				border: `1px solid ${brand.yellow}55`,
				background: 'rgba(252,180,4,0.08)',
				fontSize: 17,
				opacity: p,
				transform: `translateY(${(1 - p) * 16}px)`,
			}}
		>
			<b style={{color: brand.yellow}}>Brain says: </b>
			Move budget from Meta to Google, and fix Meta before you scale it.
		</div>
	);
};

export const ProfitCheck: React.FC = () => (
	<AbsoluteFill style={{background: `radial-gradient(circle at 70% 40%, #333, ${brand.deep})`}}>
		<Shape kind="half-b" size={220} color={brand.pink} x={180} y={-20} delay={8} bob={6} />
		<Shape kind="q-tl" size={170} color={brand.green} x={-20} y={930} delay={14} spin={-8} />
		<Caption
			eyebrow="BUSINESS P&L"
			lines={['Check your', 'ads against', 'real profit.']}
			accent={2}
			sub="See what Meta and Google claim next to what really made money. Then scale what's profitable."
			y={300}
			width={560}
		/>
		<AppWindow x={700} y={120} width={1160} height={840} delay={4} path="/pnl" sidebar="Business P&L">
			<div style={{padding: 22, display: 'flex', flexDirection: 'column', gap: 14, height: '100%', boxSizing: 'border-box'}}>
				<div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
					<div style={{fontSize: 26, fontWeight: 800}}>Business P&L</div>
					<div style={{fontSize: 15, color: ui.muted}}>Yesterday · Tue 27 Oct</div>
				</div>
				<Panel delay={10} style={{padding: 20, display: 'flex', gap: 26, alignItems: 'center', background: 'linear-gradient(90deg, #0F2A26, #0E1728 60%)', borderColor: '#1D4A3F'}}>
					<GradeRing start={18} />
					<div>
						<div style={{fontSize: 26, fontWeight: 800, color: ui.teal}}>Profit grade</div>
						<div style={{fontSize: 16, color: '#B8C4D8', margin: '6px 0 14px', maxWidth: 560}}>
							Graded on real profit, after product costs, ad spend and every expense.
						</div>
						<div style={{display: 'flex', gap: 10}}>
							<Pill color={ui.teal}>Profit margin · Strong</Pill>
							<Pill color={ui.teal}>Ad efficiency · Strong</Pill>
							<Pill color={ui.teal}>Revenue trend · Good</Pill>
						</div>
					</div>
				</Panel>
				<div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12}}>
					{TILES.map((t, i) => (
						<Panel key={t.label} delay={40 + i * 6} style={{padding: '14px 16px', borderColor: `${t.color}55`}}>
							<Label color={t.color}>{t.label}</Label>
							<div style={{fontSize: 32, fontWeight: 800, margin: '6px 0 2px'}}>
								<CountUp value={t.value} start={46 + i * 6} prefix={t.prefix} suffix={t.suffix} decimals={t.decimals} />
							</div>
							<div style={{fontSize: 14, color: ui.muted}}>{t.sub}</div>
						</Panel>
					))}
				</div>
				<Panel delay={84} style={{flex: 1, padding: '18px 22px'}}>
					<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
						<div style={{fontSize: 19, fontWeight: 800}}>What the platforms claim vs what really sold</div>
						<div style={{display: 'flex', gap: 16, fontSize: 14, color: ui.muted}}>
							<span style={{display: 'flex', alignItems: 'center', gap: 6}}>
								<span style={{width: 10, height: 10, borderRadius: 3, background: ui.slate}} />
								Platform says
							</span>
							<span style={{display: 'flex', alignItems: 'center', gap: 6}}>
								<span style={{width: 10, height: 10, borderRadius: 3, background: ui.emerald}} />
								InHaus pixel
							</span>
						</div>
					</div>
					<div style={{fontSize: 14, color: ui.muted, margin: '4px 0 22px'}}>ROAS for yesterday</div>
					<Compare start={92} />
					<Advice start={190} />
				</Panel>
			</div>
		</AppWindow>
	</AbsoluteFill>
);
