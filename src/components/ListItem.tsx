import React from 'react';
import '../styles/scss/_ListItem.scss';
import DeleteIcon from '@material-ui/icons/Delete';
import {withStyles} from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors";
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';

const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

function ListItem(props: any) {
    const items = props.items;
    const listItems = items.map((item: any)=> {
        if(item.text.text) {
        return <div className="list" key={item.key}>
            <p>
                <GreenCheckbox checked={item.text.completed} onChange={() => props.handleStatusChange(item.text.key, item.key)} name="checkedG" />
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
            props.deleteItem(item.key);
            setTimeout(() => {
                alert('Empty field removed!');
            }, 200);
        }
    });
    return(
        <div className="lists" id="lists">{listItems}</div>
    );
}

export default ListItem;
