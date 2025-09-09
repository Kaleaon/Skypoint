import React, { useState, useEffect } from 'react'

interface ProtocolMessage {
  type: string
  timestamp: string
  data: any
}

export const ProtocolDemo: React.FC = () => {
  const [messages, setMessages] = useState<ProtocolMessage[]>([])
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const [simulatedAgent] = useState({
    name: 'TestAgent',
    position: { x: 128, y: 128, z: 25 },
    region: 'Mainland Sandbox'
  })

  // Simulate Second Life protocol messages
  useEffect(() => {
    const interval = setInterval(() => {
      const messageTypes = [
        'ObjectUpdate',
        'ChatFromSimulator', 
        'AvatarAnimation',
        'TerrainInfo',
        'AgentMovementComplete',
        'ViewerEffect'
      ]
      
      const randomMessage: ProtocolMessage = {
        type: messageTypes[Math.floor(Math.random() * messageTypes.length)],
        timestamp: new Date().toLocaleTimeString(),
        data: generateMockData()
      }

      setMessages(prev => [...prev.slice(-9), randomMessage])
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const generateMockData = () => {
    const mockData = {
      ObjectUpdate: {
        objectId: `00000000-${Math.random().toString(16).slice(2, 6)}-4000-8000-000000000000`,
        position: {
          x: Math.random() * 256,
          y: Math.random() * 256,
          z: Math.random() * 50
        },
        rotation: {
          x: Math.random(),
          y: Math.random(),
          z: Math.random(),
          w: Math.random()
        }
      },
      ChatFromSimulator: {
        sourceType: Math.random() > 0.5 ? 'Agent' : 'Object',
        message: ['Hello world!', 'Welcome to Second Life!', 'Virtual worlds are amazing!'][Math.floor(Math.random() * 3)],
        fromName: ['Alice', 'Bob', 'Charlie', 'Diana'][Math.floor(Math.random() * 4)]
      },
      AvatarAnimation: {
        animationId: `anim_${Math.floor(Math.random() * 1000)}`,
        sequence: Math.floor(Math.random() * 100)
      },
      TerrainInfo: {
        patchSize: 16,
        region: 'Mainland',
        waterHeight: 20.0
      }
    }

    return mockData
  }

  const simulateConnection = () => {
    setConnectionStatus('connecting')
    setTimeout(() => {
      setConnectionStatus('connected')
      setMessages([{
        type: 'LoginComplete',
        timestamp: new Date().toLocaleTimeString(),
        data: { 
          agentId: '12345678-1234-1234-1234-123456789012',
          regionName: 'Mainland Sandbox',
          position: simulatedAgent.position
        }
      }])
    }, 3000)
  }

  const disconnect = () => {
    setConnectionStatus('disconnected')
    setMessages([])
  }

  return (
    <div className="protocol-demo">
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div>
          <span className={`status-indicator ${connectionStatus}`}></span>
          Status: {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
        </div>
        <button 
          onClick={connectionStatus === 'disconnected' ? simulateConnection : disconnect}
          style={{
            padding: '0.5rem 1rem',
            background: connectionStatus === 'disconnected' ? '#4caf50' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {connectionStatus === 'disconnected' ? 'Connect' : 'Disconnect'}
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <strong>Agent Info:</strong><br />
        Name: {simulatedAgent.name}<br />
        Position: ({simulatedAgent.position.x.toFixed(1)}, {simulatedAgent.position.y.toFixed(1)}, {simulatedAgent.position.z.toFixed(1)})<br />
        Region: {simulatedAgent.region}
      </div>

      <div style={{ 
        height: '200px', 
        overflowY: 'auto', 
        background: 'rgba(0,0,0,0.5)', 
        padding: '0.5rem',
        borderRadius: '4px',
        fontSize: '0.8rem'
      }}>
        <div><strong>Protocol Messages (Simulated):</strong></div>
        {messages.map((msg, index) => (
          <div key={index} style={{ margin: '0.5rem 0', opacity: 0.9 }}>
            <span style={{ color: '#4ecdc4' }}>[{msg.timestamp}]</span>{' '}
            <span style={{ color: '#ffc107' }}>{msg.type}</span>
            {msg.data && (
              <div style={{ marginLeft: '1rem', color: '#ccc', fontSize: '0.7rem' }}>
                {JSON.stringify(msg.data, null, 2).split('\n').slice(0, 3).join('\n')}
                {JSON.stringify(msg.data, null, 2).split('\n').length > 3 && '...'}
              </div>
            )}
          </div>
        ))}
        {messages.length === 0 && connectionStatus === 'disconnected' && (
          <div style={{ opacity: 0.6, fontStyle: 'italic' }}>No connection established</div>
        )}
      </div>
      
      <div style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.7 }}>
        <strong>Note:</strong> This simulates Second Life protocol messages. In a real implementation, 
        this would connect via WebSocket proxy to handle UDP circuits and CAPS HTTP requests.
      </div>
    </div>
  )
}