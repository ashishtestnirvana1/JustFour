'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  role: 'user' | 'assistant'
  content: string
}

export default function MessageBubble({ role, content }: Props) {
  const isUser = role === 'user'

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 16,
      animation: 'bubbleIn 0.25s ease-out',
    }}>
      <div style={{
        maxWidth: '82%',
        padding: '12px 16px',
        borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        backgroundColor: isUser ? '#1A1A1A' : '#EFEEE9',
        color: isUser ? '#FFFFFF' : '#1A1A1A',
        fontFamily: "'Outfit', sans-serif",
        fontSize: 14,
        lineHeight: 1.6,
      }}>
        {isUser ? (
          <span style={{ whiteSpace: 'pre-wrap' }}>{content}</span>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p style={{ margin: '0 0 8px', lineHeight: 1.6 }}>{children}</p>,
              ul: ({ children }) => <ul style={{ margin: '4px 0 8px', paddingLeft: 20 }}>{children}</ul>,
              ol: ({ children }) => <ol style={{ margin: '4px 0 8px', paddingLeft: 20 }}>{children}</ol>,
              li: ({ children }) => <li style={{ marginBottom: 4 }}>{children}</li>,
              strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
              em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
              code: ({ children }) => (
                <code style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  backgroundColor: 'rgba(0,0,0,0.08)',
                  padding: '1px 5px',
                  borderRadius: 4,
                }}>{children}</code>
              ),
              pre: ({ children }) => (
                <pre style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  backgroundColor: 'rgba(0,0,0,0.06)',
                  padding: '10px 14px',
                  borderRadius: 8,
                  overflowX: 'auto',
                  margin: '8px 0',
                }}>{children}</pre>
              ),
            }}
          >
            {content.replace(/```dashboard[\s\S]*?```/g, '').trim()}
          </ReactMarkdown>
        )}
      </div>
      <style>{`
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
