import { useState } from "react"
import Cookies from "js-cookie"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"

import { RadioGroup } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import InstructionScreen from "./instructionScreen"
import FormItems from "./components/ui/formItems"
import { useNavigate } from "react-router-dom"

// Define the shape of the API response
interface apiResponse {
  status: boolean;
  message: string;
  data: Array<{
    test_id: string;
    question_id: string;
    question: string;
    options: Array<string>;
    status: string;
    tags : string[];
  }>;
  code: number;
}

// Define the validation schema for the form
const FormSchema = z.object({
  type: z.string({
    message: "Please select an option to continue",
  }),
})

export default function Dashboard() {
  // State variables
  const [starttest, setStartTest] = useState(false)
  const [sampleData, setSampleData] = useState({} as apiResponse)
  const [selectedOption, setSelectedOption] = useState([0, 0, 0, 0])
  const [noOfQuestions, setNoOfQuestions] = useState(1)
  const [questionIndex, setQuestionIndex] = useState([...Array(20)].map(() => 0))
  const navigate = useNavigate()

  // Function to start the test
  const startTest = () => {
    
    const token = Cookies.get('token');
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const headers = new Headers();
    headers.append('Authorization', token || '');
    fetch(`${baseUrl}/test/start`, {
      method: 'GET',
      headers: headers
    }).then(res => {
      if (res.status === 401) {
        navigate('/log-in')
        return
      } else {
        return res.json()
      }
    }).then(data => {
      if (data.status) {
        
        setSampleData(data)
        setStartTest(true)
      }
    }).catch(() => {
      
      navigate('/log-in')
    });
  }

  // Form setup using react-hook-form
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues:{
      type:''
    }
  })

  // Form submission handler
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const token = Cookies.get('token');
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const headers = new Headers();
    headers.append('Authorization', token || '');
    headers.append('Content-Type', 'application/json');
    const selectedType = data.type || '';
    if(selectedType===''){
      questionIndex[noOfQuestions-1]=0
    }
    else {
      questionIndex[noOfQuestions-1]=1
    }
    
    const body = {
      test_id: sampleData.data[0].test_id,
      question_id: sampleData.data[0].question_id,
      answer: selectedType
    }
    form.reset({ type: '' })
    fetch(`${baseUrl}/test/question/next`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
      if (data.status) {
        if (data.message === 'Test Completed') {
          navigate('/results?test_id=' + sampleData.data[0].test_id)
        } else {
          setSampleData(data)
          setSelectedOption([0, 0, 0, 0])
          setNoOfQuestions(noOfQuestions+1)
          setQuestionIndex(questionIndex)
        }
      }
      else {
        toast({
          title: "Error",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(data.message, null, 2)}</code>
            </pre>
          ),
        })
      }
    })
  }

  return (
    <>
      {!starttest ? <InstructionScreen startTest={startTest} /> : <div>
        {sampleData && sampleData.data ? (
          <div className="flex flex-col lg:flex-row">
            <div className=" h-screen flex flex-col basis-2/3 ">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}  className=" h-full mt-12 w-full  flex flex-col space-y-6">
                  <FormField
                    control={form.control}
                    name="type"
                    defaultValue=""
                    render={({ field }) => (
                      <FormItem className="space-y-3 flex flex-col h-full" >
                        <div className=" basis-1/2  flex flex-col justify-center items-center ">
                          <div className=" h-2/3 w-full flex flex-col justify-center items-center">
                            <FormLabel className=" mt-24  text-3xl mb-12">{sampleData.data[0].question}</FormLabel>
                            <div className=" w-full flex justify-end justify-items-end items-baseline me-5">
                                {sampleData.data[0].tags.map((tag) => (
                                  <Badge variant="secondary" className=" h-8 w-24 flex justify-center mx-2 text-md" >{tag}</Badge>
                                ))}
                            </div>
                          </div>
                        </div>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={''}
                            defaultValue={''}
                            className="flex flex-col space-y-1 outline-none basis-1/3 "
                          >
                            <div className=" flex w-full overflow-hidden flex-wrap justify-center ">
                              {sampleData.data[0].options.map((option, index) => (
                                <FormItems option={option} index={index} selectedOption={selectedOption} setSelectedOption={setSelectedOption} field={field} />
                              ))}
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className=" basis-1/3 w-full">
                    <Button className="w-1/2 h-16" type="submit">Submit</Button>
                  </div>
                </form>
              </Form>
            </div>
            <div className="basis-1/3 flex flex-col justify-between border-s-2 items-center">
              <div className="w-1/2 mt-24">
                <div className="flex flex-wrap">
                  {[...Array(20)].map((_, index) => (
                    <>
                      <Badge variant={questionIndex[index]===1? 'secondary':'outline'} className=" h-8 w-8 flex justify-center m-2 text-md" >{index + 1}</Badge>
                    </>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex mb-24">
                  <div className="flex items-center">
                    <Badge variant="secondary" className=" h-8 w-8 flex justify-center mx-2 text-md" ></Badge>
                    <p>Attempted</p>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className=" h-8 w-8 flex justify-center mx-2 text-md" ></Badge>
                    <p>Skipped</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>}
    </>
  )
}
