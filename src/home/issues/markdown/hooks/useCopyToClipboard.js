import React from 'react'

export default function useCopyToClipboard() {
    return (text) => {
        let success = true
        try {
            navigator.clipboard.writeText(text)
        } catch (e) {
            success = false
        }
        return success
    }
}
