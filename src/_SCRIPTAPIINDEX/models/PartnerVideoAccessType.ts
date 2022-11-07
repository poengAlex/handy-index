/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export enum PartnerVideoAccessType {
    /**
     * A premium subscription is required to view the video.
     */
    PREMIUM = 'premium',
    /**
     * Special permission needed to view the video.
     */
    PRIVATE = 'private',
    /**
     * Anyone can watch the video. No additional actions are required.
     */
    PUBLIC = 'public',
    /**
     * Only people who know the URL to the video can access it.
     */
    UNLISTED = 'ùnlisted',
    /**
     * Only members can watch the video. Signup/membership required.
     */
    MEMBER = 'member',
}
