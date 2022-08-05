// eslint-disable-next-line no-unused-vars
import React, { createContext } from 'react';

export const initalState = {
    familyData: { familyStatus: -1 } // familyStatus 开通为2，未开通为0
};
export function reducer (state, data) {
    return { ...state, ...data };
}
export const SERVICE_CONTEXT = createContext(null);
