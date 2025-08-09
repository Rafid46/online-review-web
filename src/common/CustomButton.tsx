/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";

const CustomButton = ({ text, className = "", ...props }: any) => {
  return (
    <Button
      className={`cursor-pointer px-6 py-6 font-medium bg-[#67AE6E] text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] ${className}`}
      {...props}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
