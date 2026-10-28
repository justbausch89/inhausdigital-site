import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming, type TransitionPresentation} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {Attribution} from './scenes/Attribution';
import {Brain} from './scenes/Brain';
import {Creatives} from './scenes/Creatives';
import {Creator} from './scenes/Creator';
import {Cta} from './scenes/Cta';
import {Hook} from './scenes/Hook';
import {Intro} from './scenes/Intro';
import {Overview} from './scenes/Overview';
import {Pocket} from './scenes/Pocket';
import {Products} from './scenes/Products';
import {ProfitCheck} from './scenes/ProfitCheck';
import {Story} from './scenes/Story';
import {brand} from './theme';

const T = 18; // transition length in frames

type Presentation = TransitionPresentation<Record<string, unknown>>;

// Each scene, how long it runs (30 frames = 1 second) and how it takes over from the one before
const SCENES: [React.FC, number, Presentation?][] = [
	[Hook, 240],
	[Intro, 120, wipe({direction: 'from-left'}) as Presentation],
	[Overview, 250, slide({direction: 'from-right'}) as Presentation],
	[ProfitCheck, 270, slide({direction: 'from-bottom'}) as Presentation],
	[Brain, 270, wipe({direction: 'from-right'}) as Presentation],
	[Attribution, 240, slide({direction: 'from-right'}) as Presentation],
	[Products, 180, wipe({direction: 'from-right'}) as Presentation],
	[Creator, 240, slide({direction: 'from-bottom'}) as Presentation],
	[Creatives, 180, wipe({direction: 'from-left'}) as Presentation],
	[Pocket, 220, fade() as Presentation],
	[Story, 220, slide({direction: 'from-right'}) as Presentation],
	[Cta, 170, wipe({direction: 'from-bottom-left'}) as Presentation],
];

export const VIDEO_FRAMES = SCENES.reduce((sum, [, d]) => sum + d, 0) - T * (SCENES.length - 1);

// Where each scene starts in the finished video, handy for picking review frames
export const SCENE_STARTS = SCENES.map((_, i) => SCENES.slice(0, i).reduce((sum, [, d]) => sum + d - T, 0));

export const Video: React.FC = () => (
	<AbsoluteFill style={{background: brand.deep}}>
		<TransitionSeries>
			{SCENES.map(([Scene, duration, presentation], i) => (
				<React.Fragment key={i}>
					{presentation ? (
						<TransitionSeries.Transition presentation={presentation} timing={linearTiming({durationInFrames: T})} />
					) : null}
					<TransitionSeries.Sequence durationInFrames={duration}>
						<Scene />
					</TransitionSeries.Sequence>
				</React.Fragment>
			))}
		</TransitionSeries>
	</AbsoluteFill>
);
