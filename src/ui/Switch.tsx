import { useCallback, useEffect, useRef } from "react";
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

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (
        itemRef.current &&
        (e.pointerType === "touch" ||
          (e.pointerType === "mouse" && e.buttons === 1))
      ) {
        for (let i = 0; i < itemRef.current.children.length; i++) {
          const item = itemRef.current.children[i] as HTMLLabelElement;
          if (
            e.clientX >= item.getBoundingClientRect().left &&
            e.clientX <= item.getBoundingClientRect().right
          ) {
            onSelectionChange(items[i].value);
          }
        }
      }
    },
    []
  );

  return (
    <div
      className={
        "relative inline-block touch-none select-none rounded-full border border-black/50 bg-black/10 text-center align-middle text-black shadow-inner"
      }
    >
      <div
        ref={selectionRef}
        className={clsx(
          "absolute -left-1 -top-1 z-0 inline-block cursor-grab rounded-xl border border-black px-3 py-2 active:cursor-grabbing",
          "shadow-md transition-transform",
          styles.woodBackground
        )}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={(e) => {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
      >
        {selectedItem.name}
      </div>
      <div className="z-10" ref={itemRef}>
        {items.map((item) => (
          <label
            key={item.value}
            className={
              "inline-block cursor-pointer px-2 py-1 text-black first-of-type:pl-3 last-of-type:pr-3"
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
