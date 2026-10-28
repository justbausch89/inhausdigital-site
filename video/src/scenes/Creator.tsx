import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInOut, pop, progress, typed} from '../anim';
import {AppWindow} from '../components/AppWindow';
import {Artwork} from '../components/Artwork';
import {Caption} from '../components/Caption';
import {Shape} from '../components/Shape';
import {Cursor, Label, Pill} from '../components/Ui';
import {BODY, brand, ui} from '../theme';

const TITLE = 'Golden Hour Abstract | Canvas Print';
const DESCRIPTION = 'Warm, sun-washed shapes that bring golden-hour calm to any room. Printed on museum-grade canvas.';

const Field: React.FC<{label: string; children: React.ReactNode; style?: React.CSSProperties; extra?: React.ReactNode}> = ({
	label,
	children,
	style,
	extra,
}) => (
	<div style={{marginBottom: 16, ...style}}>
		<div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7}}>
			<Label>{label}</Label>
			{extra}
		</div>
		<div
			style={{
				minHeight: 46,
				padding: '11px 14px',
				borderRadius: 10,
				background: '#0A1222',
				border: `1px solid ${ui.border}`,
				fontSize: 18,
				fontWeight: 600,
				lineHeight: 1.4,
				boxSizing: 'border-box',
			}}
		>
			{children}
		</div>
	</div>
);

const Caret: React.FC<{show: boolean}> = ({show}) => {
	const frame = useCurrentFrame();
	return show ? <span style={{display: 'inline-block', width: 2, height: 20, marginLeft: 2, background: brand.yellow, verticalAlign: 'middle', opacity: Math.floor(frame / 8) % 2 ? 0 : 1}} /> : null;
};

export const Creator: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const title = typed(TITLE, frame, 24, 1.2);
	const desc = typed(DESCRIPTION, frame, 84, 2.4);
	const fieldsIn = progress(frame, 58, 14);

	// cursor glides to the button, clicks, then the push runs
	const BTN = {x: 1540, y: 758};
	const move = progress(frame, 132, 34, easeInOut);
	const cursorX = interpolate(move, [0, 1], [1780, BTN.x]);
	const cursorY = interpolate(move, [0, 1], [1040, BTN.y]);
	const pressed = frame >= 168 && frame < 175;
	const push = progress(frame, 172, 30);
	const done = frame >= 204;
	const doneIn = pop(frame, fps, 204, 12);
	const toast = pop(frame, fps, 210, 14);

	return (
		<AbsoluteFill style={{background: `radial-gradient(circle at 70% 40%, #333, ${brand.deep})`}}>
			<Shape kind="q-tr" size={200} color={brand.green} x={-20} y={880} delay={8} />
			<Shape kind="circle" size={80} color={brand.orange} x={560} y={150} delay={14} />
			<Caption
				eyebrow="PRODUCT CREATOR"
				lines={['Build products.', 'Push to Shopify', 'in one click.']}
				accent={2}
				sub="Create listings in real time and sync them straight to your store."
				y={320}
				width={610}
				size={68}
			/>
			<AppWindow x={700} y={140} width={1160} height={790} delay={4} path="/product-creator" sidebar="Product Creator">
				<div style={{padding: 22, height: '100%', boxSizing: 'border-box'}}>
					<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18}}>
						<div style={{fontSize: 26, fontWeight: 800}}>Product Creator</div>
						<Pill color={ui.teal}>● Synced with Shopify</Pill>
					</div>
					<div style={{display: 'flex', gap: 24}}>
						<div style={{width: 320, flexShrink: 0}}>
							<div style={{padding: 14, background: '#fff', borderRadius: 6, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', transform: `scale(${pop(frame, fps, 10, 14)})`}}>
								<Artwork variant={0} width={292} height={370} delay={14} />
							</div>
							<div style={{display: 'flex', gap: 10, marginTop: 16}}>
								{[1, 2, 3].map((v) => (
									<div key={v} style={{borderRadius: 8, overflow: 'hidden', border: `1px solid ${ui.border}`, transform: `scale(${pop(frame, fps, 30 + v * 5, 14)})`}}>
										<Artwork variant={v} width={92} height={92} delay={34 + v * 5} />
									</div>
								))}
							</div>
						</div>
						<div style={{flex: 1, minWidth: 0}}>
							<Field label="Title">
								{title}
								<Caret show={frame < 70} />
							</Field>
							<div style={{display: 'flex', gap: 14, opacity: fieldsIn}}>
								<Field label="Price" style={{flex: 1}}>
									$189.00
								</Field>
								<Field label="Compare at" style={{flex: 1}}>
									<span style={{color: ui.muted, textDecoration: 'line-through'}}>$249.00</span>
								</Field>
							</div>
							<div style={{marginBottom: 16}}>
								<Label style={{marginBottom: 7}}>Sizes</Label>
								<div style={{display: 'flex', gap: 10}}>
									{['30 × 40cm', '50 × 70cm', '70 × 100cm'].map((size, i) => (
										<span key={size} style={{transform: `scale(${pop(frame, fps, 66 + i * 4, 12)})`, display: 'inline-block'}}>
											<Pill color={brand.yellow} style={{fontSize: 16, padding: '7px 14px'}}>
												{size}
											</Pill>
										</span>
									))}
								</div>
							</div>
							<Field label="Description" extra={<Pill color={ui.purple}>✦ Written by AI</Pill>} style={{opacity: progress(frame, 76, 10)}}>
								<div style={{minHeight: 76, fontWeight: 500, color: '#D4DBE8'}}>
									{desc}
									<Caret show={frame >= 84 && desc.length < DESCRIPTION.length} />
								</div>
							</Field>
							<div style={{display: 'flex', gap: 10, marginBottom: 22, opacity: progress(frame, 120, 12)}}>
								<Label style={{alignSelf: 'center', marginRight: 4}}>Collections</Label>
								<Pill color={ui.teal}>Abstract</Pill>
								<Pill color={ui.teal}>Best sellers</Pill>
							</div>
							<div
								style={{
									position: 'relative',
									height: 62,
									borderRadius: 12,
									overflow: 'hidden',
									background: done ? ui.emerald : ui.gold,
									color: done ? '#fff' : '#1B1405',
									fontSize: 21,
									fontWeight: 800,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									transform: `scale(${pressed ? 0.97 : done ? 1 + (1 - doneIn) * 0.06 : 1})`,
								}}
							>
								{push > 0 && !done ? (
									<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${push * 100}%`, background: 'rgba(255,255,255,0.35)'}} />
								) : null}
								<span style={{position: 'relative'}}>{done ? '✓  Live on your store' : push > 0 ? 'Pushing to Shopify…' : 'Push to Shopify'}</span>
							</div>
						</div>
					</div>
				</div>
			</AppWindow>
			{frame >= 128 ? <Cursor x={cursorX} y={cursorY} pressed={pressed} /> : null}
			<div
				style={{
					position: 'absolute',
					right: 90,
					top: 60,
					padding: '18px 26px',
					borderRadius: 16,
					background: '#fff',
					color: brand.charcoal,
					fontFamily: BODY,
					fontSize: 22,
					fontWeight: 700,
					display: 'flex',
					alignItems: 'center',
					gap: 14,
					boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
					opacity: Math.min(1, toast * 1.4),
					transform: `translateY(${interpolate(toast, [0, 1], [-140, 0])}px)`,
				}}
			>
				<span style={{width: 34, height: 34, borderRadius: 17, background: ui.emerald, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20}}>✓</span>
				Published to Shopify · 3 variants synced
			</div>
		</AbsoluteFill>
	);
};
