/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ULID } from './ULID';
import type { URL } from './URL';
import type { VideoRequestStatus } from './VideoRequestStatus';

export type VideoRequest = {
    requestId: ULID;
    url: URL;
    externalRef?: string;
    domain: string;
    status: VideoRequestStatus;
    votes: number;
};
