import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {pop, progress} from '../anim';
import {Shape} from '../components/Shape';
import {BODY, DISPLAY, brand} from '../theme';

export const Cta: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const mark = pop(frame, fps, 4, 11);
	const name = pop(frame, fps, 14, 14);
	const line = progress(frame, 30, 20);
	const button = pop(frame, fps, 50, 12);
	const url = progress(frame, 64, 20);
	const pulse = frame > 80 ? Math.max(0, Math.sin((frame - 80) / 9)) * 0.03 : 0;
	return (
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, ${brand.charcoal}, ${brand.deep} 75%)`}}>
			<Shape kind="q-br" size={300} color={brand.yellow} x={-60} y={-60} delay={4} bob={6} />
			<Shape kind="circle" size={130} color={brand.pink} x={1660} y={140} delay={10} />
			<Shape kind="half-t" size={320} color={brand.green} x={1500} y={920} delay={14} bob={8} />
			<Shape kind="q-tr" size={170} color={brand.orange} x={90} y={860} delay={18} spin={10} />
			<Shape kind="circle" size={40} color="#fff" x={420} y={210} delay={22} />

			<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
				<Img
					src={staticFile('mark-512.png')}
					style={{width: 190, height: 190, transform: `scale(${mark}) rotate(${interpolate(mark, [0, 1], [-140, 0])}deg)`}}
				/>
				<div
					style={{
						fontFamily: DISPLAY,
						fontSize: 150,
						lineHeight: 1,
						color: '#fff',
						marginTop: 26,
						opacity: Math.min(1, name * 1.5),
						transform: `translateY(${interpolate(name, [0, 1], [60, 0])}px)`,
					}}
				>
					InHaus <span style={{color: brand.yellow}}>App</span>
				</div>
				<div
					style={{
						fontFamily: BODY,
						fontSize: 46,
						fontWeight: 700,
						color: '#fff',
						marginTop: 20,
						opacity: line,
						transform: `translateY(${interpolate(line, [0, 1], [24, 0])}px)`,
					}}
				>
					Your AI brain in your pocket.
				</div>
				<div
					style={{
						marginTop: 50,
						padding: '24px 46px',
						borderRadius: 999,
						background: brand.yellow,
						color: brand.charcoal,
						fontFamily: BODY,
						fontSize: 34,
						fontWeight: 800,
						transform: `scale(${button * (1 + pulse)})`,
						boxShadow: '0 20px 50px rgba(252,180,4,0.3)',
					}}
				>
					Join an InHaus workshop to get access
				</div>
				<div style={{fontFamily: BODY, fontSize: 32, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginTop: 30, opacity: url}}>
					inhausdigital.com.au
				</div>
			</div>
		</AbsoluteFill>
	);
};
