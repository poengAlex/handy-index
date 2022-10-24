/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Performer = {
    properties: {
        performerId: {
    type: 'ULID',
    isRequired: true,
},
        name: {
    type: 'string',
    isRequired: true,
},
        description: {
    type: 'string',
},
        age: {
    type: 'number',
},
        careerStatus: {
    type: 'string',
},
        careerStart: {
    type: 'string',
},
        careerEnd: {
    type: 'string',
},
        fakeBoobs: {
    type: 'string',
},
        starSign: {
    type: 'string',
},
        hobbies: {
    type: 'string',
},
        relationshipStatus: {
    type: 'string',
},
        interestedIn: {
    type: 'string',
},
        dateOfBirth: {
    type: 'string',
},
        measurements: {
    type: 'string',
},
        piercings: {
    type: 'string',
},
        tattoos: {
    type: 'string',
},
        country: {
    type: 'string',
},
        hair: {
    type: 'string',
},
        eyes: {
    type: 'string',
},
        ethnicity: {
    type: 'string',
},
        height: {
    type: 'string',
},
        weight: {
    type: 'string',
},
        gender: {
    type: 'string',
},
        turnOns: {
    type: 'string',
},
        turnOffs: {
    type: 'string',
},
        profileViews: {
    type: 'number',
},
        videoViews: {
    type: 'number',
},
        some: {
    type: 'array',
    contains: {
        type: 'SomeRef',
    },
},
        avatar: {
    type: 'string',
},
        images: {
    type: 'array',
    contains: {
    type: 'string',
},
},
    },
} as const;
