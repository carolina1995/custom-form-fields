import React, { useState } from 'react';
import '../styles/checkbox.css';

const CheckboxGroup = ({ name, options, defaultValue = [], required, onValidationChange }) => {
    const [checkedValues, setCheckedValues] = useState(defaultValue);

    const handleCheckboxChange = (value) => {
        const updatedValues = [...checkedValues];

        if (updatedValues.includes(value)) {
            updatedValues.splice(updatedValues.indexOf(value), 1);
        } else {
            updatedValues.push(value);
        }

        if (required) {
            if (updatedValues.length === 0) {
                onValidationChange(name, false, updatedValues);
            } else {
                onValidationChange(name, true, updatedValues);
            }
        } else {
            onValidationChange(name, true, updatedValues);
        }

        setCheckedValues(updatedValues);
    };

    return (
        <div className='checkbox-container'>
            {options.map((option) => (
                <label key={option.value}>
                    <input
                        type="checkbox"
                        value={option.value}
                        checked={checkedValues.includes(option.value)}
                        onChange={() => handleCheckboxChange(option.value)}
                    />
                    {option.label}
                </label>
            ))}
        </div>
    );
};

export default CheckboxGroup;