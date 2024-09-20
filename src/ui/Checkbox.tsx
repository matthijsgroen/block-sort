import { Dispatch } from "react";

type Props = {
  value: boolean;
  label: string;
  onChange: Dispatch<boolean>;
};

export const Checkbox: React.FC<Props> = ({ value, label, onChange }) => (
  <label className="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={value}
      className="sr-only peer"
      onChange={(e) => {
        onChange?.(e.target.checked);
      }}
    />
    <div className="relative w-9 h-5 bg-black/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-900"></div>
    <span className="ms-3 text-sm font-medium text-gray-900">{label}</span>
  </label>
);
