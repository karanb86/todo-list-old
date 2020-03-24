import React from 'react';
import '../styles/scss/_ListItem.scss';
import DeleteIcon from '@material-ui/icons/Delete';

function ListItem(props: any) {
    const items = props.items;
    const listItems = items.map((item: any)=> {
        if(item.text.text) {
        return <div className="list" key={item.key}>
            <p>
                <input type="text"
                       id='{item.text.key}'
                       value={item.text.text}
                       onChange = {
                           (e) => {
                               props.setUpdate(e.target.value, item.text.key, item.key);
                           }
                       }/>
                <span><DeleteIcon className="delete" onClick={() => props.deleteItem(item.key)}/></span></p>
        </div>
    }
        else {
            props.deleteItem(item.key)
        }
    });
    return(
        <div>{listItems}</div>
    );
}

export default ListItem;
