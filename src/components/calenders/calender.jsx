import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { capitalizeFirstLetter } from '../../utils/formatString'


const Calender = ({ meetings, setTargetMeeting, setIsUpdate, setShowModalForm }) => {

    const localizer = momentLocalizer(moment)


    const getBackgroundColor = (status) => {
        if(status === 'UPCOMING') {
            return '#4C83EE'
        } else if(status === 'RESCHEDULED') {
            return '#5C60F5'
        } else if(status === 'CANCELLED') {
            return '#DE350B'
        } else if(status === 'ACTIVE') {
            return '#20C997'
        } else if(status === 'EXPIRED') {
            return '#414552'
        } else if(status === 'DONE') {
            return '#3BB077'
        }
    }

    const formatMeetings = (meetings) => {
        meetings.forEach(meeting => {
            const title = meeting?.lead?.name
            meeting.title = `${title}`
            meeting.start = new Date(meeting.reservationTime)
            let endDate = new Date(meeting.reservationTime)
            meeting.end = endDate.setHours(endDate.getHours() + 1)
        })

        return meetings
    }

    return <div>
            <Calendar
                localizer={localizer}
                events={formatMeetings(meetings)}
                onSelectEvent={event => {
                    setTargetMeeting(event)
                    setIsUpdate(true)
                    setShowModalForm(true)
                }}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 450 }}
                eventPropGetter={event => {
                    return { style: { backgroundColor: getBackgroundColor(event.status) } }
                }}
                />            
    </div>
        
}

export default Calender