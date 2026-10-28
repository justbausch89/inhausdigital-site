import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {progress} from '../anim';
import {AppWindow} from '../components/AppWindow';
import {Caption} from '../components/Caption';
import {Shape} from '../components/Shape';
import {CountUp, Label, Panel, Pill} from '../components/Ui';
import {brand, ui} from '../theme';

const TOP = [
	['Custom Photo Canvas', 9.4],
	['Golden Hour Set of 3', 4.1],
	['Coastal Dusk Print', 3.3],
	['Palm Springs Retro', 2.9],
	['Botanical Line Art', 2.4],
	['Desert Bloom Canvas', 2.2],
	['Ocean Ripple Diptych', 1.9],
	['Midnight Abstract', 1.7],
] as const;

const ABC = [
	{cls: 'A', title: 'Best performers', count: 182, share: '80% of revenue', color: ui.teal},
	{cls: 'B', title: 'Mid performers', count: 141, share: '15% of revenue', color: ui.orange},
	{cls: 'C', title: 'Low performers', count: 129, share: '5% of revenue', color: ui.muted},
];

const Bars: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const MAX = 10;
	const W = 680;
	return (
		<div style={{marginTop: 14}}>
			{TOP.map(([name, value], i) => {
				const p = progress(frame, start + i * 5, 34);
				return (
					<div key={name} style={{display: 'flex', alignItems: 'center', height: 38, gap: 14}}>
						<div style={{width: 210, textAlign: 'right', fontSize: 16, fontWeight: 600, color: '#C8D2E3', whiteSpace: 'nowrap'}}>{name}</div>
						<div style={{width: (value / MAX) * W * p, height: 24, borderRadius: 5, background: i === 1 ? brand.yellow : ui.emerald}} />
						<div style={{fontSize: 16, fontWeight: 800, opacity: p}}>${(value * p).toFixed(1)}K</div>
					</div>
				);
			})}
		</div>
	);
};

export const Products: React.FC = () => {
	const frame = useCurrentFrame();
	const tip = progress(frame, 120, 20);
	return (
		<AbsoluteFill style={{background: `radial-gradient(circle at 70% 40%, #333, ${brand.deep})`}}>
			<Shape kind="half-t" size={260} color={brand.yellow} x={160} y={950} delay={8} bob={6} />
			<Shape kind="circle" size={60} color={brand.green} x={600} y={160} delay={14} />
			<Caption
				eyebrow="PRODUCTS"
				lines={['Know which', 'products make', 'you money.']}
				accent={2}
				sub="Best sellers, hidden gems and dead weight, ranked for you automatically."
				y={300}
				width={560}
			/>
			<AppWindow x={715} y={120} width={1140} height={840} delay={4} path="/products">
				<div style={{padding: 22, display: 'flex', flexDirection: 'column', gap: 14, height: '100%', boxSizing: 'border-box'}}>
					<div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12}}>
						{[
							{l: 'Product revenue', v: 104.7, p: '$', s: 'K', d: 1},
							{l: 'Products sold', v: 1092, d: 0},
							{l: 'Orders', v: 1041, d: 0},
							{l: 'Avg order value', v: 100.53, p: '$', d: 2},
						].map((k, i) => (
							<Panel key={k.l} delay={8 + i * 5} style={{padding: '14px 16px'}}>
								<Label>{k.l}</Label>
								<div style={{fontSize: 28, fontWeight: 800, marginTop: 6}}>
									<CountUp value={k.v} start={12 + i * 5} prefix={k.p} suffix={k.s} decimals={k.d} />
								</div>
							</Panel>
						))}
					</div>
					<Panel delay={22} style={{padding: '16px 20px'}}>
						<div style={{display: 'flex', justifyContent: 'space-between'}}>
							<div>
								<div style={{fontSize: 19, fontWeight: 800}}>Top products by revenue</div>
								<div style={{fontSize: 14, color: ui.muted}}>Ranked from store orders, coloured by class</div>
							</div>
						</div>
						<Bars start={30} />
					</Panel>
					<div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12}}>
						{ABC.map((c, i) => (
							<Panel key={c.cls} delay={84 + i * 6} style={{padding: '14px 18px'}}>
								<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
									<div style={{fontSize: 16, fontWeight: 800, color: c.color}}>
										{c.cls} · {c.title}
									</div>
									<Pill color={c.color}>{c.cls}</Pill>
								</div>
								<div style={{fontSize: 30, fontWeight: 800, marginTop: 4}}>
									<CountUp value={c.count} start={88 + i * 6} />
									<span style={{fontSize: 15, color: ui.muted, fontWeight: 600}}> products</span>
								</div>
								<div style={{fontSize: 14, color: ui.muted}}>{c.share}</div>
							</Panel>
						))}
					</div>
					<div
						style={{
							padding: '14px 18px',
							borderRadius: 12,
							border: `1px solid ${brand.yellow}55`,
							background: 'rgba(252,180,4,0.08)',
							fontSize: 17,
							opacity: tip,
							transform: `translateY(${(1 - tip) * 20}px)`,
						}}
					>
						<b style={{color: brand.yellow}}>Hidden gem: </b>
						Golden Hour Set of 3 has a 40% higher order value than your best sellers. Put it in your ads.
					</div>
				</div>
			</AppWindow>
		</AbsoluteFill>
	);
};
