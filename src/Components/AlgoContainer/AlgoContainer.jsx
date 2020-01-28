import React, {useState} from "react";
import {DndProvider, useDrop} from "react-dnd";
import Card from "../Card/Card";
import update from "immutability-helper";
import ItemTypes from "../ItemTypes";
import {functionIDLookup, InitialCardStates} from "../../Algorithms";
import ProcessingParametersContainer from "../ProcessingParametersContainer";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";

const AlgoContainer = ({cards, setCards}) => {
    // AlgoContainer should have its own state for defining a new card to be added
    let [potentialNewCard, setPotentialNewCard] = useState({
        algoID: 1,
        processingOptions: {}
    });


    // add a new processing unit into the pipeline
    const addCard = (algoId, processingOptions) => {
        let [, label,] = functionIDLookup(algoId);
        console.debug(algoId);
        console.debug(typeof algoId);
        console.debug(processingOptions);
        setCards(
            update(cards, {
                $push: [{
                    id: Math.max.apply(Math, cards.map(function (o) {
                        return o.id + 1;
                    })),
                    algoID: algoId,
                    text: label,
                    processingOptions: processingOptions,
                }]
            })
        );
    };

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

    const updateCard = (id, property, value) => {
        const {card, index} = findCard(id);
        console.debug(`got a value of ${value} for property ${property} in updateCard`);

        setCards(
            update(cards, {
                [index]: {
                    processingOptions: {
                        [property]:
                            {$set: value}
                    }
                }
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
        <div style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "30vw",
        }}>
            <div ref={drop}
                 className={"drag-and-drop-container"}>
                <h2>Algorithms to run on input video (in order from top to bottom)</h2>
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
            {/* TODO: move the below to another component*/}
            <form style={{
                marginTop: "50px",
                border: "1px gray",
                padding: "0.5rem 1rem",
                marginBottom: ".5rem",
                backgroundColor: "white",
                color: "black",
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
            }}>
                <p style={{
                    textDecoration: "underline",
                    textAlign: "center",
                }}>Add a new processing card</p>
                <InputLabel shrink htmlFor="select-new-algo">
                    Algorithm Options
                </InputLabel>
                <NativeSelect
                    onChange={event => {
                        let algoID = Number.parseInt(event.target.value);
                        let [, , processingOptions] = functionIDLookup(algoID);
                        console.debug("setting new card with parameters:");
                        console.debug(`algoID: ${algoID} of type ${typeof algoID}`);
                        console.debug("processing options:");
                        console.debug(processingOptions);
                        setPotentialNewCard({algoID, processingOptions});
                    }} inputProps={{
                    id: 'select-new-algo',
                }}
                >
                    {InitialCardStates.map((cardState, id) => {
                        return (
                            <option key={id} value={cardState.algoID}>{cardState.text}</option>
                        )
                    })}
                </NativeSelect>
                <label htmlFor="options-for-algo"></label>
                <div id={"options-for-algo"}>
                    <ProcessingParametersContainer
                        cardID={-1}
                        processingOptions={potentialNewCard.processingOptions}
                        onChange={(evt) => {
                        }}
                    ></ProcessingParametersContainer>
                </div>
                <Button
                    variant="contained"
                    style={{marginTop: "30px"}}
                    id={"add-algo"}
                    onClick={(evt) => {
                        evt.preventDefault();
                        console.debug(potentialNewCard.algoID);
                        console.debug(potentialNewCard.processingOptions);
                        addCard(
                            potentialNewCard.algoID,
                            potentialNewCard.processingOptions
                        )
                    }
                    }
                >
                    Add new algorithm
                </Button>
            </form>
        </div>
    );
};
export default AlgoContainer;