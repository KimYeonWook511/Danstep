import React, { useEffect, useState } from 'react';
import { receiveScores } from "../utils/mypageAxios";
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import 'chart.js/auto';  // Ensure Chart.js is registered

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const ChartTest: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await receiveScores();
                setData(result);
                console.log(result);

                // Extracting health values and creating labels
                const labels = result.map((item: any, index: number) => `Point ${index + 1}`);
                const values = result.map((item: any) => item.health);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Health Scores',
                            data: values,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: true,
                        },
                    ],
                });
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {data ? <p>Data received: {JSON.stringify(data)}</p> : <p>Loading data...</p>}
            {chartData && <Line data={chartData} />}
        </div>
    );
}

export default ChartTest;
