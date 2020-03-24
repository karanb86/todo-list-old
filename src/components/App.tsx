import React from 'react';
import '../styles/scss/_App.scss';
import ListItem from './ListItem'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Divider from '@material-ui/core/Divider';
import fire from "../firebase";

class App extends React.Component<{}, { items: any, currentItem: { text: string, key: number } }> {
  constructor(props: any) {
    super(props);
    this.state = {
      items: [],
      currentItem: {
        text: '',
        key: 0
      }
    };
    this.handleInput = this.handleInput.bind(this);
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.setUpdate = this.setUpdate.bind(this);
  }

  componentWillMount(){
    /* Create reference to messages in Firebase Database */
    let itemsRef = fire.database().ref('items').orderByKey().limitToFirst(100);
    itemsRef.on('child_added', snapshot => {
      /* Update React state when message is added at Firebase Database */
      let item = { text: snapshot.val(), key: snapshot.key };
      this.setState({ items: [item].concat(this.state.items) });
    })
  }

  handleInput(e: any) {
    this.setState({
      currentItem: {
        text: e.target.value,
        key: Date.now()
      }
    })
  }

  addItem(e: any) {
    e.preventDefault();
    const newItem = this.state.currentItem;
    if (newItem.text !== '') {
      const newItems = [...this.state.items, newItem];
      this.setState({
        items: newItems,
        currentItem: {
          text: '',
          key: 0
        }
      });
      fire.database().ref('items').push( newItem );
    }
  }

  deleteItem(key: number) {
    const filteredItems = this.state.items.filter((item:{ text: string, key: number } ) =>
        item.key !==key);
    this.setState({
      items: filteredItems
    });
    const fireRef = fire.database().ref(`items/${key}`);
    fireRef.remove().catch();
  }

  setUpdate(text: string, key: number, id: any) {
    const items = this.state.items;
    items.map((item: any) => {
      if(item.text.key === key) {
        item.text.text = text;
      }
      this.setState({
        items: items
      });
    });
    const fireRef = fire.database().ref(`items/${id}`);
    fireRef.update({text: text}).catch();
  }

  render() {
    return (
        <div className="App">
          <header>
            <form id="to-do-form" onSubmit={this.addItem}>
              <input type="text" placeholder="What needs to be done..."
                     value={this.state.currentItem.text}
                     onChange={this.handleInput}/>
            </form>
          </header>
          <ListItem className='list-item' items={this.state.items}
                    deleteItem={this.deleteItem}
                    setUpdate={this.setUpdate} />

          <div className="footer">
            <Divider />
            <p>
              <span>Check All</span>
              <span>{this.state.items.length} items left</span>
            </p>
            <Divider />
          </div>

          <div className="footer-ex">
            <ButtonGroup color="primary" aria-label="outlined primary button group">
              <Button>All</Button>
              <Button>Active</Button>
              <Button>Completed</Button>
            </ButtonGroup>
          </div>
        </div>
    );
  }
}
export default App;
