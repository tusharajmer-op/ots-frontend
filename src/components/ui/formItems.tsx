import {
    FormControl,
    FormItem,
    FormLabel,
  } from "@/components/ui/form"
import {RadioGroupItem } from "@/components/ui/radio-group"
import { ControllerRenderProps } from "react-hook-form";

export default function FormItems(props : {index : number , option : string,selectedOption : number[], setSelectedOption : React.Dispatch<React.SetStateAction<number[]>>,field : ControllerRenderProps<{ type: string; }, "type">}) {
    
    const {index,option,selectedOption, setSelectedOption,field} = props
    let className = "flex items-center space-x-3 space-y-0 min-w-[45vw] h-20 rounded-3xl border-2 m-2 hover:bg-slate-700 hover:text-white"
    if(selectedOption[index] === 1){
        className = className + ' bg-black text-white'
    }
    return (
        <FormItem key={index} className={className}  onClick={() => {
            const temp = [0,0,0,0]
            temp[index] = 1
            field.onChange(option)
            setSelectedOption(temp)
        }}>
            <FormControl>
                <RadioGroupItem  className="border-none" value={option} />
            </FormControl>
            <FormLabel className="font-normal "> {option}</FormLabel>
        </FormItem>
    )
}
