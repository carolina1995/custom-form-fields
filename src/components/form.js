import React, { useState } from 'react';
import '../styles/form.css';
import CheckboxGroup from './checkbox-group';
import InputValidationText from './input-validation-text';
import Select from './select';

// For assignment only we will set the options here.
const runtimeOptions = [
    { label: 'Go', value: 'golang' },
    { label: 'Java', value: 'java' },
    { label: 'NodeJs', value: 'nodejs' },
    { label: 'Python 3.7', value: 'python:3.7' },
    { label: 'Python 3.9', value: 'python:3.9' },
];

const functionNameValidationRules = [
    { label: 'Valid characters: a-z, 0-9, -', value: '^[a-z0-9-]*$' },
    { label: 'Must begin and end with a-z, 0-9', value: '^(?:[a-z0-9].*[a-z0-9]|^[a-z0-9])$' },
    { label: 'Max length: 56', value: '^(?=.{0,56}$).*$', },
];

const serviceValidationRules = [
    { label: 'Valid characters: a-z, 0-9, -', value: '^[a-z0-9-]*$' },
    { label: 'Must begin with: a-z', value: '^[a-z]' },
    { label: 'Must end with: a-z, 0-9', value: '[a-z0-9]$' },
    { label: 'Max length: 53', value: '^(?=.{0,53}$).*$', },
];

const categoriesOptions = [
    { label: 'Data Collection', value: 'collect' },
    { label: 'Data Processing', value: 'process' },
    { label: 'Analytics & Reporting', value: 'report' },
    { label: 'Sorting, filtering, tagging', value: 'sort' },
];

const permissionsOptions = [
    { label: 'Read files', value: 'read' },
    { label: 'Write files', value: 'write' },
    { label: 'Execute files', value: 'execute' },
];

const buildFormStateFromFields = (fields) => {
    return fields.reduce((formState, field) => {
        formState[field.name] = field;
        return formState;
    }, {});
}

const createFormField = (fieldName, validation, defaultValue) => {
    let isValid = true;
    if (validation.regexRules) {
        isValid = defaultValue && validation.regexRules.every((rule) => new RegExp(rule.value).test(defaultValue));
    }

    if (validation.required && (defaultValue === null || defaultValue === undefined)) {
        isValid = false;
    }

    return {
        name: fieldName,
        validation,
        value: defaultValue,
        isValid
    }
}

const checkFormValidity = (formModel) => {
    return Object.values(formModel).every((field) => field.isValid);
};

const addIsRequiredClass = (isRequired) => {
    return isRequired ? 'required' : '';
}

const normalizeFormModelToFormValues = (formModel) =>
    Object.entries(formModel).reduce((result, [fieldName, fieldData]) => {
        const fieldParts = fieldName.split('.');
        fieldParts.reduce((currentObj, part, index, array) => {
            if (!currentObj[part]) {
                if (index === array.length - 1) {
                    currentObj[part] = fieldData.value;
                } else {
                    currentObj[part] = {};
                }
            }
            return currentObj[part];
        }, result);
        return result;
    }, {});

const Form = () => {
    const [formModel, setFormModel] = useState(buildFormStateFromFields([
        createFormField('metadata.name', { regexRules: functionNameValidationRules.slice(), required: true }, ''),
        createFormField('metadata.categories', { required: false }, []),
        createFormField('spec.serviceName', { regexRules: serviceValidationRules.slice(), required: true }, ''),
        createFormField('spec.runtime', { required: false }, runtimeOptions[0].value),
        createFormField('spec.description', { required: false }, ''),
        createFormField('spec.permissions', { required: true }, [permissionsOptions[0].value])
    ]));
    const [isFormValid, setIsFormValid] = useState(false);

    const handleValidationChange = (fieldName, isValid, value) => {
        setFormModel((prevFormModel) => {
            const updatedFormModel = {
                ...prevFormModel,
                [fieldName]: { ...prevFormModel[fieldName], isValid, value },
            }

            setIsFormValid(checkFormValidity(updatedFormModel));

            return updatedFormModel;
        });
    };

    const handleSubmitForm = () => {
        const formValues = normalizeFormModelToFormValues(formModel);
        console.log('form values:', formValues);
    }

    return (
        <div className="form-container">
            <h1 className='header'>Create New Form</h1>
            <div className={`form-item ${addIsRequiredClass(formModel['metadata.name'].validation.required)}`}>
                <InputValidationText
                    name="metadata.name"
                    label="Function Name:"
                    rules={formModel['metadata.name'].validation.regexRules}
                    onValidationChange={handleValidationChange}>
                </InputValidationText>
            </div>
            <div className={`form-item ${addIsRequiredClass(formModel['spec.description'].validation.required)}`}>
                <label className='form-label'>Description :</label>
                <div>
                    <textarea className='text-area' spellCheck="false" onChange={(event) => handleValidationChange('spec.description', true, event.target.value)}></textarea>
                </div>
            </div>
            <div className={`form-item ${addIsRequiredClass(formModel['spec.runtime'].validation.required)}`}>
                <Select
                    label={`Runtime:`}
                    options={runtimeOptions}
                    defaultValue={formModel['spec.runtime'].value}
                    onSelect={(selectedValue) => handleValidationChange('spec.runtime', true, selectedValue)}
                >
                </Select>
            </div>
            <div className={`form-item ${addIsRequiredClass(formModel['metadata.categories'].validation.required)}`}>
                <label className='form-label'>Categories: </label>
                <CheckboxGroup
                    name="metadata.categories"
                    options={categoriesOptions}
                    defaultValue={formModel['metadata.categories'].value}
                    required={formModel['metadata.categories'].validation.required}
                    onValidationChange={handleValidationChange}
                />
            </div>
            <div className={`form-item ${addIsRequiredClass(formModel['spec.serviceName'].validation.required)}`}>
                <InputValidationText
                    name="spec.serviceName"
                    label="Service Name:"
                    rules={formModel['spec.serviceName'].validation.regexRules}
                    onValidationChange={handleValidationChange}>
                </InputValidationText>
            </div>
            <div className={`form-item ${addIsRequiredClass(formModel['spec.permissions'].validation.required)}`}>
                <label className='form-label'>Permissions: </label>
                <CheckboxGroup
                    name="spec.permissions"
                    options={permissionsOptions}
                    defaultValue={formModel['spec.permissions'].value}
                    required={formModel['spec.permissions'].validation.required}
                    onValidationChange={handleValidationChange}
                />
            </div>

            <div className='button-container'>
                <button className='submit-button' disabled={!isFormValid} onClick={handleSubmitForm}>Create</button>
            </div>
        </div >
    );
};


export default Form