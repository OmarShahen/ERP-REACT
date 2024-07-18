import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast' 


const BarcodeScanner = ({ orderItems, setOrderItems, inputRef }) => {

  const [barcode, setBarcode] = useState('')

  const items = useSelector(state => state.items.items)

  useEffect(() => {
    // Focus the input field when the component mounts
    inputRef.current.focus()
  }, [])

  const handleInputChange = (event) => {
    setBarcode(event.target.value)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const targetItemList = items.filter(item => item.barcode === barcode)
      if(targetItemList.length === 0) {
        return toast.error('المنتج غير مسجل', { duration: 3000, position: 'top-left' })
      }

      const item = targetItemList[0]

      setOrderItems([ ...orderItems, { ...item, quantity: 1 } ])
      setBarcode('')
      inputRef.current.focus()
    }
  }

  return (
    <div>
      <input
        type="text"
        className="form-input"
        ref={inputRef}
        value={barcode}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="ماسح الباركود"
      />
    </div>
  )
}

export default BarcodeScanner