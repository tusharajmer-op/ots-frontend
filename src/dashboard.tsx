import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { UserContext } from "./utils/userContext";
import { ArrowBigRightIcon } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import PieChartComponent from "./components/ui/piechart";
import Cookies from "js-cookie";

interface Result {
    score: number;
    test_id: string;
    correctAnswers: string[];
    incorrectAnswers: string[];
    skippedQuestions: string[];
    tagsToQuestions: Record<string, string[]>;
}

export default function Dashboard() {
    const [testDetails, setTestDetails] = useState([] as Record<string, string | number>[]);
    const [piStats, setPiStats] = useState([{}]);
    const [chartStats, setChartStats] = useState([{}])

    // Fetch user details from the server
    const getUserDetails = async () => {
        const token = Cookies.get('token');
        const headers = new Headers();
        headers.append('Authorization', token ? token : '');
        headers.append('Content-Type', 'application/json');
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/info`, {
            method: 'GET',
            headers: headers
        });
        if (response.status === 401) {
            navigate('/log-in');
        }
        return response.json();
    }

    // Create submitted answers status for pie chart
    const createSumbitedAnswersStatus = (data: Result) => {
        const submitedAnswersStatus = [
            { name: 'Correct', value: data.correctAnswers.length },
            { name: 'Incorrect', value: data.incorrectAnswers.length },
            { name: 'Skipped', value: data.skippedQuestions.length },
        ];
        setPiStats(submitedAnswersStatus);
    };

    // Create topic percentage for bar chart
    const createTopicPercentage = (data: Result) => {
        const topicPercentage = [];
        const gradeData = []

        for (const key in data.tagsToQuestions) {
            if (key.match('grade')) {
                gradeData.push({ name: key, value: data.tagsToQuestions[key].length });
                continue
            }
            const percentage = data.tagsToQuestions[key].length;
            topicPercentage.push({ name: key, value: percentage });
        }
        setChartStats(gradeData);
    };

    // Fetch statistics for a specific test
    const getStatistics = async (testId: string) => {
        const token = Cookies.get('token');
        const headers = new Headers();
        headers.append('Authorization', token ? token : '');
        headers.append('Content-Type', 'application/json');
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/result/test/${testId}`, {
            method: 'GET',
            headers: headers
        });
        const data = await response.json();
        createSumbitedAnswersStatus(data.data[0])
        createTopicPercentage(data.data[0])
    }

    useEffect(() => {
        if (user === '') { navigate('/log-in') }
        // Fetch user details and set test data
        getUserDetails().then((data) => {
            const testData = data.data[0].tests.map((test: Record<string, string | number>) => {
                return {
                    testId: test.test,
                    status: 'Completed',
                    score: test.result
                }
            });

            getStatistics(testData[0].testId as string)
            setTestDetails(testData);
        })
    }, [])

    const navigate = useNavigate()
    const { user } = useContext(UserContext);

    return (
        <div className="mb-2">
            <div className=" flex w-full p-12">
                <h1 className=" text-5xl">
                    Dashboard
                </h1>
            </div>
            <div className=" flex flex-col lg:flex-row px-2 lg:px-12  w-full ">
                <div className="flex flex-col lg:w-[60%]">
                    <div className="w-full h-min-56 border-2 rounded-2xl p-12">
                        <div className=" flex items-baseline text-3xl">
                            Hello, <span className=' text-4xl'> {user}! </span>
                        </div>
                        <div className="text-md mt-8 flex items-baseline text-2xl">
                            Click here to start your computerized adaptive test
                        </div>
                        <div className="w-full flex justify-end">
                            <div className=" w-fit border-2 rounded-full bg-black">
                                <ArrowBigRightIcon className="w-12 h-12 text-white" onClick={() => { navigate('/test') }} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 text-3xl w-full  flex ">
                        Previously taken tests
                    </div>
                    <div className="flex flex-col overflow-auto mt-12 h-auto max-h-[55vh] min-h-[50vh] border-2 rounded-2xl">
                        <Table>
                            <TableCaption>A list of your recent invoices.</TableCaption>
                            <TableHeader className=" text-lg">
                                <TableRow>
                                    <TableHead className="w-[100px]">Sr no</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className=" text-lg">
                                {testDetails.map((test, index) => (
                                    <TableRow className="hover:bg-black hover:text-white" key={index} onClick={() => getStatistics(test.testId as string)} >
                                        <TableCell className=" w-[100px] ">{index + 1}</TableCell>
                                        <TableCell className="text-left">{test.status}</TableCell>
                                        <TableCell className="text-left">{test.score}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className="flex flex-col h-screen lg:h-auto lg:w-[40%] border-2 rounded-2xl mt-12 lg:mt-0 lg:ms-12 lg:space-y-24">
                    <div className="  rounded-xl h-1/2 lg:h-auto w-full  ">
                        <h1 className="text-3xl lg:text-start mt-5 lg:ms-5"> Test Stats</h1>
                        <div className="text-sm lg:text-xl  h-1/2  lg:h-[30vh] mt-12 lg-w-full flex justify-center items-center ">
                            <PieChartComponent data={piStats} />
                        </div>
                    </div>
                    <div className=" rounded-xl w-full justify-center items-center">
                        <div className=" h-full w-full min-h-[50vw] lg:min-h-56 lg:h-[30vh] lg:w-full flex justify-center items-center ">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart width={150} height={40} data={chartStats} barSize={50}>
                                    <Bar dataKey="value" fill="black" />
                                    <XAxis dataKey="name" />
                                    <YAxis dataKey="value" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
