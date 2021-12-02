import * as React from 'react'
import {Item, SearchForm, storiesReducer} from './App';
import {fireEvent, render, screen} from "@testing-library/react";
import '@testing-library/jest-dom'


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

describe('Item', () => {
    test('renders all properties', () => {
        render(<Item item={storyOne}/>)

        expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
        expect(screen.getByText('React')).toHaveAttribute('href', 'https://reactjs.org/')


    })

    test('renders a clickable dismiss button', () => {
        render(<Item item={storyOne}/>)

        expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('clicking the dismiss button calls the callback handler', () => {
        const handlerRemoveItem = jest.fn();

        render(<Item item={storyOne} onRemoveItem={handlerRemoveItem}/>)

        fireEvent.click(screen.getByRole('button'))

        expect(handlerRemoveItem).toHaveBeenCalledTimes(1)
    })
})

describe('Search Form', () => {
    const searchFormProps = {
        searchTerm: 'React',
        onSearchInput: jest.fn(),
        onSearchSubmit: jest.fn(),
    }

    test('renders the input field with its value', () => {
        render(<SearchForm {...searchFormProps}/>)

        expect(screen.getByDisplayValue('React')).toBeInTheDocument()
    })

    test('renders the correct label', () => {
        render(<SearchForm  {...searchFormProps}/>);

        expect (screen.getByLabelText(/Search/)).toBeInTheDocument()
    })

    test('calls onSearchInput on input field change', () => {
        render(<SearchForm {...searchFormProps}/>)

        fireEvent.change(screen.getByDisplayValue('React'), {
            target: {value: 'Redux'},
        });

        expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1)
    });

    test('calls onSearchSubmit on button submit click', () => {
        render(<SearchForm {...searchFormProps} />);
        fireEvent.submit(screen.getByRole('button'));
        expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
    })
})
