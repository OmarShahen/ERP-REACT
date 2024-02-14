import { useMemo } from 'react'
import { createAvatar } from '@dicebear/core'
import { initials } from '@dicebear/collection'


const CardImage = ({ name='', imageURL }) => {

    const avatar = useMemo(() => {
        if(imageURL) {
            return
        }
        return createAvatar(initials, {
            seed: name,
            size: 128,
        }).toDataUriSync();
      }, [])

    return <img src={imageURL ? imageURL : avatar} alt="avatar" />
}

export default CardImage