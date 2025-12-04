import { useState, useEffect, useRef } from 'react'
import SearchBar from './components/SearchBar'
import ChatContainer from './components/ChatContainer'
import './index.css'

const API_URL = 'https://qraie-demo-beta.qryde.net/ask-sam'
// const API_URL = 'http://localhost:3100/qraieAiEngine'

const suggestions = {
  QRyde: 'QRyde is a transportation management software.',
  Microtransit: 'Microtransit provides efficient public transit solutions.',
  'What is Qryde?':
    'QRyde is an advanced, community-focused transportation management platform that provides solutions to improve the efficiency and accessibility of transportation services...',
  'What services does QRyde Provide?':
    'QRyde provides a comprehensive suite of transportation solutions tailored to a variety of transit needs...',
}

function App() {
  const [messages, setMessages] = useState([])
  const [chatHistory, setChatHistory] = useState([])
  const [hasChat, setHasChat] = useState(false)
  const [isChatMinimized, setIsChatMinimized] = useState(false)
  const [isChatVisible, setIsChatVisible] = useState(false)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  useEffect(() => {
    // Show initial welcome message
    addMessage(
      "Hello, Welcome to DTC! I'm SAM, your smart assistant here to help you navigate, discover, and explore!",
      'assistant'
    )
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight
    }
  }

  const formatResponse = (text) => {
    const acronymMap = {
      TripleDataEncryptionStandard: '3DES',
      AmericanswithDisabilitiesAct: 'ADA',
      AdvancedEncryptionStandard: 'AES',
      ApplicationProgrammingInterface: 'API',
      EnterpriseResourcePlanning: 'ERP',
      EstimatedTimeofArrival: 'ETA',
      GlobalPositioningSystem: 'GPS',
      HealthInsurancePortabilityandAccountabilityAct: 'HIPAA',
      InternetofThings: 'IoT',
      MobileDeviceManagement: 'MDM',
      NonEmergencyMedicalTransportation: 'NEMT',
      QualityAssurance: 'QA',
      UserInterface: 'UI',
      VirtualPrivateNetwork: 'VPN',
    }

    const reverseMap = {}
    for (const [full, acronym] of Object.entries(acronymMap)) {
      reverseMap[acronym] = full
    }

    let formatted = text
    for (const [acronym, full] of Object.entries(reverseMap)) {
      formatted = formatted.replace(
        new RegExp(`\\b${acronym}\\b`, 'gi'),
        full
      )
    }

    return formatted
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[.*?\]/g, '')
      .replace('#', '')
  }

  const addMessage = (text, type) => {
    const newMessage = {
      id: `message-${Date.now()}-${Math.random()}`,
      text,
      type,
      isLoading: false,
    }
    setMessages((prev) => [...prev, newMessage])
    return newMessage.id
  }

  const updateMessage = (id, text, isLoading = false) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, text, isLoading } : msg
      )
    )
  }

  const getAssistantResponse = async (question) => {
    // Check suggestions first
    if (suggestions[question]) {
      const loadingId = addMessage('.', 'assistant')
      updateMessage(loadingId, suggestions[question], false)
      return
    }

    // Add loading message
    const loadingId = addMessage('.', 'assistant')
    let dotCount = 1
    const loadingInterval = setInterval(() => {
      dotCount = (dotCount % 4) + 1
      updateMessage(loadingId, '.'.repeat(dotCount), true)
    }, 500)

    try {
      const payload = {
        question,
        tenant: 'dtc',
        chat_history: chatHistory,
      }

      console.log('=== Sending Request ===')
      console.log('Question:', question)
      console.log('Chat History Before:', chatHistory)
      console.log('Full Payload:', JSON.stringify(payload, null, 2))

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('Response Status:', response.status, response.statusText)

      if (!response.ok) throw new Error(`Error: ${response.statusText}`)

      // Handle streaming response
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      clearInterval(loadingInterval)

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        console.log('Raw chunk received:', chunk)

        // Parse SSE format: extract text after "data: "
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const text = line.substring(6).trim() // Remove "data: " prefix
            if (text && text !== '[DONE]') {
              fullResponse += text + ' '
              console.log('Extracted text:', text)
            }
          }
        }

        // Update the message bubble with accumulated response
        const formattedResponse = formatResponse(fullResponse.trim())
        updateMessage(loadingId, formattedResponse, false)

        // Auto-scroll to keep response visible
        scrollToBottom()
      }

      // Add to chat history after response is complete
      setChatHistory((prev) => [
        ...prev,
        `User: ${question}`,
        `Assistant: ${fullResponse.trim()}`,
      ])

      console.log('=== Response Completed ===')
      console.log('Full Response:', fullResponse.trim())
      console.log('Chat History After:', [
        ...chatHistory,
        `User: ${question}`,
        `Assistant: ${fullResponse.trim()}`,
      ])
      console.log('======================')
    } catch (error) {
      clearInterval(loadingInterval)
      updateMessage(
        loadingId,
        'Sorry, something went wrong. Please try again later.',
        false
      )
      console.error('Error:', error)
    }
  }

  const handleSearch = (question) => {
    if (!question.trim()) return

    if (!hasChat) {
      setHasChat(true)
    }

    setIsChatVisible(true)
    setIsChatMinimized(false)

    addMessage(question, 'user')
    console.log('\n🔵 New User Question:', question)
    getAssistantResponse(question)
  }

  const minimizeChat = () => {
    setIsChatVisible(false)
    if (hasChat) {
      setIsChatMinimized(true)
    }
  }

  const maximizeChat = () => {
    if (hasChat) {
      setIsChatVisible(true)
      setIsChatMinimized(false)
    }
  }

  const handleClickOutside = (e) => {
    if (
      hasChat &&
      !e.target.closest('.chat-container') &&
      !e.target.closest('.search-row')
    ) {
      minimizeChat()
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [hasChat])

  return (
    <div className="App">
      <SearchBar
        onSearch={handleSearch}
        hasChat={hasChat}
        isMinimized={isChatMinimized}
        onSearchRowClick={maximizeChat}
      />
      <ChatContainer
        messages={messages}
        isVisible={isChatVisible}
        onMinimize={minimizeChat}
        messagesContainerRef={messagesContainerRef}
      />
    </div>
  )
}

export default App

