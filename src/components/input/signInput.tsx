import Image from "next/image";
import { forwardRef, useState } from "react";
import { FieldError } from "react-hook-form";

export interface SignInputProps {
  placeholder?: string;
  labelName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  name: string;
  hasError?: FieldError;
  className?: string;
}

const errorColor = "#d6173a";

const PasswordInput = forwardRef<HTMLInputElement, SignInputProps>(
  ({ placeholder, labelName, onChange, onBlur, name = "", hasError }, ref) => {
    const [currentType, setCurrentType] = useState("password");
    const [isOpenEye, setIsOpenEye] = useState(false);

    const handleClickEye = () => {
      setCurrentType(currentType === "text" ? "password" : "text");
      setIsOpenEye(!isOpenEye);
    };

    const hasErrorForField = hasError?.message;

    return (
      <div className="relative mb-4 flex w-full flex-col">
        <label htmlFor={name} className="mb-2 font-medium text-black">
          {labelName}
        </label>
        <button
          onClick={handleClickEye}
          className="absolute right-4 top-12"
          type="button"
        >
          <Image
            src={isOpenEye ? "/svg/visible.svg" : "/svg/invisible.svg"}
            alt=""
            width={24}
            height={24}
          />
        </button>
        <input
          id={name}
          ref={ref}
          name={name}
          type={currentType}
          placeholder={placeholder}
          className={`w-full rounded-md border p-4 ${
            hasErrorForField ? "border-[#d6173a]" : "border-gray-300"
          }`}
          onChange={onChange}
          onBlur={onBlur}
          style={hasErrorForField ? { borderColor: errorColor } : {}}
        />
        {hasErrorForField && (
          <span
            className="pt-2 text-sm"
            style={{ color: errorColor, marginTop: "4px" }}
          >
            {hasErrorForField}
          </span>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

const TextInput = forwardRef<HTMLInputElement, SignInputProps>(
  ({ placeholder, labelName, onChange, onBlur, name = "", hasError }, ref) => {
    const hasErrorForField = hasError?.message;
    return (
      <div className="mb-4 flex w-full flex-col">
        <label htmlFor={name} className="mb-2 font-medium text-black">
          {labelName}
        </label>
        <input
          id={name}
          ref={ref}
          name={name}
          type="text"
          placeholder={placeholder}
          className={`w-full rounded-md border p-4 ${
            hasErrorForField ? "border-[#d6173a]" : "border-gray-300"
          }`}
          onChange={onChange}
          onBlur={onBlur}
          style={hasErrorForField ? { borderColor: errorColor } : {}}
        />
        {hasErrorForField && (
          <span
            className="pt-2 text-sm"
            style={{ color: errorColor, marginTop: "4px" }}
          >
            {hasErrorForField}
          </span>
        )}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";

const ReadonlyInput = ({
  labelName = "",
  inputText = "",
}: {
  labelName?: string;
  inputText?: string;
}) => {
  return (
    <div className="mb-4 flex w-full flex-col">
      <label className="mb-2 font-medium text-black">{labelName}</label>
      <input
        type="text"
        disabled
        className="w-full rounded-md border bg-gray-100 p-4"
        placeholder={inputText}
      />
    </div>
  );
};

export { PasswordInput, ReadonlyInput, TextInput };
