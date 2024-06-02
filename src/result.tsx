import Cookies from 'js-cookie';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PieChartComponent from './components/ui/piechart';
import { UserContext } from './utils/userContext';
import { Button } from './components/ui/button';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from 'recharts';

// Define the Result interface
interface Result {
    score: number;
    test_id: string;
    correctAnswers: string[];
    incorrectAnswers: string[];
    skippedQuestions: string[];
    tagsToQuestions: Record<string, string[]>;
}

// Custom hook to get query parameters from the URL
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function Result() {
    const navigate = useNavigate();
    const [result, setResult] = useState([] as Result[]);
    const [submitedAnswersStatus, setSubmitedAnswersStatus] = useState([{}]);
    const [topicPercentage, setTopicPercentage] = useState([{}]);
    const [gradePercentage, setGradePercentage] = useState([{}]);
    const pieCharList = [{ name: 'Answers Status', data: submitedAnswersStatus }, { name: 'Topic Percentage', data: topicPercentage }];
    const req = useQuery();
    const { user } = useContext(UserContext);
    const [piechart, setPieChart] = useState(0);
    const [switchPieChart, setSwitchPieChart] = useState([1, ...Array(pieCharList.length - 1).map(() => 0)]);

    // Function to create the submitted answers status data
    const createSumbitedAnswersStatus = (data: Result) => {
        const submitedAnswersStatus = [
            { name: 'Correct', value: data.correctAnswers.length },
            { name: 'Incorrect', value: data.incorrectAnswers.length },
            { name: 'Skipped', value: data.skippedQuestions.length },
        ];
        setSubmitedAnswersStatus(submitedAnswersStatus);
    };

    // Function to create the topic percentage data
    const createTopicPercentage = (data: Result) => {
        const topicPercentage = [];
        const gradeData = [];
        for (const key in data.tagsToQuestions) {
            if (key.match('grade')) {
                gradeData.push({ name: key, value: data.tagsToQuestions[key].length });
                continue;
            }
            const percentage = data.tagsToQuestions[key].length;
            topicPercentage.push({ name: key, value: percentage });
        }
        setTopicPercentage(topicPercentage);
        setGradePercentage(gradeData);
    };

    // Function to fetch the result data from the server
    const fetchResult = async () => {
        const testID = req.get('test_id');
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const response = await fetch(`${baseUrl}/result/test/${testID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${Cookies.get('token')}`,
            },
        });
        return response.json();
    };

    // Function to update the selected pie chart
    const updatechart = (index: number) => {
        setPieChart(index);
        const newSwitchPieChart = switchPieChart.map((_, i) => (i === index ? 1 : 0));
        setSwitchPieChart(newSwitchPieChart);
    };

    // Fetch the result data when the component mounts
    useEffect(() => {
        fetchResult()
            .then((data) => {
                if (data.status) {
                    setResult(data.data);
                    createSumbitedAnswersStatus(data.data[0]);
                    createTopicPercentage(data.data[0]);
                }
            })
            .catch((err) => {return err} );
    }, []);

    // Render a loading message if the result data is not available yet
    if (result.length === 0) {
        return (
            <div className="h-screen flex justify-center items-center">
                <h1>Loading...</h1>
            </div>
        );
    }

    // Render the result component
    return (
        <>
            <div className="w-full flex flex-col">
                <div className="flex flex-col lg:flex-row justify-between items-center lg:space-x-4 ">
                    <div className="text-3xl lg:ms-16 mt-16 ">Hello <span className=' text-4xl'> {user} </span> ! Here is you Result </div>
                    <div className='px-12 mt-16 '>
                        <Button variant='black' onClick={() => { navigate('/Dashboard') }}>Back to Dashboard</Button>
                    </div>
                </div>
                <div className="h-5/6 flex flex-col">
                    <div className="w-full h-1/3 flex  flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 p-5">
                        <div className=" w-full lg:w-1/4 h-fit flex flex-col justify-start items-start border-2 rounded-2xl">
                            <h1 className="text-3xl self-center mt-10">Score</h1>
                            <h4 className="text-5xl self-center mt-10 mb-24">{result[0].score}</h4>
                        </div>
                        <div className="w-full lg:w-1/4 h-fit flex flex-col justify-start items-start border-2 rounded-2xl">
                            <h1 className="text-3xl self-center mt-10">Correct Answers</h1>
                            <h4 className="text-5xl self-center mt-10 mb-24">{result[0].correctAnswers.length}</h4>
                        </div>
                        <div className="w-full lg:w-1/4 h-fit flex flex-col justify-start items-start border-2 rounded-2xl">
                            <h1 className="text-3xl self-center mt-10">Incorrect Answers</h1>
                            <h4 className="text-5xl self-center mt-10 mb-24">{result[0].incorrectAnswers.length}</h4>
                        </div>
                        <div className="w-full lg:w-1/4 h-fit flex flex-col justify-start items-start border-2 rounded-2xl">
                            <h1 className="text-3xl self-center mt-10">Skipped Questions</h1>
                            <h4 className="text-5xl self-center mt-10 mb-24">{result[0].skippedQuestions.length}</h4>
                        </div>
                    </div>
                    <div className="h-full  lg:h-2/3 w-full flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-8 p-4 lg:p-12 ">
                        <div className="border-2  lg:w-1/2 rounded-xl">
                            <div className='flex  w-full'>
                                {pieCharList.map((e, index) => (
                                    <Button key={index} variant={switchPieChart[index] ? 'black' : 'white'} className="w-1/2" onClick={() => updatechart(index)}>{e.name}</Button>
                                ))}
                            </div>
                            <div className="lg:h-5/6 w-full flex justify-center items-center">
                                <PieChartComponent data={pieCharList[piechart].data} />
                            </div>
                        </div>
                        <div className="border-2 w-full lg:w-1/2 rounded-xl">
                            <h1>Grade wise Question Distribution</h1>
                            <div className="h-5/6 w-full mt-12 flex justify-center items-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart width={150} height={40} data={gradePercentage}>
                                        <Bar dataKey="value" fill="black" barSize={40} />
                                        <XAxis dataKey="name" />
                                        <YAxis dataKey="value" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
