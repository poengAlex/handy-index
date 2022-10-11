/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $VideoRequest = {
    type: 'all-of',
    contains: [{
    type: 'Entity',
}, {
    properties: {
        requestId: {
    type: 'ULID',
    isRequired: true,
},
        url: {
    type: 'URL',
    isRequired: true,
},
        externalRef: {
    type: 'string',
},
        domain: {
    type: 'string',
    isRequired: true,
},
        status: {
    type: 'VideoRequestStatus',
    isRequired: true,
},
        votes: {
    type: 'number',
    isRequired: true,
},
        partnerId: {
    type: 'ULID',
},
        partnerName: {
    type: 'string',
},
        title: {
    type: 'VideoTitle',
},
        description: {
    type: 'VideoDescription',
},
        duration: {
    type: 'number',
},
        tags: {
    type: 'array',
    contains: {
    type: 'string',
},
},
        images: {
    type: 'array',
    contains: {
    type: 'string',
},
},
        thumbnail: {
    type: 'string',
},
        views: {
    type: 'number',
    description: `Video views information from/within the partner video site.`,
},
        rating: {
    type: 'Rating',
    description: `Video rating information from/within the partner video site.`,
},
        upVotes: {
    type: 'number',
    description: `Video upVotes/likes information from/within the partner video site.`,
},
        downVotes: {
    type: 'number',
    description: `Video downVotes/dislikes information from/within the partner video site.`,
},
        partnerPerformers: {
    type: 'array',
    contains: {
        type: 'PerformerData',
    },
},
        performers: {
    type: 'array',
    contains: {
        type: 'Performer',
    },
},
    },
}],
} as const;
