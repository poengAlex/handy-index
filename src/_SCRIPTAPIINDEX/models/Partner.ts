/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PartnerAccessType } from './PartnerAccessType';
import type { ULID } from './ULID';

export type Partner = {
    partnerId: ULID;
    name: string;
    description?: string;
    tags?: Array<string>;
    access?: PartnerAccessType;
};
