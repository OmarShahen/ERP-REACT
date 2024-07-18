import { format, formatDistance  } from 'date-fns'
import { useSelector } from 'react-redux'


const CardDate = ({ creationDate, updateDate, isHideUpdate=false }) => {

    const lang = useSelector(state => state.lang.lang)

    return <div className="card-date-container grey-text left-direction">
        <div>
            <span>{format(new Date(creationDate), 'dd/MM/yyyy')}</span>
        </div>
        { lang === 'en' ?
            <div>
                {
                    !isHideUpdate ?
                    !updateDate || new Date(creationDate).getTime() === new Date(updateDate).getTime() ?
                    <span>
                        {formatDistance(new Date(creationDate), new Date(), { addSuffix: true })}
                    </span>
                    :
                    <span>
                        last modified({formatDistance(new Date(updateDate), new Date(), { addSuffix: true })})
                    </span>
                    :
                    null
                }
            </div>
            :
            null
        }
    </div>
}

export default CardDate