import React from 'react';
import {Composition} from 'remotion';
import {FPS, HEIGHT, WIDTH} from './theme';
import {Poster, POSTER_FRAME} from './scenes/Poster';
import {Video, VIDEO_FRAMES} from './Video';

export const Root: React.FC = () => (
	<>
		<Composition id="InhausApp" component={Video} durationInFrames={VIDEO_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
		<Composition id="Poster" component={Poster} durationInFrames={POSTER_FRAME + 1} fps={FPS} width={WIDTH} height={HEIGHT} />
	</>
);
