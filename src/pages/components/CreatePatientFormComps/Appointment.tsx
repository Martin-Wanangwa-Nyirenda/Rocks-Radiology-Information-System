import { DatePicker, DatePickerProps } from "@fluentui/react-datepicker-compat";
import {
  Field,
  makeStyles,
  Option,
  Dropdown,
  useId,
} from "@fluentui/react-components";
import * as React from "react";
import { modalities } from "@/lib/constants";

const useStyles = makeStyles({
  control: {
    maxWidth: "300px",
  },
});

type SelectBirthDateProps = {
  handlerImagingDate: (imaging_day: string) => void;
  handlerModality: (modality: string) => void;
  modalityValue?: string;
  imagingDateValue?: Date;
};

export const Appointment = (props: SelectBirthDateProps) => {
  const styles = useStyles();
  const dropdownId = useId("dropdown-default");
  const handleOptionSelect = (event: any, data: any) => {
    props.handlerModality(data.optionValue);
  };
  return (
    <>
      {" "}
      <Field label="Select date of imaging day" required>
        <DatePicker
          className={styles.control}
          placeholder="Date of birth..."
          {...props}
          onSelectDate={(date: Date | null | undefined) => {
            let mydate = `${date?.getDay()}-${date?.getMonth()}-${date?.getFullYear()}`;
            props.handlerImagingDate(mydate || Date.now.toString());
          }}
          value={props.imagingDateValue}
        />
      </Field>
      <div>
        <label id={dropdownId}>Modality</label>
        <Dropdown
          aria-labelledby={dropdownId}
          placeholder="Select a modality"
          {...props}
          onOptionSelect={handleOptionSelect}
          defaultValue={props.modalityValue}
        >
          {modalities.map((option) => (
            <Option key={option}>{option}</Option>
          ))}
        </Dropdown>
      </div>
    </>
  );
};
