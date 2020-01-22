import React, {useState} from "react";
import {DndProvider, useDrop} from "react-dnd";
import Card from "../Card/Card";
import update from "immutability-helper";
import ItemTypes from "../ItemTypes";

const AlgoContainer = ({cards, setCards, beginImageProcessing}) => {

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
        // beginImageProcessing(); // cannot put this here. Will not update with the latest set of cards
        setCards(
            update(cards, {
                $splice: [[index, 1]]
            })
        );
        beginImageProcessing();
    };

    const findCard = id => {
        const card = cards.filter(c => `${c.id}` === id)[0];
        return {
            card,
            index: cards.indexOf(card)
        };
    };

    //
    const updateCard = (id, property,  value) => {
        const {card, index} = findCard(id);
        console.log(`got a value of ${value} for property ${property} in updateCard`);

        // there is a stupid bug somewhere that eats the last character in the value passed.
        // A quick workaround is to add one extra chracter, and to do that with numbers we will simply multiply by 10.
        console.log("updating the card:");
        console.log(cards[index]);
        console.log(setCards);
        setCards(
            update(cards, {[index]: {processingOptions: {[property]:
                    {$set: value}
                }}
            })
        );
        beginImageProcessing();
    };

    const [, drop] = useDrop({
            accept: ItemTypes.CARD,
            drop: () => {
                beginImageProcessing();
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