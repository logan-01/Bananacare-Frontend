import React from "react";

function ToggleSwtich({ value, setValue }: any) {
  return (
    <div className="fixed top-20 right-0 z-50 p-2">
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={value}
          onChange={setValue}
        />
        <div className="group peer h-8 w-16 rounded-full bg-white ring-2 ring-slate-500 duration-300 peer-checked:ring-green-500 after:absolute after:top-1 after:left-1 after:flex after:h-6 after:w-6 after:items-center after:justify-center after:rounded-full after:bg-slate-500 after:duration-300 peer-checked:after:translate-x-8 peer-checked:after:bg-green-500 peer-hover:after:scale-95"></div>
      </label>
    </div>
  );
}

export default ToggleSwtich;
