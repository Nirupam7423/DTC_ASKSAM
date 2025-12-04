const Message = ({ message }) => {
  const { text, type, isLoading } = message

  return (
    <div className={`message ${type}`} id={message.id}>
      <div className="bubble assistant-response">
        {isLoading ? (
          <span className="loading-dots">{text}</span>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: text }} />
        )}
      </div>
    </div>
  )
}

export default Message

