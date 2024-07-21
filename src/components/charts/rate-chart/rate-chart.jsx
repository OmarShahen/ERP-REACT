import React from 'react'
import Chart from 'chart.js/auto'
import '../../cards/cards.css'
import '../chart.css'
import './rate-chart.css'
import { formatNumber } from '../../../utils/numbers'
import EmptySection from '../../sections/empty/empty'


const RateChart = ({ title, ratings=[], totalReviews=0, rateNameFunction }) => {


    const getTotalAmount = (scores) => {
        let total = 0
        for(let i=0;i<scores.length;i++) {
            total += scores[i].count
        }

        return total
    }

    const getTotalCount = (scores) => {
        let total = 0
        for(let i=0;i<scores.length;i++) {
            total += (scores[i].count * scores[i]._id)
        }

        return total / getTotalAmount(scores)
    }


    return <div className="card-container cards-white-bg disable-hover">
        <div className="chart-header-container right-direction">
            <span>{title}</span>
        </div>
        <div className="rate-chart-body-container">
            {/*<div className="rate-chart-score-container">
                <strong>
                    {
                        ratings.length === 0 ? 
                        0 
                        : 
                        formatNumber(getTotalCount(ratings))
                    }
                </strong>
                <span>من {formatNumber(totalReviews)} طلب-</span>
            </div>*/}
            <div>
                {
                    ratings.length === 0 ?
                    <EmptySection />
                    :
                    ratings.map(rate => <div className="rate-chart-progress-container">
                        <span>{rate.count}</span>
                        <progress max={'100'} value={(rate.count / totalReviews) * 100}></progress>
                        <span>{rateNameFunction ? rateNameFunction(rate) : rate._id}</span>
                    </div>)
                }
            </div>
        </div>
    </div>
}

export default RateChart