/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export enum PartnerAccessType {
    /**
     * A premium subscription is required to access the partner.
     */
    PREMIUM = 'premium',
    /**
     * Special permission needed to access the partner.
     */
    PRIVATE = 'private',
    /**
     * Anyone can access the partner.
     */
    PUBLIC = 'public',
    /**
     * Only members can access the partner. Signup/membership is required.
     */
    MEMBER = 'member',
}
