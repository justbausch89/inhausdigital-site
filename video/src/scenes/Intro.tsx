import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {pop, progress} from '../anim';
import {Shape} from '../components/Shape';
import {BODY, DISPLAY, brand} from '../theme';

// Yellow brand moment: the InHaus mark rolls in and the product is named.
export const Intro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const mark = pop(frame, fps, 4, 11);
	const meet = progress(frame, 16, 18);
	const name = pop(frame, fps, 22, 14);
	const sub = progress(frame, 40, 20);
	return (
		<AbsoluteFill style={{background: brand.yellow}}>
			<Shape kind="q-tl" size={340} color={brand.charcoal} x={-60} y={800} delay={6} bob={6} />
			<Shape kind="circle" size={150} color={brand.pink} x={1640} y={120} delay={12} />
			<Shape kind="half-l" size={260} color="#fff" x={1790} y={640} delay={16} bob={8} />
			<Shape kind="q-br" size={130} color={brand.orange} x={210} y={110} delay={20} spin={-14} />
			<Shape kind="circle" size={46} color={brand.charcoal} x={1500} y={880} delay={24} />

			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 70}}>
				<div
					style={{
						width: 330,
						height: 330,
						borderRadius: '50%',
						background: brand.charcoal,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						transform: `scale(${mark}) rotate(${interpolate(mark, [0, 1], [-140, 0])}deg)`,
						boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
					}}
				>
					<Img src={staticFile('mark-512.png')} style={{width: 290, height: 290}} />
				</div>
				<div style={{color: brand.charcoal}}>
					<div
						style={{
							fontFamily: BODY,
							fontSize: 52,
							fontWeight: 700,
							opacity: meet,
							transform: `translateX(${interpolate(meet, [0, 1], [-40, 0])}px)`,
						}}
					>
						Meet the
					</div>
					<div
						style={{
							fontFamily: DISPLAY,
							fontSize: 190,
							lineHeight: 1,
							opacity: Math.min(1, name * 1.5),
							transform: `translateY(${interpolate(name, [0, 1], [60, 0])}px)`,
						}}
					>
						InHaus App
					</div>
					<div
						style={{
							fontFamily: BODY,
							fontSize: 42,
							fontWeight: 600,
							marginTop: 18,
							opacity: sub,
							transform: `translateY(${interpolate(sub, [0, 1], [20, 0])}px)`,
						}}
					>
						Your AI growth platform for ecommerce.
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
