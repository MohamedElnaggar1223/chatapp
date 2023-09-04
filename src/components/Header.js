import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AvatarImage from '../features/messages/AvatarImage';
import { useGetMyImageQuery } from '../features/users/usersApiSlice';

export default function Header() 
{
    const { pathname } = useLocation()

    const { username, id } = useAuth()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const { data: image, isSuccess} = useGetMyImageQuery({id}, { pollingInterval: 120000000, refetchOnFocus: true, refetchOnMountOrArgChange: true })

    const handleClick = (event) => 
    {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => 
    {
        setAnchorEl(null);
    }

    let content
    if(username && isSuccess)
    {
        content = (
            <header>
                <div className='HeaderTitle'>
                    <span>Logo</span>
                </div>
                {/* <div className='HeaderButtons'>
                    <button>
                        <Link to='/logout'>Log out</Link>
                    </button>
                    <button>
                        <Link to='/settings'>Settings</Link>
                    </button>
                </div> */}
                <div>
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <AvatarImage image={image} />
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem disabled={true}>User: {username}</MenuItem>
                        <MenuItem onClick={handleClose}><Link style={{ textDecoration: 'none', color: 'black' }} to={pathname === '/messages' ? '/settings' : '/messages'}>{pathname === '/messages' ? 'Profile' : 'Messages'}</Link></MenuItem>
                        <MenuItem onClick={handleClose}><Link style={{ textDecoration: 'none', color: 'black' }} to='/logout'>Logout</Link></MenuItem>
                    </Menu>
                </div>
            </header>
        )
    }
    else
    {
        content = (
            <header>
                <div className='HeaderTitle'>
                    <span>Logo</span>
                </div>
                <div className='HeaderButtons'>
                    <button>
                        <Link to='/login'>Login</Link>
                    </button>
                    <button>
                        <Link to='/Signup'>Sign Up</Link>
                    </button>
                </div>
            </header>
        )
    }

    return content
}
