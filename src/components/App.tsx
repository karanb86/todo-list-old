import React from 'react';
import '../styles/scss/_App.scss';
import ListItem from './ListItem'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Divider from '@material-ui/core/Divider';
import fire from "../firebase";
import {withStyles} from "@material-ui/core/styles";
import {grey} from "@material-ui/core/colors";
import Checkbox, {CheckboxProps} from "@material-ui/core/Checkbox";

class App extends React.Component<{}, { items: any, originalItems: any, currentItem: { text: string, key: number,  completed: boolean }, itemsStatus: string }> {
  constructor(props: any) {
    super(props);
    this.state = {
      items: [],
      originalItems: [],
      currentItem: {
        text: '',
        key: 0,
        completed: false
      },
      itemsStatus: 'All'
    };

    this.handleInput = this.handleInput.bind(this);
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.setUpdate = this.setUpdate.bind(this);
    this.onGetAll = this.onGetAll.bind(this);
    this.onGetActive = this.onGetActive.bind(this);
    this.onGetCompleted = this.onGetCompleted.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  GreenCheckbox = withStyles({
    root: {
      color: grey[900],
      '&$checked': {
        color: grey[900],
      },
    },
    checked: {},
  })((props: CheckboxProps) => <Checkbox color="default" {...props} />);

  // duplicateList = this.state.items;

  componentWillMount() {
    /* Create reference to messages in Firebase Database */
    let itemsRef = fire.database().ref('items').orderByKey().limitToFirst(100);
    itemsRef.on('child_added', snapshot => {
      /* Update React state when message is added at Firebase Database */
      let item = { text: snapshot.val(), key: snapshot.key };
      this.setState({ items: [item].concat(this.state.items), originalItems: [item].concat(this.state.items) });
    })
    // console.log(this.duplicateList)
  }

  handleInput(e: any) {
    this.setState({
      currentItem: {
        text: e.target.value,
        key: Date.now(),
        completed: false
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
          key: 0,
          completed: false
        },
        originalItems: newItems
      });
      fire.database().ref('items').push( newItem );
    }
    console.log(this.state.originalItems);
  }

  deleteItem(key: number) {
    const filteredItems = this.state.items.filter((item:{ text: string, key: number } ) =>
        item.key !==key);
    this.setState({
      items: filteredItems,
      originalItems: filteredItems
    });
    setTimeout(() => {
      alert('Task Deleted!');
    }, 200);
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
        items: items,
        originalItems: items
      });
    });
    const fireRef = fire.database().ref(`items/${id}`);
    fireRef.update({text: text}).catch();
  }

  onGetAll() {
    // console.log('reached all');
    this.setState({
      items: this.state.originalItems,
      itemsStatus: 'All'
    });
  }
  onGetActive() {
    // console.log('reached active');

    const items = this.state.originalItems.filter((item: any ) =>
        item.text.completed === false
    );
    this.setState({
      items: items,
      itemsStatus: 'Active'
    });
  }
  onGetCompleted() {
    // console.log('reached completed');

    const items = this.state.originalItems.filter((item: any ) =>
      item.text.completed === true
    );
    this.setState({
      items: items,
      itemsStatus: 'Completed'
    });
  }

  handleStatusChange(key: number, id: any) {
    const items = this.state.items;
    // console.log('items:', items)
    // console.log('key:', key)
    // console.log('id:', id)
    let completedStatus = '';
    items.map((item: any) => {
      if(item.text.key === key) {
        console.log(item);
        console.log(item.text.checked);
        item.text.completed = !item.text.completed;
        completedStatus = item.text.completed;
      }
      this.setState({
        items: items
      });
    });
    const fireRef = fire.database().ref(`items/${id}`);
    fireRef.update({completed: completedStatus}).catch();
    setTimeout(() => {
      alert('Status Changed!');
    }, 200);
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
          <div className="status">
            <span>{this.state.itemsStatus} tasks:</span>
          </div>
          <ListItem className='list-item' items={this.state.items}
                    deleteItem={this.deleteItem}
                    setUpdate={this.setUpdate}
                    handleStatusChange={this.handleStatusChange}/>
          </header>
          <div className="footer">
            <Divider />
            <p>

              {/*<span>*/}
              {/*  <this.GreenCheckbox  name="checkedG" />*/}
              {/*  Check All</span>*/}
              <span>({this.state.items.length}) items left</span>
            </p>
            <Divider />
            <div className="footer-ex">
              <ButtonGroup color="primary" aria-label="outlined primary button group">
                <Button onClick={this.onGetAll}>All</Button>
                <Button onClick={this.onGetActive}>Active</Button>
                <Button onClick={this.onGetCompleted}>Completed</Button>
              </ButtonGroup>
            </div>
          </div>


        </div>
    );
  }
}
export default App;
