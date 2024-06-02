
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';
export default function PieChartComponent(props: { data: Record<string,unknown>[]; }) {
    const { data } = props;
    return (
           
        <ResponsiveContainer width="100%" height="100%" className='lg:text-xl'>
            <PieChart width={800} height={800}>
                <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={data}
                    cx="50%"
                    cy="50%"
                    
                    fill="black"
                    label={({ name, value }) => `${name} : ${value}`}
                />
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    )
}
