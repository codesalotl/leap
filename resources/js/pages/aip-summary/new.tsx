import React, { useState, useEffect } from 'react';
// 1. Unused import (General/TS)
import { SomeType } from './types';

export const TestComponent = () => {
    // 2. Inferrable type (TS)
    const [count, setCount]: [number, any] = useState<number>(0);

    // 3. Use of 'var' instead of 'const' (General)
    var label = 'Counter';

    useEffect(() => {
        // 4. Missing dependency (React Hooks - may only report, but some versions fix)
        console.log('Component mounted');
    }, []);

    return (
        <div>
            <h1>{label}</h1>
            {/* 5. Boolean prop shorthand (React) */}
            <button disabled={true} onClick={() => setCount(count + 1)}>
                Increment
            </button>

            {/* 6. Security risk: target="_blank" without rel (React) */}
            <a href="https://google.com" target="_blank">
                External Link
            </a>
        </div>
    );
};
