import React, { useEffect } from "react";
import Tooltip from "../../../Tooltip";
import { useController } from "react-hook-form";

function InputTextv2(props) {
  const { field } = useController(props);

  return (
    <>
      <label className="block text-sm font-medium mb-1">{props.label}</label>
      <input
        className={`form-input w-full ${props.disabled ? "bg-gray-200" : ""}`}
        type="text"
        placeholder={props.placeholder}
        disabled={props.disabled}
        {...field}
      />
    </>
  );
}

export default InputTextv2;

// How to send default value from props
