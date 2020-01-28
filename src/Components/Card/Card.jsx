import React from "react";
import {useDrag, useDrop} from "react-dnd";
import ItemTypes from "../ItemTypes";
import './Card.css';
import ProcessingParametersContainer from "../ProcessingParametersContainer";

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
                className={"processing-parameters"}
            >
                <ProcessingParametersContainer
                    cardID={id}
                    processingOptions={processingOptions}
                    onChange={
                        (event) => {
                            let labels = event.target.parentElement.parentElement.getElementsByTagName('label');
                            for (let i = 0; i < labels.length; i++) {
                                if (labels[i].htmlFor === event.target.id) {
                                    let property = labels[i].textContent;
                                    console.debug(
                                        `received a change with the value: ${event.target.value} of type ${typeof (event.target.value)} for property ${property}`);
                                    updateCard(
                                        id, property, Number.parseInt(event.target.value)
                                    );
                                    break;
                                }
                            }
                        }
                    }
                >
                </ProcessingParametersContainer>
            </div>
        </div>
    );
};
export default Card;