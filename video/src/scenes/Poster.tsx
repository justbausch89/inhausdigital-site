import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Shape} from '../components/Shape';
import {BODY, DISPLAY, brand} from '../theme';
import {OverviewWindow} from './Overview';

// The still shown before the video plays, taken from its last frame once everything has animated in.
// The middle stays clear for the site's play button.
export const POSTER_FRAME = 240;

export const Poster: React.FC = () => (
	<AbsoluteFill style={{background: `radial-gradient(circle at 70% 50%, #3a3a3a, ${brand.deep} 70%)`}}>
		<Shape kind="q-br" size={240} color={brand.yellow} x={-40} y={-40} bob={0} />
		<Shape kind="circle" size={90} color={brand.pink} x={820} y={110} bob={0} />
		<Shape kind="half-t" size={260} color={brand.green} x={150} y={960} bob={0} />
		<div style={{position: 'absolute', left: 1020, top: 250, width: 1500, height: 1080, transform: 'scale(0.9)', transformOrigin: '0 0'}}>
			<OverviewWindow x={0} y={0} />
		</div>
		<div style={{position: 'absolute', left: 110, top: 300, display: 'flex', alignItems: 'center', gap: 34}}>
			<div style={{width: 150, height: 150, borderRadius: 75, background: brand.charcoal, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>
				<Img src={staticFile('mark-512.png')} style={{width: 132, height: 132}} />
			</div>
		</div>
		<div style={{position: 'absolute', left: 110, top: 490, fontFamily: DISPLAY, fontSize: 132, lineHeight: 1, color: '#fff'}}>
			InHaus
			<br />
			<span style={{color: brand.yellow}}>App</span>
		</div>
		<div style={{position: 'absolute', left: 114, top: 790, fontFamily: BODY, fontSize: 40, fontWeight: 700, color: 'rgba(255,255,255,0.85)'}}>
			Your AI brain in your pocket.
		</div>
	</AbsoluteFill>
);
