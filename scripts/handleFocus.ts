import React from 'react'

export const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
  const inputField = event.target
  inputField.scrollIntoView({ behavior: 'smooth', block: 'center' })
}