import {
  Dropdown,
  makeStyles,
  Option,
  shorthands,
  useId,
  DropdownProps,
} from "@fluentui/react-components";
import * as React from "react";

const useStyles = makeStyles({
  root: {
    // Stack the label above the field with a gap
    display: "grid",
    gridTemplateRows: "repeat(1fr)",
    justifyItems: "start",
    ...shorthands.gap("2px"),
    maxWidth: "400px",
  },
});

type SelectGenderProps = {
  handlerSetSex: (sex: string) => void;
};

export const SelectGender = (props: SelectGenderProps) => {
  const dropdownId = useId("dropdown-default");
  const options = ["Female", "Male"];
  const styles = useStyles();
  const handleOptionSelect = (event: any, data: any) => {
    props.handlerSetSex(data.optionValue);
  };
  return (
    <div className={styles.root}>
      <label id={dropdownId}>Sex</label>
      <Dropdown
        aria-labelledby={dropdownId}
        placeholder="Select an gender"
        {...props}
        onOptionSelect={handleOptionSelect}
      >
        {options.map((option) => (
          <Option key={option} disabled={option === "Ferret"}>
            {option}
          </Option>
        ))}
      </Dropdown>
    </div>
  );
};
