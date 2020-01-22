import React from "react";
import {useDrag, useDrop} from "react-dnd";
import ItemTypes from "../ItemTypes";
import './Card.css';
import TextField from '@material-ui/core/TextField';

const Card = ({id, text, moveCard, findCard, deleteCard, processingOptions, updateCard}) => {
    const originalIndex = findCard(id).index;
    const [{isDragging}, drag] = useDrag({
        item: {type: ItemTypes.CARD, id, originalIndex},
        collect: monitor => ({
            isDragging: monitor.isDragging()
        }),
        end: (dropResult, monitor) => {
            const {id: droppedId, originalIndex} = monitor.getItem();
            const didDrop = monitor.didDrop();
            if (!didDrop) {
                moveCard(droppedId, originalIndex);
            }
        }
    });
    const [, drop] = useDrop({
        accept: ItemTypes.CARD,
        canDrop: () => false,
        hover({id: draggedId}) {
            if (draggedId !== id) {
                const {index: overIndex} = findCard(id);
                moveCard(draggedId, overIndex);
            }
        }
    });
    const opacity = isDragging ? 0 : 1;
    return (
        <div
            ref={node => drag(drop(node))}
            style={{opacity}}
            className={'card'}
        >
            {text}
            <span
                className={'delete-button'}
                onClick={() => {
                    deleteCard(id);
                }}>
                <p
                    className="fa fa-trash"
                ></p>
            </span>
            <br/>
            <div
                className={"hello"}
            >
                {Object.keys(processingOptions).map((option) => {
                    return (
                        // // the basic variant is out of date but it has better performance compared to the above
                        // <TextField id="standard-basic" label={option} variant="outlined"/>
                        <TextField
                            key={id + '-' + option}
                            id={id + '-' + option}
                            label={option}
                            type={"number"}
                            placeholder={processingOptions[option].toString()}
                            variant="outlined"
                            onChange={(event) => {
                                console.log(
                                    `received a change with the value: ${event.target.value} of type ${typeof(event.target.value)} for property ${option}`);
                                updateCard(
                                    id, option, Number.parseInt(event.target.value)
                                );
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style = {{
                                marginTop: "5px",

                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};
export default Card;