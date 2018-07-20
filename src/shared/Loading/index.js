import React from 'react';
import styles from './styles.scss'
import classNames from 'classnames'

const Loading = (props) => {
	return (
		<div className={classNames(props.loading&&styles.loadingMask)}>{props.children}</div>
	)
}


export default Loading
