import React from 'react';
import styles from './styles.scss'

const PaginationLinks = ({currentPage=1, count=0, pageSize=1, rowName='', onPageChange=null}) => {
    let last = Math.ceil(parseInt(count,10)/parseInt(pageSize,10))
    let first = 1
    let next = (parseInt(currentPage,10) + 1) > last ? last : (parseInt(currentPage,10) + 1)
    let previous = (parseInt(currentPage,10) - 1) > 0 ? (parseInt(currentPage,10) - 1) : 1
    let fromRow = ((currentPage-1)*pageSize)+1
    let toRow = ((currentPage-1)*pageSize)+pageSize > count ? count : ((currentPage-1)*pageSize)+pageSize

    return (
        <div className={styles.container}>
            <div className={styles.infoText}>Showing form {fromRow} to {toRow} of {count} {rowName}</div>
            <div className={styles.paginationButtons}>
                <button type="button" page={first} disabled={currentPage===first} onClick={e => onPageChange(parseInt(e.target.getAttribute('page'),10))}>First</button>
                <button type="button" page={previous} disabled={currentPage-1 < first} onClick={e => onPageChange(parseInt(e.target.getAttribute('page'),10))}>Previous</button>
                <button type="button" disabled >{currentPage}</button>
                <button type="button" page={next} disabled={currentPage+1 > last} onClick={e => onPageChange(parseInt(e.target.getAttribute('page'),10))}>Next</button>
                <button type="button" page={last} disabled={currentPage===last} onClick={e => onPageChange(parseInt(e.target.getAttribute('page'),10))}>Last</button>
            </div>
        </div>
    )
}


export default PaginationLinks