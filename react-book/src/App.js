import * as React from 'react'


const App = () => {
    console.log("app")

    const stories = [
        {
            title: "React",
            url: "https://reactjs.org/",
            author: "Jordan Walke",
            um_comments: 3,
            points: 4,
            objectID: 0,
        },
        {
            title: "Redux",
            url: "https://redux.js.org/",
            author: "Dan Abramov, Andrew Clark",
            num_comments: 2,
            points: 5,
            objectID: 1,
        }
    ]

    return (
        <div>
            <h1>My Hacker Stories</h1>

            <Search/>

            <hr/>

            <List list={stories}/>
        </div>
    );
}


const Search = () => {
    console.log("search")

    const [searchTerm, setSearchTerm] = React.useState('');

    const handleChange = (event) => {
        setSearchTerm(event.target.value)
    }

    return (
        <div>
            <label htmlFor="search">Search: </label>
            <input id="search" type="text" onChange={handleChange}/>
        </div>
    )
}


const List = (props) => {
    console.log("list")
    return (
        <ul>
            {props.list.map((item) => (
                    <Item key={item.objectID} item={item}/>
                )
            )}
        </ul>
    )
}

const Item = (props) => {
    console.log("item")
    return (
        <li>
        <span>
           <a href={props.item.url}>{props.item.title}</a>
        </span>
            <span>{props.item.author}</span>
            <span>{props.item.num_comments}</span>
            <span>{props.item.points}</span>
        </li>
    )
}


export default App;


