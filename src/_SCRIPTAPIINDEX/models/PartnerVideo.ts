/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Entity } from './Entity';
import type { ExternalId } from './ExternalId';
import type { PartnerVideoAccessType } from './PartnerVideoAccessType';
import type { PartnerVideoScriptAccessIndicator } from './PartnerVideoScriptAccessIndicator';
import type { ULID } from './ULID';
import type { URL } from './URL';
import type { VideoDescription } from './VideoDescription';
import type { VideoFormat } from './VideoFormat';
import type { VideoTitle } from './VideoTitle';

export type PartnerVideo = (Entity & {
partnerVideoId: ULID;
partnerId: ULID;
partnerName?: string;
title?: VideoTitle;
description?: VideoDescription;
externalRef?: ExternalId;
/**
 * Optional URL to where the video can be found in the partner site.
 */
videoUrl?: URL;
duration?: number;
format?: VideoFormat;
tags?: Array<string>;
images?: Array<string>;
thumbnail?: string;
gifs?: Array<string>;
videoAccess?: PartnerVideoAccessType;
scriptAccess?: PartnerVideoScriptAccessIndicator;
});
