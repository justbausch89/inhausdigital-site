import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {pop, progress} from '../anim';
import {Artwork} from '../components/Artwork';
import {Caption} from '../components/Caption';
import {Shape} from '../components/Shape';
import {Pill} from '../components/Ui';
import {BODY, brand, ui} from '../theme';

const ADS = [
	{name: 'Video · Studio tour', channel: 'Meta', art: 3, hook: 0.42, ctr: 0.031, roas: 4.6, verdict: 'Winner · scale it', color: ui.teal},
	{name: 'Static · Golden Hour', channel: 'Meta', art: 0, hook: 0.27, ctr: 0.019, roas: 2.2, verdict: 'Fatigue · refresh', color: ui.orange},
	{name: 'Carousel · New in', channel: 'Google', art: 2, hook: 0.14, ctr: 0.008, roas: 0.9, verdict: 'Losing money · cut', color: ui.red},
];

const Metric: React.FC<{label: string; value: string; fill: number; color: string; start: number}> = ({label, value, fill, color, start}) => {
	const frame = useCurrentFrame();
	const p = progress(frame, start, 30);
	return (
		<div style={{marginTop: 12}}>
			<div style={{display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 700, color: '#C8D2E3'}}>
				<span>{label}</span>
				<span style={{color: '#fff'}}>{value}</span>
			</div>
			<div style={{height: 8, borderRadius: 4, background: ui.border, marginTop: 6}}>
				<div style={{height: 8, borderRadius: 4, width: `${fill * p * 100}%`, background: color}} />
			</div>
		</div>
	);
};

export const Creatives: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{background: `radial-gradient(circle at 70% 40%, #333, ${brand.deep})`}}>
			<Shape kind="q-br" size={190} color={brand.pink} x={-30} y={-30} delay={6} />
			<Shape kind="half-t" size={240} color={brand.yellow} x={1640} y={960} delay={12} bob={6} />
			<Caption
				eyebrow="CREATIVE INTELLIGENCE"
				lines={['See which ads', 'and media', 'really work.']}
				accent={2}
				sub="Every ad and asset scored on hook rate, clicks and real ROAS. Back the winners, cut the rest."
				y={290}
				width={600}
				size={74}
			/>
			<div style={{position: 'absolute', left: 730, top: 235, display: 'flex', gap: 30, fontFamily: BODY, color: '#fff'}}>
				{ADS.map((ad, i) => {
					const s = pop(frame, fps, 8 + i * 8, 15);
					const verdict = pop(frame, fps, [96, 112, 127][i], 11);
					const winner = i === 0 ? progress(frame, 96, 24) : 0;
					return (
						<div
							key={ad.name}
							style={{
								width: 340,
								borderRadius: 22,
								overflow: 'hidden',
								background: ui.panel,
								border: `2px solid ${i === 0 ? `rgba(52,211,153,${0.2 + winner * 0.8})` : ui.border}`,
								boxShadow: `0 30px 70px rgba(0,0,0,0.5), 0 0 ${winner * 50}px rgba(52,211,153,${winner * 0.45})`,
								opacity: Math.min(1, s * 1.4),
								transform: `translateY(${interpolate(s, [0, 1], [220, 0]) - winner * 24}px) scale(${1 + winner * 0.04})`,
							}}
						>
							<div style={{position: 'relative'}}>
								<Artwork variant={ad.art} width={340} height={320} delay={16 + i * 8} />
								<span style={{position: 'absolute', left: 14, top: 14}}>
									<Pill color="#fff" style={{background: 'rgba(0,0,0,0.55)', border: 'none'}}>
										{ad.channel}
									</Pill>
								</span>
								{i === 0 ? (
									<div style={{position: 'absolute', left: '50%', top: '50%', width: 74, height: 74, marginLeft: -37, marginTop: -37, borderRadius: 37, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
										<div style={{width: 0, height: 0, borderTop: '15px solid transparent', borderBottom: '15px solid transparent', borderLeft: '24px solid #fff', marginLeft: 6}} />
									</div>
								) : null}
							</div>
							<div style={{padding: '18px 22px 24px'}}>
								<div style={{fontSize: 21, fontWeight: 800}}>{ad.name}</div>
								<Metric label="Hook rate" value={`${Math.round(ad.hook * 100)}%`} fill={ad.hook / 0.5} color={ad.color} start={40 + i * 8} />
								<Metric label="Click-through" value={`${(ad.ctr * 100).toFixed(1)}%`} fill={ad.ctr / 0.035} color={ad.color} start={48 + i * 8} />
								<Metric label="Real ROAS" value={`${ad.roas.toFixed(1)}x`} fill={ad.roas / 5} color={ad.color} start={56 + i * 8} />
								<div style={{marginTop: 18, transform: `scale(${verdict})`, transformOrigin: 'left center'}}>
									<Pill color={ad.color} style={{fontSize: 17, padding: '8px 15px'}}>
										{ad.verdict}
									</Pill>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
