/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $VideoRequestVote = {
    properties: {
        voteId: {
    type: 'ULID',
    isRequired: true,
},
        requestId: {
    type: 'ULID',
    isRequired: true,
},
        vote: {
    type: 'VideoRequestVoteValue',
    isRequired: true,
},
    },
} as const;
