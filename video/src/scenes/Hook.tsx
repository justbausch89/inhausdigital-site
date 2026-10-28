import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fmt, pop, progress} from '../anim';
import {Shape} from '../components/Shape';
import {BODY, DISPLAY, brand, ui} from '../theme';

const CARDS = [
	{who: 'META SAYS', color: ui.blue, value: 52.4, what: 'in sales from your ads'},
	{who: 'GOOGLE SAYS', color: ui.emerald, value: 46.8, what: 'in sales from your ads'},
	{who: 'SHOPIFY SAYS', color: '#95BF47', value: 71.3, what: 'in total sales'},
];

// "Struggling to understand your numbers?", then three platforms that don't add up.
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const lines = ['Struggling to', 'understand your', 'numbers?'];
	const lift = pop(frame, fps, 78, 20);
	let w = 0;
	return (
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, ${brand.charcoal}, ${brand.deep})`}}>
			<Shape kind="q-br" size={260} color={brand.yellow} x={-40} y={-40} delay={4} bob={6} />
			<Shape kind="circle" size={120} color={brand.pink} x={1700} y={110} delay={10} />
			<Shape kind="half-t" size={300} color={brand.green} x={1560} y={930} delay={14} bob={8} />
			<Shape kind="q-tr" size={150} color={brand.orange} x={70} y={880} delay={18} spin={12} />

			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 250,
					textAlign: 'center',
					fontFamily: DISPLAY,
					fontSize: 130,
					lineHeight: 1.04,
					color: '#fff',
					transform: `translateY(${interpolate(lift, [0, 1], [0, -175])}px) scale(${interpolate(lift, [0, 1], [1, 0.52])})`,
					transformOrigin: '50% 0',
				}}
			>
				{lines.map((line, i) => (
					<div key={line} style={{color: i === 2 ? brand.yellow : '#fff'}}>
						{line.split(' ').map((word) => {
							const s = pop(frame, fps, 4 + w++ * 5, 13);
							return (
								<span
									key={word}
									style={{
										display: 'inline-block',
										margin: '0 0.12em',
										opacity: Math.min(1, s * 1.5),
										transform: `translateY(${interpolate(s, [0, 1], [80, 0])}px) rotate(${interpolate(s, [0, 1], [6, 0])}deg)`,
									}}
								>
									{word}
								</span>
							);
						})}
					</div>
				))}
			</div>

			<div style={{position: 'absolute', top: 395, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
				{CARDS.map((card, i) => {
					const delay = 96 + i * 12;
					const s = pop(frame, fps, delay, 12);
					const settled = progress(frame, delay + 10, 20);
					const wobble = Math.sin(frame * 0.16 + i * 2) * 1.6 * settled;
					const symbol = i === 0 ? '+' : i === 1 ? '≠' : null;
					const symIn = pop(frame, fps, 140 + i * 10, 10);
					return (
						<React.Fragment key={card.who}>
							<div
								style={{
									width: 430,
									padding: '34px 36px 32px',
									borderRadius: 24,
									background: ui.panel,
									border: `1px solid ${ui.border}`,
									borderTop: `6px solid ${card.color}`,
									boxShadow: '0 30px 70px rgba(0,0,0,0.45)',
									fontFamily: BODY,
									opacity: Math.min(1, s * 1.5),
									transform: `translateY(${interpolate(s, [0, 1], [260, 0])}px) rotate(${interpolate(s, [0, 1], [i === 1 ? 0 : (i - 1) * 14, 0]) + wobble}deg)`,
								}}
							>
								<div style={{fontSize: 22, fontWeight: 800, letterSpacing: '0.14em', color: card.color}}>{card.who}</div>
								<div style={{fontSize: 92, fontWeight: 800, color: '#fff', margin: '10px 0 4px', letterSpacing: '-0.02em'}}>
									{fmt(card.value * progress(frame, delay + 4, 34), {prefix: '$', suffix: 'K', decimals: 1})}
								</div>
								<div style={{fontSize: 26, fontWeight: 500, color: ui.muted}}>{card.what}</div>
							</div>
							{symbol ? (
								<div
									style={{
										width: 110,
										textAlign: 'center',
										fontFamily: DISPLAY,
										fontSize: 110,
										color: symbol === '≠' ? brand.pink : '#fff',
										transform: `scale(${symIn})`,
									}}
								>
									{symbol}
								</div>
							) : null}
						</React.Fragment>
					);
				})}
			</div>

			<div
				style={{
					position: 'absolute',
					top: 800,
					left: 0,
					right: 0,
					textAlign: 'center',
					fontFamily: BODY,
					fontSize: 44,
					fontWeight: 600,
					color: '#fff',
					opacity: progress(frame, 172, 18),
					transform: `translateY(${interpolate(progress(frame, 172, 18), [0, 1], [30, 0])}px)`,
				}}
			>
				Every platform takes credit for the <span style={{color: brand.yellow}}>same sale.</span>
			</div>
		</AbsoluteFill>
	);
};
