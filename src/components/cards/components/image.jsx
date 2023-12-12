import { useMemo } from 'react'
import { createAvatar } from '@dicebear/core'
import { initials } from '@dicebear/collection'


const CardImage = ({ name='' }) => {

    const avatar = useMemo(() => {
        return createAvatar(initials, {
            seed: name,
            size: 128,
        }).toDataUriSync();
      }, [])

    return <img src={avatar} alt="avatar" />
}

export default CardImage