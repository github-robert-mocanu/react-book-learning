import * as React from 'react'
import axios from 'axios'
import './App.css'
import {ReactComponent as Check} from './check.svg'

const useSemiPersistentState = (key: string, initialState: string): [string, (newValue: string) => void] => {
    const isMounted = React.useRef(false)

    const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

    React.useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
        } else {
            localStorage.setItem(key, value)
        }
    }, [value, key]);

    return [value, setValue];

}

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='

type StoriesState = {
    data: Stories;
    isLoading: boolean;
    isError: boolean;
};

interface StoriesFetchInitAction {
    type: 'STORIES_FETCH_INIT';
}
interface StoriesFetchSuccessAction {
    type: 'STORIES_FETCH_SUCCESS';
    payload: Stories;
}
interface StoriesFetchFailureAction {
    type: 'STORIES_FETCH_FAILURE';
}
interface StoriesRemoveAction {
    type: 'REMOVE_STORY';
    payload: Story;
}
type StoriesAction =
    | StoriesFetchInitAction
    | StoriesFetchSuccessAction
    | StoriesFetchFailureAction
    | StoriesRemoveAction;

const storiesReducer = (state: StoriesState, action: StoriesAction) => {
    switch (action.type) {
        case 'STORIES_FETCH_INIT':
            return {...state, isLoading: true, isError: false};

        case 'STORIES_FETCH_SUCCESS':
            return {...state, isLoading: false, isError: false, data: action.payload }

        case 'STORIES_FETCH_FAILURE':
            return {...state, isLoading: false, isError: true}

        case 'REMOVE_STORY':
            return {...state,
                data: state.data.filter(story => action.payload.objectID !== story.objectID)}

        default:
            throw new Error()
    }
}

const getSumComments = (stories: any) => {
    console.log('C')

    return stories.data.reduce(
        (result: number, value: any) => result + value.num_comments, 0
    )
}
type Story = {
    objectID: string;
    url: string;
    title: string;
    author: string;
    num_comments: number;
    points: number;
}

type Stories = Array<Story>

type ItemProps = {
    item: Story;
    onRemoveItem: (item:Story) =>void
}

type ListProps = {
    list: Stories;
    onRemoveItem: (item:Story) => void;
}

const App = () => {
    console.log('B:App')

    const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React')
    const [stories, dispatchStories] = React.useReducer(storiesReducer, {data: [], isLoading: false, isError: false})
    const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`)

    const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setUrl(`${API_ENDPOINT}${searchTerm}`)
        event.preventDefault()
    }

    const handleFetchStories=React.useCallback(async () => {
        dispatchStories({ type: 'STORIES_FETCH_INIT' })

        try {
            const result = await axios.get(url)

            dispatchStories({type: 'STORIES_FETCH_SUCCESS', payload: result.data.hits})
        } catch {
            dispatchStories({type: 'STORIES_FETCH_FAILURE'})
        }
    }, [url])

    React.useEffect(() => {
        handleFetchStories()
    }, [handleFetchStories])

    const handleRemoveStory = React.useCallback((item: Story) => {
        dispatchStories({type: 'REMOVE_STORY', payload: item})
    }, [])

    const sumComments = React.useMemo(() => getSumComments(stories), [stories])

    return (
        <div className={"container"}>
            <h1 className={"headline-primary"}>My Hacker Stories with {sumComments} comments</h1>

            <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit}/>

            {stories.isError && <p>Something went wrong...</p>}

            {stories.isLoading ? (
                <p>Loading...</p>
            ) : (
                <List list={stories.data} onRemoveItem={handleRemoveStory}/>
            )}
        </div>
    );
}

type InputWithLabelProps = {
    id: string;
    value: string;
    type?: string;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isFocused?: boolean;
    children: React.ReactNode;
};


const InputWithLabel = ({id, children, value, type = "text", isFocused, onInputChange}: InputWithLabelProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null!)

    React.useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isFocused])

    return (
        <>
            <label className={"label"} htmlFor={id}>{children} </label>
            &nbsp;
            <input className={"input"} ref={inputRef} id={id} type={type} value={value} autoFocus={isFocused} onChange={onInputChange}/>
        </>
    )
}


const List = React.memo(({list, onRemoveItem}: ListProps) => {
        console.log('B:List')

        return (
            <ul>
                {list.map((item) => (
                        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}/>
                    )
                )}
            </ul>
        )
    }
)


const Item = ({item, onRemoveItem}: ItemProps) => {

    return (
        <li className={"item"}>
        <span style={{width: '40%'}}>
           <a href={item.url}>{item.title}</a>
        </span>
            <span style={{width: '30%'}}>{item.author}</span>
            <span style={{width: '10%'}}>{item.num_comments}</span>
            <span style={{width: '10%'}}>{item.points}</span>
            <span style={{width: '10%'}}>
                <button className={"button button-small"} type="button" onClick={() => onRemoveItem(item)}>
                    {/*<Check height={"18 px"} width={"18px"} />*/}
                    Dismiss
                </button>
            </span>
        </li>
    )
}


type SearchFormProps = {
    searchTerm: string;
    onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const SearchForm = ({searchTerm, onSearchInput, onSearchSubmit}: SearchFormProps) => (
    <form className={"search-form"} onSubmit={onSearchSubmit}>
        <InputWithLabel id="search" value={searchTerm} onInputChange={onSearchInput} isFocused>
            <strong>Search:</strong>
        </InputWithLabel>

        <button className={"button button_large"} type={"submit"} disabled={!searchTerm}>
            Submit
        </button>
    </form>

)


export default App;
export {storiesReducer, SearchForm, InputWithLabel, List, Item}

