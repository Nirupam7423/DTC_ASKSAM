import { useState } from 'react'

const SearchBar = ({ onSearch, hasChat, isMinimized, onSearchRowClick }) => {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSearch(inputValue.trim())
      setInputValue('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const handleSearchRowClick = (e) => {
    // Only maximize if clicking on the row itself, not on input or button
    if (
      hasChat &&
      !e.target.closest('.search-input') &&
      !e.target.closest('.ask-sam-button')
    ) {
      onSearchRowClick()
    }
  }

  return (
    <div className="search-container">
      <div
        className={`search-row ${hasChat ? 'has-chat' : ''} ${
          isMinimized ? 'minimized' : ''
        }`}
        onClick={handleSearchRowClick}
      >
        <div className="search-bubble">
          <input
            type="text"
            className="search-input"
            placeholder="How can I assist you?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <button className="ask-sam-button" onClick={handleSubmit}>
          AskSAM
        </button>
      </div>
      <div className="tagline">AI Engine Powered by QRaie</div>
    </div>
  )
}

export default SearchBar

