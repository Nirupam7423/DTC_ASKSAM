import Message from "./Message";

const ChatContainer = ({
  messages,
  isVisible,
  onMinimize,
  messagesContainerRef,
}) => {
  return (
    <div
      className={`chat-container ${isVisible ? "show" : ""}`}
      id="chatContainer"
    >
      <div className="chat-header" onClick={onMinimize}>
        <div className="header-content">
          <div id="logoText">Ask SAM your questions!</div>
          <div id="subText">AI Engine Powered by QRaie</div>
        </div>
      </div>
      <div
        className="messages"
        ref={messagesContainerRef}
        id="messagesContainer"
      >
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <a
        href="https://delaware.gov/contact/#readspeaker_button1"
        target="_blank"
        className="demo-button"
        rel="noreferrer"
      >
        Request a Demo
      </a>
    </div>
  );
};

export default ChatContainer;
