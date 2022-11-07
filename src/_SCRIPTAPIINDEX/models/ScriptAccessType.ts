/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export enum ScriptAccessType {
    /**
     * A premium subscription is required to play the script/download token.
     */
    PREMIUM = 'premium',
    /**
     * Special permission needed to play the script/download token.
     */
    PRIVATE = 'private',
    /**
     * Anyone can play the script/download token.
     */
    PUBLIC = 'public',
    /**
     * Only members can play the script/download token. Signup/membership is required.
     */
    MEMBER = 'member',
}
