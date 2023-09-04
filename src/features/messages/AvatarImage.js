import React, { memo } from 'react'
import Avatar from '@mui/material/Avatar';

function AvatarImage({ image }) {
  return <Avatar src={image} />
}

const memoizedAvatar = memo(AvatarImage)
export default memoizedAvatar