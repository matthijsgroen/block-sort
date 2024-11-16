import { useEffect, useRef } from "react";
import clsx from "clsx";

import styles from "./Dialog/Dialog.module.css";

type SwitchProps = {
  items: { name: string; value: string }[];
  selected: string;
  onSelectionChange: (newValue: string) => void;
};

export const Switch: React.FC<SwitchProps> = ({
  items,
  selected = items[0].value,
  onSelectionChange
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const selectedItem =
    items.find((item) => item.value === selected) || items[0];

  useEffect(() => {
    if (itemRef.current && selectionRef.current) {
      const itemIndex = items.findIndex((item) => item.value === selected);

      let offset = 0;
      for (let i = 0; i < itemIndex; i++) {
        offset += itemRef.current.children[i].clientWidth;
      }
      selectionRef.current.style.transform = `translate(${offset}px, 0)`;
    }
  }, [selectedItem]);

  useEffect(() => {
    if (itemRef.current && selectionRef.current) {
      const itemIndex = items.findIndex((item) => item.value === selected);

      let offset = 0;
      for (let i = 0; i < itemIndex; i++) {
        offset += itemRef.current.children[i].clientWidth;
      }
      selectionRef.current.style.transform = `translate(${offset}px, 0)`;
    }
  }, []);

  return (
    <div
      className={
        "relative inline-block rounded-full border border-black/50 bg-black/10 text-center align-middle text-black shadow-inner"
      }
    >
      <div
        ref={selectionRef}
        className={clsx(
          "pointer-events-none absolute -left-1 -top-1 z-0 inline-block rounded-xl border border-black px-3 py-2",
          "transition-transform",
          styles.woodBackground
        )}
      >
        {selectedItem.name}
      </div>
      <div className="z-10" ref={itemRef}>
        {items.map((item) => (
          <label
            key={item.value}
            className={
              "inline-block px-2 py-1 text-black first-of-type:pl-3 last-of-type:pr-3"
            }
          >
            <input
              type="radio"
              value={item.value}
              checked={selected === item.value}
              onChange={(e) => onSelectionChange(e.target.value)}
              className="hidden"
            ></input>
            {item.name}
          </label>
        ))}
      </div>
    </div>
  );
};
