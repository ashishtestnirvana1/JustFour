'use client'

export default function ContinueConversationStub() {
  return (
    <section style={{
      padding: '24px 28px', backgroundColor: '#FAFAF8',
      border: '1.5px dashed #D4D3CE', borderRadius: 14,
      textAlign: 'center', marginBottom: 40,
    }}>
      <div style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600,
        color: '#9B9B9B', marginBottom: 8,
      }}>
        Continue the conversation
      </div>
      <div style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#C4C3BE',
        lineHeight: 1.5, maxWidth: 340, margin: '0 auto',
      }}>
        Mid-week check-ins and plan updates are coming soon. Check back Thursday.
      </div>
    </section>
  )
}
