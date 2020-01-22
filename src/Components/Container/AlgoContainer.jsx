import React, {useState} from "react";
import {DndProvider, useDrop} from "react-dnd";
import Card from "../Card/Card";
import update from "immutability-helper";
import ItemTypes from "../ItemTypes";

const AlgoContainer = ({cards, setCards}) => {

    const moveCard = (id, atIndex) => {
        const {card, index} = findCard(id);
        setCards(
            update(cards, {
                $splice: [[index, 1], [atIndex, 0, card]]
            })
        );
    };

    const deleteCard = (id) => {
        const {card, index} = findCard(id);
        console.log(`aiyoh ${id} kena delete`);
        setCards(
            update(cards, {
                $splice: [[index, 1]]
            })
        );
    };

    const findCard = id => {
        const card = cards.filter(c => `${c.id}` === id)[0];
        return {
            card,
            index: cards.indexOf(card)
        };
    };

    const updateCard = (id, property,  value) => {
        const {card, index} = findCard(id);
        console.log(`got a value of ${value} for property ${property} in updateCard`);

        setCards(
            update(cards, {[index]: {processingOptions: {[property]:
                    {$set: value}
                }}
            })
        );
    };

    const [, drop] = useDrop({
            accept: ItemTypes.CARD,
            drop: () => {
            }
        }
    );
    return (
        <>
            <div ref={drop}
                 className={"drag-and-drop-container"} >
                {/*<div style={style}>*/}
                {cards.map(card => (
                    <Card
                        key={card.id}
                        id={`${card.id}`}
                        text={card.text}
                        moveCard={moveCard}
                        findCard={findCard}
                        deleteCard={deleteCard}
                        processingOptions={card.processingOptions}
                        updateCard={updateCard}
                    />
                ))}
            </div>
        </>
    );
};
export default AlgoContainer;