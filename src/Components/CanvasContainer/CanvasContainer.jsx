import React, {useState} from "react";
import update from "immutability-helper";
import {useDrop} from "react-dnd";
import ItemTypes from "../ItemTypes";
import Card from "../Card/Card";
import "../../Constants";
import {INTERMEDIATE_OUTPUT_PREFIX} from "../../Constants";

const CanvasContainer = ({cards}) => {

    return (
        <div className={"daPipeline"}>
            {cards.map((card, index) => (
                <canvas
                    key={INTERMEDIATE_OUTPUT_PREFIX + index}
                    id={INTERMEDIATE_OUTPUT_PREFIX + index}
                >
                </canvas>
                // <Card
                //     key={card.id}
                //     id={`${card.id}`}
                //     text={card.text}
                //     moveCard={moveCard}
                //     findCard={findCard}
                //     deleteCard={deleteCard}
                //     processingOptions={card.processingOptions}
                //     updateCard={updateCard}
                // />
            ))}
        </div>
    );
};
export default CanvasContainer;