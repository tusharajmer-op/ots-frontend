import { Button } from "@/components/ui/button"

export default function InstructionScreen(props: { startTest: () => void }) {
    const { startTest } = props
    return (
        <div className="flex flex-col lg:flex-row mb-12 lg:h-full ">
            <div className="flex basis-1/2">
                <img className="w-full h-full rounded-3xl object-fill" src="/instruction2.jpeg" alt="Background" />
            </div>
            <div className="flex basis-1/2 w-full">
                <div className="w-full flex flex-col items-center space-y-5">
                    <div className="mt-12">
                        <h1 className="text-6xl font-bold  mt-5">Online Test </h1>
                    </div>
                    <div className="w-full text-lg flex flex-col  justify-start text-start">
                        <h2 className="text-5xl font-bold text-center mt-24 mb-12">Instructions</h2>
                        <ul className=" mx-12 list-disc list-inside">
                            <li className="text-lg">The test consists of 20 questions.</li>
                            <li className="text-lg">Each question has 4 options.</li>
                            <li className="text-lg">You can only attempt each question once.</li>
                            <li className="text-lg">Only completed tests are taken in consideration.</li>
                            <li className="text-lg">Once you have submitted an answer, you cannot go back to the previous question.</li>
                            <li className="text-lg">You will be able to see your score at the end of the test.</li>
                        </ul>
                    </div>
                    <div className="flex w-2/3 justify-center">
                        <Button className="w-full mt-24" onClick={startTest}>Start Test</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
