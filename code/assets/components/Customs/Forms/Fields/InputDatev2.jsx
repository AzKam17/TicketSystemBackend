import React from "react";
import Flatpickr from "react-flatpickr";
import { useController } from "react-hook-form";

function InputDatev2(props) {
  const { field } = useController(props);

  const options = {
    minDate: "2000-01-01",
    dateFormat: "j/m/Y",
    defaultDate: [new Date()],
    prevArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
    nextArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
  };

  const addLeadingZero = (number) => {
    if (number < 10) {
      return "0" + number;
    }
    return number;
  };

  const dateToString = (date) => {
    return (
      addLeadingZero(date.getDate()) +
      "/" +
      addLeadingZero(date.getMonth() + 1) +
      "/" +
      date.getFullYear()
    );
  };

  return (
    <>
      <label className="block text-sm font-medium mb-1">{props.label}</label>
      <div className="relative">
        <Flatpickr
          style={{
            backgroundColor: props.disabled ? "rgb(229,231,235)" : "",
          }}
          disabled={props.disabled}
          options={options}
          {...field}
          onChange={(date) => {
            let actualDate = date[0];
            field.onChange({
              target: {
                value: dateToString(actualDate),
              },
            });
          }}
          onReady={(date) => {
            let actualDate = date[0];
            field.onChange({
              target: {
                value: dateToString(actualDate),
              },
            });
          }}
          onOpen={(date) => {
            if (props.disabled) {
              return false;
            }
          }}
          format="j/m/Y"
          className="form-input pl-9 text-slate-500 hover:text-slate-600 font-medium focus:border-slate-300 w-full"
        />
        <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 fill-current text-slate-500 ml-3"
            viewBox="0 0 16 16"
          >
            <path d="M15 2h-2V0h-2v2H9V0H7v2H5V0H3v2H1a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V3a1 1 0 00-1-1zm-1 12H2V6h12v8z" />
          </svg>
        </div>
      </div>
    </>
  );
}

export default InputDatev2;
