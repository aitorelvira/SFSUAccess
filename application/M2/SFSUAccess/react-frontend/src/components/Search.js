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
        axios.get('/api/search')
            .then(response => {
                console.log(response.data);
                this.setState({lists: response.data})
            })
    }

    render() {
        return (
            <div>
                <div>
                    Search component
                </div>
                <label htmlFor="cars">Choose a category:</label>
                <select id="cars">
                {this.state.lists.map((x) => {
                    return (
                        <option value="">{x.product_category_name}</option>
                    )
                })}
                </select>
            </div>
        );
    }
}

export default Search;