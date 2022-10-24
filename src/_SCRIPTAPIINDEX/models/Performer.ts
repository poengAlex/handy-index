/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SomeRef } from './SomeRef';
import type { ULID } from './ULID';

export type Performer = {
    performerId: ULID;
    name: string;
    description?: string;
    age?: number;
    careerStatus?: string;
    careerStart?: string;
    careerEnd?: string;
    fakeBoobs?: string;
    starSign?: string;
    hobbies?: string;
    relationshipStatus?: string;
    interestedIn?: string;
    dateOfBirth?: string;
    measurements?: string;
    piercings?: string;
    tattoos?: string;
    country?: string;
    hair?: string;
    eyes?: string;
    ethnicity?: string;
    height?: string;
    weight?: string;
    gender?: string;
    turnOns?: string;
    turnOffs?: string;
    profileViews?: number;
    videoViews?: number;
    some?: Array<SomeRef>;
    avatar?: string;
    images?: Array<string>;
};
