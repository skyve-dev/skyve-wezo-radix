import {colors} from "../../utils/colors.ts";
import React, {useRef} from "react";

const inputStyle: React.CSSProperties = {
    padding: '12px 16px',
    fontSize: '16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#fff',
    transition: 'border-color 0.2s',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
}
const inputErrorStyle: React.CSSProperties = {
    ...inputStyle,
    borderColor: '#ef4444',
};
export const NumericInput: React.FC<{
    value?: number,
    onChange: (value?: number) => void,
    min?: number,
    max?: number,
    invalid?: boolean,
}> = (props) => {
    const {value, onChange, min, max,invalid} = props;
    const valueRef = useRef(value);
    valueRef.current = value;
    return <div style={{display: 'flex', gap: '12px', maxWidth: '200px'}}>
        <button type={'button'} style={{
            borderRadius: '48px',
            width: '42px',
            height: '42px',
            flexShrink: 0,
            border: '1px solid rgba(0,0,0,0.1)'
        }} onClick={() => {
            const old = valueRef.current;
            onChange( old && old > 1 ? old - 1 : 1)
        }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z"
                    fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
            </svg>
        </button>
        <input
            type="number"
            value={value}
            min={min}
            max={max}
            readOnly={true}
            style={{...(invalid ? inputErrorStyle : inputStyle), textAlign: 'center'}}
            onFocus={(e) => e.target.style.borderColor = colors.primary}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
        />
        <button type={'button'} style={{
            borderRadius: '48px',
            width: '42px',
            height: '42px',
            flexShrink: 0,
            border: '1px solid rgba(0,0,0,0.1)'
        }} onClick={() => {
            const old = valueRef.current;
            onChange((old ?? 0) + 1)
        }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                    fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
            </svg>
        </button>

    </div>
}