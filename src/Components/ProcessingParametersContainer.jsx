import TextField from "@material-ui/core/TextField";
import React from "react";

const ProcessingParametersContainer = ({cardID, processingOptions, onChange}) => {
    return (
        <>
            {Object.keys(processingOptions).map(option => (
                <TextField
                    key={cardID + '-' + option}
                    id={cardID + '-' + option}
                    label={option}
                    type={"number"}
                    placeholder={processingOptions[option].toString()}
                    variant="outlined"
                    onChange={onChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    style={{
                        marginTop: "10px",

                    }}
                />
            ))}
        </>
    );
};

export default ProcessingParametersContainer;