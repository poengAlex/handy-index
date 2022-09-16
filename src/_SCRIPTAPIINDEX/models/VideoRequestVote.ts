/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ULID } from './ULID';
import type { VideoRequestVoteValue } from './VideoRequestVoteValue';

export type VideoRequestVote = {
    voteId: ULID;
    requestId: ULID;
    vote: VideoRequestVoteValue;
};
