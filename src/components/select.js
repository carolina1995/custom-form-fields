import { useCallback, useState } from "react";
import '../styles/select.css';
import Dropdown from "./dropdown";
import { ChevronDown, Check } from "react-feather";

const SelectOption = ({ label, isSelected }) => {
    return (
        <div className={`${isSelected ? 'select-option selected' : 'select-option'}`}>
            {isSelected ? <Check /> : <Check visibility='hidden' />}
            <span>{label}</span>
        </div >
    )
}

const Select = ({ label, options = [], defaultValue, onSelect }) => {
    const [value, setValue] = useState(defaultValue);
    const currentValueLabel = options.find(option => option.value === value).label || '';
    const selectOptions = options.map(option => ({
        ...option,
        label: <SelectOption label={option.label} isSelected={option.value === value} />
    }))

    const handleSelect = useCallback((value) => {
        setValue(value);

        if (onSelect) {
            onSelect(value);
        }
    }, [setValue, onSelect]);

    return (
        <div className="select-container">
            <label className='form-label'>{label}</label>
            <Dropdown options={selectOptions} currentSelectedValue={value} onChange={handleSelect}>
                <div className='selected-option'>
                    {currentValueLabel}
                    <ChevronDown />
                </div>
            </Dropdown>
        </div>
    )
}

export default Select;