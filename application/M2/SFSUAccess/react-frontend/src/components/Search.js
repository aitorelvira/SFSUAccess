import React from 'react'
import axios from 'axios'

class Search extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            lists: []
        }
    }

    componentDidMount() {
        axios.get('/search')
            .then(response => {
                console.log(response.data);
                this.setState({lists: response.data})
            })
    }

    render() {
        return (
            <div>
                <div>
                    Search test
                </div>
                {this.state.lists.map((x) => {
                    return (<div>
                        <p>First: {x.first_name}, Gender: {x.gender} , Last: {x.last_name}</p>
                    </div>)
                })}
            </div>
        );
    }
}

export default Search;