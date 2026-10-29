import React from 'react';
import {AbsoluteFill, Html5Audio, staticFile} from 'remotion';
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
import {FPS, brand} from './theme';

const T = 18; // transition length in frames (30 frames = 1 second)

// The voiceover (public/voiceover.mp3) sets the pace. Each scene is listed with the second its
// line starts in the voiceover, and takes over just before that line so the picture leads the words.
const VOICE_END = 72.34; // seconds
const LEAD = 0.3; // seconds
const HOLD = 0.5; // seconds on the end card after the voice stops

type Presentation = TransitionPresentation<Record<string, unknown>>;

// Each scene, when its line starts in the voiceover, and how it takes over from the one before
const SCENES: [React.FC, number, Presentation?][] = [
	[Hook, 0],
	[Intro, 7.02, wipe({direction: 'from-left'}) as Presentation],
	[Overview, 11.26, slide({direction: 'from-right'}) as Presentation],
	[ProfitCheck, 17.92, slide({direction: 'from-bottom'}) as Presentation],
	[Brain, 25.5, wipe({direction: 'from-right'}) as Presentation],
	[Attribution, 33.08, slide({direction: 'from-right'}) as Presentation],
	[Products, 40.0, wipe({direction: 'from-right'}) as Presentation],
	[Creator, 44.28, slide({direction: 'from-bottom'}) as Presentation],
	[Creatives, 49.42, wipe({direction: 'from-left'}) as Presentation],
	[Pocket, 54.48, fade() as Presentation],
	[Story, 59.88, slide({direction: 'from-right'}) as Presentation],
	[Cta, 66.28, wipe({direction: 'from-bottom-left'}) as Presentation],
];

export const VIDEO_FRAMES = Math.round((VOICE_END + HOLD) * FPS);

// Where each scene starts in the finished video, and so how long each one runs
// (it overlaps the next scene by the length of the transition)
export const SCENE_STARTS = SCENES.map(([, cue], i) => (i === 0 ? 0 : Math.round((cue - LEAD) * FPS)));
const durations = SCENE_STARTS.map((start, i) =>
	i < SCENES.length - 1 ? SCENE_STARTS[i + 1] - start + T : VIDEO_FRAMES - start,
);

export const Video: React.FC = () => (
	<AbsoluteFill style={{background: brand.deep}}>
		<TransitionSeries>
			{SCENES.map(([Scene, , presentation], i) => (
				<React.Fragment key={i}>
					{presentation ? (
						<TransitionSeries.Transition presentation={presentation} timing={linearTiming({durationInFrames: T})} />
					) : null}
					<TransitionSeries.Sequence durationInFrames={durations[i]}>
						<Scene />
					</TransitionSeries.Sequence>
				</React.Fragment>
			))}
		</TransitionSeries>
		<Html5Audio src={staticFile('voiceover.mp3')} />
	</AbsoluteFill>
);
