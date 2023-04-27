import React from "react";
import Tooltip from "../../../Tooltip";

function InputText({
  name,
  label,
  placeholder,
  defaultValue,
  onChange,
  disabled,
}) {
  return (
    <>
      <label className="block text-sm font-medium mb-1" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        className={`form-input w-full ${disabled ? "bg-gray-200" : ""}`}
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue}
        // Pass value to parent component
        onChange={onChange}
        disabled={disabled}
      />
    </>
  );
}

export default InputText;
