import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
    return (
        <section className="d-flex justify-content-center align-items-center pageNotFound">
            <div className="text-center">
                <h2 className="d-flex justify-content-center align-items-center gap-2 mb-4">
                    <span className="display-1 fw-bold">4</span>
                    <i className="display-1 fw-bold">0</i>
                    <span className="display-1 fw-bold bsb-flip-h">4</span>
                </h2>
                <h3 className="h2 mb-2">Oops! You're lost.</h3>
                <p className="mb-5">The page you are looking for was not found.</p>
                <Link className="button" to="https://crematrix.com/">Back to Home</Link>
            </div>
        </section>
    )
}

export default PageNotFound