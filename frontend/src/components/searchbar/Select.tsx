import { Boxes } from "lucide-react";
import Select, {
  components,
  OptionProps,
  SingleValueProps,
} from "react-select";

export interface SelectOption {
  label: string;
  value: string;
  icon: React.ReactNode;
  style: {
    color: string;
    borderColor: string;
    bg: string;
  };
}

type SelectProps = {
  selectValue: SelectOption;
  setSelectValue: (v: SelectOption) => void;
  options: SelectOption[];
};

const Option = (props: OptionProps<SelectOption>) => {
  return (
    <components.Option {...props} className={`cursor-pointer p-0`}>
      <div
        className={`flex items-center gap-2 p-2 text-sm ${props.data.style.color} ${props.isFocused || props.isSelected ? props.data.style.bg + " font-semibold" : ""}`}
      >
        {props.data.icon}
        <span>{props.data.label}</span>
      </div>
    </components.Option>
  );
};

const SingleValue = (props: SingleValueProps<SelectOption>) => {
  return (
    <components.SingleValue {...props} className="w-full">
      <div
        className={`flex items-center gap-2 font-semibold ${props.data.style.color}`}
      >
        {props.data.icon}
        <span>{props.data.label}</span>
      </div>
    </components.SingleValue>
  );
};

function CustomSelect({ options, selectValue, setSelectValue }: SelectProps) {
  return (
    <Select<SelectOption>
      isSearchable={false}
      value={selectValue}
      onChange={(v) => setSelectValue(v!)}
      options={options}
      defaultValue={selectValue}
      components={{
        Option,
        SingleValue,
      }}
      classNames={{
        container: () => "w-[20%] min-w-40",
        control: () =>
          "bg-white rounded-xl flex border border-slate-200 text-sm w-full",
        indicatorSeparator: () => "hidden",
        indicatorsContainer: () => "cursor-pointer",
      }}
      styles={{
        control: () => ({}),
        option: () => ({}),
      }}
    />
  );
}

export { CustomSelect as Select };
