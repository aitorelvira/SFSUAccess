import React from 'react';
import axios from 'axios';
import '../css/Home.css';


class Search extends React.Component {
    state = {
        lists: [],
        selected: '',
        searchItem: '',
    };

    componentDidMount() {
        axios.get('/api/search')
            .then(response => {
                console.log(response.data);
               this.setState({lists: response.data});
               
            })
    }

    handleClick = (e) => {
        console.log('Click happened');
        let select = document.getElementById("category");
        let index = select.selectedIndex;
        let userSelection = select.options[index].value;
        console.log(userSelection);
        console.log(this.state.searchItem);
      }


      handleChange(e){
          this.setState({searchItem: e.target.value})
      }

    render() {
        return (
            <div id ="nav-text">
                <label>Choose a category:</label>&nbsp;&nbsp;
                <select id="category">
                {this.state.lists.map((x) => {
                    return (
                        <option value={x.product_category_name} key={x.product_category_name}>{x.product_category_name}</option>
                    )
                })}
                </select>&nbsp;&nbsp;&nbsp;&nbsp;
                <input id ="searchItem" placeholder="Search" onChange={(e)=>this.setState({searchItem: e.target.value})} />&nbsp;&nbsp;&nbsp;
                <Button variant="warning" onClick = {this.handleClick}>Search</Button>
                
            
            </div>
        );
    }
}

export default Search;