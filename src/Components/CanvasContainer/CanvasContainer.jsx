import React from "react";
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
            ))}
        </div>
    );
};
export default CanvasContainer;