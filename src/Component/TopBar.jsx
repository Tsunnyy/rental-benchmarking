import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { Link } from 'react-router-dom'

const TopBar = (props) => {
    return (
        <div className='d-flex justify-content-between align-items-center gap-4 topBar'>
            <h2>{props.title}</h2>
            {window.location.pathname == "/" ? <Link to="/subject-property"><Icon icon="ic:outline-plus" /> Create</Link> : ""}
        </div>
    )
}

export default TopBar