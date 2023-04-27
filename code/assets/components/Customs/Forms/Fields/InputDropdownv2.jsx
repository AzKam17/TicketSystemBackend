import React, { useState, useEffect } from "react";
import { useController } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

function InputDropdownv2(props) {
  const { field } = useController(props);
  const [value, setValue] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (props.data) {
      if (props.data.length > 0) {
        const selectedOption = props.data.find(
          (option) => option.selected === true
        );
        setOptions(props.data);
        if (selectedOption) {
          setValue(selectedOption);
          field.onChange(selectedOption.value);
        } else if (props.data.length > 0) {
          setValue(props.data[0]);
          field.onChange(props.data[0].value);
        }
      }
    }
  }, [props.data]);

  return (
    <>
      <label className="block text-sm font-medium mb-1">{props.label}</label>
      <div className="flex items-center">
        {props.isAnother ? (
          <CreatableSelect
            className="w-full"
            isDisabled={props.disabled}
            isClearable={false}
            isMulti={false}
            options={options}
            onChange={(value) => {
              if (value) {
                setValue(value);
                field.onChange(value.value);
              }
            }}
            onCreateOption={(value) => {
              const newOption = { label: value, value: value };
              setOptions([...options, newOption]);
              setValue(newOption);
              field.onChange(newOption.value);
            }}
            value={value}
            noOptionsMessage={() => "Aucune option"}
            formatCreateLabel={(inputValue) => `Ajouter "${inputValue}"`}
          />
        ) : (
          <Select
            className="w-full"
            isDisabled={props.disabled}
            isClearable={false}
            isSearchable={false}
            isMulti={false}
            options={options}
            value={value}
            onChange={(value) => {
              if (value) {
                setValue(value);
                field.onChange(value.value);
              }
            }}
          />
        )}
      </div>
    </>
  );
}

export default InputDropdownv2;
