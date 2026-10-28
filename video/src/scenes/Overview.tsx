import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {progress, smoothPath} from '../anim';
import {AppWindow} from '../components/AppWindow';
import {Caption} from '../components/Caption';
import {Shape} from '../components/Shape';
import {KpiCard, Panel} from '../components/Ui';
import {BODY, brand, ui} from '../theme';

const KPIS = [
	{label: 'Blended MER', value: 4.12, decimals: 2, suffix: 'x', note: '24% of rev', delta: '+12.1%', sub: 'Total revenue ÷ ad spend', spark: [3, 4, 3.6, 4.4, 4.1, 4.8, 5.2]},
	{label: 'Total revenue', value: 128.6, decimals: 1, prefix: '$', suffix: 'K', delta: '+18.4%', sub: 'All sales channels', spark: [2, 3, 2.6, 4.2, 3.4, 4.6, 5.4]},
	{label: 'Ad spend', value: 31.2, decimals: 1, prefix: '$', suffix: 'K', delta: '+4.2%', sub: 'Meta + Google', spark: [3, 3.2, 3.1, 3.6, 3.3, 3.5, 3.4]},
	{label: 'Blended CAC', value: 62.4, decimals: 2, prefix: '$', delta: '-8.8%', sub: 'Ad spend ÷ new customers', spark: [5, 4.6, 4.8, 4.1, 3.8, 3.6, 3.2]},
	{label: 'NC-ROAS', value: 3.61, decimals: 2, suffix: 'x', note: '31% of NC rev', delta: '+13.3%', sub: 'New-customer rev ÷ spend', spark: [2, 2.4, 2.2, 3, 2.8, 3.4, 3.6]},
	{label: 'After-ad profit', value: 26.8, decimals: 1, prefix: '$', suffix: 'K', delta: '+21.7%', sub: 'After costs and ads', spark: [1, 1.6, 1.4, 2.4, 2.2, 3, 3.8], accent: ui.teal},
];

// Revenue and spend per day, with blended ROAS on the right axis
const DAYS = [
	{d: 'Mon', rev: 15.2, spend: 3.9, roas: 3.9},
	{d: 'Tue', rev: 17.8, spend: 4.1, roas: 4.3},
	{d: 'Wed', rev: 21.4, spend: 4.6, roas: 4.6},
	{d: 'Thu', rev: 16.1, spend: 4.4, roas: 3.7},
	{d: 'Fri', rev: 19.6, spend: 4.5, roas: 4.4},
	{d: 'Sat', rev: 23.9, spend: 4.9, roas: 4.9},
	{d: 'Sun', rev: 22.6, spend: 4.8, roas: 4.7},
];

const RevenueChart: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const W = 1000;
	const H = 190;
	const max = 26;
	const slot = W / DAYS.length;
	const line = DAYS.map((day, i) => [slot * i + slot / 2, H - (day.roas / 6) * H] as [number, number]);
	const lineIn = progress(frame, start + 40, 45);
	return (
		<svg width={W + 60} height={H + 40} style={{overflow: 'visible'}}>
			{[0, 0.25, 0.5, 0.75, 1].map((g) => (
				<g key={g}>
					<line x1={50} x2={W + 50} y1={H - g * H} y2={H - g * H} stroke={ui.border} strokeDasharray="4 6" />
					<text x={40} y={H - g * H + 5} textAnchor="end" fill={ui.muted} fontSize={14} fontFamily={BODY}>
						${Math.round(g * max)}K
					</text>
				</g>
			))}
			<g transform="translate(50 0)">
				<defs>
					<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#F2C14E" />
						<stop offset="1" stopColor="#C9971F" />
					</linearGradient>
				</defs>
				{DAYS.map((day, i) => {
					const g = progress(frame, start + i * 5, 26);
					const rh = (day.rev / max) * H * g;
					const sh = (day.spend / max) * H * progress(frame, start + 8 + i * 5, 26);
					const x = slot * i + slot / 2;
					return (
						<g key={day.d}>
							<rect x={x - 34} y={H - rh} width={30} height={rh} rx={5} fill="url(#gold)" />
							<rect x={x + 4} y={H - sh} width={30} height={sh} rx={5} fill={ui.slate} />
							<text x={x} y={H + 28} textAnchor="middle" fill={ui.muted} fontSize={15} fontFamily={BODY}>
								{day.d}
							</text>
						</g>
					);
				})}
				<path
					d={smoothPath(line)}
					fill="none"
					stroke={ui.teal}
					strokeWidth={4}
					strokeLinecap="round"
					pathLength={1}
					strokeDasharray={1}
					strokeDashoffset={1 - lineIn}
				/>
				{line.map(([x, y], i) => (
					<circle key={i} cx={x} cy={y} r={6} fill={ui.bg} stroke={ui.teal} strokeWidth={3} opacity={lineIn > (i + 0.5) / line.length ? 1 : 0} />
				))}
			</g>
		</svg>
	);
};

// The dashboard window on its own, so the poster can reuse it
export const OverviewWindow: React.FC<{x: number; y: number}> = ({x, y}) => {
	const frame = useCurrentFrame();
	return (
		<AppWindow x={x} y={y} width={1120} height={800} delay={4} path="/overview">
			<div style={{padding: 22, display: 'flex', flexDirection: 'column', gap: 14, height: '100%', boxSizing: 'border-box'}}>
				<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
					<div
						style={{
							display: 'flex',
							gap: 16,
							alignItems: 'center',
							padding: '8px 16px',
							borderRadius: 999,
							border: `1px solid ${ui.border}`,
							fontSize: 15,
							color: ui.muted,
						}}
					>
						<span style={{width: 10, height: 10, borderRadius: 5, background: ui.teal, boxShadow: `0 0 ${8 + Math.sin(frame / 5) * 6}px ${ui.teal}`}} />
						<b style={{color: ui.text}}>52</b> on site now
						<span style={{color: ui.border}}>|</span>
						<b style={{color: ui.text}}>14</b> orders today · $2.4K
					</div>
					<div style={{padding: '9px 18px', borderRadius: 10, background: ui.gold, color: '#1B1405', fontWeight: 800, fontSize: 15}}>
						Run Overview Audit
					</div>
				</div>
				<div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: 160, gap: 14}}>
					{KPIS.map((k, i) => (
						<KpiCard key={k.label} {...k} delay={14 + i * 6} />
					))}
				</div>
				<Panel delay={60} style={{flex: 1, padding: '16px 20px', position: 'relative'}}>
					<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
						<div style={{fontSize: 18, fontWeight: 800}}>Revenue vs Spend</div>
						<div style={{display: 'flex', gap: 18, fontSize: 14, color: ui.muted}}>
							{[
								['ROAS', ui.teal],
								['Revenue', ui.gold],
								['Spend', ui.slate],
							].map(([n, c]) => (
								<span key={n} style={{display: 'flex', alignItems: 'center', gap: 6}}>
									<span style={{width: 10, height: 10, borderRadius: 5, background: c}} />
									{n}
								</span>
							))}
						</div>
					</div>
					<RevenueChart start={72} />
				</Panel>
			</div>
		</AppWindow>
	);
};

export const Overview: React.FC = () => {
	const frame = useCurrentFrame();
	const zoom = interpolate(frame, [0, 270], [1, 1.025]);
	return (
		<AbsoluteFill style={{background: `radial-gradient(circle at 70% 40%, #333, ${brand.deep})`}}>
			<Shape kind="q-tr" size={180} color={brand.yellow} x={-30} y={900} delay={10} bob={6} />
			<Shape kind="circle" size={70} color={brand.pink} x={600} y={120} delay={16} />
			<Caption
				eyebrow="ECOM OVERVIEW"
				lines={['All your numbers.', 'One screen.']}
				accent={1}
				sub="Shopify, Meta and Google pulled in live and checked against each other."
				y={330}
				width={560}
			/>
			<div style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '75% 50%'}}>
				<OverviewWindow x={715} y={140} />
			</div>
		</AbsoluteFill>
	);
};
