import { useState } from "react";
import '../styles/input-validation-text.css';
import { X, Check } from 'react-feather';
import Dropdown from "./dropdown";

const checkIfAllValid = (rules, value) => {
    return value && rules.every((rule) => new RegExp(rule.value).test(value))
}

const InputValidationText = ({ name, label, rules, onValidationChange }) => {
    const [isDirty, setIsDirty] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [rulesOptions, setRulesOptions] = useState([]);

    const onInputValueChange = (value) => {
        setIsDirty(true);

        if (checkIfAllValid(rules, value)) {
            setIsValid(true);
            if (onValidationChange) {
                onValidationChange(name, true, value)
            }
        } else {
            setIsValid(false);
            if (onValidationChange) {
                onValidationChange(name, false, value)
            }
        }

        setRulesOptions(rules.map(rule => {
            return {
                label: <div className='validation-rule-option'>{value && new RegExp(rule.value).test(value) ? <Check color='green' size="24" /> : <X color='red' size="24" />}{rule.label}</div>,
                value: rule.value
            }
        }));
    }

    return (
        <div>
            <label className='form-label'>{label}</label>
            <Dropdown options={rulesOptions}>
                <div className='selected-option'>
                    <input className='validation-input' type="text" spellCheck="false" onChange={(event) => onInputValueChange(event.target.value)} />
                    <div>
                        {isDirty ?
                            isValid ? <Check color="green" size="24" /> : <X color="red" size="24" /> :
                            <X visibility="hidden" />}
                    </div>
                </div>
            </Dropdown>
        </div>
    )
}

export default InputValidationText;