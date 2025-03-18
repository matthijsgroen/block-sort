import type { Dispatch } from "react";

type Props = {
  value: boolean;
  label: string;
  description?: string;
  onChange: Dispatch<boolean>;
};

export const Checkbox: React.FC<Props> = ({
  value,
  label,
  description,
  onChange
}) => (
  <label className="inline-flex cursor-pointer items-center">
    <input
      type="checkbox"
      checked={value}
      className="peer sr-only"
      onChange={(e) => {
        onChange?.(e.target.checked);
      }}
    />
    <div className="flex-0 peer relative h-5 w-9 rounded-full bg-black/20 after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-900 peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
    <div className="flex-1">
      <p className="ms-3 select-none text-sm font-medium text-gray-900">
        {label}
      </p>
      {description && (
        <p className="ms-3 select-none text-xs italic">{description}</p>
      )}
    </div>
  </label>
);
