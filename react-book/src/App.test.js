import * as React from 'react'
import {storiesReducer,} from './App';


const storyOne = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
};

const storyTwo = {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
};

const stories = [storyOne, storyTwo];

describe('storiesReducer', () => {
    test('removes a story from all stories', () => {
        const action = {type: 'REMOVE_STORY', payload: storyOne}
        const state = {data: stories, isLoading: false, isError: false}

        const newState = storiesReducer(state, action);
        const expectedState = {
            data: [storyTwo],
            isLoading: false,
            isError: false
        }

        expect(newState).toStrictEqual(expectedState);
    })

    test('starts the fetching of stories', () => {
        const action = {type: 'STORIES_FETCH_INIT'}
        const state = {data: [], isLoading: false, isError: false}

        const newState = storiesReducer(state, action)

        const expectedState = {
            data: [],
            isLoading: true,
            isError: false
        }
        expect(newState).toStrictEqual(expectedState)
    })

    test('completes the fetching of stories', () => {

        const action = {type: 'STORIES_FETCH_SUCCESS', payload: stories}
        const state = {data: [], isLoading: false, isError: false}

        const newState = storiesReducer(state, action)

        const expectedState = {
            data: stories,
            isLoading: false,
            isError: false
        }
        expect(newState).toStrictEqual(expectedState)
    })

    test('fails the fetching of stories', () => {

        const action = {type: 'STORIES_FETCH_FAILURE'}
        const state = {data: [], isLoading: false, isError: false}

        const newState = storiesReducer(state, action)

        const expectedState = {
            data: [],
            isLoading: false,
            isError: true
        }
        expect(newState).toStrictEqual(expectedState)
    })

})