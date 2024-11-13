import { Snackbar } from '@mui/material'
import React, { memo } from 'react'

const Alert = (props) => {

    const { isOpen = false, hideDuration = 6000, handleCLose, message = 'Message', location = { vertical: 'bottom', horizontal: 'left' }
        , color = 'success' } = props.alertConfig;

    return (
        <Snackbar
            open={isOpen}
            autoHideDuration={hideDuration}
            onClose={handleCLose}
            message={message}
            anchorOrigin={location}
            color={color}
        />
    )
}

export default memo(Alert);