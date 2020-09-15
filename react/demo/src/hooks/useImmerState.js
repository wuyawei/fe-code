import React, { useState, useEffect, useRef, useCallback } from 'react';
import produce from "immer"

const useImmerState = (initialValue) => {
    const [value, setValue] = useState(initialValue);
    const setState = useCallback((callback) => {
        const nextState = produce(value, draftState => {
            callback(draftState);
        })
        setValue(nextState);
    }, [value])
    return [value, setState]
}

export default useImmerState;