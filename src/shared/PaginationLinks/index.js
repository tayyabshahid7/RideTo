import React from 'react';
import styles from './styles.scss'

const PaginationLinks = ({currentPage=1, count=0, pageSize=1, rowName='', onPageChange=null}) => {
    const last = Math.ceil(parseInt(count,10)/parseInt(pageSize,10))
    const first = 1
    const next = (parseInt(currentPage,10) + 1) > last ? last : (parseInt(currentPage,10) + 1)
    const previous = (parseInt(currentPage,10) - 1) > 0 ? (parseInt(currentPage,10) - 1) : 1
    const fromRow = ((currentPage-1)*pageSize)+1
    const toRow = ((currentPage-1)*pageSize)+pageSize > count ? count : ((currentPage-1)*pageSize)+pageSize

    return (
        <div className={styles.container}>
            Showing form {fromRow} to {toRow} of {count} {rowName}
            <button type="button" page={first} disabled={currentPage===first} onClick={e => onPageChange(parseInt(e.target.getAttribute('page'),10))}>First</button>
            <button type="button" page={previous} disabled={currentPage===first} onClick={e => onPageChange(parseInt(e.target.getAttribute('page'),10))}>Previous</button>
            <button type="button" disabled >{currentPage}</button>
            <button type="button" page={next} disabled={currentPage===last} onClick={e => onPageChange(parseInt(e.target.getAttribute('page'),10))}>Next</button>
            <button type="button" page={last} disabled={currentPage===last} onClick={e => onPageChange(parseInt(e.target.getAttribute('page'),10))}>Last</button>
        </div>
    )
}


export default PaginationLinks