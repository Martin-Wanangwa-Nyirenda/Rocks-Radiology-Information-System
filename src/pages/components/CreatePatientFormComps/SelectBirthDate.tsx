import { DatePicker, DatePickerProps } from "@fluentui/react-datepicker-compat";
import { Field, makeStyles } from "@fluentui/react-components";
import * as React from "react";

const useStyles = makeStyles({
  control: {
    maxWidth: "300px",
  },
});

type SelectBirthDateProps = {
  handlerBirthDate: (patient_dob: string) => void;
  dateValue?: Date;
};

export const SelectBirthDate = (props: SelectBirthDateProps) => {
  const styles = useStyles();

  return (
    <Field label="Select date of birth" required>
      <DatePicker
        className={styles.control}
        placeholder="Date of birth..."
        {...props}
        onSelectDate={(date: Date | null | undefined) => {
          let mydate = `${date?.getDay()}-${date?.getMonth()}-${date?.getFullYear()}`;
          props.handlerBirthDate(mydate || Date.now.toString());
        }}
        value={props.dateValue}
      />
    </Field>
  );
};
