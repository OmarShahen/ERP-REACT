import React from 'react'
import Chart from 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import '../../cards/cards.css'
import '../chart.css'


const LineChart = ({ title, labels, data, setGroupBy  }) => {

    return <div style={{ maxWidth: '100%' }} className="card-container cards-white-bg disable-hover">
        <div className="chart-header-container right-direction">
            <span>{title}</span>
            <div className="form-input-container">
                <select 
                className="form-input"
                onChange={e => setGroupBy(e.target.value)}
                >
                    <option value="DAY">يومي</option>
                    <option selected value="MONTH">شهري</option>
                    <option value="YEAR">سنوي</option>
                </select>
            </div>
        </div>
        <Line
            data={{
                labels,
                datasets: [{
                    data,
                    backgroundColor: ["rgba(55, 125, 255, .5)", "rgba(255, 255, 255, .2)"],
                    borderColor: "#377dff",
                    borderWidth: 2,
                    pointRadius: 5,
                    hoverBorderColor: "#377dff",
                    pointBackgroundColor: "#377dff",
                    pointBorderColor: "#fff",
                    pointHoverRadius: 0,
                    tension: 0
                }],
                transitions: {
                    zoom: {
                      animation: {
                        duration: 1000,
                        easing: 'easeOutCubic'
                      }
                    }
                  }
            }}

            options={{
                plugins: {
                    legend: {
                      display: false // Hide the chart legend if needed
                    },
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                elements: {
                    line: {
                        borderColor: 'rgba(0, 0, 0, 0)',
                        borderWidth: 0
                    }
                }
            }}

            />
    </div>
}

export default LineChart