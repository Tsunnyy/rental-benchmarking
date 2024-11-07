import React from 'react'

const Loader = ({ loader }) => {
    return (
        <>
            {loader &&
                <div className="loader-parent">
                    <span className="loader"></span>
                </div>
            }
        </>
    )
}

export default Loader