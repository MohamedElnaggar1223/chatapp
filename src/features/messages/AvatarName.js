import React, { memo } from 'react'
import Avatar from '@mui/material/Avatar';

function AvatarName({name, color}) 
{
  return (
        <Avatar sx={{ bgcolor: color[500] }}>
            {name && name[0]}
        </Avatar>
    )
}

const memoizedAvatar = memo(AvatarName)
export default memoizedAvatar