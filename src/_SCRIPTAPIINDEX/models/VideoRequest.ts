/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Entity } from './Entity';
import type { Performer } from './Performer';
import type { PerformerData } from './PerformerData';
import type { Rating } from './Rating';
import type { ULID } from './ULID';
import type { URL } from './URL';
import type { VideoDescription } from './VideoDescription';
import type { VideoRequestStatus } from './VideoRequestStatus';
import type { VideoTitle } from './VideoTitle';

export type VideoRequest = (Entity & {
requestId: ULID;
url: URL;
externalRef?: string;
domain: string;
status: VideoRequestStatus;
votes: number;
partnerId?: ULID;
partnerName?: string;
title?: VideoTitle;
description?: VideoDescription;
duration?: number;
tags?: Array<string>;
images?: Array<string>;
thumbnail?: string;
/**
 * Video views information from/within the partner video site.
 */
views?: number;
/**
 * Video rating information from/within the partner video site.
 */
rating?: Rating;
/**
 * Video upVotes/likes information from/within the partner video site.
 */
upVotes?: number;
/**
 * Video downVotes/dislikes information from/within the partner video site.
 */
downVotes?: number;
/**
 * Performer information from/within the partner video site.
 */
partnerPerformers?: Array<PerformerData>;
/**
 * Performer information from/within the index service.
 */
performers?: Array<Performer>;
});
