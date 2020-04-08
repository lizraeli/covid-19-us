import React from "react";
import type { Option } from "../../types";

// Mocking react-select as a regular select element 
// see https://www.polvara.me/posts/testing-a-custom-select-with-react-testing-library/
type OnChangeSelect = (option: Option) => void;
jest.mock(
  "react-select",
  () => (props: {
    id: string;
    options: Option[];
    value: string;
    onChange: OnChangeSelect;
  }) => {
    const { id, options, value, onChange } = props;
    function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
      const option = options.find(
        (option) => option.value === event.currentTarget.value
      );
      if (option) {
        onChange(option);
      }
    }
    return (
      <select data-testid={id} value={value} onChange={handleChange}>
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    );
  }
);
